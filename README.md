# Reading Mode for X

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome) ![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)

A Chrome extension that hides the left and right sidebars on X (Twitter) article pages, giving you a clean, distraction-free reading experience.

---

## How It Works

1. Open any article on X/Twitter
2. Both sidebars automatically hide
3. Read without distraction
4. Only activates on article pages — all other pages are unaffected

---

## Features

* 🧹 Hides left and right sidebars on article pages only
* ⚡ Automatic — no clicking required
* 🔁 Non-destructive — only activates on article pages, all other pages are unaffected
* 🔒 No data collected, no external requests

---

## Installation

### Step 1: Download the Extension

Click **Code → Download ZIP** and extract it, or:

```
git clone https://github.com/oheeriye/reading-mode-for-x.git
```

### Step 2: Open Chrome Extensions

Navigate to `chrome://extensions`

### Step 3: Enable Developer Mode

Toggle **Developer mode** in the top-right corner

### Step 4: Load the Extension

1. Click **Load unpacked**
2. Select the folder containing `manifest.json`
3. Click **Select Folder**

### Step 5: Verify

Visit any article on X — both sidebars should disappear automatically.

---

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension config (Manifest V3) |
| `content.js` | Detects article pages and hides sidebars |
| `icon.png` | Extension icon |

---

## Privacy

* No data collected
* No external requests
* Works entirely in your browser
* No tracking, no analytics, no nonsense

---

## Bugs or Issues?

Drop me a text on [@noheeriye](https://x.com/noheeriye) if something's broken or behaving weird.

---

## Built With

Built by [Heer](https://x.com/noheeriye) with [Claude Code](https://claude.ai/code) as co-creator.

---

## License

MIT
