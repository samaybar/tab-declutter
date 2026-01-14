// Smart category definitions - known domains mapped to categories
const CATEGORY_DOMAINS = {
  'Shopping': [
    'amazon.com', 'ebay.com', 'etsy.com', 'walmart.com', 'target.com',
    'bestbuy.com', 'newegg.com', 'aliexpress.com', 'shopify.com',
    'wayfair.com', 'costco.com', 'homedepot.com', 'lowes.com',
    'macys.com', 'nordstrom.com', 'zappos.com', 'overstock.com'
  ],
  'Development': [
    'github.com', 'gitlab.com', 'bitbucket.org', 'stackoverflow.com',
    'developer.mozilla.org', 'npmjs.com', 'pypi.org', 'crates.io',
    'docs.rs', 'rubygems.org', 'packagist.org', 'nuget.org',
    'codepen.io', 'jsfiddle.net', 'replit.com', 'codesandbox.io',
    'vercel.com', 'netlify.com', 'heroku.com', 'digitalocean.com',
    'aws.amazon.com', 'cloud.google.com', 'azure.microsoft.com'
  ],
  'Social Media': [
    'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'linkedin.com',
    'reddit.com', 'tiktok.com', 'pinterest.com', 'tumblr.com',
    'discord.com', 'slack.com', 'mastodon.social', 'threads.net'
  ],
  'Video & Streaming': [
    'youtube.com', 'netflix.com', 'hulu.com', 'disneyplus.com',
    'hbomax.com', 'primevideo.com', 'twitch.tv', 'vimeo.com',
    'dailymotion.com', 'peacocktv.com', 'paramountplus.com'
  ],
  'News & Media': [
    'news.google.com', 'cnn.com', 'bbc.com', 'nytimes.com', 'wsj.com',
    'theguardian.com', 'reuters.com', 'apnews.com', 'npr.org',
    'washingtonpost.com', 'bloomberg.com', 'techcrunch.com',
    'theverge.com', 'arstechnica.com', 'wired.com', 'engadget.com'
  ],
  'Productivity': [
    'docs.google.com', 'sheets.google.com', 'slides.google.com',
    'drive.google.com', 'notion.so', 'trello.com', 'asana.com',
    'monday.com', 'airtable.com', 'figma.com', 'miro.com',
    'dropbox.com', 'box.com', 'evernote.com', 'todoist.com'
  ],
  'Email': [
    'mail.google.com', 'outlook.live.com', 'outlook.office.com',
    'mail.yahoo.com', 'protonmail.com', 'zoho.com'
  ],
  'AI & Research': [
    'chat.openai.com', 'chatgpt.com', 'claude.ai', 'anthropic.com',
    'bard.google.com', 'gemini.google.com', 'perplexity.ai',
    'huggingface.co', 'arxiv.org', 'scholar.google.com',
    'semanticscholar.org', 'researchgate.net'
  ],
  'Finance': [
    'chase.com', 'bankofamerica.com', 'wellsfargo.com', 'citi.com',
    'capitalone.com', 'mint.com', 'robinhood.com', 'coinbase.com',
    'binance.com', 'paypal.com', 'venmo.com', 'wise.com',
    'yahoo.com/finance', 'finance.yahoo.com', 'tradingview.com'
  ],
  'Travel': [
    'google.com/travel', 'google.com/flights', 'expedia.com',
    'booking.com', 'airbnb.com', 'hotels.com', 'kayak.com',
    'tripadvisor.com', 'southwest.com', 'united.com', 'delta.com',
    'aa.com', 'vrbo.com', 'priceline.com'
  ]
};

// Keywords for smart categorization when domain isn't in our list
const CATEGORY_KEYWORDS = {
  'Shopping': ['shop', 'store', 'buy', 'cart', 'checkout', 'product', 'price', 'sale', 'deal', 'order'],
  'Development': ['code', 'programming', 'api', 'documentation', 'docs', 'tutorial', 'developer', 'debug', 'error', 'stack'],
  'Social Media': ['post', 'feed', 'profile', 'follow', 'share', 'comment', 'like'],
  'Video & Streaming': ['watch', 'video', 'stream', 'episode', 'movie', 'show', 'channel'],
  'News & Media': ['news', 'article', 'breaking', 'report', 'headline', 'story', 'journalist'],
  'Finance': ['bank', 'account', 'investment', 'stock', 'crypto', 'trading', 'portfolio', 'payment'],
  'Travel': ['flight', 'hotel', 'booking', 'reservation', 'travel', 'trip', 'vacation', 'destination'],
  'AI & Research': ['ai', 'artificial intelligence', 'machine learning', 'research', 'paper', 'study']
};

