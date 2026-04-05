import { renderAdmin, showPublic, syncAdminChrome } from "../../admin/admin.js";
import { renderPublic } from "../../client/public.js";
import { createAppShell } from "../templates/appShell.js";
import { bindActions } from "./actionRegistry.js";
import { syncThemeButton } from "./helpers.js";
import { initializeSupabaseState } from "./supabase.js";

const app = typeof document !== "undefined"
  ? document.getElementById("app")
  : null;

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

if (app) {
  app.innerHTML = createAppShell();
  initializeHeroTypewriter();
  bindActions();
  syncThemeButton();
  showPublic();
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  });
  void initializeApp();
}

async function initializeApp() {
  try {
    await initializeSupabaseState();
  } catch (error) {
    console.error(error);
  }

  syncAdminChrome();
  renderPublic();

  if (document.getElementById("adminView")?.classList.contains("active")) {
    renderAdmin();
  }
}

function initializeHeroTypewriter() {
  if (typeof window === "undefined") {
    return;
  }

  const typeLine = document.querySelector(".hero-type-line");
  const emphasis = typeLine?.querySelector(".hero-emphasis");

  if (!(typeLine instanceof HTMLElement) || !(emphasis instanceof HTMLElement)) {
    return;
  }

  const words = (typeLine.dataset.typewriterWords || "")
    .split("|")
    .map((word) => word.trim())
    .filter(Boolean);

  if (!words.length) {
    return;
  }

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const longestWord = words.reduce((longest, word) => {
    return Math.max(longest, word.length);
  }, 0);

  typeLine.style.setProperty("--typewriter-width", `${longestWord + 1}ch`);

  let timerId = 0;
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const clearTimer = () => {
    if (timerId) {
      window.clearTimeout(timerId);
      timerId = 0;
    }
  };

  const renderStaticWord = () => {
    clearTimer();
    typeLine.classList.remove("is-animated");
    emphasis.textContent = words[0];
  };

  const scheduleTick = (delay) => {
    clearTimer();
    timerId = window.setTimeout(step, delay);
  };

  const step = () => {
    if (reduceMotionQuery.matches) {
      renderStaticWord();
      return;
    }

    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);
      emphasis.textContent = currentWord.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        scheduleTick(220);
        return;
      }

      scheduleTick(55);
      return;
    }

    const nextWord = words[wordIndex];
    charIndex = Math.min(nextWord.length, charIndex + 1);
    emphasis.textContent = nextWord.slice(0, charIndex);

    if (charIndex === nextWord.length) {
      isDeleting = true;
      scheduleTick(1450);
      return;
    }

    scheduleTick(95);
  };

  const startAnimation = () => {
    if (reduceMotionQuery.matches || words.length === 1) {
      renderStaticWord();
      return;
    }

    clearTimer();
    typeLine.classList.add("is-animated");
    emphasis.textContent = "";
    wordIndex = 0;
    charIndex = 0;
    isDeleting = false;
    scheduleTick(380);
  };

  startAnimation();

  const handleMotionChange = () => {
    startAnimation();
  };

  if (typeof reduceMotionQuery.addEventListener === "function") {
    reduceMotionQuery.addEventListener("change", handleMotionChange);
    return;
  }

  if (typeof reduceMotionQuery.addListener === "function") {
    reduceMotionQuery.addListener(handleMotionChange);
  }
}
