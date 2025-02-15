chrome.runtime.onInstalled.addListener(() => {
    // Set default state
    chrome.storage.local.set({ enabled: true });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleExtension") {
        chrome.storage.local.get("enabled", (data) => {
            let newState = !data.enabled;
            chrome.storage.local.set({ enabled: newState }, () => {
                sendResponse({ status: "ok", enabled: newState });
            });
        });

        return true; // Required for async `sendResponse`
    }
});