// State
let allTabs = [];
let selectedTabIds = new Set();
let currentView = 'domain'; // 'flat', 'domain', 'window', 'smart', or 'history'
let openerColors = new Map(); // Maps openerTabId to color
let windowEmojis = new Map(); // Maps windowId to emoji

// DOM elements
const elements = {
  totalTabs: document.getElementById('totalTabs'),
  groupCount: document.getElementById('groupCount'),
  selectedStat: document.getElementById('selectedStat'),
  selectedCount: document.getElementById('selectedCount'),
  selectAll: document.getElementById('selectAll'),
  btnExpandAll: document.getElementById('btnExpandAll'),
  btnCollapseAll: document.getElementById('btnCollapseAll'),
  btnCloseSelected: document.getElementById('btnCloseSelected'),
  btnFlatView: document.getElementById('btnFlatView'),
  btnDomainView: document.getElementById('btnDomainView'),
  btnWindowView: document.getElementById('btnWindowView'),
  btnSmartView: document.getElementById('btnSmartView'),
  btnHistoryView: document.getElementById('btnHistoryView'),
  tabList: document.getElementById('tabList'),
  historyView: document.getElementById('historyView'),
  historyList: document.getElementById('historyList'),
  btnClearHistory: document.getElementById('btnClearHistory')
};

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    await loadTabs();
    await loadSelectedTabs();
    renderTabs();
    updateSelectionUI();
    setupEventListeners();
  } catch (err) {
    console.error('Init error:', err);
    document.getElementById('tabList').innerHTML = `<div style="padding:20px;color:red;">Error: ${err.message}</div>`;
  }
}

async function loadSelectedTabs() {
  const { selectedTabIds: savedIds = [] } = await chrome.storage.local.get('selectedTabIds');
  const currentTabIds = new Set(allTabs.map(t => t.id));

  // Only restore selections for tabs that still exist
  for (const id of savedIds) {
    if (currentTabIds.has(id)) {
      selectedTabIds.add(id);
    }
  }
}

async function saveSelectedTabs() {
  await chrome.storage.local.set({ selectedTabIds: [...selectedTabIds] });
}

