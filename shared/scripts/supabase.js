import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import {
  FILE_TYPES,
  deriveSliceStatusFromUploads,
  getGameStatus,
  getUploads,
  markAccessLoaded,
  markAvailabilityLoaded,
  markUploadsLoaded,
  setAuthReady,
  setAuthUser,
  setGameStatuses,
  setIsAdmin,
  setLessonAccess,
  setSliceStatuses,
  setSupabaseConfigError,
  setSyncState,
  setUploads,
  state,
} from "./store.js";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_STORAGE_BUCKET,
  SUPABASE_URL,
} from "./supabaseConfig.js";

const LESSON_ASSETS_TABLE = "lesson_assets";
const LESSON_SETTINGS_TABLE = "lesson_settings";
const LESSON_AVAILABILITY_TABLE = "lesson_availability";
const LESSON_ENTITLEMENTS_TABLE = "lesson_entitlements";
const ADMIN_RPC = "is_admin";
const FREE_CLAIM_RPC = "claim_free_lesson";
const ANON_AUTH_ERROR =
  "Enable Anonymous sign-ins in Supabase Auth so teachers can claim and download lessons securely.";

const FILE_TYPE_META = {
  ppt: {
    label: "PPT",
    accept: ".pptx,.ppt,.pdf",
  },
  lp: {
    label: "LP",
    accept: ".doc,.docx,.pdf",
  },
  activity: {
    label: "Web Game",
    accept: ".html,.htm,.zip",
  },
  worksheet: {
    label: "Worksheet",
    accept: ".pdf,.doc,.docx",
  },
};

const ACCESS_SOURCE_PRIORITY = {
  free_claim: 5,
  bundle: 4,
  grade_pack: 3,
  purchase: 2,
  manual: 1,
};

const supabaseUrl = SUPABASE_URL.trim();
const supabaseAnonKey = SUPABASE_ANON_KEY.trim();
const storageBucket = SUPABASE_STORAGE_BUCKET.trim() || "lesson-assets";
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

setSupabaseConfigError(
  isConfigured
    ? ""
    : "Set SUPABASE_URL and SUPABASE_ANON_KEY in shared/scripts/supabaseConfig.js.",
);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

function normalizeAsset(asset) {
  if (!asset || typeof asset !== "object") {
    return null;
  }

  if (!asset.path || !asset.name) {
    return null;
  }

  return {
    name: String(asset.name),
    path: String(asset.path),
    size: Number(asset.size) || 0,
    mimeType: asset.mimeType ? String(asset.mimeType) : "",
    updatedAt: asset.updatedAt ? String(asset.updatedAt) : "",
  };
}

function normalizeAssetsMap(assets) {
  const normalized = {};

  if (!assets || typeof assets !== "object") {
    return normalized;
  }

  FILE_TYPES.forEach((fileType) => {
    const asset = normalizeAsset(assets[fileType]);

    if (asset) {
      normalized[fileType] = asset;
    }
  });

  return normalized;
}

function sanitizePathSegment(value = "file") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "file";
}

function sanitizeExtension(value = "") {
  const safeExtension = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "");

  if (!safeExtension) {
    return "";
  }

  return safeExtension.startsWith(".")
    ? safeExtension
    : `.${safeExtension}`;
}

function buildStoragePath(sliceKey, fileType, fileName) {
  const extensionIndex = fileName.lastIndexOf(".");
  const baseName =
    extensionIndex > 0 ? fileName.slice(0, extensionIndex) : fileName;
  const extension =
    extensionIndex > 0 ? fileName.slice(extensionIndex) : "";

  return [
    sanitizePathSegment(sliceKey),
    fileType,
    `${Date.now()}-${sanitizePathSegment(baseName)}${sanitizeExtension(extension)}`,
  ].join("/");
}

function ensureConfigured() {
  if (!isConfigured || !supabase) {
    throw new Error(state.configError || "Supabase is not configured yet.");
  }
}

function ensureAdminSession() {
  if (!state.isAdmin || !state.authUser) {
    throw new Error("Sign in with an approved Supabase admin account first.");
  }
}

function buildUploadsFromRows(rows = []) {
  const nextUploads = {};

  rows.forEach((row) => {
    const assets = normalizeAssetsMap(row.assets);

    if (Object.keys(assets).length > 0) {
      nextUploads[row.slice_key] = assets;
    }
  });

  return nextUploads;
}

