import { showToast } from "../../shared/scripts/helpers.js";
import {
  claimFreeLesson,
  getErrorMessage,
} from "../../shared/scripts/supabase.js";
import { state } from "../../shared/scripts/store.js";
import { renderPublic } from "../public.js";

export function openClaimModal(button) {
  if (state.userFreeLesson) {
    return;
  }

  const { key, topic, packTopic, code, strand, grade, quarter, gameStatus } = button.dataset;

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
    gameStatus: gameStatus || "",
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

export async function confirmClaim() {
  if (!state.pendingClaim?.key) {
    return;
  }

  const confirmButton = document.querySelector('[data-action="confirm-claim"]');

  if (confirmButton instanceof HTMLButtonElement) {
    confirmButton.disabled = true;
  }

  try {
    await claimFreeLesson(state.pendingClaim.key);
    closeClaimModal();
    showToast(
      getClaimSuccessMessage(state.pendingClaim.gameStatus),
      "success",
    );
    renderPublic();
  } catch (error) {
    console.error(error);
    showToast(
      getErrorMessage(error, "Unable to claim this lesson right now."),
      "error",
    );
  } finally {
    if (confirmButton instanceof HTMLButtonElement) {
      confirmButton.disabled = false;
    }
  }
}

export function closeClaimModal() {
  state.pendingClaim = null;

  const modal = document.getElementById("claimModal");

  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
}

function getClaimSuccessMessage(gameStatus) {
  if (gameStatus === "available") {
    return "Lesson claimed. Your LP, PPT, worksheet, and interactive game access are ready below.";
  }

  if (gameStatus === "coming_soon") {
    return "Lesson claimed. Your LP, PPT, and worksheet are ready below. The interactive game is still in development.";
  }

  return "Lesson claimed. Your LP, PPT, and worksheet are ready below.";
}
