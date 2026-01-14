# Tab Declutter

A Chrome extension to help you organize, review, and bulk-close browser tabs.

## Features

- **Domain Grouping** - Tabs grouped by website domain
- **Window Grouping** - Tabs grouped by browser window, then by domain within each
- **Smart Grouping** - Automatic categorization (Shopping, Development, Social Media, News, etc.)
- **Age Indicators** - Visual indicator showing how recently each tab was accessed
- **Opener Tracking** - Colored dots showing tabs opened from the same parent
- **Bulk Selection** - Select individual tabs or entire groups with checkboxes
- **Bulk Close** - Close all selected tabs with one click
- **History** - View and reopen previously closed tabs
- **Keyboard Navigation** - Full keyboard support for efficient workflow
- **Keyboard Shortcut** - Quick access via Cmd+Shift+Y (customizable)
- **Persistent Selections** - Your selections are remembered when you close the popup

## Keyboard Shortcuts

**Open Extension:** `Cmd+Shift+Y` (Mac) / `Ctrl+Shift+Y` (Windows/Linux)

Customize at `chrome://extensions/shortcuts`

**In the popup:**

| Key | Action |
|-----|--------|
| ↓ Down | Next visible item |
| ↑ Up | Previous visible item |
| → Right | Expand group |
| ← Left | Collapse group / jump to group header |
| Space | Toggle checkbox |
| Tab | Next visible checkbox |

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
   ```bash
   git clone https://github.com/samaybar/tab-declutter.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `tab-declutter` folder

### From Release

1. Download the latest release zip from [Releases](https://github.com/samaybar/tab-declutter/releases)
2. Extract the zip file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable **Developer mode** (toggle in top right)
5. Click **Load unpacked**
6. Select the extracted folder

## Usage

1. Click the Tab Declutter icon in your Chrome toolbar
2. Browse your tabs grouped by domain or smart categories
3. Use checkboxes to select tabs you want to close
4. Click "Close Selected" to close them
5. View closed tabs in the History tab to reopen if needed

## License

MIT