function buildStatusesFromRows(rows = []) {
  const nextStatuses = {};

  rows.forEach((row) => {
    const status =
      row?.status === "live" || row?.status === "partial" || row?.status === "empty"
        ? row.status
        : "empty";

    if (row?.slice_key) {
      nextStatuses[row.slice_key] = status;
    }
  });

  return nextStatuses;
}

function buildGameStatusesFromRows(rows = []) {
  const nextStatuses = {};

  rows.forEach((row) => {
    if (
      row?.slice_key &&
      (row.game_status === "none" ||
        row.game_status === "coming_soon" ||
        row.game_status === "available")
    ) {
      nextStatuses[row.slice_key] = row.game_status;
    }
  });

  return nextStatuses;
}

function pickPrimaryAccessSource(currentSource = "", nextSource = "") {
  const currentPriority = ACCESS_SOURCE_PRIORITY[currentSource] || 0;
  const nextPriority = ACCESS_SOURCE_PRIORITY[nextSource] || 0;
  return nextPriority >= currentPriority ? nextSource : currentSource;
}

function buildLessonAccessMap(rows = []) {
  const nextAccess = {};

  rows.forEach((row) => {
    if (!row?.slice_key || !row?.source) {
      return;
    }

    const current = nextAccess[row.slice_key] || {
      source: row.source,
      sources: [],
    };
    const sources = current.sources.includes(row.source)
      ? current.sources
      : [...current.sources, row.source];

    nextAccess[row.slice_key] = {
      source: pickPrimaryAccessSource(current.source, row.source),
      sources,
    };
  });

  return nextAccess;
}

function resetPublicStateForMissingConfig() {
  setAuthUser(null);
  setIsAdmin(false);
  setUploads({});
  setGameStatuses({});
  setSliceStatuses({});
  setLessonAccess({});
  markUploadsLoaded(false);
  markAvailabilityLoaded(true);
  markAccessLoaded(true);
  setSyncState("idle");
  setAuthReady(true);
}

function clearAdminUploads() {
  setUploads({});
  markUploadsLoaded(false);
}

function updateLocalSliceStatus(key, uploads, gameStatus = getGameStatus(key)) {
  state.sliceStatuses[key] = deriveSliceStatusFromUploads(uploads, gameStatus);
  markAvailabilityLoaded(true);
}

async function getCurrentSession() {
  ensureConfigured();

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session || null;
}

async function ensureBrowserSession() {
  const currentSession = await getCurrentSession();

  if (currentSession?.user) {
    return currentSession;
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw new Error(ANON_AUTH_ERROR);
  }

  if (!data.session?.user) {
    throw new Error("Supabase did not return a usable session.");
  }

  return data.session;
}

async function getOrCreatePublicSession() {
  const currentSession = await getCurrentSession();

  if (currentSession?.user) {
    return currentSession;
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    return null;
  }

  return data.session || null;
}

async function syncAuthState(session) {
  const user = session?.user || null;
  setAuthUser(user);

  if (!user) {
    setIsAdmin(false);
    return { user: null, isAdmin: false };
  }

  const { data, error } = await supabase.rpc(ADMIN_RPC);

  if (error) {
    throw error;
  }

  const isAdmin = Boolean(data);
  setIsAdmin(isAdmin);
  return { user, isAdmin };
}

async function syncLessonAvailability() {
  ensureConfigured();

  const { data, error } = await supabase
    .from(LESSON_AVAILABILITY_TABLE)
    .select("slice_key, status");

  if (error) {
    throw error;
  }

  setSliceStatuses(buildStatusesFromRows(data || []));
  markAvailabilityLoaded(true);
}

async function syncLessonSettings() {
  ensureConfigured();

  const { data, error } = await supabase
    .from(LESSON_SETTINGS_TABLE)
    .select("slice_key, game_status");

  if (error) {
    throw error;
  }

  setGameStatuses(buildGameStatusesFromRows(data || []));
}

async function syncLessonAccess(session = null) {
  ensureConfigured();

  const activeSession = session || (await getCurrentSession());

  if (!activeSession?.user) {
    setLessonAccess({});
    markAccessLoaded(true);
    return;
  }

  const { data, error } = await supabase
    .from(LESSON_ENTITLEMENTS_TABLE)
    .select("slice_key, source");

  if (error) {
    throw error;
  }

  setLessonAccess(buildLessonAccessMap(data || []));
  markAccessLoaded(true);
}

export async function syncLessonAssets() {
  ensureConfigured();
  ensureAdminSession();

  const { data, error } = await supabase
    .from(LESSON_ASSETS_TABLE)
    .select("slice_key, assets, updated_at");

  if (error) {
    throw error;
  }

  setUploads(buildUploadsFromRows(data || []));
  markUploadsLoaded(true);
  return state.uploads;
}

