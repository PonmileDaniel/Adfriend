// Function to replace ad elements with "Hello, world!" like the template
function replaceAdElement(ad) {
    const replacement = document.createElement('div');
    replacement.innerHTML = '<div class="widget-container"> Ad replaced</div> <div class="widget-content"><p class="widget-quote">Welcome to Adfriend</p></div>';
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
