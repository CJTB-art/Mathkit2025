import { renderPublic } from "../client/public.js";
import { CURRICULUM } from "../shared/data/curriculum.js";
import {
  escapeAttr,
  escapeHtml,
  icon,
  refreshIcons,
  showToast,
} from "../shared/scripts/helpers.js";
import {
  deleteLessonAsset,
  getErrorMessage,
  getFileAccept,
  getFileLabel,
  getSupabaseConfigMessage,
  getSyncStatusLabel,
  isSupabaseConfigured,
  refreshSupabaseState,
  signInAdmin,
  signOutAdmin,
  updateLessonGameStatus,
  uploadLessonAsset,
} from "../shared/scripts/supabase.js";
import {
  FILE_TYPES,
  getGameStatus,
  getLessonProgress,
  getSliceStatus,
  getTotalSliceCount,
  getUploads,
  sliceKey,
  state,
} from "../shared/scripts/store.js";

const GRADES = [7, 8, 9, 10];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
let adminAutoRefreshBound = false;
let adminAutoRefreshSuspendedUntil = 0;

export function showPublic() {
  state.lessonPreviewKey = null;
  setActiveView("home");
  syncAdminChrome();
  scrollToTop();
}

export function showLessons() {
  state.lessonPreviewKey = null;
  setActiveView("lessons");
  syncAdminChrome();
  renderPublic();
  scrollToTop();
}

export function showPricing() {
  state.lessonPreviewKey = null;
  setActiveView("pricing");
  syncAdminChrome();
  scrollToTop();
}

export function showAdmin() {
  state.lessonPreviewKey = null;
  syncAdminChrome();

  if (state.isAdmin) {
    bindAdminAutoRefresh();
    setActiveView("admin");
    renderAdmin();
    void refreshLessonAssets({ silent: true });
    return;
  }

  setActiveView("login");
  hideLoginError();

  const emailInput = document.getElementById("adminEmailInput");
  const passwordInput = document.getElementById("adminPasswordInput");
  const nextFocus = emailInput || passwordInput;

  window.setTimeout(() => nextFocus?.focus(), 100);
}

export async function submitLogin() {
  const emailInput = document.getElementById("adminEmailInput");
  const passwordInput = document.getElementById("adminPasswordInput");

  if (
    !(emailInput instanceof HTMLInputElement) ||
    !(passwordInput instanceof HTMLInputElement)
  ) {
    return;
  }

  if (!isSupabaseConfigured()) {
    showLoginError(getSupabaseConfigMessage());
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showLoginError("Enter your Supabase admin email and password.");
    return;
  }

  setLoginBusy(true);
  hideLoginError();

  try {
    await signInAdmin(email, password);
    passwordInput.value = "";
    showToast("Signed in. Lesson uploads are now protected by your admin account.", "success");
    showAdmin();
  } catch (error) {
    console.error(error);
    showLoginError(getErrorMessage(error, "Unable to sign in."));
  } finally {
    setLoginBusy(false);
  }
}

export async function signOutAdminSession() {
  try {
    await signOutAdmin();
    syncAdminChrome();
    renderPublic();
    showAdmin();
    showToast("Signed out.");
  } catch (error) {
    console.error(error);
    showToast(getErrorMessage(error, "Unable to sign out."), "error");
  }
}

export async function refreshLessonAssets(options = {}) {
  const { silent = false } = options;

  if (!isSupabaseConfigured()) {
    syncAdminChrome();
    if (!silent) {
      showToast(getSupabaseConfigMessage(), "error");
    }
    return false;
  }

  if (!state.isAdmin) {
    if (!silent) {
      showToast("Sign in with an approved Supabase admin account first.", "error");
    }
    return false;
  }

  if (!silent) {
    showToast("Refreshing lesson assets...");
  }

  try {
    const syncPromise = refreshSupabaseState({ includeUploads: true });
    syncAdminChrome();

    if (document.getElementById("adminView")?.classList.contains("active")) {
      renderAdmin();
    }

    await syncPromise;
    syncAdminChrome();
    renderPublic();

    if (document.getElementById("adminView")?.classList.contains("active")) {
      renderAdmin();
    }

    if (!silent) {
      showToast("Lesson assets synced.", "success");
    }

    return true;
  } catch (error) {
    console.error(error);
    syncAdminChrome();

    if (document.getElementById("adminView")?.classList.contains("active")) {
      renderAdmin();
    }

    if (!silent) {
      showToast(
        getErrorMessage(error, "Unable to refresh lesson assets."),
        "error",
      );
    }

    return false;
  }
}

