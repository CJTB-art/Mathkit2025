import {
  openConfiguredLink,
  showToast,
} from "../../shared/scripts/helpers.js";
import { state } from "../../shared/scripts/store.js";
import { browseLessons } from "../public.js";

const ALL_GRADES_BUNDLE_URL = "";

export function handleBundleButton() {
  if (openConfiguredLink(ALL_GRADES_BUNDLE_URL)) {
    return;
  }

  state.filters.grade = "all";
  state.filters.status = "live";

  browseLessons();
  showToast("Bundle checkout is not connected yet. Available lessons are listed below.");
}
