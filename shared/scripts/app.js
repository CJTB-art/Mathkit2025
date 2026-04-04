import { renderAdmin, showPublic, syncAdminChrome } from "../../admin/admin.js";
import { renderPublic } from "../../client/public.js";
import { createAppShell } from "../templates/appShell.js";
import { bindActions } from "./actionRegistry.js";
import { startTypewriter, syncThemeButton } from "./helpers.js";
import { initializeSupabaseState } from "./supabase.js";

const app = typeof document !== "undefined"
  ? document.getElementById("app")
  : null;

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

if (app) {
  app.innerHTML = createAppShell();
  bindActions();
  syncThemeButton();
  showPublic();
  startTypewriter();
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
