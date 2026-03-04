# Privacy Policy for Tab Declutter

**Last updated:** March 4, 2026

## Overview

Tab Declutter is a browser extension that helps you organize and manage your Chrome tabs. Your privacy is important, and this extension is designed to work entirely locally on your device.

## Data Collection

Tab Declutter does **not** collect, transmit, or share any personal data. Specifically:

- No analytics or tracking
- No network requests
- No user accounts or authentication
- No data sent to external servers

## Local Storage

Tab Declutter uses Chrome's local storage API (`chrome.storage.local`) to save:

- Your current tab selections (so they persist when the popup is closed)
- A history of recently closed tabs (so you can reopen them)

This data is stored entirely on your device and is never transmitted anywhere.

## Permissions

Tab Declutter requests the following browser permissions:

- **tabs**: To read the list of open tabs (titles, URLs, favicons) so they can be displayed, grouped, and closed
- **storage**: To save your selections and closed tab history locally

## Changes

If this privacy policy changes, updates will be posted here.

## Contact

For questions or concerns, please open an issue at https://github.com/samaybar/tab-declutter/issues