export async function refreshSupabaseState(options = {}) {
  const { includeUploads = state.isAdmin } = options;

  if (!isConfigured || !supabase) {
    resetPublicStateForMissingConfig();
    return;
  }

  setSyncState("loading");

  try {
    const session = await getOrCreatePublicSession();
    const { isAdmin } = await syncAuthState(session);

    await Promise.all([
      syncLessonSettings(),
      syncLessonAvailability(),
      syncLessonAccess(session),
      includeUploads && isAdmin
        ? syncLessonAssets()
        : Promise.resolve(clearAdminUploads()),
    ]);

    setSyncState("ready");
  } catch (error) {
    clearAdminUploads();
    markAvailabilityLoaded(true);
    markAccessLoaded(true);
    setSyncState("error", getErrorMessage(error, "Unable to reach Supabase."));
    throw error;
  } finally {
    setAuthReady(true);
  }
}

export async function initializeSupabaseState() {
  if (!isConfigured || !supabase) {
    resetPublicStateForMissingConfig();
    return;
  }

  setAuthReady(false);
  await refreshSupabaseState();
}

async function removeStorageObject(path) {
  if (!supabase || !path) {
    return;
  }

  const { error } = await supabase.storage.from(storageBucket).remove([path]);

  if (error) {
    console.warn(`Unable to remove storage object "${path}".`, error);
  }
}

async function upsertLessonAssets(sliceKey, assets) {
  const { error } = await supabase.from(LESSON_ASSETS_TABLE).upsert(
    {
      slice_key: sliceKey,
      assets,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "slice_key",
    },
  );

  if (error) {
    throw error;
  }
}

async function upsertLessonGameStatus(sliceKey, gameStatus) {
  const { error } = await supabase.from(LESSON_SETTINGS_TABLE).upsert(
    {
      slice_key: sliceKey,
      game_status: gameStatus,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "slice_key",
    },
  );

  if (error) {
    throw error;
  }
}

async function ensureAuthenticatedToken() {
  const session = await ensureBrowserSession();

  if (!session.access_token) {
    throw new Error("Supabase session is missing an access token.");
  }

  return session.access_token;
}

async function fetchBundleManifest(key) {
  const accessToken = await ensureAuthenticatedToken();
  const response = await fetch("/api/bundle-manifest", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key }),
  });

  let payload = {};

  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string" && payload.error
        ? payload.error
        : "Unable to prepare this download.",
    );
  }

  return Array.isArray(payload.files) ? payload.files : [];
}

async function fetchLessonAssetManifest(key, fileType) {
  const accessToken = await ensureAuthenticatedToken();
  const response = await fetch("/api/lesson-asset", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, fileType }),
  });

  let payload = {};

  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string" && payload.error
        ? payload.error
        : "Unable to open this lesson asset.",
    );
  }

  return {
    name: typeof payload.name === "string" ? payload.name : "",
    url: typeof payload.url === "string" ? payload.url : "",
  };
}

export function isSupabaseConfigured() {
  return isConfigured;
}

export function getSupabaseConfigMessage() {
  return state.configError || "Supabase is not configured yet.";
}

export function getFileAccept(fileType) {
  return FILE_TYPE_META[fileType]?.accept || "";
}

export function getFileLabel(fileType) {
  return FILE_TYPE_META[fileType]?.label || fileType;
}

export function getSyncStatusLabel() {
  if (!isConfigured) {
    return "Supabase not configured";
  }

  if (state.syncStatus === "loading") {
    return state.isAdmin ? "Syncing admin assets" : "Loading lesson catalog";
  }

  if (state.syncStatus === "error") {
    return state.syncError || "Sync failed";
  }

  if (state.isAdmin && state.uploadIndexLoaded) {
    return "Admin assets synced";
  }

  if (state.availabilityLoaded) {
    return "Catalog synced";
  }

  return "Waiting for initial sync";
}

export async function signInAdmin(email, password) {
  ensureConfigured();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  const session = data.session || (await getCurrentSession());

  if (!session?.user) {
    throw new Error("Supabase did not return a valid admin session.");
  }

  setAuthUser(session.user);

  const { isAdmin } = await syncAuthState(session);

  if (!isAdmin) {
    await supabase.auth.signOut();
    await refreshSupabaseState({ includeUploads: false });
    throw new Error(
      "This user is not in public.admin_users yet. Add the email there first.",
    );
  }

  await refreshSupabaseState({ includeUploads: true });
  return data;
}

