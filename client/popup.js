document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const toggleSwitch = document.getElementById("global-toggle");
  const switchLabel = document.querySelector(".switch-slider");
  const statusIndicator = document.getElementById("connection-status");

  chrome.storage.local.get(["enabled"], function (result) {
    if (result.enabled) {
        toggleSwitch.checked = true;
        statusIndicator.style.backgroundColor = "green";
    } else {
        toggleSwitch.checked = false;
        statusIndicator.style.backgroundColor = "red";
    }
});

  // Load stored settings
  chrome.storage.local.get(["darkMode", "enabled"], function (result) {
      // Set dark mode
      if (result.darkMode === "enabled") {
          body.setAttribute("data-theme", "dark");
      } else {
          body.removeAttribute("data-theme");
      }

      // Ensure the toggle switch reflects the current state
      const isEnabled = result.enabled ?? true; // Default to ON if not set
      toggleSwitch.checked = isEnabled;
      updateSwitchLabel(isEnabled);
  });

  // Listen for dark mode changes
  chrome.storage.onChanged.addListener(function (changes) {
      if (changes.darkMode) {
          if (changes.darkMode.newValue === "enabled") {
              body.setAttribute("data-theme", "dark");
          } else {
              body.removeAttribute("data-theme");
          }
      }
  });

  // Toggle extension state
  toggleSwitch.addEventListener("change", function () {
      const isEnabled = toggleSwitch.checked;

      // Save the new state
      chrome.storage.local.set({ enabled: isEnabled }, function () {
          console.log(`Extension is now ${isEnabled ? "Enabled" : "Disabled"}`);

          // Send message to background script to handle state
          chrome.runtime.sendMessage({ action: "toggleExtension", enabled: isEnabled });

          statusIndicator.style.backgroundColor = isEnabled ? "green" : "red"
          
          // Update label
          updateSwitchLabel(isEnabled);

          // Show notification
          showNotification(isEnabled);
      });
  });

  // Function to update switch label
  function updateSwitchLabel(isEnabled) {
      switchLabel.textContent = isEnabled ? " Turn Off " : " Turn On ";
  }

  // Function to show notification when toggling
  function showNotification(isEnabled) {
      chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "AdFriend",
          message: isEnabled ? "Extension is now ON" : "Extension is now OFF"
      });
  }
});
