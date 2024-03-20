/**
 * Background script to handle background tasks and data synchronization.
 */

/**
 *  Event listener to handle changes in storage and synchronize data using Chrome sync
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let key in changes) {
        let storageChange = changes[key];
        if (namespace === 'local') {
            chrome.storage.sync.set({ [key]: storageChange.newValue });
        } else if (namespace === 'sync') {
            chrome.storage.local.set({ [key]: storageChange.newValue });
        }
    }
});

/**
 * Event listener to handle extension installation and initial setup
 */
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['notes', 'links'], (result) => {
        if (!result.notes) {
            chrome.storage.local.set({ 'notes': [] });
        }
        if (!result.links) {
            chrome.storage.local.set({ 'links': [] });
        }
    });
});
