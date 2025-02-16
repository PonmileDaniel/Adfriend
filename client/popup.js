// This opens the settings page in a new tab
document.getElementById('open-options').addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
  
    // Toggle switch and status indicator
    const toggleSwitch = document.getElementById("global-toggle");
    const statusIndicator = document.getElementById("connection-status");
  
    // Load the extension's enabled state from chrome.storage.local
    chrome.storage.local.get(["enabled"], function (result) {
      const isEnabled = result.enabled !== undefined ? result.enabled : true; // Default to ON if not set
      toggleSwitch.checked = isEnabled;
      updateStatusIndicator(isEnabled);
    });
  
    // Listen for changes to the toggle switch
    toggleSwitch.addEventListener("change", function () {
      const isEnabled = toggleSwitch.checked;
      chrome.storage.local.set({ enabled: isEnabled }, function () {
        updateStatusIndicator(isEnabled);
        // Send a message to the background script to enable/disable the ad blocker
        chrome.runtime.sendMessage({ action: "toggleEnabled", enabled: isEnabled });
      });
    });
  
    // Function to update the status indicator
    function updateStatusIndicator(isEnabled) {
      statusIndicator.style.backgroundColor = isEnabled ? "green" : "red";
    }
  
    // Load dark mode state from chrome.storage.local
    chrome.storage.local.get(["darkMode"], function (result) {
      if (result.darkMode === "enabled") {
        body.setAttribute("data-theme", "dark");
      } else {
        body.removeAttribute("data-theme");
      }
    });
  
    // Listen for changes to dark mode
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      if (changes.darkMode) {
        if (changes.darkMode.newValue === "enabled") {
          body.setAttribute("data-theme", "dark");
        } else {
          body.removeAttribute("data-theme");
        }
      }
    });
  });
  
  // Current Replacement: Update the Preview
  document.addEventListener('DOMContentLoaded', function () {
    const miniPreview = document.getElementById('mini-preview');
  
    // Function to update the Preview
    function updatePreview(adReplacementType, customHtml) {
      if (adReplacementType === 'simple') {
        miniPreview.innerHTML = `<p>${customHtml || 'Ads blocked by AdFriend!'}</p>`;
      } else if (adReplacementType === 'quote') {
        miniPreview.innerHTML = '<p>"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill</p>';
      } else if (adReplacementType === 'dsa') {
        miniPreview.innerHTML = "<p>DSA Challenge: Implement a binary search algorithm!</p>";
      } else if (adReplacementType === 'joke') {
        miniPreview.innerHTML = '<p>Funniest Jokes told by AI! Your ads are replaced by Jokes</p>';
      } else {
        miniPreview.innerHTML = `<p>${customHtml || "No replacement content selected."}</p>`;
      }
    }
  
    // Load the user's settings from chrome.storage.local
    chrome.storage.local.get(['adReplacementType', 'customHtml'], function (result) {
      const adReplacementType = result.adReplacementType || "simple";
      const customHtml = result.customHtml || '';
      updatePreview(adReplacementType, customHtml);
    });
  
    // Listen for changes to the user's settings
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      if (changes.adReplacementType || changes.customHtml) {
        chrome.storage.local.get(['adReplacementType', 'customHtml'], function (result) {
          const adReplacementType = result.adReplacementType || 'simple';
          const customHtml = result.customHtml || '';
          updatePreview(adReplacementType, customHtml);
        });
      }
    });
  });




  chrome.runtime.sendMessage({ action: "testMessage" }, (response) => {
    if (chrome.runtime.lastError) {
        console.error("Error: ", chrome.runtime.lastError.message);
    } else {
        console.log("Response from background:", response);
    }
});
