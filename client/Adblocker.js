function getAdReplacementType() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["adReplacementType", "customHtml"], (result) => {
            resolve({ adReplacementType: result.adReplacementType || "default", customHtml: result.customHtml || "" });
        });
    });
}


//   Function to fetch content from the Backend
async function fetchAIContent(type, customHtml = "") {
    console.log('Fetching content for type:', type);

    if (type === 'simple') {
        console.log('Using user-provided custom text:', customHtml);
        return customHtml || 'Enter your custom message...'
    }

    try {
        console.log('Marking API request for type:', type);
        const response = await fetch(`http://localhost:5000/api/get-content?type=${type}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.content
    } catch (err) {
        console.log("Error fetching AI content", err);
        return "Error loading content";
    }
    
}




// Function to replace ad elements with "Hello, world!" like the template

let adsBlockedCount = 0 // Counter for blocked ads


async function replaceAdElement(ad, content) {
    console.log('Replacing ad with content:', content); 
    const replacement = document.createElement('div');
    replacement.style.cssText = "padding: 10px; background: #ffffff; border-radius: 8px; border: 1px solid var(--border); transition: all 0.3s ease; color: var(--text, #2d3436);";
    replacement.innerHTML = content;

    ad.replaceWith(replacement);

    // Increment the counter 
    adsBlockedCount++;

    // Save the Updated count to chrome.storgae.local
    chrome.storage.local.set( {adsBlocked: adsBlockedCount}, () => {
        console.log('Ads blocked counted updated:', adsBlockedCount);
    });
}

//  Reset the counter
function resetAdsBlockedCount() {
    adsBlockedCount = 0;
    chrome.storage.local.set({ adsBlocked: 0}, () => {
        console.log('Ads blocked count reset to 0');
    });
}

document.getElementById('reset-counter')?.addEventListener('click', resetAdsBlockedCount);

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

let cachedContent = null;


async function replaceAds() { 
    try {
        const { adReplacementType, customHtml } = await getAdReplacementType();

        // Slider Try
        const { sensitivity } = await new Promise((resolve) => {
            chrome.storage.local.get(['sensitivity'], (result) => {
                resolve({ sensitivity: result.sensitivity || 50 });
            });
        });
        console.log('Selected content type:', adReplacementType);
        console.log('User custom input:', customHtml);

        console.log('Sensitivity:', sensitivity);

        cachedContent = await fetchAIContent(adReplacementType, customHtml);
        console.log('Fetched content:', cachedContent);
    
        adSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach(ad => {
                if (sensitivity >= 50) {
                    replaceAdElement(ad, cachedContent);
                }
            });
        });
    } catch (err) {
        console.log("Error replacing ads:", err);
    }
}




const observer = new MutationObserver(async (mutationsList) => {
    try {
        const { sensitivity } = await new Promise((resolve) => {
            chrome.storage.local.get(['sensitivity'], (result) => {
                resolve({ sensitivity: result.sensitivity || 50})
            })
        });

        for (const mutation of mutationsList) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    adSelectors.forEach((selector) => {
                        if (node.matches(selector)) {
                            if (sensitivity > 50) {
                                replaceAdElement(node, cachedContent);
                            }
                        } else {
                            node.querySelectorAll(selector).forEach(ad => {
                                if (sensitivity > 50 ) {
                                    replaceAdElement(ad, cachedContent);

                                }
                            });
                                
                        }
                    });
                }
            });
        }
    } catch (err) {
        console.log("Error in MutationObserver:", err);
    }
});



// Start observing changes
observer.observe(document.body, { childList: true, subtree: true });



chrome.storage.local.get("adReplacementType", (result) => {
    if (!result.adReplacementType) {
        chrome.storage.local.set({ adReplacementType: "default" }); // Set only if not already set
    }
    replaceAds();
});