export function renderAdmin() {
  const stats = document.getElementById("adminStats");
  const catalog = document.getElementById("adminCatalog");

  if (!stats || !catalog) {
    return;
  }

  syncAdminChrome();

  if (!isSupabaseConfigured()) {
    stats.innerHTML = renderAdminNotice(
      "Supabase is not configured yet.",
      "Add your project URL and anon key in shared/scripts/supabaseConfig.js to enable admin uploads.",
    );
    catalog.innerHTML = "";
    refreshIcons();
    return;
  }

  if (!state.uploadIndexLoaded && state.syncStatus === "loading") {
    stats.innerHTML = renderAdminNotice(
      "Loading lesson assets...",
      "Pulling the latest lesson status from Supabase.",
    );
    catalog.innerHTML = "";
    refreshIcons();
    return;
  }

  const totalSlices = getTotalSliceCount(CURRICULUM);
  let liveCount = 0;
  let partialCount = 0;

  CURRICULUM.forEach((lesson) => {
    const progress = getLessonProgress(lesson);
    liveCount += progress.liveCount;
    partialCount += progress.partialCount;
  });

  const emptyCount = totalSlices - liveCount - partialCount;
  const syncNotice =
    state.syncStatus === "error"
      ? `
        <div class="admin-wide-note admin-wide-note-error">
          ${icon("triangle-alert", "icon icon-sm")}
          <span>${escapeHtml(state.syncError || "Supabase sync failed.")}</span>
        </div>
      `
      : "";

  stats.innerHTML = `
    ${syncNotice}
    <div class="astat">
      <div class="astat-num total">${totalSlices}</div>
      <div class="astat-label">Total Slices</div>
    </div>
    <div class="astat">
      <div class="astat-num live">${liveCount}</div>
      <div class="astat-label">Live</div>
    </div>
    <div class="astat">
      <div class="astat-num partial">${partialCount}</div>
      <div class="astat-label">Partial</div>
    </div>
    <div class="astat">
      <div class="astat-num empty">${emptyCount}</div>
      <div class="astat-label">Not Started</div>
    </div>
  `;

  let html = "";

  GRADES.forEach((grade) => {
    const gradeLessons = CURRICULUM.filter((lesson) => lesson.grade === grade);
    const gradeSliceCount = gradeLessons.reduce((count, lesson) => {
      return count + lesson.microLessons.length;
    }, 0);
    const gradeLiveCount = gradeLessons.reduce((count, lesson) => {
      return count + getLessonProgress(lesson).liveCount;
    }, 0);

    html += `
      <div class="admin-grade-block">
        <div class="admin-grade-title">
          Grade ${grade}
          <span class="admin-grade-meta">${gradeLiveCount}/${gradeSliceCount} slices live</span>
        </div>
    `;

    QUARTERS.forEach((quarter) => {
      const quarterLessons = gradeLessons.filter((lesson) => lesson.q === quarter);

      if (!quarterLessons.length) {
        return;
      }

      html += `
        <div class="admin-quarter-block">
          <div class="quarter-label">Quarter ${quarter.replace("Q", "")}</div>
          ${quarterLessons.map((lesson) => renderLessonPack(lesson)).join("")}
        </div>
      `;
    });

    html += "</div>";
  });

  catalog.innerHTML = html;
  refreshIcons();
}

export async function handleUploadChange(input) {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const key = input.dataset.key;
  const fileType = input.dataset.fileType;
  const file = input.files?.[0];

  input.value = "";

  if (!key || !fileType || !file) {
    return;
  }

  showToast(`Uploading ${file.name}...`);

  try {
    await uploadLessonAsset({ key, fileType, file });
    renderAdmin();
    renderPublic();
    void refreshLessonAssets({ silent: true });

    const uploadState = getUploads(key);

    if (FILE_TYPES.every((type) => Boolean(uploadState[type]))) {
      showToast("Micro-lesson is now live.", "success");
    } else {
      showToast(`${file.name} uploaded.`, "success");
    }
  } catch (error) {
    console.error(error);
    showToast(
      getErrorMessage(
        error,
        `Unable to upload ${getFileLabel(fileType)} right now.`,
      ),
      "error",
    );
  }
}

