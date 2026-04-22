# Tracksy Chrome Extension

Saves jobs from LinkedIn and Indeed directly into your Tracksy account.

## Load in Chrome (development)

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select this `tracksy-extension/` folder

## Connect to Tracksy

1. Click the Tracksy icon in Chrome
2. Enter your server URL (e.g. `http://localhost:3000`)
3. Paste your JWT token from `localStorage.getItem('authToken')` in your browser console on the Tracksy tab
4. Click **Connect**

## How it works

- Opens on any page so you can manually save any job
- On LinkedIn Jobs and Indeed pages, it auto-fills the company and position from the page
- Saves via `POST /applications` using your existing backend
- The current page URL is saved as the job description link

## Build for production

The extension uses plain JS/HTML — no build step needed.
For a minified/bundled version, add esbuild:
```
npm install -D esbuild
esbuild src/popup.ts --bundle --outfile=popup.js
```
