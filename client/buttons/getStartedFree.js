import {
  focusFirstClaimButton,
  showToast,
} from "../../shared/scripts/helpers.js";
import { state } from "../../shared/scripts/store.js";
import { browseLessons } from "../public.js";

export function handleFreePlanButton() {
  browseLessons();

  if (state.userFreeLesson) {
    showToast("Your free lesson is already claimed. Download it from the lesson card.");
    return;
  }

  if (!focusFirstClaimButton()) {
    showToast("No live lessons are available to claim yet.");
    return;
  }

  showToast("Pick any available lesson and use Claim Free.");
}
