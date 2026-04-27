import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Video } from "lucide-react";

import { DiagnosticStatusCard } from "@/components/DiagnosticStatusCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  classifyMediaError,
  createDiagnosticStatus,
  getWebcamPreflightStatus,
  type DiagnosticStatus,
} from "@/lib/diagnosticStatus";
import { testStore } from "@/lib/store";

export function WebcamTest() {
  const [status, setStatus] = useState<DiagnosticStatus>(getWebcamPreflightStatus);
  const [isActive, setIsActive] = useState(false);
  const [cameraName, setCameraName] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef(0);
  const mountedRef = useRef(true);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (mountedRef.current) {
      setIsActive(false);
      setCameraName("");
      setStatus(getWebcamPreflightStatus());
    }
  };

  const startCamera = async () => {
    if (status.state === "unsupported") {
      return;
    }

    sessionRef.current += 1;
    const sessionId = sessionRef.current;
    stopCamera();
    setStatus(
      createDiagnosticStatus(
        "permission-required",
        "Awaiting Camera Access",
        "Approve camera access in the browser prompt to start the live preview.",
      ),
    );

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (!mountedRef.current || sessionRef.current !== sessionId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      const activeCameraName = videoTrack?.label || "Generic Camera Device";
      setCameraName(activeCameraName);
      setIsActive(true);
      setStatus(
        createDiagnosticStatus(
          "active",
          "Camera Preview Active",
          "Live preview is running locally. Confirm the feed, framing, resolution, and frame rate below.",
          {
            notes: ["The preview stays on this device and is discarded when you stop the camera."],
          },
        ),
      );
      testStore.addResult("webcam", "passed", { device: activeCameraName });
    } catch (error) {
      if (!mountedRef.current || sessionRef.current !== sessionId) {
        return;
      }

      console.error("Webcam access error:", error);
      setStatus(classifyMediaError(error, "camera"));
      setIsActive(false);
      setCameraName("");
    }
  };

  useEffect(() => {
    if (!isActive || !videoRef.current || !streamRef.current) {
      return;
    }

    const videoElement = videoRef.current;
    videoElement.srcObject = streamRef.current;

    let cancelled = false;
    const currentSession = sessionRef.current;

    const playVideo = async () => {
      try {
        await videoElement.play();
      } catch (error) {
        if (cancelled || !mountedRef.current || currentSession !== sessionRef.current) {
          return;
        }

        console.error("Error playing webcam preview:", error);
        setStatus(
          createDiagnosticStatus(
            "failed",
            "Preview Playback Failed",
            "The camera stream opened, but the browser could not start the inline preview. Check autoplay restrictions and try again.",
          ),
        );
      }
    };

    void playVideo();

    return () => {
      cancelled = true;
    };
  }, [isActive]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      sessionRef.current += 1;
      stopCamera();
    };
  }, []);

  const videoTrack = streamRef.current?.getVideoTracks()[0];
  const settings = videoTrack?.getSettings();

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div>
            <h3 className="font-orbitron text-2xl uppercase tracking-widest text-primary">Webcam Diagnostics</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Test your camera functionality, resolution, and frame rate locally in your browser.
            </p>
          </div>

          <DiagnosticStatusCard
            status={status}
            onAction={!isActive && status.state !== "unsupported" ? startCamera : undefined}
            className="bg-surface/70"
          />

          <div className="space-y-4">
            {!isActive ? (
              <Button onClick={startCamera} className="w-full bg-primary font-orbitron text-background hover:bg-primary/80">
                <Camera className="mr-2 h-4 w-4" /> Start Camera
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="destructive" className="w-full font-orbitron">
                <CameraOff className="mr-2 h-4 w-4" /> Stop Camera
              </Button>
            )}

            {isActive && cameraName ? (
              <div className="flex items-center gap-2 rounded border border-primary/30 bg-surface p-3 text-xs font-orbitron text-primary">
                <div className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
                Active: {cameraName}
              </div>
            ) : null}
          </div>

          {isActive && streamRef.current ? (
            <div className="space-y-2 rounded-lg border border-secondary/30 bg-surface p-4">
              <h4 className="font-orbitron text-sm text-primary">Stream Stats</h4>
              <div className="space-y-1 text-xs font-mono text-muted-foreground">
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span className="text-foreground">
                    {settings?.width || "N/A"}x{settings?.height || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Frame Rate:</span>
                  <span className="text-foreground">{Math.round(settings?.frameRate || 0)} FPS</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-2">
          <Card className="glow-border relative flex min-h-[400px] items-center justify-center overflow-hidden border-secondary/30 bg-black p-1">
            {!isActive ? (
              <div className="text-center text-muted-foreground">
                <Video className="mx-auto mb-4 h-16 w-16 opacity-20" />
                <p className="text-sm font-orbitron opacity-50">Camera Offline</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full bg-black object-contain"
                style={{ transform: "scaleX(-1)" }}
              />
            )}

            {isActive ? (
              <div className="absolute right-4 top-4 flex gap-2">
                <div className="rounded border border-neon-green/50 bg-neon-green/10 px-2 py-0.5 font-orbitron text-[10px] text-neon-green animate-pulse">
                  LIVE
                </div>
              </div>
            ) : null}
          </Card>
        </div>

        <div className="rounded-lg border border-secondary/30 bg-surface p-8 lg:col-span-3">
          <h2 className="mb-6 border-b border-secondary/30 pb-4 font-orbitron text-2xl uppercase tracking-widest text-primary">
            Comprehensive Webcam Diagnostic Guide
          </h2>
          <div className="space-y-8 font-roboto-mono text-lg leading-relaxed text-muted-foreground">
            <section>
              <h3 className="mb-2 text-xl font-orbitron text-white">How to Use the Online Webcam Tester</h3>
              <p>
                This free, browser-based webcam diagnostic tool allows you to instantly verify your camera&apos;s video
                feed, resolution, and frame rate without installing any third-party software. Whether you are setting
                up a new Logitech C920, testing your built-in laptop camera for a meeting, or diagnosing a black screen
                issue, this dashboard provides real-time telemetry.
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-xl font-orbitron text-white">Diagnosing Common Webcam Errors</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Camera Permission Denied:</strong> If you see this error, your web browser (Chrome, Edge,
                  Firefox, or Safari) is blocking access for privacy reasons. Click the padlock icon in your browser&apos;s
                  address bar and ensure "Camera" is set to "Allow", then refresh the page.
                </li>
                <li>
                  <strong>Camera in Use by Another Application:</strong> Webcams can only be accessed by one
                  application at a time. If you have Zoom, Microsoft Teams, OBS Studio, or Discord open and actively
                  using the camera, this tool will not be able to connect to it. Close those apps and try again.
                </li>
                <li>
                  <strong>Black Screen or No Device Found:</strong> If the tool cannot find a camera, check your
                  physical connections. USB webcams may need to be plugged directly into the motherboard rather than a
                  USB hub. Some gaming laptops (like Lenovo Legion or MSI) have a physical privacy switch or keyboard
                  shortcut (Fn + F-key) that completely disables the webcam at a hardware level.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-xl font-orbitron text-white">Understanding Frame Rate (FPS) and Resolution</h3>
              <p className="mb-2">Once your camera is active, check the "Stream Stats" box.</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Resolution:</strong> Displayed as Width x Height. A standard HD webcam will show `1280x720`
                  (720p) or `1920x1080` (1080p). 4K webcams may display `3840x2160`.
                </li>
                <li>
                  <strong>Frame Rate (FPS):</strong> A smooth video feed requires at least 30 FPS. If your frame rate
                  drops below 20 FPS, your video will appear choppy. Low frame rates are often caused by poor lighting
                  conditions (the camera lowers the shutter speed to capture more light) or USB bandwidth limitations.
                  Ensure you are using a USB 3.0 port and have adequate lighting.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-xl font-orbitron text-white">Local Preview Privacy</h3>
              <p>
                <strong>Device Test Online renders the webcam preview locally in your browser.</strong> The diagnostic
                flow is not designed to upload the live camera feed as part of the test itself. Site analytics and ad
                services are disclosed separately in the privacy policy and do not need webcam frames to operate.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
