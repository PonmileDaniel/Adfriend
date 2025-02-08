// Function to replace ad elements with "Hello, world!" like the template

const customContent = `
  <div class="custom-ad">
    <h3>Interesting Content</h3>
    <p>Check out this cool feature!</p>
  </div>
`;

function replaceAdElement(ad) {
    const replacement = document.createElement('div');
    replacement.style.cssText = "padding: 10px; background: #f4f4f4; border: 1px solid #ddd;";
    replacement.innerHTML = customContent;
    ad.replaceWith(replacement);
}

// Ad selectors
const adSelectors = [
    'iframe', 
    '.ad-banner', 
    '.adsbygoogle', 
    '.sponsored',
    'fbs-ad',
    "[id^='google_ads']",
    "[class^='google-ad']",
    "[id='google_ads_iframe']",
    "[class='ad-slot-header']",
    "[class='ad-slot']",
    "[div='ad-slot']",
    "[alt*='ad']",
    "[alt*='Advertisement']"
];

// Function to block ads on page load
function replaceAds() {
    adSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach(replaceAdElement);
    });
}

// Run when the page loads
replaceAds();

// Observe the DOM for dynamically added ads
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                adSelectors.forEach((selector) => {
                    if (node.matches(selector)) {
                        replaceAdElement(node);
                    } else {
                        node.querySelectorAll(selector).forEach(replaceAdElement);
                    }
                });
            }
        });
    }
});

// Start observing changes
observer.observe(document.body, { childList: true, subtree: true });
