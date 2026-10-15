# Sririthi AI Face

A mobile-first, installable Progressive Web App starter for a privacy-minded face-editing workflow.

## Current status

**Version 0.1: interface and local previews.** This build lets users select a source photo and target video, previews them locally in the browser, and caches the app shell for repeat/offline opening after the first visit. It does **not** perform AI face swapping yet.

## Features

- Responsive UI designed for Android phones.
- Source image and target video selection with local previews.
- No media upload or backend in this starter.
- PWA manifest and service worker for installability and app-shell caching.
- Clear status messages instead of pretending an AI render succeeded.

## Deploy with GitHub Pages

1. Open **Settings → Pages**.
2. Choose **Deploy from a branch**, branch `main`, folder `/(root)`, then Save.
3. Open the Pages URL GitHub provides.
4. On Android Chrome, use the browser menu and choose **Install app** or **Add to Home screen**.

## Offline behavior

After the site loads once over HTTPS, the service worker caches the app shell. This means the interface can reopen offline. It does **not** mean AI face-swapping works offline; that requires an inference engine, model weights, and an implementation compatible with the target Android device.

## Next milestone

Evaluate the engine's licence, model compatibility, Android hardware acceleration, RAM usage, thermal behavior, and whether media stays local. Never commit private photos, videos, API keys, or credentials to the repository. Use only media you have permission to edit and label synthetic output clearly.

Repository description: Mobile-first PWA starter for privacy-minded AI face-editing experiments, with local media previews and offline app-shell caching.