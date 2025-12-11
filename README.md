# DeviceTesterOnline 🛠️

**A privacy-first, client-side suite for testing hardware peripherals directly in the browser.**

**Live Demo:** [https://devicetesteronline.com](https://devicetesteronline.com)

---

## 📖 About

**DeviceTesterOnline** is a lightweight Single Page Application (SPA) designed to validate hardware functionality without installing shady diagnostic software.

Whether you are buying a used monitor, setting up a new gaming rig, or troubleshooting a quiet microphone, this tool provides instant, real-time feedback. It runs **100% client-side**—no audio, video, or input data is ever recorded or uploaded to a server.

## ⚡ Key Features

### 🖱️ Input Devices
- **Mouse Polling Rate & Jitter Test:** Real-time graph of your mouse's reporting rate (Hz). Verifies if you are actually getting the 1000Hz/8000Hz performance advertised by gaming mice.
- **Keyboard Ghosting & Rollover:** Visualizes N-Key Rollover (NKRO) to detect "ghosting" or jammed keys during simultaneous presses.
- **Gamepad / Controller Tester:** Full API support for Xbox, PlayStation, and generic USB controllers (Buttons, Joysticks, and Triggers).

### 🖥️ Display & Camera
- **Dead Pixel Locator:** High-contrast color cycling to spot stuck or dead pixels on LCD/OLED panels.
- **Monitor Refresh Rate:** Validates the *actual* browser frame rate to ensure your 144Hz/240Hz monitor is configured correctly in OS settings.
- **Webcam & Microphone:** Instant feedback on audio levels and video clarity without joining a call.

### 🛡️ Privacy & Architecture
- **Zero-Knowledge:** All tests run locally using standard HTML5 APIs (`Navigator`, `Gamepad API`, `AudioContext`).
- **No Installs:** Works instantly in Chrome, Firefox, Edge, and Safari.
- **MIT License.
