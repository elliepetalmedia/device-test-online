import React, { useMemo, useState } from "react";
import { AlertTriangle, MousePointer2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { testStore } from "@/lib/store";

interface ClickSample {
  timestamp: number;
  delta: number | null;
}

const FAULT_THRESHOLD_MS = 120;

export function DoubleClickTest() {
  const [samples, setSamples] = useState<ClickSample[]>([]);
  const [faultCount, setFaultCount] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);

  const suspiciousSamples = useMemo(
    () => samples.filter((sample) => sample.delta !== null && sample.delta <= FAULT_THRESHOLD_MS),
    [samples],
  );

  const averageInterval = useMemo(() => {
    const deltas = samples
      .map((sample) => sample.delta)
      .filter((delta): delta is number => typeof delta === "number");

    if (deltas.length === 0) {
      return null;
    }

    return Math.round(deltas.reduce((sum, value) => sum + value, 0) / deltas.length);
  }, [samples]);

  const registerClick = () => {
    const now = performance.now();
    const delta = lastTimestamp === null ? null : Math.round(now - lastTimestamp);
    const nextSamples = [{ timestamp: now, delta }, ...samples].slice(0, 12);
    const nextAverage =
      nextSamples
        .map((sample) => sample.delta)
        .filter((value): value is number => typeof value === "number")
        .reduce((sum, value, _, values) => sum + value / values.length, 0) || null;

    setSamples(nextSamples);
    setLastTimestamp(now);

    if (delta !== null && delta <= FAULT_THRESHOLD_MS) {
      const nextFaultCount = faultCount + 1;
      setFaultCount(nextFaultCount);
      testStore.addResult("double-click", "failed", {
        faultThresholdMs: FAULT_THRESHOLD_MS,
        suspiciousBursts: nextFaultCount,
      });
      return;
    }

    testStore.addResult("double-click", "tested", {
      sampleCount: nextSamples.length,
      averageIntervalMs: nextAverage ?? "N/A",
    });
  };

  const reset = () => {
    setSamples([]);
    setFaultCount(0);
    setLastTimestamp(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card className="border-secondary/30 bg-surface p-8">
            <div className="mb-6 space-y-2 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <MousePointer2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-orbitron text-2xl uppercase tracking-widest text-primary">
                Click the target normally
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Repeated suspicious intervals under {FAULT_THRESHOLD_MS}ms are treated as likely switch bounce rather
                than normal human double-click timing.
              </p>
            </div>

            <button
              type="button"
              onClick={registerClick}
              className="flex h-[320px] w-full items-center justify-center rounded-xl border border-primary/20 bg-black/40 text-center transition-colors hover:bg-primary/5"
            >
              <div className="space-y-3">
                <div className="font-orbitron text-4xl text-white">Click Here</div>
                <div className="text-sm text-muted-foreground">
                  Use your normal left-click rhythm and watch for suspiciously short intervals.
                </div>
              </div>
            </button>
          </Card>

          {faultCount > 0 ? (
            <Card className="border-destructive/40 bg-destructive/10 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <div className="space-y-2">
                  <h4 className="font-orbitron text-sm uppercase tracking-[0.2em] text-white">
                    Possible Switch Bounce Detected
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    This page recorded {faultCount} suspicious interval{faultCount === 1 ? "" : "s"} under{" "}
                    {FAULT_THRESHOLD_MS}ms. If the pattern repeats on another machine, the mouse switch is likely
                    wearing out.
                  </p>
                </div>
              </div>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card className="border-secondary/30 bg-surface p-6">
            <h4 className="mb-4 font-orbitron text-sm uppercase tracking-widest text-primary">
              Live Snapshot
            </h4>
            <div className="space-y-4 text-sm">
              <div className="rounded border border-secondary/20 bg-background/40 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Suspicious Bursts
                </div>
                <div className="mt-2 font-orbitron text-4xl text-destructive">{faultCount}</div>
              </div>
              <div className="rounded border border-secondary/20 bg-background/40 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Average Interval
                </div>
                <div className="mt-2 font-orbitron text-4xl text-primary">
                  {averageInterval ?? "--"}
                  <span className="text-lg text-muted-foreground">ms</span>
                </div>
              </div>
            </div>
            <Button
              onClick={reset}
              variant="ghost"
              className="mt-4 w-full font-orbitron text-muted-foreground hover:text-white"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Sample Log
            </Button>
          </Card>

          <Card className="border-secondary/30 bg-surface p-6">
            <h4 className="mb-4 font-orbitron text-sm uppercase tracking-widest text-primary">
              Recent Intervals
            </h4>
            <div className="space-y-2">
              {samples.length === 0 ? (
                <div className="rounded border border-dashed border-secondary/20 py-6 text-center text-sm text-muted-foreground">
                  No clicks recorded yet.
                </div>
              ) : (
                samples.map((sample, index) => (
                  <div
                    key={`${sample.timestamp}-${index}`}
                    className="flex items-center justify-between rounded border border-secondary/20 bg-background/40 p-3"
                  >
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Sample {samples.length - index}
                    </span>
                    <span
                      className={
                        sample.delta !== null && sample.delta <= FAULT_THRESHOLD_MS
                          ? "font-orbitron text-destructive"
                          : "font-orbitron text-white"
                      }
                    >
                      {sample.delta === null ? "Start" : `${sample.delta}ms`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
