export const FILE_TYPES = ["ppt", "lp", "activity", "worksheet"];
export const CORE_FILE_TYPES = ["ppt", "lp", "worksheet"];
export const GAME_STATUS_OPTIONS = ["none", "coming_soon", "available"];

export const state = {
  uploads: {},
  gameStatuses: {},
  sliceStatuses: {},
  lessonAccess: {},
  userFreeLesson: null,
  pendingClaim: null,
  lessonPreviewKey: null,
  filters: {
    grade: "all",
    quarter: "all",
    status: "all",
  },
  isAdmin: false,
  authReady: false,
  authUser: null,
  uploadIndexLoaded: false,
  availabilityLoaded: false,
  accessLoaded: false,
  syncStatus: "idle",
  syncError: "",
  configError: "",
};

export function setUserFreeLesson(key) {
  state.userFreeLesson = key || null;
}

export function setUploads(nextUploads = {}) {
  state.uploads = nextUploads;
}

export function setGameStatuses(nextStatuses = {}) {
  state.gameStatuses = nextStatuses;
}

export function setAuthUser(user) {
  state.authUser = user || null;
}

export function setIsAdmin(isAdmin) {
  state.isAdmin = Boolean(isAdmin);
}

export function setAuthReady(isReady) {
  state.authReady = isReady;
}

export function markUploadsLoaded(isLoaded) {
  state.uploadIndexLoaded = Boolean(isLoaded);
}

export function markAvailabilityLoaded(isLoaded) {
  state.availabilityLoaded = Boolean(isLoaded);
}

export function markAccessLoaded(isLoaded) {
  state.accessLoaded = Boolean(isLoaded);
}

export function setSyncState(status, errorMessage = "") {
  state.syncStatus = status;
  state.syncError = errorMessage;
}

export function setSupabaseConfigError(message = "") {
  state.configError = message;
}

export function setSliceStatuses(nextStatuses = {}) {
  state.sliceStatuses = nextStatuses;
}

export function setLessonAccess(nextAccess = {}) {
  state.lessonAccess = nextAccess;
  const freeClaim = Object.entries(nextAccess).find(([, value]) => {
    return value?.source === "free_claim";
  });

  state.userFreeLesson = freeClaim?.[0] || null;
}

export function lessonKey(lesson) {
  return `${lesson.code}_${lesson.grade}_${lesson.q}`;
}

export function sliceKey(lesson, microLesson) {
  return `${lessonKey(lesson)}_${microLesson.sliceId}`;
}

export function getUploads(key) {
  return state.uploads[key] || {};
}

export function getGameStatus(key) {
  const value = state.gameStatuses[key];
  return GAME_STATUS_OPTIONS.includes(value) ? value : "none";
}

export function hasAsset(asset) {
  return Boolean(asset && typeof asset === "object" && asset.path && asset.name);
}

export function deriveSliceStatusFromUploads(uploadState = {}, gameStatus = "none") {
  const normalizedGameStatus = GAME_STATUS_OPTIONS.includes(gameStatus)
    ? gameStatus
    : "none";
  const coreCount = CORE_FILE_TYPES.filter((type) =>
    hasAsset(uploadState[type]),
  ).length;
  const needsActivity = normalizedGameStatus === "available";
  const hasActivity = hasAsset(uploadState.activity);

  if (coreCount === CORE_FILE_TYPES.length && (!needsActivity || hasActivity)) {
    return "live";
  }

  if (coreCount > 0 || hasActivity) {
    return "partial";
  }

  return "empty";
}

export function getSliceStatus(key) {
  if (state.sliceStatuses[key]) {
    return state.sliceStatuses[key];
  }

  return deriveSliceStatusFromUploads(getUploads(key), getGameStatus(key));
}

export function userHasLessonAccess(key) {
  return Boolean(state.isAdmin || state.lessonAccess[key]);
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
