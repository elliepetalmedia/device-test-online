import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Crosshair,
  Gamepad2,
  Play,
  RefreshCw,
} from "lucide-react";

import { DiagnosticStatusCard } from "@/components/DiagnosticStatusCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createDiagnosticStatus,
  getGamepadPreflightStatus,
  getGamepadVibrationNotes,
  supportsGamepadApi,
  type DiagnosticStatus,
} from "@/lib/diagnosticStatus";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { testStore } from "@/lib/store";

interface GamepadState {
  id: string;
  index: number;
  buttons: readonly GamepadButton[];
  axes: readonly number[];
  connected: boolean;
  timestamp: number;
}

type TestState = "IDLE" | "AGITATE" | "SETTLE" | "SAMPLING" | "RESULT";

interface DriftSample {
  x: number;
  y: number;
}

interface AxisResult {
  avg: number;
  jitter: number;
  drift: number;
}

interface StickResult {
  x: AxisResult;
  y: AxisResult;
  driftPercentage: number;
  passed: boolean;
}

interface DriftTestOverlayProps {
  gamepad: GamepadState;
  testState: TestState;
  countdown: number;
  results: Record<number, StickResult>;
  onStartTest: (index: number) => void;
  onResetTest: () => void;
}

const DriftTestOverlay = ({
  gamepad,
  testState,
  countdown,
  results,
  onStartTest,
  onResetTest,
}: DriftTestOverlayProps) => {
  if (testState === "IDLE") {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 p-8 text-center backdrop-blur-sm">
        <Crosshair className="mb-4 h-16 w-16 text-primary opacity-50" />
        <h3 className="mb-2 text-2xl font-orbitron font-bold text-white">Drift Analysis Protocol</h3>
        <p className="mb-6 max-w-md font-mono text-sm text-muted-foreground">
          This test measures the resting position and signal noise of both analog sticks to detect stick drift.
        </p>
        <Button
          onClick={() => onStartTest(gamepad.index)}
          className="pointer-events-auto relative z-30 bg-primary font-orbitron tracking-widest text-black hover:bg-primary/80"
        >
          <Play className="mr-2 h-4 w-4" /> Begin Test Sequence
        </Button>
      </div>
    );
  }

  if (testState === "AGITATE") {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-primary/10 p-8 text-center backdrop-blur-sm animate-in fade-in">
        <Activity className="mb-4 h-16 w-16 animate-bounce text-primary" />
        <h3 className="mb-2 text-3xl font-orbitron font-bold text-primary">Agitate Sticks</h3>
        <p className="text-lg font-bold text-white">Rotate both sticks in circles vigorously.</p>
        <p className="mt-2 text-sm text-muted-foreground">Warming up sensors...</p>
      </div>
    );
  }

  if (testState === "SETTLE") {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 p-8 text-center">
        <div className="mb-4 text-8xl font-orbitron font-black text-white animate-pulse">{countdown}</div>
        <h3 className="mb-2 text-2xl font-orbitron font-bold text-neon-red">Release Sticks Now</h3>
        <p className="text-muted-foreground">Do not touch the controller.</p>
      </div>
    );
  }

  if (testState === "SAMPLING") {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 p-8 text-center">
        <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <h3 className="font-orbitron text-xl font-bold tracking-widest text-white">Sampling Sensor Data</h3>
        <p className="mt-2 font-mono text-primary">Recording micro-movements...</p>
      </div>
    );
  }

  if (testState === "RESULT") {
    const leftStick = results[0];
    const rightStick = results[1];

    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 p-4 animate-in zoom-in-95 md:p-8">
        <h3 className="mb-6 flex items-center gap-2 text-xl font-orbitron font-bold text-white">
          <CheckCircle2 className="text-primary" /> Analysis Complete
        </h3>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
          {[{ label: "Left Stick", result: leftStick }, { label: "Right Stick", result: rightStick }].map(
            ({ label, result }) => (
              <div
                key={label}
                className={cn(
                  "rounded border p-4",
                  result?.passed ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5",
                )}
              >
                <h4 className="mb-4 text-sm font-orbitron uppercase text-muted-foreground">{label}</h4>
                <div className="mb-4 flex items-center gap-4">
                  <div className="relative h-24 w-24 rounded-full border border-white/10 bg-black">
                    <div className="absolute inset-0 m-auto h-1/2 w-1/2 rounded-full border border-green-500/30 bg-green-500/5" />
                    <div className="absolute inset-0 m-auto h-1 w-1 rounded-full bg-white/20" />
                    {result ? (
                      <div
                        className={cn(
                          "absolute h-2 w-2 rounded-full shadow-[0_0_10px]",
                          result.passed ? "bg-green-500 shadow-green-500" : "bg-red-500 shadow-red-500",
                        )}
                        style={{
                          left: `calc(50% + ${result.x.avg * 50}%)`,
                          top: `calc(50% + ${result.y.avg * 50}%)`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ) : null}
                  </div>

                  <div>
                    <div className="mb-1 text-2xl font-orbitron font-bold">{result?.driftPercentage.toFixed(1)}%</div>
                    <div
                      className={cn(
                        "inline-block rounded px-2 py-0.5 text-xs font-bold uppercase",
                        result?.passed ? "bg-green-500 text-black" : "bg-red-500 text-white",
                      )}
                    >
                      {result?.passed ? "Pass" : "Fail"}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-mono text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Jitter X:</span>
                    <span>{result?.x.jitter.toFixed(5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jitter Y:</span>
                    <span>{result?.y.jitter.toFixed(5)}</span>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={onResetTest} className="pointer-events-auto relative z-30 border-white/20 hover:bg-white/10">
            Close
          </Button>
          <Button onClick={() => onStartTest(gamepad.index)} className="pointer-events-auto relative z-30 bg-primary text-black hover:bg-primary/80">
            <RefreshCw className="mr-2 h-4 w-4" /> Retest
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export function GamepadTest() {
  const [gamepads, setGamepads] = useState<Record<number, GamepadState>>({});
  const [status, setStatus] = useState<DiagnosticStatus>(() => getGamepadPreflightStatus(false));
  const [selectedLayout, setSelectedLayout] = useState<"generic" | "xbox" | "playstation">("generic");
  const [activeTestIndex, setActiveTestIndex] = useState<number | null>(null);
  const [testState, setTestState] = useState<TestState>("IDLE");
  const [countdown, setCountdown] = useState(3);
  const [results, setResults] = useState<Record<number, StickResult>>({});

  const { toast } = useToast();
  const samplesRef = useRef<Record<number, DriftSample[]>>({});
  const requestRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const countdownIntervalRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const activeTestIndexRef = useRef<number | null>(null);
  const testStateRef = useRef<TestState>("IDLE");
  const sequenceRef = useRef(0);
  const mountedRef = useRef(true);

  const hasGamepads = Object.keys(gamepads).length > 0;
  const primaryGamepad = useMemo(() => Object.values(gamepads)[0] ?? null, [gamepads]);

  const clearSequenceTimers = () => {
    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };

  const resetDriftTest = () => {
    sequenceRef.current += 1;
    clearSequenceTimers();
    samplesRef.current = {};
    frameCountRef.current = 0;
    setCountdown(3);
    setResults({});
    setActiveTestIndex(null);
    setTestState("IDLE");
  };

  const calculateResults = () => {
    const nextResults: Record<number, StickResult> = {};

    [0, 1].forEach((stickIndex) => {
      const stickSamples = samplesRef.current[stickIndex];
      if (!stickSamples || stickSamples.length === 0) {
        return;
      }

      const sumX = stickSamples.reduce((total, sample) => total + sample.x, 0);
      const sumY = stickSamples.reduce((total, sample) => total + sample.y, 0);
      const avgX = sumX / stickSamples.length;
      const avgY = sumY / stickSamples.length;
      const varianceX =
        stickSamples.reduce((total, sample) => total + Math.pow(sample.x - avgX, 2), 0) / stickSamples.length;
      const varianceY =
        stickSamples.reduce((total, sample) => total + Math.pow(sample.y - avgY, 2), 0) / stickSamples.length;
      const driftDistance = Math.sqrt(Math.pow(avgX, 2) + Math.pow(avgY, 2));

      nextResults[stickIndex] = {
        x: { avg: avgX, jitter: Math.sqrt(varianceX), drift: avgX },
        y: { avg: avgY, jitter: Math.sqrt(varianceY), drift: avgY },
        driftPercentage: driftDistance * 100,
        passed: driftDistance < 0.05,
      };
    });

    setResults(nextResults);
    const anyFailed = Object.values(nextResults).some((result) => !result.passed);
    testStore.addResult("gamepad", anyFailed ? "failed" : "passed", {
      driftTest: anyFailed ? "Drift Detected" : "Passed Deadzone Check",
    });
  };

  const collectSamples = (gamepad: GamepadState) => {
    [0, 1].forEach((stickIndex) => {
      const xIndex = stickIndex * 2;
      const yIndex = stickIndex * 2 + 1;

      if (xIndex < gamepad.axes.length && yIndex < gamepad.axes.length) {
        const sample: DriftSample = {
          x: gamepad.axes[xIndex],
          y: gamepad.axes[yIndex],
        };

        if (!samplesRef.current[stickIndex]) {
          samplesRef.current[stickIndex] = [];
        }

        samplesRef.current[stickIndex].push(sample);
      }
    });

    frameCountRef.current += 1;
    if (frameCountRef.current >= 60) {
      calculateResults();
      setTestState("RESULT");
    }
  };

  const startDriftTest = (gamepadIndex: number) => {
    if (!supportsGamepadApi()) {
      return;
    }

    const currentSequence = sequenceRef.current + 1;
    sequenceRef.current = currentSequence;
    clearSequenceTimers();
    samplesRef.current = {};
    frameCountRef.current = 0;
    setResults({});
    setActiveTestIndex(gamepadIndex);
    setTestState("AGITATE");
    setCountdown(3);

    const settleTimeout = window.setTimeout(() => {
      if (!mountedRef.current || sequenceRef.current !== currentSequence) {
        return;
      }

      setTestState("SETTLE");
      setCountdown(3);
      countdownIntervalRef.current = window.setInterval(() => {
        setCountdown((previous) => {
          if (previous <= 1) {
            if (countdownIntervalRef.current !== null) {
              window.clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            return 0;
          }

          return previous - 1;
        });
      }, 1000);
    }, 3000);

    const sampleTimeout = window.setTimeout(() => {
      if (!mountedRef.current || sequenceRef.current !== currentSequence) {
        return;
      }

      setTestState("SAMPLING");
    }, 6000);

    timeoutsRef.current.push(settleTimeout, sampleTimeout);
  };

  useEffect(() => {
    activeTestIndexRef.current = activeTestIndex;
  }, [activeTestIndex]);

  useEffect(() => {
    testStateRef.current = testState;
  }, [testState]);

  useEffect(() => {
    if (!supportsGamepadApi()) {
      setStatus(getGamepadPreflightStatus(false));
      return;
    }

    if (!hasGamepads) {
      setStatus(getGamepadPreflightStatus(false));
      return;
    }

    if (testState === "IDLE" || testState === "RESULT") {
      setStatus(getGamepadPreflightStatus(true));
      return;
    }

    setStatus(
      createDiagnosticStatus(
        "active",
        "Controller Test Active",
        "The controller is connected and the drift analysis sequence is currently running.",
        {
          notes: ["Keep the browser tab focused and avoid disconnecting the controller mid-test."],
        },
      ),
    );
  }, [hasGamepads, testState]);

  useEffect(() => {
    if (!supportsGamepadApi()) {
      return;
    }

    mountedRef.current = true;

    const scanGamepads = () => {
      const connectedGamepads = navigator.getGamepads();
      const nextGamepads: Record<number, GamepadState> = {};

      for (const gamepad of connectedGamepads) {
        if (!gamepad) {
          continue;
        }

        const mappedGamepad: GamepadState = {
          id: gamepad.id,
          index: gamepad.index,
          buttons: gamepad.buttons,
          axes: gamepad.axes,
          connected: gamepad.connected,
          timestamp: gamepad.timestamp,
        };

        nextGamepads[gamepad.index] = mappedGamepad;

        if (activeTestIndexRef.current === gamepad.index && testStateRef.current === "SAMPLING") {
          collectSamples(mappedGamepad);
        }
      }

      if (mountedRef.current) {
        setGamepads(nextGamepads);
        requestRef.current = requestAnimationFrame(scanGamepads);
      }
    };

    const handleConnected = (event: GamepadEvent) => {
      testStore.addResult("gamepad", "tested", { controller: event.gamepad.id });
    };

    const handleDisconnected = (event: GamepadEvent) => {
      if (activeTestIndexRef.current === event.gamepad.index) {
        resetDriftTest();
      }
    };

    window.addEventListener("gamepadconnected", handleConnected);
    window.addEventListener("gamepaddisconnected", handleDisconnected);
    requestRef.current = requestAnimationFrame(scanGamepads);

    return () => {
      mountedRef.current = false;
      clearSequenceTimers();
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      window.removeEventListener("gamepadconnected", handleConnected);
      window.removeEventListener("gamepaddisconnected", handleDisconnected);
    };
  }, []);

  const renderLayoutButtons = (gamepad?: GamepadState) => {
    const buttons =
      gamepad?.buttons ?? Array.from({ length: 16 }).map(() => ({ pressed: false, value: 0 } as GamepadButton));

    const getLabel = (index: number) => {
      if (selectedLayout === "xbox") {
        const labels = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "Back", "Start", "LS", "RS", "Up", "Down", "Left", "Right"];
        return labels[index] || index.toString();
      }

      if (selectedLayout === "playstation") {
        const labels = ["Cross", "Circle", "Square", "Triangle", "L1", "R1", "L2", "R2", "Share", "Options", "L3", "R3", "Up", "Down", "Left", "Right"];
        return labels[index] || index.toString();
      }

      return index.toString();
    };

    return (
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {buttons.map((button, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square rounded border p-3 transition-all duration-75 flex flex-col items-center justify-center",
              button.pressed
                ? "scale-95 border-primary bg-primary text-black shadow-[0_0_15px_rgba(102,252,241,0.5)]"
                : "border-white/10 bg-black/40 text-muted-foreground",
            )}
          >
            <span className="mb-1 text-center text-sm font-orbitron font-bold leading-tight sm:text-lg">{getLabel(index)}</span>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/50">
              <div className="h-full bg-current transition-none" style={{ width: `${button.value * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLayoutAxes = (gamepad?: GamepadState) => {
    const axes = gamepad?.axes ?? [0, 0, 0, 0];

    return (
      <div className="grid gap-6">
        {Array.from({ length: Math.ceil(axes.length / 2) }).map((_, pairIndex) => {
          const xIndex = pairIndex * 2;
          const yIndex = pairIndex * 2 + 1;
          const xValue = axes[xIndex] || 0;
          const yValue = axes[yIndex] || 0;
          const hasY = yIndex < axes.length;

          return (
            <div key={pairIndex} className="rounded border border-white/5 bg-black/20 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  Stick {pairIndex + 1} (Axes {xIndex}
                  {hasY ? ` & ${yIndex}` : ""})
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 shrink-0 rounded-full border border-white/20 bg-black/40">
                  <div
                    className="absolute left-1/2 top-1/2 -ml-2 -mt-2 h-4 w-4 rounded-full bg-primary shadow-[0_0_10px_rgba(102,252,241,0.8)] transition-none"
                    style={{
                      transform: `translate(${xValue * 40}px, ${hasY ? yValue * 40 : 0}px)`,
                    }}
                  />
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
                  <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white/10" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>AXIS {xIndex} (X)</span>
                      <span className={cn(Math.abs(xValue) > 0.1 ? "text-primary" : "text-muted-foreground")}>
                        {xValue.toFixed(4)}
                      </span>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-black/50">
                      <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white/20" />
                      <div
                        className="absolute top-0 h-full bg-primary/80 transition-none"
                        style={{
                          left: xValue < 0 ? `${(1 + xValue) * 50}%` : "50%",
                          width: `${Math.abs(xValue) * 50}%`,
                        }}
                      />
                    </div>
                  </div>

                  {hasY ? (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span>AXIS {yIndex} (Y)</span>
                        <span className={cn(Math.abs(yValue) > 0.1 ? "text-primary" : "text-muted-foreground")}>
                          {yValue.toFixed(4)}
                        </span>
                      </div>
                      <div className="relative h-2 overflow-hidden rounded-full bg-black/50">
                        <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white/20" />
                        <div
                          className="absolute top-0 h-full bg-primary/80 transition-none"
                          style={{
                            left: yValue < 0 ? `${(1 + yValue) * 50}%` : "50%",
                            width: `${Math.abs(yValue) * 50}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const testVibration = async (gamepad: GamepadState) => {
    const liveGamepad = navigator.getGamepads()[gamepad.index];

    if (!liveGamepad) {
      toast({
        variant: "destructive",
        title: "Controller Not Found",
        description: "Could not find the gamepad instance. Try reconnecting it and press a button to wake it up.",
      });
      return;
    }

    const vibrationCapableGamepad = liveGamepad as Gamepad & {
      vibrationActuator?: {
        playEffect?: (
          type: string,
          options: {
            startDelay: number;
            duration: number;
            weakMagnitude: number;
            strongMagnitude: number;
          },
        ) => Promise<void>;
      };
      hapticActuators?: Array<{ pulse?: (value: number, duration: number) => Promise<void> }>;
    };

    if (vibrationCapableGamepad.vibrationActuator?.playEffect) {
      try {
        await vibrationCapableGamepad.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 1000,
          weakMagnitude: 1,
          strongMagnitude: 1,
        });
        toast({
          title: "Vibration Sent",
          description: "Sent a dual-rumble command to the connected controller.",
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown vibration error.";
        toast({
          variant: "destructive",
          title: "Vibration Failed",
          description: message,
        });
      }
      return;
    }

    if (vibrationCapableGamepad.hapticActuators?.[0]?.pulse) {
      try {
        await vibrationCapableGamepad.hapticActuators[0].pulse(1, 1000);
        toast({
          title: "Vibration Sent",
          description: "Sent a haptic pulse command to the connected controller.",
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown haptic pulse error.";
        toast({
          variant: "destructive",
          title: "Haptic Pulse Failed",
          description: message,
        });
      }
      return;
    }

    toast({
      variant: "destructive",
      title: "Vibration Not Available",
      description: "This browser and controller combination does not expose vibration support.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-black/40 p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-3">
            <Gamepad2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="mb-2 text-xl font-orbitron font-bold text-foreground">Gamepad Diagnostics</h3>
                <p className="text-sm text-muted-foreground">
                  Check live button states, analog axes, drift behavior, and haptic support using the browser Gamepad
                  API.
                </p>
              </div>

              <div className="flex gap-2">
                {[
                  { key: "generic", label: "Generic" },
                  { key: "xbox", label: "Xbox" },
                  { key: "playstation", label: "PlayStation" },
                ].map((layout) => (
                  <button
                    key={layout.key}
                    onClick={() => setSelectedLayout(layout.key as "generic" | "xbox" | "playstation")}
                    className={cn(
                      "rounded border px-3 py-1.5 text-xs font-bold transition-colors",
                      selectedLayout === layout.key
                        ? layout.key === "xbox"
                          ? "border-green-500 bg-green-600 text-white"
                          : layout.key === "playstation"
                            ? "border-blue-500 bg-blue-600 text-white"
                            : "border-primary bg-primary text-black"
                        : "border-white/10 bg-black/20 text-muted-foreground hover:border-white/20",
                    )}
                  >
                    {layout.label.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <DiagnosticStatusCard status={status} className="bg-black/20" />
          </div>
        </div>
      </Card>

      {hasGamepads ? (
        Object.values(gamepads).map((gamepad) => (
          <Card
            key={gamepad.index}
            className="group relative overflow-hidden border-primary/20 bg-black/40 p-6 backdrop-blur-sm"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="mb-6 border-b border-white/10 pb-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div>
                    <h4 className="max-w-md truncate font-orbitron text-lg text-primary" title={gamepad.id}>
                      {gamepad.id}
                    </h4>
                    <div className="mt-2 text-xs font-mono text-muted-foreground">
                      Index: {gamepad.index} | Buttons: {gamepad.buttons.length} | Axes: {gamepad.axes.length}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <button
                      onClick={() => void testVibration(gamepad)}
                      className="rounded border border-primary/50 bg-primary/20 px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/40"
                    >
                      Test Vibration
                    </button>

                    <div className="space-y-1 text-xs font-mono text-muted-foreground/90">
                      {getGamepadVibrationNotes(navigator.getGamepads()[gamepad.index] ?? null).map((note) => (
                        <div key={note}>{note}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded border border-primary bg-primary/20 px-2 py-1 text-xs font-bold uppercase tracking-wider text-primary animate-pulse">
                  Live Input
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <h5 className="border-l-2 border-primary pl-3 font-orbitron text-sm uppercase tracking-widest text-muted-foreground">
                      Button State
                    </h5>
                    {renderLayoutButtons(gamepad)}
                  </div>

                  <div className="space-y-4">
                    <h5 className="border-l-2 border-secondary pl-3 font-orbitron text-sm uppercase tracking-widest text-muted-foreground">
                      Analog Axes
                    </h5>
                    {renderLayoutAxes(gamepad)}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <Card className="relative flex min-h-[500px] h-full flex-col overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
                    <div>
                      <h4 className="font-orbitron text-base text-white">Drift Analysis</h4>
                      <p className="text-xs font-mono text-muted-foreground">Statistical sensor check</p>
                    </div>
                  </div>

                  <div className="relative flex-1 bg-black/50">
                    <DriftTestOverlay
                      gamepad={gamepad}
                      testState={activeTestIndex === gamepad.index ? testState : "IDLE"}
                      countdown={countdown}
                      results={results}
                      onStartTest={startDriftTest}
                      onResetTest={resetDriftTest}
                    />
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Card className="border-white/10 bg-black/40 p-6 backdrop-blur-sm opacity-60">
          <div className="mb-6 border-b border-white/10 pb-4">
            <div>
              <h4 className="font-orbitron text-lg text-muted-foreground">Device Test Preview</h4>
              <div className="mt-1 text-xs font-mono text-muted-foreground">Waiting for controller input...</div>
            </div>
          </div>

          <div className="pointer-events-none grid grid-cols-1 gap-6 grayscale lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h5 className="border-l-2 border-white/20 pl-3 font-orbitron text-sm uppercase tracking-widest text-muted-foreground">
                    Button State
                  </h5>
                  {renderLayoutButtons()}
                </div>

                <div className="space-y-4">
                  <h5 className="border-l-2 border-white/20 pl-3 font-orbitron text-sm uppercase tracking-widest text-muted-foreground">
                    Analog Axes
                  </h5>
                  {renderLayoutAxes()}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Card className="relative flex min-h-[500px] h-full flex-col overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
                  <div>
                    <h4 className="font-orbitron text-base text-white">Drift Analysis</h4>
                    <p className="text-xs font-mono text-muted-foreground">Statistical sensor check</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center bg-black/50 p-8 text-center">
                  <Crosshair className="mb-4 h-16 w-16 text-muted-foreground opacity-30" />
                  <h3 className="mb-2 text-2xl font-orbitron font-bold text-muted-foreground">Drift Analysis Protocol</h3>
                  <p className="mb-6 max-w-md font-mono text-sm text-muted-foreground opacity-50">
                    Connect a controller to enable the live visualizer and drift analysis sequence.
                  </p>
                  <Button disabled className="bg-white/10 font-orbitron tracking-widest text-muted-foreground">
                    <Play className="mr-2 h-4 w-4" /> Begin Test Sequence
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