export async function handleGameStatusChange(select) {
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }

  const key = select.dataset.key;
  const gameStatus = select.value;

  if (!key || !gameStatus) {
    return;
  }

  select.disabled = true;

  try {
    await updateLessonGameStatus({ key, gameStatus });
    renderAdmin();
    renderPublic();
    void refreshLessonAssets({ silent: true });
    showToast("Game status updated.", "success");
  } catch (error) {
    console.error(error);
    showToast(
      getErrorMessage(error, "Unable to update the game status right now."),
      "error",
    );
  } finally {
    select.disabled = false;
  }
}

export async function handleDeleteUpload(button) {
  const { key, fileType } = button.dataset;

  if (!key || !fileType || !getUploads(key)[fileType]) {
    return;
  }

  try {
    await deleteLessonAsset({ key, fileType });
    renderAdmin();
    renderPublic();
    void refreshLessonAssets({ silent: true });
    showToast("File removed.");
  } catch (error) {
    console.error(error);
    showToast(
      getErrorMessage(error, "Unable to remove this file right now."),
      "error",
    );
  }
}

function renderLessonPack(lesson) {
  const progress = getLessonProgress(lesson);
  const isCuratedPack = lesson.isCuratedSequence && lesson.sliceCount > 1;

  if (!isCuratedPack) {
    return `
      <div class="admin-lesson-pack">
        <div class="alr-pack-head">
          <div class="alr-pack-code">${escapeHtml(lesson.code)}</div>
          <div class="alr-pack-copy">
            <div class="alr-pack-topic">${escapeHtml(lesson.topic)}</div>
            <div class="alr-pack-meta">Single focused lesson &middot; ${lesson.durationMinutes} mins &middot; ${progress.liveCount}/${progress.totalCount} live</div>
          </div>
        </div>
        <div class="admin-slice-list">
          ${renderSingleLessonRow(lesson)}
        </div>
      </div>
    `;
  }

  return `
    <div class="admin-lesson-pack">
      <div class="alr-pack-head">
        <div class="alr-pack-code">${escapeHtml(lesson.code)}</div>
        <div class="alr-pack-copy">
          <div class="alr-pack-topic">${escapeHtml(lesson.topic)}</div>
          <div class="alr-pack-meta">
            ${lesson.sliceCount} teachable slices &middot; ${lesson.durationMinutes} mins each &middot; ${escapeHtml(lesson.pacingLabel)} &middot; ${progress.liveCount}/${progress.totalCount} live
          </div>
        </div>
      </div>
      <div class="admin-slice-list">
        ${lesson.microLessons.map((microLesson) => renderSliceRow(lesson, microLesson)).join("")}
      </div>
    </div>
  `;
}

function renderSingleLessonRow(lesson) {
  const microLesson = lesson.microLessons[0];
  const key = sliceKey(lesson, microLesson);
  const status = getSliceStatus(key);
  const statusClass =
    status === "live" ? "sp-live" : status === "partial" ? "sp-partial" : "sp-empty";
  const statusLabel =
    status === "live" ? "Live" : status === "partial" ? "Partial" : "Empty";

  return `
    <div class="admin-lesson-row admin-lesson-row--single">
      <div class="alr-topic-block">
        <div class="alr-topic">${escapeHtml(lesson.topic)}</div>
      </div>
      <div class="upload-slots">
        ${renderUploadSlot(key, "ppt")}
        ${renderUploadSlot(key, "lp")}
        ${renderUploadSlot(key, "activity")}
        ${renderUploadSlot(key, "worksheet")}
      </div>
      <div class="alr-game-status">
        ${renderGameStatusControl(key)}
      </div>
      <div class="alr-status"><span class="status-pill ${statusClass}">${statusLabel}</span></div>
    </div>
  `;
}

