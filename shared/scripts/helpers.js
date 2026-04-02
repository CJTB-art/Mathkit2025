const TYPEWRITER_WORDS = [
  "engage",
  "excite",
  "challenge",
  "motivate",
  "captivate",
  "inspire",
  "empower",
];

let toastTimer = 0;
let typewriterTimer = 0;
let typewriterIndex = 0;
let typewriterCharacter = 0;
let typewriterDeleting = false;
let typewriterStarted = false;

const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    return HTML_ESCAPES[character];
  });
}

export function escapeAttr(value = "") {
  return escapeHtml(value);
}

export function icon(name, classNames = "icon") {
  return `<i data-lucide="${escapeAttr(name)}" class="${escapeAttr(classNames)}" aria-hidden="true"></i>`;
}

export function sanitizeFileName(value = "lesson") {
  return String(value).replace(/[^a-zA-Z0-9 ]/g, "").trim() || "lesson";
}

export function showToast(message, type = "") {
  const toast = document.getElementById("toast");

  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.className = `toast show ${type}`.trim();

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.className = "toast";
  }, 2800);
}

export function focusFirstClaimButton() {
  const button = document.querySelector('[data-action="claim-free"]');

  if (button instanceof HTMLButtonElement) {
    button.focus();
    return button;
  }

  return null;
}

export function syncThemeButton() {
  const button = document.getElementById("themeBtn");

  if (!button) {
    return;
  }

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  button.innerHTML = `
    ${icon(isDark ? "sun" : "moon", "icon icon-sm")}
    <span>${isDark ? "Light" : "Dark"}</span>
  `;
  button.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme",
  );
  refreshIcons();
}

export function toggleTheme() {
  const root = document.documentElement;
  const nextTheme =
    root.getAttribute("data-theme") === "dark" ? "light" : "dark";

  root.setAttribute("data-theme", nextTheme);
  syncThemeButton();
}

export function startTypewriter() {
  if (typewriterStarted) {
    return;
  }

  typewriterStarted = true;

  const element = document.getElementById("typewriter-word");

  if (!element) {
    return;
  }

  const tick = () => {
    const word = TYPEWRITER_WORDS[typewriterIndex];

    if (!typewriterDeleting) {
      element.textContent = word.slice(0, typewriterCharacter + 1);
      typewriterCharacter += 1;

      if (typewriterCharacter === word.length) {
        typewriterTimer = window.setTimeout(() => {
          typewriterDeleting = true;
          tick();
        }, 1800);
        return;
      }
    } else {
      element.textContent = word.slice(0, typewriterCharacter - 1);
      typewriterCharacter -= 1;

      if (typewriterCharacter === 0) {
        typewriterDeleting = false;
        typewriterIndex = (typewriterIndex + 1) % TYPEWRITER_WORDS.length;
      }
    }

    typewriterTimer = window.setTimeout(
      tick,
      typewriterDeleting ? 60 : 90,
    );
  };

  typewriterTimer = window.setTimeout(tick, 400);
}

export function refreshIcons() {
  if (!window.lucide?.createIcons) {
    return;
  }

  window.lucide.createIcons({
    attrs: {
      "stroke-width": 1.8,
    },
  });
}

export function openConfiguredLink(url) {
  if (!url) {
    return false;
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

export function openMailto(email, subject = "MathKit PH Inquiry") {
  if (!email) {
    return false;
  }

  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  return true;
}