export async function signOutAdmin() {
  if (!supabase) {
    setAuthUser(null);
    setIsAdmin(false);
    clearAdminUploads();
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  setAuthUser(null);
  setIsAdmin(false);
  clearAdminUploads();
  markAccessLoaded(false);
  markAvailabilityLoaded(false);

  await refreshSupabaseState({ includeUploads: false });
}

export async function claimFreeLesson(key) {
  ensureConfigured();

  if (!key) {
    throw new Error("Missing lesson key.");
  }

  await ensureBrowserSession();

  const { error } = await supabase.rpc(FREE_CLAIM_RPC, {
    target_slice_key: key,
  });

  if (error) {
    throw error;
  }

  await syncLessonAccess();
  return state.lessonAccess[key] || null;
}

export async function updateLessonGameStatus({ key, gameStatus }) {
  ensureConfigured();
  ensureAdminSession();

  if (!key) {
    throw new Error("Missing lesson key.");
  }

  if (
    gameStatus !== "none" &&
    gameStatus !== "coming_soon" &&
    gameStatus !== "available"
  ) {
    throw new Error("Choose None, Coming Soon, or Available for the game status.");
  }

  await upsertLessonGameStatus(key, gameStatus);
  state.gameStatuses[key] = gameStatus;
  updateLocalSliceStatus(key, getUploads(key), gameStatus);
  return gameStatus;
}

export async function uploadLessonAsset({ key, fileType, file }) {
  ensureConfigured();
  ensureAdminSession();

  const currentAssets = normalizeAssetsMap(getUploads(key));
  const currentAsset = currentAssets[fileType];
  const nextAsset = {
    name: file.name,
    path: buildStoragePath(key, fileType, file.name),
    size: file.size || 0,
    mimeType: file.type || "",
    updatedAt: new Date().toISOString(),
  };

  const { error: storageError } = await supabase.storage
    .from(storageBucket)
    .upload(nextAsset.path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (storageError) {
    throw storageError;
  }

  const nextAssets = {
    ...currentAssets,
    [fileType]: nextAsset,
  };

  try {
    await upsertLessonAssets(key, nextAssets);
    state.uploads[key] = nextAssets;
    markUploadsLoaded(true);
    updateLocalSliceStatus(key, nextAssets);

    if (currentAsset?.path && currentAsset.path !== nextAsset.path) {
      await removeStorageObject(currentAsset.path);
    }

    return nextAsset;
  } catch (error) {
    await removeStorageObject(nextAsset.path);
    throw error;
  }
}

export async function deleteLessonAsset({ key, fileType }) {
  ensureConfigured();
  ensureAdminSession();

  const currentAssets = normalizeAssetsMap(getUploads(key));
  const currentAsset = currentAssets[fileType];

  if (!currentAsset) {
    return false;
  }

  const nextAssets = {
    ...currentAssets,
  };

  delete nextAssets[fileType];

  if (Object.keys(nextAssets).length === 0) {
    const { error } = await supabase
      .from(LESSON_ASSETS_TABLE)
      .delete()
      .eq("slice_key", key);

    if (error) {
      throw error;
    }

    delete state.uploads[key];
    markUploadsLoaded(true);
    updateLocalSliceStatus(key, {});
  } else {
    await upsertLessonAssets(key, nextAssets);
    state.uploads[key] = nextAssets;
    markUploadsLoaded(true);
    updateLocalSliceStatus(key, nextAssets);
  }

  await removeStorageObject(currentAsset.path);
  return true;
}

export async function fetchBundleFiles(key) {
  ensureConfigured();

  if (!key) {
    throw new Error("Missing lesson key.");
  }

  const manifest = await fetchBundleManifest(key);
  const bundleFiles = [];

  for (const file of manifest) {
    if (!file?.url || !file?.name) {
      continue;
    }

    const response = await fetch(file.url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Unable to download ${file.name}.`);
    }

    bundleFiles.push({
      name: file.name,
      blob: await response.blob(),
    });
  }

  return bundleFiles;
}

export async function fetchLessonAssetUrl(key, fileType) {
  ensureConfigured();

  if (!key) {
    throw new Error("Missing lesson key.");
  }

  if (!fileType) {
    throw new Error("Missing lesson asset type.");
  }

  const asset = await fetchLessonAssetManifest(key, fileType);

  if (!asset.url) {
    throw new Error("This lesson asset is not available yet.");
  }

  return asset;
}

export function getErrorMessage(error, fallbackMessage = "Something went wrong.") {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message || fallbackMessage);
  }

  return fallbackMessage;
}
