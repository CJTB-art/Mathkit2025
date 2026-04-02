import { showPublic } from "../../admin/admin.js";
import { createAppShell } from "../templates/appShell.js";
import { bindActions } from "./actionRegistry.js";
import { startTypewriter, syncThemeButton } from "./helpers.js";

const app = typeof document !== "undefined"
  ? document.getElementById("app")
  : null;

if (app) {
  app.innerHTML = createAppShell();
  bindActions();
  syncThemeButton();
  showPublic();
  startTypewriter();
}
