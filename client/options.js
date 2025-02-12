
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

    // Save settings
    document.getElementById('save-settings').addEventListener('click', () => {
        const selectedType = document.getElementById('template-select').value;
        const customHtml = document.getElementById('custom-html').value.trim();

        chrome.storage.local.set({ adReplacementType: selectedType, customHtml: customHtml }, () => {
            console.log('Settings saved:', { adReplacementType: selectedType, customHtml: customHtml });
            alert('Settings saved successfully!');
        });
    });
});
