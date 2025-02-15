
function updatePreview(type, customHtml) {
    const preview = document.getElementById('ad-preview');

    if (type === 'simple') {
        preview.innerHTML = `<p>${customHtml || "Enter your custom message ..."}</p>`;
    } else if (type === 'quote') {
        preview.innerHTML = '<p>"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill</p>';
    } else if (type === 'dsa') {
        preview.innerHTML = '<p>DSA Challenge: Implement a binary search algorithm!</p>';
    } else {
        preview.innerHTML = `<p>${customHtml || "Enter your custom message..."}</p>`;
    }
}



document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['adReplacementType', 'customHtml'], (result) => {
        const savedType = result.adReplacementType || 'simple'; // Default to 'simple'
        const savedHtml = result.customHtml || ''; // Default to empty

        document.getElementById('template-select').value = savedType;
        document.getElementById('custom-html').value = savedHtml; // Load saved custom input

        updatePreview(savedType, savedHtml); // Update preview
    });

    // Listen for changes in the dropdown
    document.getElementById('template-select').addEventListener('change', () => {
        const selectedType = document.getElementById('template-select').value;
        const customHtml = document.getElementById('custom-html').value; // Get latest input
        updatePreview(selectedType, customHtml);
    });

    // Listen for changes in the custom input field
    document.getElementById('custom-html').addEventListener('input', () => {
        const selectedType = document.getElementById('template-select').value;
        const customHtml = document.getElementById('custom-html').value;
        updatePreview(selectedType, customHtml);
    });

    //  Listen for changes in the sensitivity slider : Slider
    document.getElementById('sensitivity').addEventListener('input', (event) => {
        const sensitivity = event.target.value;
        console.log("Slider value changed to:", sensitivity);
        chrome.storage.local.set({ sensitivity: parseInt(sensitivity) }, () => {
            console.log("Sensitivity Saved", sensitivity);

            // replaceAds();
        })
    })

    //  Load saved sensitivity value : Slider
    chrome.storage.local.get(['sensitivity'], (result) => {
        const sensitivity = result.sensitivity || 50;
        document.getElementById('sensitivity').value = sensitivity;

    })


    // Save settings
    document.getElementById('save-settings').addEventListener('click', () => {
        const selectedType = document.getElementById('template-select').value;
        const customHtml = document.getElementById('custom-html').value.trim();

        chrome.storage.local.set({ adReplacementType: selectedType, customHtml: customHtml }, () => {
            console.log('Settings saved:', { adReplacementType: selectedType, customHtml: customHtml, sensitivity: sensitivity });
            alert('Settings saved successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("dark-mode");

    // Load dark mode state from chrome.storage.local
    chrome.storage.local.get(["darkMode"], function (result) {
        if (result.darkMode === "enabled") {
            document.body.setAttribute("data-theme", "dark");
            darkModeToggle.checked = true;
        } else {
            document.body.removeAttribute("data-theme");
            darkModeToggle.checked = false;
        }
    });

    // Toggle dark mode when checkbox is clicked
    darkModeToggle.addEventListener("change", function () {
        if (darkModeToggle.checked) {
            document.body.setAttribute("data-theme", "dark");
            chrome.storage.local.set({ darkMode: "enabled" });
        } else {
            document.body.removeAttribute("data-theme");
            chrome.storage.local.set({ darkMode: "disabled" });
        }
    });
});

// AdsBlocked Count to get it from local storage
document.addEventListener("DOMContentLoaded", () => {
    //  Load the adds blocked count
    chrome.storage.local.get(['adsBlocked'], (result) => {
        const adsBlocked = result.adsBlocked || 0;
        document.getElementById('ads-blocked').textContent = adsBlocked;
    })

    // Listen for changes to the ads blocked count
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (changes.adsBlocked) {
            document.getElementById('ads-blocked').textContent = changes.adsBlocked.newValue;
        }
    })
});