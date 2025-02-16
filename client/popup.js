
// // This opens the settings page iin a new tab
// document.getElementById('open-options').addEventListener('click', function() 
//     {
//   chrome.runtime.openOptionsPage();
// });


// document.addEventListener("DOMContentLoaded", function () {
//   const body = document.body;

//   //    Added new thing 
//   const toggleSwitch = document.getElementById("global-toggle");
//   const switchLabel = document.querySelector(".switch-slider");
//   const statusIndicator = document.getElementById("connection-status");

//   chrome.storage.local.get(["enabled"], function (result) {
//     if (result.enabled) {
//         toggleSwitch.checked = true;
//         statusIndicator.style.backgroundColor = "green";
//     } else {
//         toggleSwitch.checked = false;
//         statusIndicator.style.backgroundColor = "red";
//     }
// });
  

//   // Load dark mode state from chrome.storage.local
//   chrome.storage.local.get(["darkMode"], function (result) {
//       if (result.darkMode === "enabled") {
//           body.setAttribute("data-theme", "dark");
//       } else {
//           body.removeAttribute("data-theme");
//       }

//       const isEnabled = result.enabled ?? true; // Default to ON if not set
//       toggleSwitch.checked = isEnabled;
//       updateSwitchLabel(isEnabled);
//   });
  

//   // Listen for changes to dark mode
//   chrome.storage.onChanged.addListener(function (changes, namespace) {
//       if (changes.darkMode) {
//           if (changes.darkMode.newValue === "enabled") {
//               body.setAttribute("data-theme", "dark");
//           } else {
//               body.removeAttribute("data-theme");
//           }
//       }
//   });
// });


// // Current Replacement Update the Preview

// document.addEventListener('DOMContentLoaded', function () {
//     const miniPreview = document.getElementById('mini-preview');

//     //  Function to update the Preview
//     function updatePreview(adReplacementType, customHtml) {
//         if (adReplacementType === 'simple') {
//             miniPreview.innerHTML = `<p>${customHtml || 'Ads blocked  by Adfriend!'}</p>`;
//         } else if (adReplacementType === 'quote') {
//             miniPreview.innerHTML = '<p>"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill</p>';
//         } else if (adReplacementType === 'dsa') {
//             miniPreview.innerHTML = "<p>DSA Challenge: Implement a binary search algorithm!</p>";
//         } else if (adReplacementType === 'joke') {
//           miniPreview.innerHTML = '<p>Funniest Jokes told by Ai! Your ads are replaced by Jokes</p>';
//         } 
//          else {
//             miniPreview.innerHTML = `<p>${customHtml || "No replacement content selected."}</p>`;
//         }
//     }

//     //  Load the User's settigs from chrome storage local
//     chrome.storage.local.get(['adReplacementType', 'customHtml'], function (result) {
//         const adReplacementType = result.adReplacementType || "simple";
//         const customHtml = result.customHtml || '';
//         updatePreview(adReplacementType, customHtml);
//     });

//     //  Listen for changes to the user's settings
//     chrome.storage.onChanged.addListener(function (changes, namespace) {
//         if (changes.adReplacementType || changes.customHtml) {
//             chrome.storage.local.get(['adReplacementType', 'customHtml'],  function (result) {
//                 const adReplacementType = result.adReplacementType || 'simple';
//                 const customHtml = result.customHtml || '';
//                 updatePreview(adReplacementType, customHtml)
//             })
//         }
//     })

    
// })



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


