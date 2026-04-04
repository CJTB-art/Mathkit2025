const { createClient } = require("@supabase/supabase-js");

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;

  Object.entries(JSON_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  res.end(JSON.stringify(payload));
}

function getBearerToken(headerValue = "") {
  const [scheme, token] = String(headerValue).split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return "";
  }

  return token.trim();
}

async function parseJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }

  return await new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
    });

    req.on("end", () => {
      if (!rawBody.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function absolutizeSignedUrl(url, supabaseUrl) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${supabaseUrl}${url}`;
  }

  return `${supabaseUrl}/storage/v1/${url.replace(/^\/+/, "")}`;
}

async function isAdminUser(serviceClient, email) {
  if (!email) {
    return false;
  }

  const { data, error } = await serviceClient
    .from("admin_users")
    .select("email")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return Boolean(data);
}

async function hasLessonAccess(serviceClient, userId, sliceKey) {
  const { data, error } = await serviceClient
    .from("lesson_entitlements")
    .select("id")
    .eq("user_id", userId)
    .eq("slice_key", sliceKey)
    .limit(1);

  if (error) {
    throw error;
  }

  return Array.isArray(data) && data.length > 0;
}

async function getLessonGameStatus(serviceClient, sliceKey) {
  const { data, error } = await serviceClient
    .from("lesson_settings")
    .select("game_status")
    .eq("slice_key", sliceKey)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data?.game_status || "none";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Use POST to access lesson assets." });
    return;
  }

  const supabaseUrl = (process.env.SUPABASE_URL || "").trim();
  const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || "").trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const storageBucket = (process.env.SUPABASE_STORAGE_BUCKET || "lesson-assets").trim();

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    sendJson(res, 500, {
      error: "Server is missing Supabase environment variables.",
    });
    return;
  }

  const accessToken = getBearerToken(req.headers.authorization);

  if (!accessToken) {
    sendJson(res, 401, { error: "Missing Supabase access token." });
    return;
  }

  let body;

  try {
    body = await parseJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: "Request body must be valid JSON." });
    return;
  }

  const key = typeof body?.key === "string" ? body.key.trim() : "";
  const fileType = typeof body?.fileType === "string" ? body.fileType.trim() : "";

  if (!key) {
    sendJson(res, 400, { error: "Missing lesson key." });
    return;
  }

  if (fileType !== "activity") {
    sendJson(res, 400, { error: "Only the interactive game asset can be opened here." });
    return;
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  try {
    const { data: userData, error: userError } = await userClient.auth.getUser();

    if (userError || !userData.user) {
      sendJson(res, 401, { error: "Session expired. Reload and try again." });
      return;
    }

    const user = userData.user;
    const adminAccess = await isAdminUser(serviceClient, user.email || "");

    if (!adminAccess) {
      const entitled = await hasLessonAccess(serviceClient, user.id, key);

      if (!entitled) {
        sendJson(res, 403, {
          error: "You do not have access to this lesson yet.",
        });
        return;
      }
    }

    const gameStatus = await getLessonGameStatus(serviceClient, key);

    if (gameStatus !== "available") {
      sendJson(res, 404, {
        error: "The interactive game is not enabled for this lesson yet.",
      });
      return;
    }

    const { data: assetRow, error: assetError } = await serviceClient
      .from("lesson_assets")
      .select("assets")
      .eq("slice_key", key)
      .maybeSingle();

    if (assetError) {
      throw assetError;
    }

    const asset = assetRow?.assets?.[fileType];

    if (
      !asset ||
      typeof asset !== "object" ||
      !asset.path ||
      !asset.name
    ) {
      sendJson(res, 404, {
        error: "The interactive game is not available for this lesson yet.",
      });
      return;
    }

    const { data: signedRow, error: signedError } = await serviceClient.storage
      .from(storageBucket)
      .createSignedUrl(asset.path, 60);

    if (signedError) {
      throw signedError;
    }

    const signedUrl = absolutizeSignedUrl(
      signedRow?.signedUrl || signedRow?.signedURL || "",
      supabaseUrl,
    );

    if (!signedUrl) {
      sendJson(res, 404, {
        error: "The interactive game link could not be prepared.",
      });
      return;
    }

    sendJson(res, 200, {
      name: String(asset.name),
      url: signedUrl,
    });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, {
      error: error?.message || "Unable to open the interactive game right now.",
    });
  }
};
