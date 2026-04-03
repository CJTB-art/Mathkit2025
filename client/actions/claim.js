import { showToast } from "../../shared/scripts/helpers.js";
import { state } from "../../shared/scripts/store.js";
import { renderPublic } from "../public.js";

export function openClaimModal(button) {
  if (state.userFreeLesson) {
    return;
  }

  const { key, topic, packTopic, code, strand, grade, quarter } = button.dataset;

  if (!key) {
    return;
  }

  state.lessonPreviewKey = null;
  const lessonPreviewModal = document.getElementById("lessonPreviewModal");
  if (lessonPreviewModal) {
    lessonPreviewModal.classList.remove("open");
    lessonPreviewModal.setAttribute("aria-hidden", "true");
  }

  state.pendingClaim = {
    key,
    topic: topic || "",
    packTopic: packTopic || "",
    code: code || "",
    strand: strand || "",
    grade: grade || "",
    quarter: quarter || "",
  };

  const previewTopic = document.getElementById("claimPreviewTopic");
  const previewMeta = document.getElementById("claimPreviewMeta");
  const modal = document.getElementById("claimModal");

  if (previewTopic) {
    previewTopic.textContent = state.pendingClaim.topic;
  }

  if (previewMeta) {
    previewMeta.textContent =
      `${state.pendingClaim.code} - Grade ${state.pendingClaim.grade} ` +
      `${state.pendingClaim.quarter} - ${state.pendingClaim.strand}` +
      (state.pendingClaim.packTopic
        ? ` - ${state.pendingClaim.packTopic}`
        : "");
  }

  if (modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
}

export function confirmClaim() {
  if (!state.pendingClaim?.key) {
    return;
  }

  state.userFreeLesson = state.pendingClaim.key;
  closeClaimModal();
  showToast(
    "Lesson claimed. Your LP, PPT, worksheet, and web-based game activity bundle is ready below.",
    "success",
  );
  renderPublic();
}

export function closeClaimModal() {
  state.pendingClaim = null;

  const modal = document.getElementById("claimModal");

  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
}