function setupEventListeners() {
  elements.selectAll.addEventListener('change', handleSelectAll);
  elements.btnExpandAll.addEventListener('click', expandAllGroups);
  elements.btnCollapseAll.addEventListener('click', collapseAllGroups);
  elements.btnCloseSelected.addEventListener('click', closeSelectedTabs);
  elements.btnFlatView.addEventListener('click', () => switchView('flat'));
  elements.btnDomainView.addEventListener('click', () => switchView('domain'));
  elements.btnWindowView.addEventListener('click', () => switchView('window'));
  elements.btnSmartView.addEventListener('click', () => switchView('smart'));
  elements.btnHistoryView.addEventListener('click', () => switchView('history'));
  elements.btnClearHistory.addEventListener('click', clearHistory);

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

function handleKeyboardNavigation(e) {
  const focused = document.activeElement;

  // Only handle navigation when focused on a checkbox or group header area
  if (!focused.classList.contains('tab-checkbox') &&
      !focused.classList.contains('group-checkbox') &&
      !focused.closest('.tab-item') &&
      !focused.closest('.group-header')) {
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    // Move to next visible checkbox
    const nextCheckbox = getNextVisibleCheckbox(focused, 1);
    if (nextCheckbox) nextCheckbox.focus();

  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prevCheckbox = getNextVisibleCheckbox(focused, -1);
    if (prevCheckbox) prevCheckbox.focus();

  } else if (e.key === 'ArrowRight') {
    // Expand current group if on group header or within group
    const group = focused.closest('.tab-group');
    if (group && !group.classList.contains('single-tab')) {
      const tabsContainer = group.querySelector('.group-tabs');
      if (tabsContainer && tabsContainer.classList.contains('collapsed')) {
        e.preventDefault();
        tabsContainer.classList.remove('collapsed');
        const toggleBtn = group.querySelector('.toggle-btn');
        if (toggleBtn) toggleBtn.textContent = '−';
        const preview = group.querySelector('.group-preview');
        if (preview) preview.classList.add('hidden');
        tabsContainer.querySelectorAll('.tab-checkbox').forEach(cb => cb.tabIndex = 0);
      }
    }

  } else if (e.key === 'ArrowLeft') {
    // Collapse current group if expanded, or go to group header if inside group
    const tabItem = focused.closest('.tab-item');
    if (tabItem && !tabItem.classList.contains('single-tab-item')) {
      // Inside an expanded group - go to group header
      e.preventDefault();
      const group = tabItem.closest('.tab-group');
      const groupCheckbox = group.querySelector('.group-checkbox');
      if (groupCheckbox) groupCheckbox.focus();
    } else {
      // On group header - collapse the group
      const group = focused.closest('.tab-group');
      if (group && !group.classList.contains('single-tab')) {
        const tabsContainer = group.querySelector('.group-tabs');
        if (tabsContainer && !tabsContainer.classList.contains('collapsed')) {
          e.preventDefault();
          tabsContainer.classList.add('collapsed');
          const toggleBtn = group.querySelector('.toggle-btn');
          if (toggleBtn) toggleBtn.textContent = '+';
          const preview = group.querySelector('.group-preview');
          if (preview) preview.classList.remove('hidden');
          tabsContainer.querySelectorAll('.tab-checkbox').forEach(cb => cb.tabIndex = -1);
        }
      }
    }
  }
}

function getNextVisibleCheckbox(current, direction) {
  const allCheckboxes = Array.from(document.querySelectorAll('.group-checkbox, .tab-checkbox'));

  // Filter to only visible checkboxes (not in collapsed groups, unless it's a group checkbox)
  const visibleCheckboxes = allCheckboxes.filter(cb => {
    if (cb.classList.contains('group-checkbox')) return true;

    // For tab checkboxes, check if parent group is collapsed
    const tabItem = cb.closest('.tab-item');
    if (tabItem.classList.contains('single-tab-item')) return true;

    const groupTabs = cb.closest('.group-tabs');
    return groupTabs && !groupTabs.classList.contains('collapsed');
  });

  const currentIndex = visibleCheckboxes.indexOf(current);
  if (currentIndex === -1) {
    // Current element might be a parent of a checkbox
    const checkbox = current.closest('.tab-item')?.querySelector('.tab-checkbox') ||
                     current.closest('.group-header')?.querySelector('.group-checkbox');
    if (checkbox) {
      const idx = visibleCheckboxes.indexOf(checkbox);
      if (idx !== -1) {
        const nextIdx = idx + direction;
        if (nextIdx >= 0 && nextIdx < visibleCheckboxes.length) {
          return visibleCheckboxes[nextIdx];
        }
      }
    }
    return visibleCheckboxes[direction > 0 ? 0 : visibleCheckboxes.length - 1];
  }

  const nextIndex = currentIndex + direction;
  if (nextIndex >= 0 && nextIndex < visibleCheckboxes.length) {
    return visibleCheckboxes[nextIndex];
  }
  return null;
}

function expandAllGroups() {
  document.querySelectorAll('.group-tabs').forEach(el => {
    el.classList.remove('collapsed');
    // Make checkboxes tabbable
    el.querySelectorAll('.tab-checkbox').forEach(cb => cb.tabIndex = 0);
  });
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.textContent = '−';
  });
  document.querySelectorAll('.group-preview').forEach(el => {
    el.classList.add('hidden');
  });
}

function collapseAllGroups() {
  document.querySelectorAll('.group-tabs').forEach(el => {
    el.classList.add('collapsed');
    // Make checkboxes non-tabbable
    el.querySelectorAll('.tab-checkbox').forEach(cb => cb.tabIndex = -1);
  });
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.textContent = '+';
  });
  document.querySelectorAll('.group-preview').forEach(el => {
    el.classList.remove('hidden');
  });
}

let currentWindowId = null;

