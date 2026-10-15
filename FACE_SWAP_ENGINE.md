# Face Swap Engine: first working prototype

## Engine decision

The strict offline requirement means inference must run on Android itself. The current PWA is a web interface, not a native inference host. The first proof of concept will therefore test a native Android app using ONNX Runtime on the device.

Reference implementation: https://github.com/Parasaran-Python/android-face-fusion

That project documents a pipeline with SCRFD face detection, ArcFace embeddings, and the INSwapper model. Its source code is MIT-licensed, but the model files have separate InsightFace non-commercial research terms. Review and accept the model terms before using the app; do not use these model assets for a commercial product without appropriate permission.

## What the prototype supports

- On-device photo-to-photo face swapping.
- The reference app downloads roughly 739 MB of model files on first launch, so first setup requires internet and sufficient storage.
- After the models are downloaded and cached, image inference is designed to run locally.
- The reference implementation currently documents image swapping, not video swapping.
- This is an engine validation build, not yet the branded Sririthi app and not yet integrated into the PWA.

## Build a test APK from this repository

1. Open the **Actions** tab in this repository.
2. Choose **Build native face-swap engine test APK**.
3. Tap **Run workflow** and wait for the job to finish.
4. Open the successful workflow run and download the artifact named `Sririthi-native-engine-test-apk`.
5. Extract the ZIP on your Android phone and install the APK. Android may ask you to allow installation from that source.
6. Connect to Wi-Fi for the first model download. Keep about 1 GB or more of free storage available.
7. Test with photos you own or have permission to edit. After the models are downloaded, enable airplane mode and repeat a photo swap to verify offline inference.

The workflow builds the public reference project in an isolated folder; it does not copy its code into the PWA and does not rename the reference app. This is deliberate: first verify that the model pipeline runs on the actual phone before porting and branding it.

## Next milestones

1. Verify the native photo engine on the OPPO F29.
2. Port its inference pipeline into a Sririthi-branded Android app or a native bridge.
3. Add video decoding, face tracking across frames, frame processing, audio muxing, export, cancellation, and low-memory recovery.
4. Connect the PWA to the native app only if the Android integration can be reliable. A normal GitHub Pages PWA cannot directly load an Android Java ONNX runtime.
5. Keep online server processing optional; offline mode must not silently upload user media.

## Known limitations

- The PWA still only selects and previews media; it does not perform AI inference.
- The test APK is a reference app, not the finished Sririthi product.
- Video swapping is not provided by the reference implementation and requires additional engineering.
- Model licence restrictions apply independently of the source-code licence.
