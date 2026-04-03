import {
  openConfiguredLink,
  showToast,
} from "../../shared/scripts/helpers.js";
import { state } from "../../shared/scripts/store.js";
import { browseLessons } from "../public.js";

const GRADE_PACK_URL = "";

export function handleGradePackButton() {
  if (openConfiguredLink(GRADE_PACK_URL)) {
    return;
  }

  state.filters.grade = "all";
  state.filters.quarter = "all";
  state.filters.status = "live";

  browseLessons();
  showToast("Grade pack checkout is not connected yet. Browse the available lessons below.");
}
