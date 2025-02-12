//  Function to set ad replacement type

function setAdReplacementType(type) {
    localStorage.setItem(" setAdReplacementType", type);
    localStorage.removeItem('cachedContent')
    replaceAds()
}



//Function to fetch content from Backend(Modified)
async function fetchAIContent(type) {
    //   Check if content is already cached
    let cachedContent = localStorage.getItem('cachedContent');
    if (cachedContent) {
        cachedContent = JSON.parse(cachedContent);
        if (cachedContent[type]) {
            return cachedContent[type];
        }
    }
    try {
        console.log('Fetching content for type:', type);
        const response = await fetch(`http://localhost:5000/api/get-content?type=${type}`);
        const data = await response.json();
        const content = data.content

        //  Cache the new content
        let cacheToStore = cachedContent || {};
        cacheToStore[type] = content;
        localStorage.setItem('cachedContent', JSON.stringify(cacheToStore));
        return content
    } catch (err) {
        console.error("Error fetching AI content", err);
        return "Error loading content";
    }
}


// Function to replace ad elements with "Hello, world!" like the template
async function replaceAdElement(ad, content) {
    // const userChoice = localStorage.getItem("adReplacementType") || "quote";
    // console.log('Selcted content type', userChoice)

    // const content = await fetchAIContent(userChoice);
    // console.log('Fetched content:', content)
    const replacement = document.createElement('div');
    replacement.style.cssText = "padding: 10px; background: #f4f4f4; border: 1px solid #ddd;";
    replacement.innerHTML = content || "No content available";
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
// function replaceAds() {
//     adSelectors.forEach((selector) => {
//         document.querySelectorAll(selector).forEach(replaceAdElement);
//     });
// }

async function replaceAds() {
    const userChoice = localStorage.getItem("adReplacementType") || "quote";
    const content = await fetchAIContent(userChoice); // Fetch ONCE

    adSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach(ad => replaceAdElement(ad, content)); // Reuse content
    });
}




//  Set defaukt content type if not already set
if (!localStorage.getItem("adReplacementType")) {
    localStorage.setItem("adReplacementType", "quote");
}
// Run when the page loads
replaceAds();

// Observe the DOM for dynamically added ads
const observer = new MutationObserver(async (mutationsList) => {
    const userChoice = localStorage.getItem("aadReplacementType") || 'quote';
    const content = await fetchAIContent(userChoice)
    for (const mutation of mutationsList) {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                adSelectors.forEach((selector) => {
                    if (node.matches(selector)) {
                        replaceAdElement(node, content);
                    } else {
                        node.querySelectorAll(selector).forEach(ad => replaceAdElement(ad, content));
                    }
                });
            }
        });
    }
});

// Start observing changes
observer.observe(document.body, { childList: true, subtree: true });


//  Clear Storage on page refresh
window.addEventListener('load',  () => {
    localStorage.removeItem('cachedContent');
    // replaceAds();
})
