import {
  handleAdminSearchInput,
  handleDeleteUpload,
  handleGameStatusChange,
  handleUploadChange,
  refreshLessonAssets,
  showAdmin,
  showLessons,
  showPricing,
  showPublic,
  signOutAdminSession,
  submitLogin,
} from "../../admin/admin.js";
import { handleDownloadBundle } from "../../client/actions/download.js";
import { handleOpenGame } from "../../client/actions/game.js";
import { closeClaimModal, confirmClaim, openClaimModal } from "../../client/actions/claim.js";
import { handleBundleButton } from "../../client/buttons/getBundle.js";
import { handleFreePlanButton } from "../../client/buttons/getStartedFree.js";
import { handleGradePackButton } from "../../client/buttons/getGradePack.js";
import {
  handleSingleLessonButton,
  handleSingleLessonPlanButton,
} from "../../client/buttons/getSingleLesson.js";
import { handleOpenGumroad } from "../../client/buttons/openGumroad.js";
import { handleContactSupport } from "../../client/buttons/contactSupport.js";
import { browseLessons, closeLessonDetails, handleSetFilter, openLessonDetails } from "../../client/public.js";
import { toggleTheme } from "./helpers.js";

const clickHandlers = {
  "toggle-theme": () => toggleTheme(),
  "show-admin": () => showAdmin(),
  "show-home": () => showPublic(),
  "show-lessons": () => showLessons(),
  "show-pricing": () => showPricing(),
  "submit-login": () => submitLogin(),
  "sign-out-admin": () => signOutAdminSession(),
  "refresh-assets": () => refreshLessonAssets(),
  "close-claim-modal": () => closeClaimModal(),
  "close-lesson-details": () => closeLessonDetails(),
  "confirm-claim": (button) => confirmClaim(button),
  "set-filter": (button) => handleSetFilter(button),
  "open-lesson-details": (button) => openLessonDetails(button),
  "browse-lessons": () => browseLessons(),
  "claim-free": (button) => openClaimModal(button),
  "download-bundle": (button) => handleDownloadBundle(button),
  "open-game-asset": (button) => handleOpenGame(button),
  "cta-free-plan": () => handleFreePlanButton(),
  "cta-single-lesson": () => handleSingleLessonPlanButton(),
  "cta-grade-pack": () => handleGradePackButton(),
  "cta-all-grades": () => handleBundleButton(),
  "buy-single-lesson": (button) => handleSingleLessonButton(button),
  "open-gumroad": () => handleOpenGumroad(),
  "contact-support": () => handleContactSupport(),
  "delete-upload": (button) => handleDeleteUpload(button),
};

export function bindActions() {
  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const actionElement = target.closest("[data-action]");

    if (!actionElement) {
      return;
    }

    const handler = clickHandlers[actionElement.dataset.action];

    if (!handler) {
      return;
    }

    event.preventDefault();
    handler(actionElement);
  });

  document.addEventListener("change", (event) => {
    const target = event.target;

    if (target instanceof HTMLSelectElement && target.dataset.action === "change-game-status") {
      void handleGameStatusChange(target);
      return;
    }

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (target.dataset.action !== "upload-file") {
      return;
    }

    void handleUploadChange(target);
  });

  document.addEventListener("input", (event) => {
    const target = event.target;

    if (target instanceof HTMLInputElement && target.id === "adminSearchInput") {
      handleAdminSearchInput(target);
    }
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;

    if (
      event.key === "Enter" &&
      target instanceof HTMLInputElement &&
      (target.id === "adminPasswordInput" || target.id === "adminEmailInput")
    ) {
      event.preventDefault();
      void submitLogin();
      return;
    }

    if (event.key === "Escape") {
      closeClaimModal();
      closeLessonDetails();
    }
  });

  const modal = document.getElementById("claimModal");

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeClaimModal();
      }
    });
  }

  const lessonPreviewModal = document.getElementById("lessonPreviewModal");

  if (lessonPreviewModal) {
    lessonPreviewModal.addEventListener("click", (event) => {
      if (event.target === lessonPreviewModal) {
        closeLessonDetails();
      }
    });
  }
}
