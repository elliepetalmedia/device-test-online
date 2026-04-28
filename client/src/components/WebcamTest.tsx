import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Video } from "lucide-react";

import { ChecklistExportCard } from "@/components/ChecklistExportCard";
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

        <div className="lg:col-span-3">
          <ChecklistExportCard
            title="Meeting Video Checklist Export"
            description="Export a pre-call checklist after you confirm webcam preview here and continue through microphone and speaker checks."
          />
        </div>
      </div>
    </div>
  );
}
