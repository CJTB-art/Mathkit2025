import { CURRICULUM } from "../shared/data/curriculum.js";
import {
  escapeAttr,
  escapeHtml,
  icon,
  refreshIcons,
} from "../shared/scripts/helpers.js";
import {
  getGameStatus,
  getLessonProgress,
  getSliceStatus,
  lessonKey,
  sliceKey,
  state,
  userHasLessonAccess,
} from "../shared/scripts/store.js";
import { isSupabaseConfigured } from "../shared/scripts/supabase.js";
import { showLessons } from "../admin/admin.js";

const GRADES = [7, 8, 9, 10];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
const LESSON_MATERIALS = ["LP", "PPT", "Worksheet"];

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

export function openLessonDetails(button) {
  const key = button.dataset.lessonKey;

  if (!key) {
    return;
  }

  state.lessonPreviewKey = key;
  renderPublic();
}

export function closeLessonDetails() {
  if (!state.lessonPreviewKey) {
    return;
  }

  state.lessonPreviewKey = null;
  renderPublic();
}

export function renderPublic() {
  renderClaimBanner();
  syncFilterButtons();
  renderCatalog();
  renderLessonDetailsModal();
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
            Pick any available micro-lesson, claim it once, and get the full LP, PPT,
            worksheet, plus any interactive game access marked on that lesson.
          </div>
        </div>
      </div>
    `;
    return;
  }

  const claimed = findSliceByKey(state.userFreeLesson);

  banner.innerHTML = `
    <div class="fcb-inner fcb-claimed">
      <div class="fcb-icon">${icon("check", "icon icon-lg")}</div>
      <div class="fcb-text">
        <div class="fcb-title">
          Free lesson claimed: ${escapeHtml(claimed?.slice.title || "Current lesson")}
        </div>
        <div class="fcb-sub">
          ${getClaimedBannerCopy(claimed)}
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

  if (!state.availabilityLoaded && isSupabaseConfigured()) {
    catalog.innerHTML =
      '<div class="catalog-empty">Loading live lesson availability...</div>';
    return;
  }

  const filteredLessons = CURRICULUM.filter((lesson) => {
    const gradeMatches =
      state.filters.grade === "all" ||
      String(lesson.grade) === state.filters.grade;
    const quarterMatches =
      state.filters.quarter === "all" ||
      lesson.q === state.filters.quarter;
    const progress = getLessonProgress(lesson);
    const status = progress.liveCount > 0 ? "live" : "coming";
    const statusMatches =
      state.filters.status === "all" || state.filters.status === status;

    return gradeMatches && quarterMatches && statusMatches;
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
  const progress = getLessonProgress(lesson);
  const hasLiveSlices = progress.liveCount > 0;
  const showSliceStructure = lesson.isCuratedSequence && lesson.sliceCount > 1;
  const lessonId = lessonKey(lesson);
  const isMyFreePack = lesson.microLessons.some((microLesson) => {
    return sliceKey(lesson, microLesson) === state.userFreeLesson;
  });
  const statusClass = isMyFreePack ? "b-free" : hasLiveSlices ? "b-live" : "b-soon";
  const statusLabel = isMyFreePack
    ? (showSliceStructure ? "Your Free Inside" : "Your Free")
    : showSliceStructure && hasLiveSlices
      ? `${progress.liveCount}/${progress.totalCount} Available`
      : hasLiveSlices
        ? "Available"
      : "Coming Soon";

  return `
    <div class="lcard ${hasLiveSlices ? "live" : "coming"} ${isMyFreePack ? "user-free-card" : ""}">
      <div class="card-top">
        <div class="card-top-left">
          <span class="badge b-grade">G${lesson.grade}</span>
          <span class="badge b-q">${lesson.q}</span>
        </div>
        <span class="badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="card-topic">${escapeHtml(lesson.topic)}</div>
      <div class="card-code">${escapeHtml(lesson.code)} &middot; ${escapeHtml(lesson.strand)}</div>
      ${showSliceStructure ? `
        <div class="card-meta-line">
          <span class="card-meta-pill">${lesson.sliceCount} subtopics</span>
          <span class="card-meta-pill">${lesson.durationMinutes} mins each</span>
          <span class="card-meta-pill">${progress.liveCount}/${progress.totalCount} live</span>
        </div>
      ` : ""}
      <div class="card-summary">
        ${renderLessonSummary(lesson, progress, isMyFreePack, showSliceStructure)}
      </div>
      ${showSliceStructure ? `
        <div class="card-footer">
          <button
            type="button"
            class="lesson-toggle"
            data-action="open-lesson-details"
            data-lesson-key="${escapeAttr(lessonId)}"
            aria-haspopup="dialog"
          >
            ${icon("sparkles", "icon icon-sm")}
            Preview Subtopics
          </button>
        </div>
      ` : `
        <div class="card-footer">
          ${renderSingleLessonFooter(lesson)}
        </div>
      `}
    </div>
  `;
}

function renderLessonSummary(lesson, progress, isMyFreePack, showSliceStructure) {
  if (!showSliceStructure) {
    if (progress.liveCount === 0) {
      return "One focused lesson pack for this topic.";
    }

    if (isMyFreePack) {
      return "Your claimed lesson is ready as one focused downloadable bundle.";
    }

    if (!state.userFreeLesson) {
      return "Available as one focused lesson with LP, PPT, and worksheet. Check the lesson section below to see the interactive game status.";
    }

    return "Buy this lesson on its own or unlock it through a grade pack or full bundle.";
  }

  if (progress.liveCount === 0) {
    return `Broken into ${lesson.sliceCount} teachable subtopics so the topic stays manageable in class.`;
  }

  if (isMyFreePack) {
    return `Your free lesson is inside this sequence. ${progress.liveCount} of ${progress.totalCount} subtopics are live.`;
  }

  if (!state.userFreeLesson) {
    return `${progress.liveCount} of ${progress.totalCount} subtopics are live. Preview the sequence to claim one free or buy a single lesson.`;
  }

  return `${progress.liveCount} of ${progress.totalCount} subtopics are live. Preview the sequence to buy a single lesson or see the full breakdown.`;
}

function renderLessonDetailsModal() {
  const modal = document.getElementById("lessonPreviewModal");
  const lesson = CURRICULUM.find((item) => lessonKey(item) === state.lessonPreviewKey);

  if (!modal) {
    return;
  }

  if (!lesson) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    return;
  }

  const progress = getLessonProgress(lesson);
  const isMyFreePack = lesson.microLessons.some((microLesson) => {
    return sliceKey(lesson, microLesson) === state.userFreeLesson;
  });
  const title = document.getElementById("lessonPreviewTitle");
  const meta = document.getElementById("lessonPreviewMeta");
  const summary = document.getElementById("lessonPreviewSummary");
  const list = document.getElementById("lessonPreviewList");

  if (title) {
    title.textContent = lesson.topic;
  }

  if (meta) {
    meta.innerHTML = `
      <span class="lesson-preview-chip">Grade ${lesson.grade}</span>
      <span class="lesson-preview-chip">${escapeHtml(lesson.q)}</span>
      <span class="lesson-preview-chip">${lesson.sliceCount} subtopics</span>
      <span class="lesson-preview-chip">${lesson.durationMinutes} mins each</span>
    `;
  }

  if (summary) {
    summary.textContent = renderLessonPreviewSummary(lesson, progress, isMyFreePack);
  }

  if (list) {
    list.innerHTML = lesson.microLessons.map((microLesson) => {
      return renderLessonPreviewRow(lesson, microLesson);
    }).join("");
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function renderLessonPreviewSummary(lesson, progress, isMyFreePack) {
  if (progress.liveCount === 0) {
    return `${lesson.packTitle} is structured as ${lesson.sliceCount} teachable subtopics so the topic stays manageable inside a class period.`;
  }

  if (isMyFreePack) {
    return `Your free lesson is inside this sequence. ${progress.liveCount} of ${progress.totalCount} subtopics are already live.`;
  }

  if (!state.userFreeLesson) {
    return `${progress.liveCount} of ${progress.totalCount} subtopics are already live. Claim one free, buy a single lesson, or unlock the full pack.`;
  }

  return `${progress.liveCount} of ${progress.totalCount} subtopics are already live in this sequence and can be bought individually or unlocked in the full pack.`;
}

function renderSingleLessonFooter(lesson) {
  const microLesson = lesson.microLessons[0];
  const key = sliceKey(lesson, microLesson);
  const status = getSliceStatus(key);
  const isMyFree = state.userFreeLesson === key;
  const hasClaimed = Boolean(state.userFreeLesson);

  return `
    <div class="single-lesson-stack">
      ${renderSliceSupplementalInfo(lesson, microLesson, key, status)}
      <div class="single-lesson-actions">
        ${renderSliceAction(lesson, microLesson, key, status, isMyFree, hasClaimed)}
      </div>
    </div>
  `;
}

function renderLessonPreviewRow(lesson, microLesson) {
  const key = sliceKey(lesson, microLesson);
  const status = getSliceStatus(key);
  const isMyFree = state.userFreeLesson === key;
  const hasClaimed = Boolean(state.userFreeLesson);
  const rowClass = isMyFree ? "my-free" : status === "live" ? "available" : "coming";

  return `
    <div class="lesson-preview-row ${rowClass}">
      <div class="lesson-preview-step">0${microLesson.sequenceNo}</div>
      <div class="lesson-preview-main">
        <div class="lesson-preview-row-head">
          <div class="lesson-preview-row-title">${escapeHtml(microLesson.title)}</div>
          <span class="lesson-preview-state">${isMyFree ? "Free" : status === "live" ? "Ready" : "Soon"}</span>
        </div>
        <div class="lesson-preview-row-goal">${escapeHtml(microLesson.goal)}</div>
        ${renderSliceSupplementalInfo(lesson, microLesson, key, status)}
      </div>
      <div class="lesson-preview-row-action">
        ${renderSliceAction(lesson, microLesson, key, status, isMyFree, hasClaimed)}
      </div>
    </div>
  `;
}

function renderSliceSupplementalInfo(lesson, microLesson, key, status) {
  return `
    <div class="lesson-supplemental">
      ${renderLessonMaterialsBlock(status)}
      ${renderGameStatusBlock(lesson, microLesson, key, status)}
    </div>
  `;
}

function renderLessonMaterialsBlock(status) {
  const note = status === "live"
    ? "LP, PPT, and worksheet are included with this lesson."
    : "LP, PPT, and worksheet will appear here once this lesson is published.";

  return `
    <div class="lesson-info-block">
      <div class="lesson-info-label">Lesson Materials</div>
      <div class="lesson-info-pills">
        ${LESSON_MATERIALS.map((item) => `<span class="lesson-info-pill">${item}</span>`).join("")}
      </div>
      <div class="lesson-info-note">${note}</div>
    </div>
  `;
}

function renderGameStatusBlock(lesson, microLesson, key, status) {
  const gameStatus = getGameStatus(key);

  if (gameStatus === "none") {
    return "";
  }

  if (gameStatus === "coming_soon") {
    return `
      <div class="lesson-game-block is-muted">
        <div class="lesson-game-badge muted">Interactive Game: Coming Soon</div>
        <div class="lesson-game-note">
          A web-based activity for this lesson is currently being developed.
        </div>
      </div>
    `;
  }

  const hasAccess = userHasLessonAccess(key);
  const accessCta = hasAccess && status === "live"
    ? renderGameAccessButton(key, `${lesson.topic} - ${microLesson.title}`)
    : status === "live"
      ? '<div class="lesson-game-note">Game access unlocks after claim or purchase.</div>'
      : '<div class="lesson-game-note">Game access appears once this lesson is published.</div>';

  return `
    <div class="lesson-game-block">
      <div class="lesson-game-badge">Interactive Game</div>
      <div class="lesson-game-note">Ready classroom requirements:</div>
      <ul class="lesson-game-requirements">
        <li>Student Devices</li>
        <li>Stable internet</li>
        <li>Class PIN</li>
        <li>QR Code / session link</li>
      </ul>
      ${accessCta}
    </div>
  `;
}

function renderSliceAction(lesson, microLesson, key, status, isMyFree, hasClaimed) {
  const downloadTopic = `${lesson.topic} - ${microLesson.title}`;
  const buyButton = renderBuyLessonButton(lesson, microLesson, key);
  const hasAccess = userHasLessonAccess(key);

  if (status !== "live") {
    return `
      <div class="card-note">
        ${icon("clock-3", "icon icon-sm")}
        Files coming soon
      </div>
    `;
  }

  if (hasAccess) {
    return `
      <button
        type="button"
        class="chip dl-bundle"
        data-action="download-bundle"
        data-key="${escapeAttr(key)}"
        data-topic="${escapeAttr(downloadTopic)}"
      >
        ${icon("download", "icon icon-sm")}
        Download
      </button>
    `;
  }

  if (!hasClaimed) {
    return `
      <div class="card-action-block">
        ${renderClaimFreeButton(lesson, microLesson, key)}
        ${buyButton}
        <div class="card-includes">Use your free claim here or buy this one lesson directly.</div>
      </div>
    `;
  }

  return `
    <div class="card-action-block">
      ${buyButton}
      <div class="card-includes">Or unlock more value with a grade pack or the full bundle.</div>
    </div>
  `;
}

function renderClaimFreeButton(lesson, microLesson, key) {
  return `
    <button
      type="button"
      class="chip claim-chip"
      data-action="claim-free"
      data-key="${escapeAttr(key)}"
      data-topic="${escapeAttr(microLesson.title)}"
      data-pack-topic="${escapeAttr(lesson.topic)}"
      data-code="${escapeAttr(lesson.code)}"
      data-strand="${escapeAttr(lesson.strand)}"
      data-grade="${lesson.grade}"
      data-quarter="${escapeAttr(lesson.q)}"
      data-game-status="${escapeAttr(getGameStatus(key))}"
    >
      ${icon("gift", "icon icon-sm")}
      Claim Free
    </button>
  `;
}

function renderGameAccessButton(key, topic) {
  return `
    <button
      type="button"
      class="chip game-access-chip"
      data-action="open-game-asset"
      data-key="${escapeAttr(key)}"
      data-topic="${escapeAttr(topic)}"
    >
      ${icon("play", "icon icon-sm")}
      Access Game
    </button>
  `;
}

function renderBuyLessonButton(lesson, microLesson, key) {
  return `
    <button
      type="button"
      class="chip buy-chip"
      data-action="buy-single-lesson"
      data-key="${escapeAttr(key)}"
      data-topic="${escapeAttr(microLesson.title)}"
      data-pack-topic="${escapeAttr(lesson.topic)}"
      data-code="${escapeAttr(lesson.code)}"
      data-strand="${escapeAttr(lesson.strand)}"
      data-grade="${lesson.grade}"
      data-quarter="${escapeAttr(lesson.q)}"
    >
      ${icon("shopping-bag", "icon icon-sm")}
      Buy Lesson - PHP 99
    </button>
  `;
}
function findSliceByKey(targetKey) {
  for (const lesson of CURRICULUM) {
    for (const microLesson of lesson.microLessons) {
      if (sliceKey(lesson, microLesson) === targetKey) {
        return { lesson, slice: microLesson, key: targetKey };
      }
    }
  }

  return null;
}

function getClaimedBannerCopy(claimed) {
  if (!claimed) {
    return "Download your LP, PPT, and worksheet bundle anytime from the matching slice below.";
  }

  if (getGameStatus(claimed.key) === "available") {
    return `Inside ${escapeHtml(claimed.lesson.topic)}. Download your LP, PPT, and worksheet bundle anytime, and use the matching lesson entry below to access the interactive game.`;
  }

  if (getGameStatus(claimed.key) === "coming_soon") {
    return `Inside ${escapeHtml(claimed.lesson.topic)}. Download your LP, PPT, and worksheet bundle anytime from the matching slice below. The interactive game is still in development.`;
  }

  return `Inside ${escapeHtml(claimed.lesson.topic)}. Download your LP, PPT, and worksheet bundle anytime from the matching slice below.`;
}
