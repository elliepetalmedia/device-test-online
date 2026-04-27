import React, { useEffect, useRef, useState } from "react";
import { Activity, Monitor, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { testStore } from "@/lib/store";

export function RefreshRateTest() {
  const [fps, setFps] = useState(0);
  const [peakFps, setPeakFps] = useState(0);
  const [frameTimes, setFrameTimes] = useState<number[]>([]);

  const frameCountRef = useRef(0);
  const lastSecondRef = useRef(performance.now());
  const lastFrameRef = useRef(performance.now());
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (time: number) => {
      frameCountRef.current += 1;
      const delta = time - lastFrameRef.current;
      lastFrameRef.current = time;

      setFrameTimes((previous) => [...previous, delta].slice(-120));

      const elapsed = time - lastSecondRef.current;
      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFps);
        setPeakFps((previous) => Math.max(previous, currentFps));
        testStore.addResult("refresh-rate", "tested", {
          visibleRefreshHz: currentFps,
        });
        frameCountRef.current = 0;
        lastSecondRef.current = time;
      }

      requestRef.current = window.requestAnimationFrame(animate);
    };

    requestRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const averageFrameTime =
    frameTimes.length > 0
      ? (frameTimes.reduce((sum, value) => sum + value, 0) / frameTimes.length).toFixed(2)
      : null;

  const diagnosticLabel =
    fps >= 144
      ? "High refresh path detected"
      : fps >= 100
        ? "Elevated refresh path detected"
        : fps >= 58
          ? "60Hz-class path detected"
          : "Low visible frame delivery";

  const resetPeak = () => {
    setPeakFps(fps);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card className="border-secondary/30 bg-surface p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-full border border-primary/30 bg-primary/10 p-4">
                <Monitor className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-orbitron text-2xl uppercase tracking-widest text-primary">
                  Browser-visible refresh monitor
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This view measures the frame cadence the browser is actually delivering. Compare it with the refresh
                  mode you expect from your display settings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded border border-secondary/20 bg-background/40 p-6 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Current Rate
                </div>
                <div className="mt-3 font-orbitron text-5xl text-primary">
                  {fps}
                  <span className="text-xl text-muted-foreground">Hz</span>
                </div>
              </div>
              <div className="rounded border border-secondary/20 bg-background/40 p-6 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Peak Seen
                </div>
                <div className="mt-3 font-orbitron text-5xl text-white">
                  {peakFps}
                  <span className="text-xl text-muted-foreground">Hz</span>
                </div>
              </div>
              <div className="rounded border border-secondary/20 bg-background/40 p-6 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Avg Frame Time
                </div>
                <div className="mt-3 font-orbitron text-5xl text-primary">
                  {averageFrameTime ?? "--"}
                  <span className="text-xl text-muted-foreground">ms</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded border border-primary/20 bg-primary/5 p-5">
              <div className="mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="font-orbitron text-sm uppercase tracking-[0.2em] text-primary">
                  Live Interpretation
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {diagnosticLabel}. If the number is lower than expected, check the OS display settings, cable type,
                dock or adapter bandwidth, and whether another mirrored display is capping the active path.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-secondary/30 bg-surface p-6">
            <h4 className="mb-4 font-orbitron text-sm uppercase tracking-widest text-primary">
              Quick checks
            </h4>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>1. Open your OS display settings and confirm the target refresh mode is selected.</p>
              <p>2. Use DisplayPort or a high-bandwidth HDMI cable if you expect 120Hz, 144Hz, or higher.</p>
              <p>3. Disconnect adapters or mirrored displays and compare the number again.</p>
            </div>
            <Button
              onClick={resetPeak}
              variant="outline"
              className="mt-5 w-full border-primary/40 font-orbitron text-primary hover:bg-primary/10"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Peak Reading
            </Button>
          </Card>

          <Card className="border-secondary/30 bg-surface p-6">
            <h4 className="mb-4 font-orbitron text-sm uppercase tracking-widest text-primary">
              Browser caveat
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The browser may still cap visible animation delivery below the panel&apos;s rating depending on power
              mode, background tabs, GPU scheduling, or system-level sync behavior. Treat this as a practical
              confirmation tool, not a replacement for GPU driver telemetry.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
