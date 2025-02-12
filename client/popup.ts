declare const chrome: any;

interface ExtensionStorage {
  blockedCount: number;
  enabled: boolean;
  customContent?: string;
  theme?: "light" | "dark";
}

// Type-safe storage helper
const storage = {
  get: async <K extends keyof ExtensionStorage>(
    keys: K[]
  ): Promise<Pick<ExtensionStorage, K>> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (result) => {
        resolve(result as Pick<ExtensionStorage, K>);
      });
    });
  },
  set: async (items: Partial<ExtensionStorage>): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, () => resolve());
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const optionsButton = document.getElementById(
    "open-options"
  ) as HTMLButtonElement | null;

  if (optionsButton) {
    optionsButton.addEventListener("click", () => {
      chrome.tabs.create({ url: chrome.runtime.getURL("options.html") })
    });
  }
});

// DOM Elements with type assertions
const elements = {
  globalToggle: document.getElementById("global-toggle") as HTMLInputElement,
  blockedCount: document.getElementById("popup-blocked-count") as HTMLElement,
  miniPreview: document.getElementById("mini-preview") as HTMLElement,
  connectionStatus: document.getElementById("connection-status") as HTMLElement,
  whitelistSite: document.getElementById("whitelist-site") as HTMLButtonElement,
  openOptions: document.getElementById("open-options") as HTMLButtonElement,
  pauseExtension: document.getElementById(
    "pause-extension"
  ) as HTMLButtonElement,

};

// Initialize with type safety
async function initPopup(): Promise<void> {
  // Load theme
  const { theme } = await storage.get(["theme"]);
  document.documentElement.setAttribute("data-theme", theme || "light");

  // Load stats
  const { blockedCount = 0 } = await storage.get(["blockedCount"]);
  elements.blockedCount.textContent = blockedCount.toString();

  // Load extension state
  const { enabled = true } = await storage.get(["enabled"]);
  elements.globalToggle.checked = enabled;

  // Load preview content
  const { customContent } = await storage.get(["customContent"]);
  updateMiniPreview(customContent);

  // Check connection status
  checkConnectionStatus();
}

// Strictly typed preview updater
function updateMiniPreview(content?: string): void {
  elements.miniPreview.innerHTML =
    content ||
    `
    <div class="default-preview" style="color: var(--text);">
      Default replacement content
    </div>
  `;
}

// Connection checker with proper typing
async function checkConnectionStatus(): Promise<void> {
  try {
    const response = await fetch("https://api.example.org/status");
    elements.connectionStatus.dataset.status = response.ok
      ? "active"
      : "inactive";
  } catch (error) {
    elements.connectionStatus.dataset.status = "inactive";
  }
}

// Event listeners with proper typing
elements.globalToggle.addEventListener("change", async (e: Event) => {
  const target = e.target as HTMLInputElement;
  await storage.set({ enabled: target.checked });
});

elements.whitelistSite.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (domain: string) => {
        localStorage.setItem("whitelistedDomain", domain);
      },
      args: [new URL(tab.url!).hostname],
    });
  }
});

elements.openOptions.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initPopup);