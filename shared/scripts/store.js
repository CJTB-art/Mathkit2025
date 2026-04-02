export const ADMIN_PW = "mathkit2025";

export const state = {
  uploads: {},
  userFreeLesson: null,
  pendingClaim: null,
  filters: {
    grade: "all",
    status: "all",
  },
  isAdmin: false,
};

export function lessonKey(lesson) {
  return `${lesson.code}_${lesson.grade}_${lesson.q}`;
}

export function getUploads(key) {
  return state.uploads[key] || {};
}

export function getStatus(key) {
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
