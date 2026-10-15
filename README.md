# Sririthi AI Face Studio

An Android-friendly, installable PWA starter for a FaceFusion-inspired face-editing workflow.

## Current status

**Version 0.3: local media selection, previews, and browser capability diagnostics.** Choose a source portrait and either a target photo or target video. Media is previewed with browser object URLs; this version does not upload files and does not perform AI face swapping.

## Features in this version

- Responsive interface for Android phones.
- Source portrait picker.
- Target photo **or** video picker.
- Local previews and input validation.
- Installable PWA manifest and service-worker app-shell caching.
- Clear status messages that do not pretend a render has happened.
- Local device diagnostic panel for secure context, WebAssembly, WebGPU adapter availability, video playback hints, browser storage quota, and CPU/memory hints.
- Copyable diagnostic report to help decide the next engine prototype.

## Important: offline means two different things

- **Offline app shell:** supported after the PWA has been opened online once and its files are cached.
- **Offline AI processing:** not implemented. A real face-swap engine, compatible model weights, and a device-compatible runtime are required.

A remote AI server cannot process files without a network connection. To meet the strict offline requirement, the primary engine must eventually run on the phone. A server can be an optional online mode, not a dependency of offline mode.

## Run the device compatibility check

1. Open the deployed app in the latest Chrome on your OPPO F29.
2. Open **Offline engine readiness** and tap **Run device check**.
3. Tap **Copy diagnostic report** and paste the report into the ChatGPT conversation to continue the device-specific engine evaluation.
4. The check uses local browser APIs only; it does not upload media or download AI models. A WebGPU result is only a capability hint, not proof that a face-swap model will fit or perform well.

## Practical implementation roadmap

1. **Media workflow (current):** select and preview source portrait plus target photo/video.
2. **Photo inference proof of concept:** select a legally usable model/engine, verify its licence and model-weight terms, then benchmark Android compatibility and RAM use. Do not add a fake "Process" success state.
3. **Offline Android runtime:** prototype inference in a device-compatible runtime. A PWA alone cannot assume access to native Android acceleration; if browser inference is too slow or unsupported, package the engine in an Android wrapper with a native inference layer.
4. **Photo export:** add face detection, face selection, processing progress, output preview, and save/share flow.
5. **Video pipeline:** decode video, process frames in batches, preserve timing, mux audio where supported, and export a new file. Start with short, low-resolution clips and enforce size/duration limits.
6. **Optional online mode (later):** add a separately deployed processing API only after the offline path is stable. Clearly disclose when media leaves the device, use authentication, size limits, cleanup, and secure transport. Offline mode must never silently upload media.

## Deploy with GitHub Pages

1. Open **Settings → Pages**.
2. Choose **Deploy from a branch**, branch `main`, folder `/(root)`, then save.
3. Open the Pages URL GitHub provides.
4. On Android Chrome, use the browser menu and choose **Install app** or **Add to Home screen**.

GitHub Pages hosts the static app only. It is not an AI inference server and cannot run a persistent video-processing worker.

## Safety and privacy

Use only faces and footage you have permission to edit. Label synthetic media clearly when sharing. Never commit private photos, videos, model credentials, API keys, or secrets to this repository. Check licences for both inference code and model weights before redistribution.

See [ENGINE_PLAN.md](./ENGINE_PLAN.md) for the implementation design and acceptance checks.
