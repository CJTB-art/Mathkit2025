let toastTimer = 0;

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
