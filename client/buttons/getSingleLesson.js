import {
  openConfiguredLink,
  showToast,
} from "../../shared/scripts/helpers.js";
import { state } from "../../shared/scripts/store.js";
import { browseLessons } from "../public.js";

const SINGLE_LESSON_URL = "";
const SINGLE_LESSON_PRICE_LABEL = "PHP 99";

function buildSingleLessonUrl(details = {}) {
  if (!SINGLE_LESSON_URL) {
    return "";
  }

  try {
    const url = new URL(SINGLE_LESSON_URL, window.location.href);
    const mappings = {
      lesson: details.topic,
      pack: details.packTopic,
      code: details.code,
      grade: details.grade,
      quarter: details.quarter,
      strand: details.strand,
      slice: details.key,
    };

    Object.entries(mappings).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, String(value));
      }
    });

    return url.toString();
  } catch (error) {
    console.warn("Unable to prepare the single lesson checkout URL.", error);
    return SINGLE_LESSON_URL;
  }
}

export function handleSingleLessonPlanButton() {
  if (openConfiguredLink(buildSingleLessonUrl())) {
    return;
  }

  state.filters.grade = "all";
  state.filters.quarter = "all";
  state.filters.status = "live";

  browseLessons();
  showToast(`Choose any available lesson and use Buy Lesson - ${SINGLE_LESSON_PRICE_LABEL}.`);
}

export function handleSingleLessonButton(button) {
  const details = {
    key: button.dataset.key || "",
    topic: button.dataset.topic || "",
    packTopic: button.dataset.packTopic || "",
    code: button.dataset.code || "",
    strand: button.dataset.strand || "",
    grade: button.dataset.grade || "",
    quarter: button.dataset.quarter || "",
  };

  if (openConfiguredLink(buildSingleLessonUrl(details))) {
    return;
  }

  showToast(
    details.topic
      ? `Single lesson checkout is not connected yet for ${details.topic}.`
      : "Single lesson checkout is not connected yet.",
  );
}
