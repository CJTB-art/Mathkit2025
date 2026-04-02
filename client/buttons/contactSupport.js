import { openMailto, showToast } from "../../shared/scripts/helpers.js";

const CONTACT_EMAIL = "";

export function handleContactSupport() {
  if (openMailto(CONTACT_EMAIL)) {
    return;
  }

  showToast("Contact email is not configured yet.");
}