function renderSliceRow(lesson, microLesson) {
  const key = sliceKey(lesson, microLesson);
  const status = getSliceStatus(key);
  const statusClass =
    status === "live" ? "sp-live" : status === "partial" ? "sp-partial" : "sp-empty";
  const statusLabel =
    status === "live" ? "Live" : status === "partial" ? "Partial" : "Empty";

  return `
    <div class="admin-lesson-row admin-lesson-row--slice">
      <div class="alr-seq">L${microLesson.sequenceNo}</div>
      <div class="alr-topic-block">
        <div class="alr-topic">${escapeHtml(microLesson.title)}</div>
        <div class="alr-scope">${escapeHtml(microLesson.goal)}</div>
      </div>
      <div class="upload-slots">
        ${renderUploadSlot(key, "ppt")}
        ${renderUploadSlot(key, "lp")}
        ${renderUploadSlot(key, "activity")}
        ${renderUploadSlot(key, "worksheet")}
      </div>
      <div class="alr-game-status">
        ${renderGameStatusControl(key)}
      </div>
      <div class="alr-status"><span class="status-pill ${statusClass}">${statusLabel}</span></div>
    </div>
  `;
}

function renderGameStatusControl(key) {
  const gameStatus = getGameStatus(key);

  return `
    <label class="game-status-field">
      <span class="game-status-label">Game</span>
      <select
        class="game-status-select"
        data-action="change-game-status"
        data-key="${escapeAttr(key)}"
      >
        <option value="none" ${gameStatus === "none" ? "selected" : ""}>No Game</option>
        <option value="coming_soon" ${gameStatus === "coming_soon" ? "selected" : ""}>Coming Soon</option>
        <option value="available" ${gameStatus === "available" ? "selected" : ""}>Available</option>
      </select>
    </label>
  `;
}

function renderUploadSlot(key, fileType) {
  const file = getUploads(key)[fileType];
  const label = getFileLabel(fileType);
  const accept = getFileAccept(fileType);

  if (file) {
    const shortName =
      file.name.length > 16 ? `${file.name.slice(0, 13)}...` : file.name;

    return `
      <div class="uslot-wrap">
        <div class="uslot uploaded" title="${escapeAttr(file.name)}">
          <input
            type="file"
            data-action="upload-file"
            data-key="${escapeAttr(key)}"
            data-file-type="${fileType}"
            accept="${accept}"
          />
          <span class="slot-label">
            ${icon(slotIconName(fileType, true), "icon icon-sm")}
            Saved ${escapeHtml(shortName)}
          </span>
        </div>
        <button
          type="button"
          class="del-file-btn"
          data-action="delete-upload"
          data-key="${escapeAttr(key)}"
          data-file-type="${fileType}"
          title="Remove file"
        >
          ${icon("x", "icon icon-xs")}
        </button>
      </div>
    `;
  }

  return `
    <div class="uslot-wrap">
      <div class="uslot" title="Upload ${label}">
        <input
          type="file"
          data-action="upload-file"
          data-key="${escapeAttr(key)}"
          data-file-type="${fileType}"
          accept="${accept}"
        />
        <span class="slot-label">
          ${icon(slotIconName(fileType, false), "icon icon-sm")}
          Upload ${label}
        </span>
      </div>
    </div>
  `;
}

function renderAdminNotice(title, copy) {
  return `
    <div class="admin-notice">
      <div class="admin-notice-title">${escapeHtml(title)}</div>
      <div class="admin-notice-copy">${escapeHtml(copy)}</div>
    </div>
  `;
}

function slotIconName(fileType, uploaded) {
  if (uploaded) {
    return "check";
  }

  if (fileType === "lp") {
    return "file-text";
  }

  if (fileType === "activity") {
    return "play";
  }

  if (fileType === "worksheet") {
    return "printer";
  }

  return "file";
}

function setActiveView(view) {
  document.getElementById("homeView")?.classList.toggle("active", view === "home");
  document.getElementById("clientView")?.classList.toggle("active", view === "lessons");
  document.getElementById("pricingView")?.classList.toggle("active", view === "pricing");
  document.getElementById("adminView")?.classList.toggle("active", view === "admin");
  document.getElementById("loginView")?.classList.toggle("active", view === "login");
  syncNavLinks(view);

  const navLinks = document.getElementById("navLinks");

  if (navLinks) {
    navLinks.style.display = view === "admin" || view === "login" ? "none" : "flex";
  }
}

