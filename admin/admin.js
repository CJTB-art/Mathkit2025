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
  ADMIN_PW,
  getStatus,
  getUploads,
  lessonKey,
  state,
} from "../shared/scripts/store.js";

const GRADES = [7, 8, 9, 10];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

export function showPublic() {
  setActiveView("home");
  syncAdminNavButton();
  scrollToTop();
}

export function showLessons() {
  setActiveView("lessons");
  syncAdminNavButton();
  renderPublic();
  scrollToTop();
}

export function showPricing() {
  setActiveView("lessons");
  syncAdminNavButton();
  renderPublic();
  scrollToSection("pricing");
}

export function showAdmin() {
  syncAdminNavButton();

  if (state.isAdmin) {
    setActiveView("admin");
    renderAdmin();
    return;
  }

  setActiveView("login");
  hideLoginError();

  const passwordInput = document.getElementById("pwInput");
  window.setTimeout(() => passwordInput?.focus(), 100);
}

export function submitLogin() {
  const passwordInput = document.getElementById("pwInput");
  const errorMessage = document.getElementById("loginErr");

  if (!(passwordInput instanceof HTMLInputElement) || !errorMessage) {
    return;
  }

  if (passwordInput.value === ADMIN_PW) {
    state.isAdmin = true;
    passwordInput.value = "";
    errorMessage.style.display = "none";
    showAdmin();
    return;
  }

  errorMessage.style.display = "block";
}

export function renderAdmin() {
  const stats = document.getElementById("adminStats");
  const catalog = document.getElementById("adminCatalog");

  if (!stats || !catalog) {
    return;
  }

  const liveCount = CURRICULUM.filter((lesson) => {
    return getStatus(lessonKey(lesson)) === "live";
  }).length;
  const partialCount = CURRICULUM.filter((lesson) => {
    return getStatus(lessonKey(lesson)) === "partial";
  }).length;
  const emptyCount = CURRICULUM.length - liveCount - partialCount;

  stats.innerHTML = `
    <div class="astat">
      <div class="astat-num total">${CURRICULUM.length}</div>
      <div class="astat-label">Total Lessons</div>
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
    const liveLessons = gradeLessons.filter((lesson) => {
      return getStatus(lessonKey(lesson)) === "live";
    }).length;

    html += `
      <div class="admin-grade-block">
        <div class="admin-grade-title">
          Grade ${grade}
          <span class="admin-grade-meta">${liveLessons}/${gradeLessons.length} live</span>
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
          ${quarterLessons.map((lesson) => renderLessonRow(lesson)).join("")}
        </div>
      `;
    });

    html += "</div>";
  });

  catalog.innerHTML = html;
  refreshIcons();
}

export function handleUploadChange(input) {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const key = input.dataset.key;
  const fileType = input.dataset.fileType;
  const file = input.files?.[0];

  if (!key || !fileType || !file) {
    return;
  }

  if (!state.uploads[key]) {
    state.uploads[key] = {};
  }

  state.uploads[key][fileType] = file;

  renderAdmin();
  renderPublic();

  const uploadState = getUploads(key);

  if (uploadState.ppt && uploadState.lp && uploadState.activity) {
    showToast("Lesson is now live.", "success");
  } else {
    showToast(`${file.name} saved.`, "success");
  }
}

export function handleDeleteUpload(button) {
  const { key, fileType } = button.dataset;

  if (!key || !fileType || !state.uploads[key]) {
    return;
  }

  state.uploads[key][fileType] = null;

  if (
    !state.uploads[key].ppt &&
    !state.uploads[key].lp &&
    !state.uploads[key].activity
  ) {
    delete state.uploads[key];
  }

  renderAdmin();
  renderPublic();
  showToast("File removed.");
}

function renderLessonRow(lesson) {
  const key = lessonKey(lesson);
  const status = getStatus(key);
  const statusClass =
    status === "live" ? "sp-live" : status === "partial" ? "sp-partial" : "sp-empty";
  const statusLabel =
    status === "live" ? "Live" : status === "partial" ? "Partial" : "Empty";

  return `
    <div class="admin-lesson-row">
      <div class="alr-q">${lesson.q}</div>
      <div class="alr-code">${escapeHtml(lesson.code)}</div>
      <div class="alr-topic">${escapeHtml(lesson.topic)}</div>
      <div class="upload-slots">
        ${renderUploadSlot(key, "ppt", "PPT")}
        ${renderUploadSlot(key, "lp", "LP")}
        ${renderUploadSlot(key, "activity", "Activity")}
      </div>
      <div class="alr-status"><span class="status-pill ${statusClass}">${statusLabel}</span></div>
    </div>
  `;
}

function renderUploadSlot(key, fileType, label) {
  const file = getUploads(key)[fileType];
  const accept =
    fileType === "ppt"
      ? ".pptx,.ppt,.pdf"
      : fileType === "lp"
        ? ".doc,.docx,.pdf"
        : ".html,.htm,.zip";

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

  return "file";
}

function setActiveView(view) {
  document.getElementById("homeView")?.classList.toggle("active", view === "home");
  document.getElementById("clientView")?.classList.toggle("active", view === "lessons");
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
    .querySelectorAll('#navLinks [data-action="show-home"], #navLinks [data-action="show-lessons"]')
    .forEach((element) => {
      if (!(element instanceof HTMLElement)) {
        return;
      }

      const action = element.dataset.action;
      const isActive =
        (action === "show-home" && view === "home") ||
        (action === "show-lessons" && view === "lessons");

      element.classList.toggle("active", isActive);
    });
}

function hideLoginError() {
  const errorMessage = document.getElementById("loginErr");

  if (errorMessage) {
    errorMessage.style.display = "none";
  }
}

function syncAdminNavButton() {
  const adminButton = document.getElementById("adminNavBtn");

  if (adminButton) {
    adminButton.innerHTML = `
      ${icon("shield", "icon icon-sm")}
      <span>${state.isAdmin ? "Admin OK" : "Admin"}</span>
    `;
    refreshIcons();
  }
}

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

function scrollToSection(id) {
  if (typeof window === "undefined") {
    return;
  }

  window.requestAnimationFrame(() => {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