async function loadTabs() {
  try {
    allTabs = await chrome.tabs.query({});
    const currentWindow = await chrome.windows.getCurrent();
    currentWindowId = currentWindow.id;
    console.log('Loaded tabs:', allTabs.length);
    elements.totalTabs.textContent = allTabs.length;
  } catch (err) {
    console.error('Error loading tabs:', err);
    allTabs = [];
  }
}

function getDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

function truncateUrl(url) {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname + urlObj.search;
    if (path.length > 40) {
      return path.substring(0, 40) + '...';
    }
    return path || '/';
  } catch {
    return url;
  }
}

// Age indicator - returns class based on how old the tab is
function getAgeInfo(lastAccessed) {
  if (!lastAccessed) return { class: 'age-unknown', title: 'Unknown age', icon: '○' };

  const now = Date.now();
  const ageMs = now - lastAccessed;
  const ageMinutes = ageMs / (1000 * 60);
  const ageHours = ageMinutes / 60;
  const ageDays = ageHours / 24;

  if (ageMinutes < 5) {
    return { class: 'age-now', title: 'Just accessed', icon: '●' };
  } else if (ageMinutes < 30) {
    return { class: 'age-recent', title: `${Math.round(ageMinutes)} min ago`, icon: '●' };
  } else if (ageHours < 2) {
    return { class: 'age-hour', title: `${Math.round(ageMinutes)} min ago`, icon: '●' };
  } else if (ageHours < 24) {
    return { class: 'age-hours', title: `${Math.round(ageHours)} hours ago`, icon: '◐' };
  } else if (ageDays < 7) {
    return { class: 'age-days', title: `${Math.round(ageDays)} days ago`, icon: '◑' };
  } else {
    return { class: 'age-old', title: `${Math.round(ageDays)} days ago`, icon: '○' };
  }
}

// Opener colors - generate consistent colors for tabs from the same opener
const OPENER_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b',
  '#8e44ad', '#27ae60', '#d35400', '#2980b9', '#f1c40f'
];

function assignOpenerColors(tabs) {
  openerColors.clear();
  const openerIds = new Set();

  // Collect all unique opener IDs
  for (const tab of tabs) {
    if (tab.openerTabId) {
      openerIds.add(tab.openerTabId);
    }
  }

  // Assign colors to each opener
  let colorIndex = 0;
  for (const openerId of openerIds) {
    openerColors.set(openerId, OPENER_COLORS[colorIndex % OPENER_COLORS.length]);
    colorIndex++;
  }
}

function getOpenerColor(tab) {
  if (!tab.openerTabId) return null;
  return openerColors.get(tab.openerTabId) || null;
}

// Window emojis - fun distinct animals for each window
const WINDOW_EMOJIS = [
  '🐶', '🐱', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸',
  '🐙', '🦋', '🐢', '🦉', '🐬', '🦩', '🐝', '🦄'
];

function assignWindowEmojis(tabs) {
  windowEmojis.clear();
  const windowIds = [...new Set(tabs.map(t => t.windowId))];

  // Sort so current window gets first emoji
  windowIds.sort((a, b) => {
    if (a === currentWindowId) return -1;
    if (b === currentWindowId) return 1;
    return a - b;
  });

  windowIds.forEach((id, index) => {
    windowEmojis.set(id, WINDOW_EMOJIS[index % WINDOW_EMOJIS.length]);
  });
}

function getWindowEmoji(windowId) {
  return windowEmojis.get(windowId) || '⬜';
}

function getBaseDomain(domain) {
  // Extract base domain (e.g., "docs.google.com" -> "google.com")
  const parts = domain.split('.');
  if (parts.length > 2) {
    return parts.slice(-2).join('.');
  }
  return domain;
}

function getCategoryForTab(tab) {
  const domain = getDomain(tab.url);
  const baseDomain = getBaseDomain(domain);

  // Check exact domain matches first
  for (const [category, domains] of Object.entries(CATEGORY_DOMAINS)) {
    if (domains.some(d => domain.includes(d) || d.includes(domain) || baseDomain === d.replace('www.', ''))) {
      return category;
    }
  }

  // Fall back to keyword analysis
  const searchText = `${tab.title} ${tab.url}`.toLowerCase();
  let bestMatch = { category: 'Other', score: 0 };

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter(kw => searchText.includes(kw)).length;
    if (score > bestMatch.score) {
      bestMatch = { category, score };
    }
  }

  return bestMatch.score >= 2 ? bestMatch.category : 'Other';
}

