# Air Juggler

A canvas paddle game with opt-in index-finger control using MediaPipe Hand Landmarker. Pointer, touch and keyboard modes work without the camera.

## Run
From repository root: `python -m http.server 8000`. Open http://localhost:8000/projects/air-juggler/. Press Start game. Move with mouse, touch, or arrow keys after focusing the canvas. Space pauses/resumes. There are three lives.

## Camera
Click Enable hand tracking, permit camera access, and keep one hand visible. The index fingertip controls the paddle horizontally. No audio is requested. Stop camera releases the stream and model; navigating away stops tracks. Requires HTTPS or localhost, a supported browser, and external CDN/model access.

Uses pinned `@mediapipe/tasks-vision@0.10.18` and the float16 Hand Landmarker model v1. Frames are processed locally. Inference runs on the main thread at a maximum of about 15 FPS; slower devices may experience input lag. A Web Worker is a future improvement.

## Physics
Gravity and velocity are advanced with delta time capped at 25 ms. The paddle only bounces a descending ball in the collision band. Hit position sets horizontal velocity. Pure logic is isolated in `physics.mjs` and checked with Node's built-in runner.

## Verification limit
Automated checks cover game physics, not actual camera/model execution. Test hand tracking on your own device before recording a portfolio demo.

Reference: https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/web_js