function syncNavLinks(view) {
  document
    .querySelectorAll(
      '#navLinks [data-action="show-home"], #navLinks [data-action="show-lessons"], #navLinks [data-action="show-pricing"]',
    )
    .forEach((element) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      const action = element.dataset.action;
      const isActive =
        (action === "show-home" && view === "home") ||
        (action === "show-lessons" && view === "lessons") ||
        (action === "show-pricing" && view === "pricing");

      element.classList.toggle("active", isActive);
    });
}

export function syncAdminChrome() {
  syncAdminNavButton();
  syncLoginHelp();
  syncAdminMeta();
}

function syncLoginHelp() {
  const help = document.getElementById("loginHelp");

  if (!help) {
    return;
  }

  if (!isSupabaseConfigured()) {
    help.textContent = getSupabaseConfigMessage();
    help.className = "login-tip warning";
    return;
  }

  help.textContent = "Use a Supabase account that is also listed in public.admin_users.";
  help.className = "login-tip";
}

function syncAdminMeta() {
  const syncStatus = document.getElementById("adminSyncStatus");
  const sessionMeta = document.getElementById("adminSessionMeta");
  const refreshButton = document.getElementById("adminRefreshBtn");
  const signOutButton = document.getElementById("adminSignOutBtn");

  if (syncStatus) {
    syncStatus.textContent = getSyncStatusLabel();
    syncStatus.className = `admin-sync-pill ${state.syncStatus}`.trim();
  }

  if (sessionMeta) {
    sessionMeta.textContent = state.isAdmin && state.authUser?.email
      ? `Signed in as ${state.authUser.email}`
      : state.authUser
        ? "Public visitor session active"
        : "Not signed in";
  }

  if (refreshButton instanceof HTMLButtonElement) {
    refreshButton.disabled =
      !state.isAdmin ||
      !isSupabaseConfigured() ||
      state.syncStatus === "loading";
  }

  if (signOutButton instanceof HTMLButtonElement) {
    signOutButton.disabled = !state.isAdmin;
  }
}

function hideLoginError() {
  const errorMessage = document.getElementById("loginErr");

  if (errorMessage) {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }
}

function showLoginError(message) {
  const errorMessage = document.getElementById("loginErr");

  if (!errorMessage) {
    return;
  }

  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

function setLoginBusy(isBusy) {
  const button = document.getElementById("loginSubmitBtn");
  const emailInput = document.getElementById("adminEmailInput");
  const passwordInput = document.getElementById("adminPasswordInput");

  if (button instanceof HTMLButtonElement) {
    button.disabled = isBusy;
    button.innerHTML = isBusy
      ? `${icon("loader-circle", "icon icon-sm")} Signing in...`
      : `${icon("shield", "icon icon-sm")} Sign in`;
  }

  if (emailInput instanceof HTMLInputElement) {
    emailInput.disabled = isBusy;
  }

  if (passwordInput instanceof HTMLInputElement) {
    passwordInput.disabled = isBusy;
  }

  refreshIcons();
}

function syncAdminNavButton() {
  const adminButton = document.getElementById("adminNavBtn");

  if (adminButton) {
    const label = !isSupabaseConfigured()
      ? "Setup"
      : state.syncStatus === "loading"
        ? "Syncing"
        : state.isAdmin
          ? "Admin OK"
          : "Admin";

    adminButton.innerHTML = `
      ${icon("shield", "icon icon-sm")}
      <span>${label}</span>
    `;
    refreshIcons();
  }
}

function bindAdminAutoRefresh() {
  if (
    adminAutoRefreshBound ||
    typeof window === "undefined" ||
    typeof document === "undefined"
  ) {
    return;
  }

  const refreshVisibleAdmin = () => {
    const isAdminViewActive = document
      .getElementById("adminView")
      ?.classList.contains("active");

    if (
      !isAdminViewActive ||
      !state.isAdmin ||
      Date.now() < adminAutoRefreshSuspendedUntil
    ) {
      return;
    }

    void refreshLessonAssets({ silent: true });
  };

  window.addEventListener("focus", refreshVisibleAdmin);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreshVisibleAdmin();
    }
  });
  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const uploadInput = target.closest('input[data-action="upload-file"]');

    if (uploadInput) {
      adminAutoRefreshSuspendedUntil = Date.now() + 5000;
    }
  });

  adminAutoRefreshBound = true;
}

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}
