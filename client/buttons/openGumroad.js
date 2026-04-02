import {
  openConfiguredLink,
  showToast,
} from "../../shared/scripts/helpers.js";

const GUMROAD_URL = "";

export function handleOpenGumroad() {
  if (openConfiguredLink(GUMROAD_URL)) {
    return;
  }

  showToast("Gumroad link is not connected yet.");
}
