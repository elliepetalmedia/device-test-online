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
- **Gamepad / Controller Tester:** Full API support for Xbox, PlayStation, and generic USB controllers.
  - **Advanced Drift Analysis:** A 3-stage statistical test (Agitate -> Settle -> Sample) that accurately measures stick drift percentage and sensor jitter/noise.
  - **Vibration Testing:** Supports dual-rumble feedback on supported browsers (Chrome/Edge).

### 🖥️ Display & Camera
- **Monitor Test (Pixels & Refresh):** Combined tool to spot dead/stuck pixels with high-contrast color cycling AND validate your *actual* browser refresh rate (Hz) in real-time.
- **Webcam & Microphone:** Instant feedback on audio levels and video clarity without joining a call.

### 🛡️ Privacy & Architecture
- **Zero-Knowledge:** All tests run locally using standard HTML5 APIs (`Navigator`, `Gamepad API`, `AudioContext`, `requestAnimationFrame`).
- **No Installs:** Works instantly in Chrome, Firefox, Edge, and Safari.
- **No Data Collection:** We do not track user results, recordings, or device fingerprints.

## 🚀 Technical Highlights
- **React + Vite:** Lightning-fast frontend performance.
- **Drift Protocol:** Uses `requestAnimationFrame` for high-precision 60fps sensor sampling.
- **Tailwind CSS:** Responsive, dark-mode-first UI design.
- **Lucide React:** Beautiful, consistent iconography.

## 📄 License
MIT License.
