// Log a message to indicate that the background script has been successfully loaded.
console.log("Background script loaded!");

// Listen for the extension installation or update event.
chrome.runtime.onInstalled.addListener(() => {
    // Log a message when the extension is installed or updated.
    console.log("Extension installed or updated!");
});

// Add a general message listener to handle incoming messages from other parts of the extension.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Log the received message for debugging purposes.
    console.log("Message received in background.js:", message);

    // Send a response back to the sender to acknowledge the message.
    sendResponse({ success: true });
});

// Add a specific message listener to handle the "toggleEnabled" action.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Check if the received message has the action "toggleEnabled".
    if (request.action === "toggleEnabled") {
        // Query the currently active tab in the current window.
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            // Check if a valid tab is found.
            if (tabs[0]) {
                // Send the "toggleEnabled" message to the content script in the active tab.
                chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
                    // Handle any errors that occur while sending the message.
                    if (chrome.runtime.lastError) {
                        console.log("Error sending message to content script:", chrome.runtime.lastError);
                    } else {
                        // Log a success message if the message is sent successfully.
                        console.log("Message sent successfully:", response);
                    }
                });
            }
        });
    }
});