function groupTabsByDomain(tabs) {
  const groups = {};

  for (const tab of tabs) {
    const domain = getDomain(tab.url);
    if (!groups[domain]) {
      groups[domain] = [];
    }
    groups[domain].push(tab);
  }

  // Sort groups by number of tabs (descending)
  return Object.entries(groups)
    .sort((a, b) => b[1].length - a[1].length)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}

function groupTabsByCategory(tabs) {
  const groups = {};

  for (const tab of tabs) {
    const category = getCategoryForTab(tab);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(tab);
  }

  // Sort: defined categories first (alphabetically), then "Other" last
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  return sortedKeys.reduce((acc, key) => {
    acc[key] = groups[key];
    return acc;
  }, {});
}

function groupTabsByWindow(tabs) {
  const windows = {};

  for (const tab of tabs) {
    const windowId = tab.windowId;
    if (!windows[windowId]) {
      windows[windowId] = [];
    }
    windows[windowId].push(tab);
  }

  // Sort windows by number of tabs (descending)
  return Object.entries(windows)
    .sort((a, b) => b[1].length - a[1].length)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}

function renderTabs() {
  // Assign opener colors and window emojis for all tabs
  assignOpenerColors(allTabs);
  assignWindowEmojis(allTabs);

  elements.tabList.innerHTML = '';

  if (currentView === 'flat') {
    // Flat view - all tabs sorted by domain
    const sortedTabs = [...allTabs].sort((a, b) => {
      const domainA = getDomain(a.url);
      const domainB = getDomain(b.url);
      return domainA.localeCompare(domainB);
    });

    elements.groupCount.textContent = allTabs.length;

    const flatList = document.createElement('div');
    flatList.className = 'flat-list';

    for (const tab of sortedTabs) {
      const tabEl = createTabElement(tab, true);
      flatList.appendChild(tabEl);
    }
    elements.tabList.appendChild(flatList);

  } else if (currentView === 'window') {
    const windows = groupTabsByWindow(allTabs);

    for (const [windowId, windowTabs] of Object.entries(windows)) {
      const windowEl = createWindowElement(windowId, windowTabs, Object.keys(windows).indexOf(windowId) + 1);
      elements.tabList.appendChild(windowEl);
    }
    elements.groupCount.textContent = Object.keys(windows).length + ' win';

  } else {
    const groups = currentView === 'domain'
      ? groupTabsByDomain(allTabs)
      : groupTabsByCategory(allTabs);

    elements.groupCount.textContent = Object.keys(groups).length;

    for (const [groupName, tabs] of Object.entries(groups)) {
      const groupEl = createGroupElement(groupName, tabs);
      elements.tabList.appendChild(groupEl);
    }
  }
}

function createWindowElement(windowId, windowTabs, windowNumber) {
  const windowEl = document.createElement('div');
  windowEl.className = 'window-group';

  const windowHeader = document.createElement('div');
  windowHeader.className = 'window-header';

  const windowCheckbox = document.createElement('input');
  windowCheckbox.type = 'checkbox';
  windowCheckbox.className = 'window-checkbox';
  windowCheckbox.checked = windowTabs.every(t => selectedTabIds.has(t.id));
  windowCheckbox.addEventListener('change', () => {
    for (const tab of windowTabs) {
      if (windowCheckbox.checked) {
        selectedTabIds.add(tab.id);
      } else {
        selectedTabIds.delete(tab.id);
      }
    }
    updateSelectionUI();
    saveSelectedTabs();
    renderTabs();
  });

  const windowTitle = document.createElement('span');
  windowTitle.className = 'window-title';
  const isCurrentWindow = parseInt(windowId) === currentWindowId;
  const emoji = getWindowEmoji(parseInt(windowId));
  windowTitle.textContent = `${emoji} Window ${windowNumber}${isCurrentWindow ? ' (current)' : ''}`;

  const windowCount = document.createElement('span');
  windowCount.className = 'window-count';
  windowCount.textContent = `${windowTabs.length} tabs`;

  const windowToggle = document.createElement('button');
  windowToggle.className = 'toggle-btn';
  windowToggle.textContent = '−';
  windowToggle.tabIndex = -1;
  windowToggle.addEventListener('click', () => {
    const content = windowEl.querySelector('.window-content');
    const isCollapsed = content.classList.toggle('collapsed');
    windowToggle.textContent = isCollapsed ? '+' : '−';
  });

  windowHeader.appendChild(windowCheckbox);
  windowHeader.appendChild(windowTitle);
  windowHeader.appendChild(windowCount);
  windowHeader.appendChild(windowToggle);

  const windowContent = document.createElement('div');
  windowContent.className = 'window-content';

  // Group tabs by domain within this window
  const domainGroups = groupTabsByDomain(windowTabs);
  for (const [domain, tabs] of Object.entries(domainGroups)) {
    const groupEl = createGroupElement(domain, tabs);
    windowContent.appendChild(groupEl);
  }

  windowEl.appendChild(windowHeader);
  windowEl.appendChild(windowContent);

  return windowEl;
}

