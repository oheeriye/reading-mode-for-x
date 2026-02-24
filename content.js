let observer = null;

// Cache references to hidden elements so we don't re-query the DOM repeatedly
let cachedSidebar = null;
let cachedLeftNav = null;
let cachedProfile = null;
let cachedPrimary = null;

function applyFocusMode() {
  const isArticle = document.querySelector('[data-testid="twitterArticleReadView"]');
  if (!isArticle) return; // Not an article page — leave layout untouched

  // Use cached references where possible, fall back to querying if not found yet
  const primary = cachedPrimary || document.querySelector('[data-testid="primaryColumn"]');
  if (!primary) return; // DOM not ready yet — observer will retry
  cachedPrimary = primary;

  // Hide right sidebar
  const sidebar = cachedSidebar || document.querySelector('[data-testid="sidebarColumn"]');
  if (sidebar) {
    sidebar.style.display = 'none';
    cachedSidebar = sidebar;
  }

  // Hide left nav column — walk 2 levels up from Post button
  if (!cachedLeftNav) {
    const postButton = document.querySelector('[data-testid="SideNav_NewTweet_Button"]');
    if (postButton) {
      cachedLeftNav = postButton.parentElement?.parentElement;
    }
  }
  if (cachedLeftNav) cachedLeftNav.style.display = 'none';

  // Hide profile/account switcher button
  const profileButton = cachedProfile || document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
  if (profileButton) {
    profileButton.style.display = 'none';
    cachedProfile = profileButton;
  }

  // Expand center column to fill the space
  primary.style.maxWidth = '100%';
  primary.style.flex = '1';

  // Only disconnect once all elements are successfully hidden
  const allHidden = cachedSidebar && cachedLeftNav && cachedProfile;
  if (allHidden && observer) {
    observer.disconnect();
    observer = null;
  }
}

// Reset cache on navigation so we re-query fresh elements for the new page
function resetCache() {
  cachedSidebar = null;
  cachedLeftNav = null;
  cachedProfile = null;
  cachedPrimary = null;
}

// Debounce: only call applyFocusMode at most once every 100ms
function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

const debouncedApply = debounce(applyFocusMode, 100);

function startObserver() {
  if (observer) return; // Already running

  // Observe the narrowest possible target — the main content area
  // Fall back to document.body if not found yet
  const target = document.querySelector('main') || document.body;

  observer = new MutationObserver(debouncedApply);
  observer.observe(target, { childList: true, subtree: true });
}

// Handle SPA navigation (X.com uses pushState for routing)
function onNavigate() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  resetCache();
  startObserver();
  // Try immediately first, then let observer handle if DOM isn't ready yet
  applyFocusMode();
  debouncedApply();
}

// Intercept pushState (SPA navigation)
const originalPushState = history.pushState;
history.pushState = function (...args) {
  originalPushState.apply(this, args);
  onNavigate();
};

// Handle back/forward navigation
window.addEventListener('popstate', onNavigate);

// Try immediately on script load, then start observer as fallback
applyFocusMode();
startObserver();
