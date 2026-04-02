import { showToast } from "../../shared/scripts/helpers.js";
import { state } from "../../shared/scripts/store.js";
import { renderPublic } from "../public.js";

export function openClaimModal(button) {
  if (state.userFreeLesson) {
    return;
  }

  const { key, topic, code, strand, grade, quarter } = button.dataset;

  if (!key) {
    return;
  }

  state.pendingClaim = {
    key,
    topic: topic || "",
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
      `${state.pendingClaim.quarter} - ${state.pendingClaim.strand}`;
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