function createGroupElement(groupName, tabs) {
  const group = document.createElement('div');
  group.className = 'tab-group';

  // Single tab - show inline without collapse
  if (tabs.length === 1) {
    group.className = 'tab-group single-tab';
    const tabEl = createTabElement(tabs[0], true);
    group.appendChild(tabEl);
    return group;
  }

  // Multiple tabs - show collapsible group
  const header = document.createElement('div');
  header.className = 'group-header';

  const groupCheckbox = document.createElement('input');
  groupCheckbox.type = 'checkbox';
  groupCheckbox.className = 'group-checkbox';
  groupCheckbox.dataset.group = groupName;
  groupCheckbox.checked = tabs.every(t => selectedTabIds.has(t.id));
  groupCheckbox.addEventListener('change', () => {
    handleGroupSelect(groupName, tabs, groupCheckbox.checked);
    // Re-focus after render (element was recreated)
    setTimeout(() => {
      const newCheckbox = document.querySelector(`.group-checkbox[data-group="${groupName}"]`);
      if (newCheckbox) newCheckbox.focus();
    }, 0);
  });

  const title = document.createElement('span');
  title.className = 'group-title';
  title.textContent = groupName;

  const count = document.createElement('span');
  count.className = 'group-count';
  count.textContent = `(${tabs.length})`;

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggle-btn';
  toggleBtn.textContent = '+';
  toggleBtn.tabIndex = -1; // Not tabbable, use arrow keys instead
  toggleBtn.addEventListener('click', () => {
    const tabsContainer = group.querySelector('.group-tabs');
    const preview = group.querySelector('.group-preview');
    const isCollapsed = tabsContainer.classList.toggle('collapsed');
    toggleBtn.textContent = isCollapsed ? '+' : '−';
    if (preview) {
      preview.classList.toggle('hidden', !isCollapsed);
    }
    // Update tabindex for checkboxes
    tabsContainer.querySelectorAll('.tab-checkbox').forEach(cb => {
      cb.tabIndex = isCollapsed ? -1 : 0;
    });
  });

  header.appendChild(groupCheckbox);
  header.appendChild(title);
  header.appendChild(count);
  header.appendChild(toggleBtn);

  // Preview of tabs when collapsed
  const preview = document.createElement('div');
  preview.className = 'group-preview';
  const previewText = tabs.map(t => t.title || 'Untitled').join(' · ');
  preview.textContent = previewText;
  preview.title = tabs.map(t => t.title || 'Untitled').join('\n');

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'group-tabs collapsed';

  for (const tab of tabs) {
    const tabEl = createTabElement(tab, false);
    tabsContainer.appendChild(tabEl);
  }

  group.appendChild(header);
  group.appendChild(preview);
  group.appendChild(tabsContainer);

  return group;
}

