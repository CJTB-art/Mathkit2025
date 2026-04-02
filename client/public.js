import { CURRICULUM } from "../shared/data/curriculum.js";
import {
  escapeAttr,
  escapeHtml,
  icon,
  refreshIcons,
} from "../shared/scripts/helpers.js";
import { getStatus, lessonKey, state } from "../shared/scripts/store.js";
import { showLessons } from "../admin/admin.js";

const GRADES = [7, 8, 9, 10];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

export function handleSetFilter(button) {
  const { filter, value } = button.dataset;

  if (!filter || !value) {
    return;
  }

  state.filters[filter] = value;
  renderPublic();
}

export function browseLessons() {
  showLessons();
}

export function renderPublic() {
  renderClaimBanner();
  syncFilterButtons();
  renderCatalog();
  refreshIcons();
}

function renderClaimBanner() {
  const banner = document.getElementById("freeClaimBanner");

  if (!banner) {
    return;
  }

  if (!state.userFreeLesson) {
    banner.innerHTML = `
      <div class="fcb-inner">
        <div class="fcb-icon">${icon("gift", "icon icon-lg")}</div>
        <div class="fcb-text">
          <div class="fcb-title">You have 1 free lesson to claim.</div>
          <div class="fcb-sub">
            Pick any available lesson, claim it once, and get the full LP, PPT,
            and activity in one zip download.
          </div>
        </div>
      </div>
    `;
    return;
  }

  const claimedLesson = CURRICULUM.find((lesson) => {
    return lessonKey(lesson) === state.userFreeLesson;
  });

  banner.innerHTML = `
    <div class="fcb-inner fcb-claimed">
      <div class="fcb-icon">${icon("check", "icon icon-lg")}</div>
      <div class="fcb-text">
        <div class="fcb-title">
          Free lesson claimed: ${escapeHtml(claimedLesson?.topic || "Current lesson")}
        </div>
        <div class="fcb-sub">
          Download your bundle anytime from the matching lesson card below.
        </div>
      </div>
    </div>
  `;
}

function syncFilterButtons() {
  document.querySelectorAll('[data-action="set-filter"]').forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const { filter, value } = button.dataset;
    const isActive = Boolean(
      filter && value && state.filters[filter] === value,
    );

    button.classList.toggle("active", isActive);
  });
}

function renderCatalog() {
  const catalog = document.getElementById("publicCatalog");

  if (!catalog) {
    return;
  }

  const filteredLessons = CURRICULUM.filter((lesson) => {
    const gradeMatches =
      state.filters.grade === "all" ||
      String(lesson.grade) === state.filters.grade;
    const status = getStatus(lessonKey(lesson)) === "live" ? "live" : "coming";
    const statusMatches =
      state.filters.status === "all" || state.filters.status === status;

    return gradeMatches && statusMatches;
  });

  if (!filteredLessons.length) {
    catalog.innerHTML =
      '<div class="catalog-empty">No lessons match this filter yet.</div>';
    return;
  }

  const lessonsByGrade = new Map();

  filteredLessons.forEach((lesson) => {
    const currentLessons = lessonsByGrade.get(lesson.grade) || [];
    currentLessons.push(lesson);
    lessonsByGrade.set(lesson.grade, currentLessons);
  });

  let html = "";

  GRADES.forEach((grade) => {
    const gradeLessons = lessonsByGrade.get(grade);

    if (!gradeLessons) {
      return;
    }

    const lessonsByQuarter = new Map();

    gradeLessons.forEach((lesson) => {
      const currentLessons = lessonsByQuarter.get(lesson.q) || [];
      currentLessons.push(lesson);
      lessonsByQuarter.set(lesson.q, currentLessons);
    });

    html += `<div class="grade-block"><div class="grade-heading">Grade ${grade}</div>`;

    QUARTERS.forEach((quarter) => {
      const quarterLessons = lessonsByQuarter.get(quarter);

      if (!quarterLessons) {
        return;
      }

      html += `
        <div class="quarter-block">
          <div class="quarter-label">Quarter ${quarter.replace("Q", "")}</div>
          <div class="lessons-grid">
            ${quarterLessons.map((lesson) => renderLessonCard(lesson)).join("")}
          </div>
        </div>
      `;
    });

    html += "</div>";
  });

  catalog.innerHTML = html;
}

function renderLessonCard(lesson) {
  const key = lessonKey(lesson);
  const isLive = getStatus(key) === "live";
  const isMyFree = state.userFreeLesson === key;
  const hasClaimed = Boolean(state.userFreeLesson);
  const statusClass = isMyFree ? "b-free" : isLive ? "b-live" : "b-soon";
  const statusLabel = isMyFree ? "Your Free" : isLive ? "Available" : "Coming Soon";

  return `
    <div class="lcard ${isLive ? "live" : "coming"} ${isMyFree ? "user-free-card" : ""}">
      <div class="card-top">
        <div class="card-top-left">
          <span class="badge b-grade">G${lesson.grade}</span>
          <span class="badge b-q">${lesson.q}</span>
        </div>
        <span class="badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="card-topic">${escapeHtml(lesson.topic)}</div>
      <div class="card-code">${escapeHtml(lesson.code)} &middot; ${escapeHtml(lesson.strand)}</div>
      <div class="card-summary">
        ${renderLessonSummary(isLive, isMyFree, hasClaimed)}
      </div>
      <div class="card-footer">
        ${renderLessonFooter(lesson, key, isLive, isMyFree, hasClaimed)}
      </div>
    </div>
  `;
}

function renderLessonSummary(isLive, isMyFree, hasClaimed) {
  if (!isLive) {
    return "LP, PPT, and activity will appear here once this lesson is published.";
  }

  if (isMyFree) {
    return "Your claimed lesson is ready as one full downloadable bundle.";
  }

  if (!hasClaimed) {
    return "Claim this lesson once to unlock the LP, PPT, and interactive activity.";
  }

  return "This lesson is already prepared and unlocks through a grade pack or full bundle.";
}

function renderLessonFooter(lesson, key, isLive, isMyFree, hasClaimed) {
  if (!isLive) {
    return `
      <div class="card-note">
        ${icon("clock-3", "icon icon-sm")}
        Files coming soon
      </div>
    `;
  }

  if (isMyFree) {
    return `
      <div class="card-action-block">
        <button
          type="button"
          class="chip dl-bundle"
          data-action="download-bundle"
          data-key="${escapeAttr(key)}"
          data-topic="${escapeAttr(lesson.topic)}"
        >
          ${icon("download", "icon icon-sm")}
          Download Free Bundle
        </button>
        <div class="card-includes">Includes LP, PPT, and activity</div>
      </div>
    `;
  }

  if (!hasClaimed) {
    return `
      <div class="card-action-block">
        <button
          type="button"
          class="chip claim-chip"
          data-action="claim-free"
          data-key="${escapeAttr(key)}"
          data-topic="${escapeAttr(lesson.topic)}"
          data-code="${escapeAttr(lesson.code)}"
          data-strand="${escapeAttr(lesson.strand)}"
          data-grade="${lesson.grade}"
          data-quarter="${escapeAttr(lesson.q)}"
        >
          ${icon("gift", "icon icon-sm")}
          Claim Free
        </button>
        <div class="card-includes">One-click access to LP, PPT, and activity</div>
      </div>
    `;
  }

  return `
    <div class="card-action-block">
      <div class="card-note">
        ${icon("lock", "icon icon-sm")}
        Unlock through a pack or bundle
      </div>
      <div class="card-includes">LP, PPT, and activity are already included once purchased</div>
    </div>
  `;
}
