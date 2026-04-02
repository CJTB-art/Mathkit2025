import {
  sanitizeFileName,
  showToast,
} from "../../shared/scripts/helpers.js";
import { getUploads } from "../../shared/scripts/store.js";

export async function handleDownloadBundle(button) {
  const key = button.dataset.key;
  const topic = button.dataset.topic || "lesson";

  if (!key) {
    return;
  }

  const uploadState = getUploads(key);
  const files = [uploadState.ppt, uploadState.lp, uploadState.activity].filter(
    Boolean,
  );

  if (!files.length) {
    showToast("No files uploaded yet.", "error");
    return;
  }

  if (!window.JSZip) {
    showToast("Bundle download is still loading. Try again.", "error");
    return;
  }

  showToast("Packing your bundle...");

  try {
    const zip = new window.JSZip();
    const folderName = sanitizeFileName(topic);
    const folder = zip.folder(folderName) || zip;

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      folder.file(file.name, buffer);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${folderName}.zip`;
    link.click();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);

    showToast("Bundle downloaded.", "success");
  } catch (error) {
    console.error(error);
    showToast("Download failed. Try again.", "error");
  }
}
