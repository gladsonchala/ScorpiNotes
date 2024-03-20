/**
 * Background script to handle background tasks and data synchronization.
 */

// Event listener to handle changes in storage and synchronize data using Chrome sync
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let key in changes) {
        let storageChange = changes[key];
        if (namespace === 'local') {
            // Update data in Chrome sync
            chrome.storage.sync.set({ [key]: storageChange.newValue });
        } else if (namespace === 'sync') {
            // Update data in local storage
            chrome.storage.local.set({ [key]: storageChange.newValue });
        }
    }
});

// Event listener to handle extension installation and initial setup
chrome.runtime.onInstalled.addListener(() => {
    // Initialize storage if not already initialized
    chrome.storage.local.get(['notes', 'links'], (result) => {
        if (!result.notes) {
            chrome.storage.local.set({ 'notes': [] });
        }
        if (!result.links) {
            chrome.storage.local.set({ 'links': [] });
        }
    });
});
