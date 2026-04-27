import React, { useMemo, useState } from "react";
import { Hand, Smartphone } from "lucide-react";

import { DiagnosticStatusCard } from "@/components/DiagnosticStatusCard";
import { Card } from "@/components/ui/card";
import { createDiagnosticStatus, type DiagnosticStatus } from "@/lib/diagnosticStatus";
import { testStore } from "@/lib/store";

interface TouchPointState {
  id: number;
  x: number;
  y: number;
}

function getTouchscreenStatus(): DiagnosticStatus {
  const supportsTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  if (!supportsTouch) {
    return createDiagnosticStatus(
      "unsupported",
      "Touchscreen Input Not Detected",
      "This browser session does not currently expose touch input. Open the page on a phone, tablet, or touch-enabled display to run the test.",
    );
  }

  return createDiagnosticStatus(
    "ready",
    "Touchscreen Test Ready",
    "Touch the pad below and move across the full surface to reveal dead zones or missed multi-touch points.",
  );
}

export function TouchscreenTest() {
  const [status, setStatus] = useState<DiagnosticStatus>(getTouchscreenStatus);
  const [points, setPoints] = useState<TouchPointState[]>([]);
  const [maxPoints, setMaxPoints] = useState(0);
  const [lastGesture, setLastGesture] = useState("No touch detected yet");

  const handleTouchUpdate = (event: React.TouchEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextPoints = Array.from(event.touches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX - bounds.left,
      y: touch.clientY - bounds.top,
    }));

    setPoints(nextPoints);
    setMaxPoints((previous) => {
      const nextMax = Math.max(previous, nextPoints.length);
      testStore.addResult("touchscreen", "tested", {
        maxTouchPoints: nextMax,
        activeTouches: nextPoints.length,
      });
      return nextMax;
    });
    setLastGesture(nextPoints.length > 1 ? `${nextPoints.length}-finger touch` : "Single-touch path");
    setStatus(
      createDiagnosticStatus(
        "active",
        "Touch Input Active",
        "Drag across the full pad and use multiple fingers if your device supports multi-touch.",
      ),
    );
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextPoints = Array.from(event.touches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX - bounds.left,
      y: touch.clientY - bounds.top,
    }));

    setPoints(nextPoints);
    if (nextPoints.length === 0) {
      setStatus(getTouchscreenStatus());
    }
  };

  const summaryText = useMemo(() => {
    if (maxPoints === 0) {
      return "Touch the pad to begin.";
    }

    if (maxPoints === 1) {
      return "Single-touch confirmed. Try a two-finger gesture if your device supports multi-touch.";
    }

    return `Multi-touch confirmed with up to ${maxPoints} simultaneous contact points.`;
  }, [maxPoints]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-1">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary">
              <Smartphone className="h-7 w-7" />
              <h3 className="font-orbitron text-2xl uppercase tracking-widest">
                Touchscreen Test
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Use this page on a phone, tablet, convertible laptop, or touch-enabled monitor to check coverage and
              multi-touch response without installing an app.
            </p>
          </div>

          <DiagnosticStatusCard status={status} className="bg-surface/70" />

          <Card className="border-secondary/30 bg-surface p-6">
            <h4 className="mb-4 font-orbitron text-sm uppercase tracking-widest text-primary">
              Live Summary
            </h4>
            <div className="space-y-4 text-sm">
              <div className="rounded border border-secondary/20 bg-background/40 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Max Touch Points
                </div>
                <div className="mt-2 font-orbitron text-4xl text-primary">{maxPoints}</div>
              </div>
              <div className="rounded border border-secondary/20 bg-background/40 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Last Gesture
                </div>
                <div className="mt-2 font-orbitron text-lg text-white">{lastGesture}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Card className="border-secondary/30 bg-black/40 p-4 md:p-6">
            <div
              className="relative h-[420px] touch-none overflow-hidden rounded-xl border border-primary/20 bg-[radial-gradient(circle_at_top,rgba(102,252,241,0.1),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]"
              onTouchStart={handleTouchUpdate}
              onTouchMove={handleTouchUpdate}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              <div className="absolute left-4 top-4 rounded-full border border-primary/20 bg-black/50 px-3 py-1 font-orbitron text-xs uppercase tracking-[0.2em] text-primary">
                Touch Pad
              </div>

              {points.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Hand className="mb-4 h-16 w-16 text-primary/40" />
                  <p className="font-orbitron text-xl text-white">Touch and drag across the pad</p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Trace the edges, corners, and center. Use two or more fingers if you want to test multi-touch
                    support or dead zones.
                  </p>
                </div>
              ) : null}

              {points.map((point) => (
                <div
                  key={point.id}
                  className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60 bg-primary/20 shadow-[0_0_20px_rgba(102,252,241,0.4)]"
                  style={{ left: point.x, top: point.y }}
                />
              ))}
            </div>
          </Card>

          <Card className="mt-6 border-secondary/30 bg-surface p-6">
            <h4 className="mb-2 font-orbitron text-sm uppercase tracking-widest text-primary">
              Coverage Guidance
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{summaryText}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
