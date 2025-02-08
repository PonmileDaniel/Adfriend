// Theme Sync
document.documentElement.setAttribute(
  "data-theme",
  localStorage.getItem("theme") || "light"
);

// Real-time Stats
chrome.storage.local.get("blockedCount", ({ blockedCount }) => {
  document.getElementById("popup-blocked-count").textContent =
    blockedCount || 0;
});

// Interactive Elements
document.getElementById("global-toggle").addEventListener("change", (e) => {
  chrome.storage.local.set({ enabled: e.target.checked });
});

// Live Preview
function updateMiniPreview() {
  const preview = document.getElementById("mini-preview");
  chrome.storage.local.get("customContent", ({ customContent }) => {
    preview.innerHTML =
      customContent ||
      '<div class="default-preview">No custom content set</div>';
  });
}

// Status Indicator
chrome.runtime.sendMessage({ type: "getStatus" }, (response) => {
  const indicator = document.getElementById("connection-status");
  indicator.setAttribute(
    "data-status",
    response.active ? "active" : "inactive"
  );
});