function createTabElement(tab, showDomain = false) {
  const tabEl = document.createElement('div');
  tabEl.className = 'tab-item';
  if (showDomain) {
    tabEl.classList.add('single-tab-item');
  }
  if (selectedTabIds.has(tab.id)) {
    tabEl.classList.add('selected');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'tab-checkbox';
  checkbox.checked = selectedTabIds.has(tab.id);
  checkbox.tabIndex = showDomain ? 0 : -1; // Single tabs are tabbable, grouped tabs start collapsed
  checkbox.addEventListener('change', () => {
    handleTabSelect(tab.id, checkbox.checked);
    // Ensure focus stays on this checkbox
    checkbox.focus();
  });

  // Window emoji indicator
  const windowEmoji = document.createElement('span');
  windowEmoji.className = 'window-emoji';
  windowEmoji.textContent = getWindowEmoji(tab.windowId);
  windowEmoji.title = `Window ${[...windowEmojis.keys()].indexOf(tab.windowId) + 1}${tab.windowId === currentWindowId ? ' (current)' : ''}`;
  tabEl.appendChild(windowEmoji);

  // Opener color indicator
  const openerColor = getOpenerColor(tab);
  if (openerColor) {
    const openerDot = document.createElement('span');
    openerDot.className = 'opener-dot';
    openerDot.style.backgroundColor = openerColor;
    openerDot.title = 'Opened from same parent tab';
    tabEl.appendChild(openerDot);
  }

  // Age indicator
  const ageInfo = getAgeInfo(tab.lastAccessed);
  const ageIndicator = document.createElement('span');
  ageIndicator.className = `age-indicator ${ageInfo.class}`;
  ageIndicator.textContent = ageInfo.icon;
  ageIndicator.title = ageInfo.title;
  tabEl.appendChild(ageIndicator);

  const favicon = document.createElement('img');
  favicon.className = 'tab-favicon';
  favicon.src = tab.favIconUrl || 'icons/icon16.png';
  favicon.onerror = () => { favicon.src = 'icons/icon16.png'; };

  const info = document.createElement('div');
  info.className = 'tab-info';

  const title = document.createElement('div');
  title.className = 'tab-title';
  title.textContent = tab.title || 'Untitled';
  title.title = tab.title;

  const url = document.createElement('div');
  url.className = 'tab-url';
  url.textContent = showDomain ? getDomain(tab.url) : truncateUrl(tab.url);

  info.appendChild(title);
  info.appendChild(url);

  const goToBtn = document.createElement('button');
  goToBtn.className = 'goto-btn';
  goToBtn.textContent = '→';
  goToBtn.title = 'Go to tab';
  goToBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chrome.tabs.update(tab.id, { active: true });
    chrome.windows.update(tab.windowId, { focused: true });
  });

  tabEl.appendChild(checkbox);
  tabEl.appendChild(favicon);
  tabEl.appendChild(info);
  tabEl.appendChild(goToBtn);

  // Click on row (not checkbox) to toggle
  tabEl.addEventListener('click', (e) => {
    if (e.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
      handleTabSelect(tab.id, checkbox.checked);
    }
  });

  return tabEl;
}

function handleTabSelect(tabId, isSelected) {
  if (isSelected) {
    selectedTabIds.add(tabId);
  } else {
    selectedTabIds.delete(tabId);
  }
  updateSelectionUI();
  saveSelectedTabs();
}

function handleGroupSelect(groupName, tabs, isSelected) {
  for (const tab of tabs) {
    if (isSelected) {
      selectedTabIds.add(tab.id);
    } else {
      selectedTabIds.delete(tab.id);
    }
  }
  updateSelectionUI();
  saveSelectedTabs();
  renderTabs(); // Re-render to update individual checkboxes
}

function handleSelectAll(e) {
  const isSelected = e.target.checked;
  for (const tab of allTabs) {
    if (isSelected) {
      selectedTabIds.add(tab.id);
    } else {
      selectedTabIds.delete(tab.id);
    }
  }
  updateSelectionUI();
  saveSelectedTabs();
  renderTabs();
}

function updateSelectionUI() {
  elements.selectedCount.textContent = selectedTabIds.size;
  elements.selectedStat.textContent = selectedTabIds.size;
  elements.btnCloseSelected.disabled = selectedTabIds.size === 0;
  elements.selectAll.checked = selectedTabIds.size === allTabs.length && allTabs.length > 0;
  elements.selectAll.indeterminate = selectedTabIds.size > 0 && selectedTabIds.size < allTabs.length;

  // Update individual tab selections visually
  document.querySelectorAll('.tab-item').forEach(el => {
    const checkbox = el.querySelector('.tab-checkbox');
    if (checkbox) {
      el.classList.toggle('selected', checkbox.checked);
    }
  });
}

