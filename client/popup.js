
// This opens the settings page iin a new tab
document.getElementById('open-options').addEventListener('click', function() 
    {
  chrome.runtime.openOptionsPage();
});


document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

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


// Current Replacement Update the Preview

document.addEventListener('DOMContentLoaded', function () {
    const miniPreview = document.getElementById('mini-preview');

    //  Function to update the Preview
    function updatePreview(adReplacementType, customHtml) {
        if (adReplacementType === 'simple') {
            miniPreview.innerHTML = `<p>${customHtml || 'Ads blocked  by Adfriend!'}</p>`;
        } else if (adReplacementType === 'quote') {
            miniPreview.innerHTML = '<p>"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill</p>';
        } else if (adReplacementType === 'dsa') {
            miniPreview.innerHTML = "<p>DSA Challenge: Implement a binary search algorithm!</p>";
        } else if (type === 'joke') {
          preview.innerHTML = '<p>Funniest Jokes told by Ai! Your ads are replaced by Jokes</p>';
        } 
         else {
            miniPreview.innerHTML = `<p>${customHtml || "No replacement content selected."}</p>`;
        }
    }

    //  Load the User's settigs from chrome storage local
    chrome.storage.local.get(['adReplacementType', 'customHtml'], function (result) {
        const adReplacementType = result.adReplacementType || "simple";
        const customHtml = result.customHtml || '';
        updatePreview(adReplacementType, customHtml);
    });

    //  Listen for changes to the user's settings
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (changes.adReplacementType || changes.customHtml) {
            chrome.storage.local.get(['adReplacementType', 'customHtml'],  function (result) {
                const adReplacementType = result.adReplacementType || 'simple';
                const customHtml = result.customHtml || '';
                updatePreview(adReplacementType, customHtml)
            })
        }
    })
})