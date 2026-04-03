export const ADMIN_PW = "mathkit2025";

export const state = {
  uploads: {},
  userFreeLesson: null,
  pendingClaim: null,
  lessonPreviewKey: null,
  filters: {
    grade: "all",
    status: "all",
  },
  isAdmin: false,
};

export function lessonKey(lesson) {
  return `${lesson.code}_${lesson.grade}_${lesson.q}`;
}

export function sliceKey(lesson, microLesson) {
  return `${lessonKey(lesson)}_${microLesson.sliceId}`;
}

export function getUploads(key) {
  return state.uploads[key] || {};
}

export function getSliceStatus(key) {
  const uploadState = getUploads(key);
  const count = ["ppt", "lp", "activity", "worksheet"].filter((type) =>
    Boolean(uploadState[type]),
  ).length;

  if (count === 4) {
    return "live";
  }

  if (count > 0) {
    return "partial";
  }

  return "empty";
}

export function getLessonProgress(lesson) {
  const slices = lesson.microLessons || [];
  let liveCount = 0;
  let partialCount = 0;

  slices.forEach((microLesson) => {
    const status = getSliceStatus(sliceKey(lesson, microLesson));

    if (status === "live") {
      liveCount += 1;
      return;
    }

    if (status === "partial") {
      partialCount += 1;
    }
  });

  return {
    totalCount: slices.length,
    liveCount,
    partialCount,
    emptyCount: slices.length - liveCount - partialCount,
  };
}

export function getLessonStatus(lesson) {
  const progress = getLessonProgress(lesson);

  if (progress.totalCount > 0 && progress.liveCount === progress.totalCount) {
    return "live";
  }

  if (progress.liveCount > 0 || progress.partialCount > 0) {
    return "partial";
  }

  return "empty";
}

export function getTotalSliceCount(lessons) {
  return lessons.reduce((count, lesson) => count + lesson.microLessons.length, 0);
}
