let observer = null;


let styleInjected = false;

function injectStyles() {
  if (styleInjected) return;
  const style = document.createElement('style');
  style.id = 'x-focus-mode';
  style.textContent = `
    /* Hide left nav */
    header[role="banner"] { display: none !important; }

    /* Hide right sidebar */
    [data-testid="sidebarColumn"] { display: none !important; }

    /* Center and widen the content wrapper */
    main > div:has([data-testid="primaryColumn"]) {
      margin: 0 auto !important;
      max-width: 1200px !important;
      width: 1200px !important;
    }

    /* Also widen primaryColumn itself which has its own internal constraints */
    [data-testid="primaryColumn"] {
      max-width: 1200px !important;
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);
  styleInjected = true;
}

function removeStyles() {
  const style = document.getElementById('x-focus-mode');
  if (style) style.remove();
  styleInjected = false;
}

function applyFocusMode() {
  if (!document.querySelector('[data-testid="twitterArticleReadView"]')) {
    removeStyles(); // Not an article — clean up if we injected previously
    return;
  }

  injectStyles();

  // Disconnect observer once styles are injected
  if (styleInjected && observer) {
    observer.disconnect();
    observer = null;
  }
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
