// Background service worker for Tab Declutter
// Currently minimal - can be extended for features like:
// - Keyboard shortcuts
// - Context menu integration
// - Badge showing tab count
// - Notifications for tab limits

// Update badge with current tab count
async function updateBadge() {
  const tabs = await chrome.tabs.query({});
  const count = tabs.length;

  // Show count on badge
  chrome.action.setBadgeText({ text: count.toString() });
  chrome.action.setBadgeBackgroundColor({ color: '#667eea' });
}

// Listen for tab changes to update badge
chrome.tabs.onCreated.addListener(updateBadge);
chrome.tabs.onRemoved.addListener(updateBadge);

// Initialize badge on extension load
chrome.runtime.onInstalled.addListener(updateBadge);
chrome.runtime.onStartup.addListener(updateBadge);
