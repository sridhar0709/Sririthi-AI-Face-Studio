# Sririthi AI Face Studio: Engine Integration Plan

## Product goal

A FaceFusion-inspired, Android-friendly tool for swapping a permitted source identity into a target photo or video. Strict offline operation is a requirement for the primary workflow.

## Architecture decision

Use a **local-first architecture**:

- **PWA shell:** media selection, previews, settings, progress UI, help, and installability.
- **Local inference layer:** must execute on the device for offline operation. Prototype browser inference only if the selected model/runtime and OPPO device support it; otherwise build an Android wrapper/native module around a compatible inference runtime.
- **Optional remote worker:** a later enhancement for users who explicitly choose online processing. Never silently send local media to it.

A hosted web page cannot make a remote engine work offline. Service-worker caching only makes the app files available offline.

## Milestones

### M1: Media input and UX
- [x] Select a source portrait.
- [x] Select a target photo or video.
- [x] Preview both locally.
- [x] Validate file types and communicate that AI rendering is not yet connected.
- [ ] Add file-size/duration guidance and robust error handling.

### M2: Engine selection gate
Before choosing an engine, verify:
- Source-code and model-weight licences permit the intended use and distribution.
- Android ARM64 support and available acceleration providers.
- Model download size, runtime memory, thermal behavior, and speed on the actual phone.
- Supported input formats and output quality.
- Whether the implementation can keep all source media on-device.

Do not commit model weights to Git unless their licence explicitly permits redistribution. Keep model downloads separate from application code where required.

### M3: Photo proof of concept
- Detect faces and let the user choose the target face.
- Run one image through the local engine.
- Show progress, errors, and a before/after preview.
- Save the output only after an actual successful inference.
- Add a clear synthetic-media label or metadata note where feasible.

### M4: Video pipeline
- Begin with short clips and modest resolution.
- Extract frames, run face detection/tracking, process frames, and reassemble in timestamp order.
- Preserve audio when the chosen media pipeline supports it.
- Handle rotation, variable frame rate, interrupted jobs, low storage, and cancellation.
- Export a separate output; never overwrite the original.
- Test on-device thermal throttling and memory pressure.

### M5: Optional server mode
Only after the local path is working:
- Make server mode an explicit opt-in.
- Authenticate requests and validate media types, file sizes, and duration.
- Use encrypted transport, temporary storage, automatic cleanup, and clear retention disclosures.
- Return job status and a downloadable output.
- Keep server mode unavailable while offline, without blocking local features.

## Acceptance checks

- After the first visit, the app shell opens offline.
- Selecting source and target media never uploads either file.
- Offline mode makes no network request for media processing.
- The app never reports success unless a real engine returns an output file.
- Photo output is validated on-device before video work begins.
- Video output plays, has the expected duration, and preserves audio when supported.
- Low-memory, unsupported-format, cancellation, and insufficient-storage errors are handled without losing original media.

## Current limitation

The repository currently contains the app shell and local preview workflow only. It does not yet contain an inference engine, model weights, an Android native bridge, a video-rendering pipeline, or an AI server. Those pieces must be selected and tested rather than represented as already working.