async function closeSelectedTabs() {
  if (selectedTabIds.size === 0) return;

  // Get tab info before closing for history
  const tabsToClose = allTabs.filter(t => selectedTabIds.has(t.id));

  // Save to history
  await saveToHistory(tabsToClose);

  // Close tabs
  await chrome.tabs.remove([...selectedTabIds]);

  // Reset and reload
  selectedTabIds.clear();
  await saveSelectedTabs();
  await loadTabs();
  renderTabs();
  updateSelectionUI();
}

async function saveToHistory(tabs) {
  const historyEntry = {
    timestamp: Date.now(),
    tabs: tabs.map(t => ({
      title: t.title,
      url: t.url,
      favIconUrl: t.favIconUrl
    }))
  };

  const { closedTabsHistory = [] } = await chrome.storage.local.get('closedTabsHistory');
  closedTabsHistory.unshift(historyEntry);

  // Keep only last 100 entries
  if (closedTabsHistory.length > 100) {
    closedTabsHistory.length = 100;
  }

  await chrome.storage.local.set({ closedTabsHistory });
}

async function loadHistory() {
  const { closedTabsHistory = [] } = await chrome.storage.local.get('closedTabsHistory');
  return closedTabsHistory;
}

async function renderHistory() {
  const history = await loadHistory();
  elements.historyList.innerHTML = '';

  if (history.length === 0) {
    elements.historyList.innerHTML = '<div class="empty-state">No closed tabs yet</div>';
    return;
  }

  for (const entry of history) {
    const entryEl = createHistoryEntry(entry);
    elements.historyList.appendChild(entryEl);
  }
}

function createHistoryEntry(entry) {
  const el = document.createElement('div');
  el.className = 'history-entry';

  const header = document.createElement('div');
  header.className = 'history-entry-header';

  const date = new Date(entry.timestamp);
  const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  header.innerHTML = `
    <span class="history-date">${dateStr}</span>
    <span class="history-count">${entry.tabs.length} tab${entry.tabs.length > 1 ? 's' : ''}</span>
  `;

  const tabsList = document.createElement('div');
  tabsList.className = 'history-tabs';

  for (const tab of entry.tabs) {
    const tabEl = document.createElement('div');
    tabEl.className = 'history-tab';

    const favicon = document.createElement('img');
    favicon.className = 'tab-favicon';
    favicon.src = tab.favIconUrl || 'icons/icon16.png';
    favicon.onerror = () => { favicon.src = 'icons/icon16.png'; };

    const title = document.createElement('span');
    title.className = 'history-tab-title';
    title.textContent = tab.title || 'Untitled';
    title.title = tab.url;

    const reopenBtn = document.createElement('button');
    reopenBtn.className = 'reopen-btn';
    reopenBtn.textContent = '↗';
    reopenBtn.title = 'Reopen tab';
    reopenBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: tab.url });
    });

    tabEl.appendChild(favicon);
    tabEl.appendChild(title);
    tabEl.appendChild(reopenBtn);
    tabsList.appendChild(tabEl);
  }

  el.appendChild(header);
  el.appendChild(tabsList);

  return el;
}

async function clearHistory() {
  await chrome.storage.local.set({ closedTabsHistory: [] });
  renderHistory();
}

function switchView(view) {
  currentView = view;

  // Update button states
  elements.btnFlatView.classList.toggle('active', view === 'flat');
  elements.btnDomainView.classList.toggle('active', view === 'domain');
  elements.btnWindowView.classList.toggle('active', view === 'window');
  elements.btnSmartView.classList.toggle('active', view === 'smart');
  elements.btnHistoryView.classList.toggle('active', view === 'history');

  // Show/hide appropriate sections
  if (view === 'history') {
    elements.tabList.classList.add('hidden');
    elements.historyView.classList.remove('hidden');
    document.querySelector('.actions-bar').classList.add('hidden');
    renderHistory();
  } else {
    elements.tabList.classList.remove('hidden');
    elements.historyView.classList.add('hidden');
    document.querySelector('.actions-bar').classList.remove('hidden');
    renderTabs();
  }
}
