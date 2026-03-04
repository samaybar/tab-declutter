# Publishing to Chrome Web Store

## One-time setup

1. Register a developer account at https://chrome.google.com/webstore/devconsole ($5 fee)
2. Host the privacy policy publicly (e.g. as a GitHub Pages site or paste the raw GitHub URL)

## Before publishing

1. Update the version in `manifest.json`
2. Build the zip:
   ```bash
   zip -r tab-declutter.zip manifest.json popup.html popup.js popup.css background.js icons/*.png
   ```

## Screenshots needed

Upload at least one screenshot. Recommended set:

| Screenshot | Size | What to capture |
|-----------|------|-----------------|
| Domain view | 1280x800 | Extension popup showing tabs grouped by domain |
| Smart groups | 1280x800 | Smart Groups view with categorized tabs |
| Duplicates | 1280x800 | Duplicates view showing detected duplicates |
| History | 1280x800 | History view with recently closed tabs |

Tips for taking screenshots:
- Open the extension popup, then use Cmd+Shift+4 (Mac) to capture a region
- Chrome DevTools can capture at exact dimensions: right-click popup > Inspect > toggle device toolbar > set to 1280x800
- Save as PNG in `store/screenshots/`

## Optional: Promotional tile

- Size: 440x280 PNG
- Used as the small tile in search results
- Save as `store/promo-440x280.png`

## Publishing steps

1. Go to https://chrome.google.com/webstore/devconsole
2. Click **Add new item** and upload `tab-declutter.zip`
3. **Store listing tab:**
   - Copy description from `store/listing.md`
   - Upload screenshots from `store/screenshots/`
   - Upload promotional tile if you have one
   - Set category to Productivity
   - Set language to English
4. **Privacy tab:**
   - Single purpose: "Organize and close browser tabs"
   - Data usage: declare that no data is collected or transmitted
   - Paste your privacy policy URL
5. **Distribution tab:**
   - Visibility: Public
   - All regions (unless you want to limit)
6. Click **Submit for Review**

Review typically takes a few hours to a couple of days.
