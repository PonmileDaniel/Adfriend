document.getElementById('open-options').addEventListener('click', function() {
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