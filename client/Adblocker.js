/**
 * Retrieves the ad replacement type and custom HTML from Chrome's local storage.
 * @returns {Promise<{adReplacementType: string, customHtml: string}>} A promise that resolves with the ad replacement type and custom HTML.
 */
function getAdReplacementType() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["adReplacementType", "customHtml"], (result) => {
        resolve({ adReplacementType: result.adReplacementType || "default", customHtml: result.customHtml || "" });
      });
    });
  }
  
  /**
   * Fetches AI-generated content from the backend API based on the given type.
   * @param {string} type - The type of content to fetch.
   * @param {string} [customHtml=""] - The user-defined custom HTML.
   * @returns {Promise<string>} The fetched content or a default message if an error occurs.
   */
  async function fetchAIContent(type, customHtml = "") {
    console.log('Fetching content for type:', type);
  
    if (type === 'simple') {
      console.log('Using user-provided custom text:', customHtml);
      return customHtml || 'Enter your custom message...';
    }
  
    try {
      console.log('Making API request for type:', type);
      const response = await fetch(`http://localhost:5000/api/get-content?type=${type}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.content;
    } catch (err) {
      console.log("Error fetching AI content", err);
      return "Error loading content";
    }
  }
  
  /**
   * Replaces an ad element with the provided content and updates the blocked ads count.
   * @param {HTMLElement} ad - The ad element to be replaced.
   * @param {string} content - The replacement content.
   */
  let adsBlockedCount = 0; // Counter for blocked ads

  async function replaceAdElement(ad, content) {
    console.log('Replacing ad with content:', content);
  
    // Create a shadow DOM for the replacement element
    const replacement = document.createElement('div');
    const shadow = replacement.attachShadow({ mode: 'open' });
  
    // Add your CSS to the shadow DOM
    const style = document.createElement('style');
    style.textContent = `
        .widget-container {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            background-color: royalblue;
            border-radius: 8px;
            margin: 0 auto;
            text-align: center;
            box-sizing: border-box;
            overflow: hidden;
            color: rgb(255, 255, 255);
            transition: all 0.3s ease;
        }
  
        .widget-quote {
            font-size: 1.0vw;
            color: rgb(255, 255, 255);
            text-align: center;
            white-space: normal;
            overflow-wrap: anywhere;
            word-break: break-word;
        }
  
        /* Media queries for smaller devices */
        @media (max-width: 768px) {
            .widget-quote {
                font-size: 2vw;
            }
        }
    `;
    shadow.appendChild(style);
  
    // Create the widget structure
    const container = document.createElement('div');
    container.className = 'widget-container';
  
    const quote = document.createElement('div');
    quote.className = 'widget-quote';
    quote.textContent = content;
  
    container.appendChild(quote);
    shadow.appendChild(container);
  
    // Replace the ad with the new widget
    ad.replaceWith(replacement);
  
    // Increment the counter
    adsBlockedCount++;
  
    // Save the updated count to Chrome's local storage
    try {
      await chrome.storage.local.set({ adsBlocked: adsBlockedCount });
      console.log('Ads blocked count updated:', adsBlockedCount);
    } catch (err) {
      console.error('Failed to update ads blocked count:', err);
    }
  }
  

  /**
   * Resets the counter for blocked ads.
   */
  function resetAdsBlockedCount() {
    adsBlockedCount = 0;
    chrome.storage.local.set({ adsBlocked: 0 }, () => {
      console.log('Ads blocked count reset to 0');
    });
  }
  
  document.getElementById('reset-counter')?.addEventListener('click', resetAdsBlockedCount);
  
  /**
   * List of selectors for detecting ad elements on the page.
   */
  const adSelectors = [
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
  
  /**
   * Replaces detected ads on the page with alternative content.
   */
  async function replaceAds() {
    try {
      const { adReplacementType, customHtml } = await getAdReplacementType();
  
      // Get sensitivity setting
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
  
  /**
   * Observes changes in the DOM to detect and replace newly added ad elements.
   */
  const observer = new MutationObserver(async (mutationsList) => {
    try {
      const { sensitivity } = await new Promise((resolve) => {
        chrome.storage.local.get(['sensitivity'], (result) => {
          resolve({ sensitivity: result.sensitivity || 50 });
        });
      });
  
      for (const mutation of mutationsList) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            adSelectors.forEach((selector) => {
              if (node.matches(selector) || node.querySelector(selector)) {
                if (sensitivity > 50) {
                  replaceAdElement(node, cachedContent);
                }
              }
            });
          }
        });
      }
    } catch (err) {
      console.log("Error in MutationObserver:", err);
    }
  });
  
  /**
   * Toggles the ad blocker functionality on or off.
   * @param {boolean} enabled - Whether the ad blocker should be enabled.
   */
  function toggleAdBlocker(enabled) {
    isEnabled = enabled;
    if (enabled) {
      console.log("Ad blocker enabled");
      observer.observe(document.body, { childList: true, subtree: true });
      replaceAds();
    } else {
      console.log("Ad blocker disabled");
      observer.disconnect();
    }
  }
  
  // Listen for messages from the popup to toggle the ad blocker
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "toggleEnabled") {
      toggleAdBlocker(request.enabled);
      sendResponse({ success: true });
    }
  });
  
  // Load the initial enabled state from Chrome's local storage
  chrome.storage.local.get(["enabled"], function (result) {
    const enabled = result.enabled !== undefined ? result.enabled : true;
    toggleAdBlocker(enabled);
  });
  
  // Start observing changes and replace ads if enabled
  chrome.storage.local.get("adReplacementType", (result) => {
    if (!result.adReplacementType) {
      chrome.storage.local.set({ adReplacementType: "default" });
    }
    replaceAds();
  });
  
  