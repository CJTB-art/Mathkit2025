import { showToast } from "../../shared/scripts/helpers.js";
import {
  fetchLessonAssetUrl,
  getErrorMessage,
} from "../../shared/scripts/supabase.js";

export async function handleOpenGame(button) {
  const key = button.dataset.key;
  const topic = button.dataset.topic || "this lesson";

  if (!key) {
    return;
  }

  showToast("Opening interactive game...");

  try {
    const asset = await fetchLessonAssetUrl(key, "activity");
    const openedWindow = window.open(asset.url, "_blank", "noopener,noreferrer");

    if (!openedWindow) {
      window.location.href = asset.url;
    }

    showToast(`Interactive game ready for ${topic}.`, "success");
  } catch (error) {
    console.error(error);
    showToast(
      getErrorMessage(error, "Unable to open the interactive game right now."),
      "error",
    );
  }
}
