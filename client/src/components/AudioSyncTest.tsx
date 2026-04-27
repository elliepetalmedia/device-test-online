import React, { useEffect, useRef, useState } from "react";
import { Activity, Play, RefreshCcw, Volume2 } from "lucide-react";

import { DiagnosticStatusCard } from "@/components/DiagnosticStatusCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createDiagnosticStatus,
  getAudioSyncPreflightStatus,
  type DiagnosticStatus,
} from "@/lib/diagnosticStatus";
import { cn } from "@/lib/utils";
import { testStore } from "@/lib/store";

interface TestSample {
  delay: number;
}

type AudioSyncState = "IDLE" | "WAITING" | "FLASHING" | "RESULT";

export function AudioSyncTest() {
  const [status, setStatus] = useState<DiagnosticStatus>(getAudioSyncPreflightStatus);
  const [testState, setTestState] = useState<AudioSyncState>("IDLE");
  const [samples, setSamples] = useState<TestSample[]>([]);
  const [currentDelay, setCurrentDelay] = useState<number | null>(null);
  const [averageDelay, setAverageDelay] = useState<number | null>(null);
  const [falseStarts, setFalseStarts] = useState(0);

  const flashTimeRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const runIdRef = useRef(0);
  const mountedRef = useRef(true);

  const clearPendingTimeout = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const closeAudioContext = async () => {
    if (audioContextRef.current) {
      const context = audioContextRef.current;
      audioContextRef.current = null;
      if (context.state !== "closed") {
        await context.close();
      }
    }
  };

  const ensureAudioContextReady = async () => {
    const AudioContextCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) {
      throw new Error("Web Audio is not supported in this browser.");
    }

    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new AudioContextCtor();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (audioContextRef.current.state === "suspended") {
      throw new Error("AudioContext remained suspended after resume.");
    }

    return audioContextRef.current;
  };

  const playBeep = async () => {
    const audioContext = await ensureAudioContextReady();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const scheduleNextRound = (runId: number) => {
    clearPendingTimeout();
    setTestState("WAITING");
    setStatus(
      createDiagnosticStatus(
        "active",
        "Latency Test Active",
        "Wait for the synchronized flash and beep, then click as quickly as possible.",
      ),
    );

    const waitTime = 2000 + Math.random() * 3000;
    timeoutRef.current = window.setTimeout(async () => {
      if (!mountedRef.current || runIdRef.current !== runId) {
        return;
      }

      try {
        setTestState("FLASHING");
        flashTimeRef.current = performance.now();
        await playBeep();
      } catch (error) {
        console.error("Audio sync beep error:", error);
        setTestState("IDLE");
        setStatus(
          createDiagnosticStatus(
            "failed",
            "Audio Start Blocked",
            "The browser did not allow the timed beep to play. Interact with the page, confirm audible volume, and start the sequence again.",
            {
              notes: ["Safari and mobile browsers may require a fresh tap before each audio session can start."],
            },
          ),
        );
      }
    }, waitTime);
  };

  const startSequence = async () => {
    if (status.state === "unsupported") {
      return;
    }

    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    clearPendingTimeout();

    try {
      await ensureAudioContextReady();
      scheduleNextRound(runId);
    } catch (error) {
      console.error("Audio preflight error:", error);
      setStatus(
        createDiagnosticStatus(
          "failed",
          "Audio Playback Unavailable",
          "This browser session did not allow audio output to initialize. Check system volume and interact with the page, then try again.",
        ),
      );
    }
  };

  const finishTest = () => {
    runIdRef.current += 1;
    clearPendingTimeout();
    setTestState("IDLE");
    setStatus(getAudioSyncPreflightStatus());
    void closeAudioContext();

    if (samples.length > 0 && averageDelay !== null) {
      testStore.addResult("audio-sync", "tested", {
        latency: `${averageDelay}ms avg`,
        samples: `${samples.length} valid tests`,
        falseStarts,
      });
    }
  };

  const resetStats = () => {
    finishTest();
    setSamples([]);
    setAverageDelay(null);
    setCurrentDelay(null);
    setFalseStarts(0);
  };

  const handleReaction = () => {
    if (testState === "WAITING") {
      clearPendingTimeout();
      setFalseStarts((previous) => previous + 1);
      setTestState("IDLE");
      setStatus(
        createDiagnosticStatus(
          "ready",
          "False Start Recorded",
          "You clicked before the flash and beep. Start the next round when you are ready.",
          {
            actionLabel: "Start Sequence",
          },
        ),
      );
      return;
    }

    if (testState !== "FLASHING") {
      return;
    }

    const reactionTime = performance.now();
    const delay = Math.round(reactionTime - flashTimeRef.current);
    const runId = runIdRef.current;

    setCurrentDelay(delay);
    setSamples((previous) => {
      const nextSamples = [...previous, { delay }].slice(-5);
      const total = nextSamples.reduce((sum, sample) => sum + sample.delay, 0);
      setAverageDelay(Math.round(total / nextSamples.length));
      return nextSamples;
    });
    setTestState("RESULT");
    setStatus(
      createDiagnosticStatus(
        "active",
        "Round Captured",
        "Your reaction time was recorded. The next round will begin automatically unless you stop the test.",
      ),
    );

    clearPendingTimeout();
    timeoutRef.current = window.setTimeout(() => {
      if (!mountedRef.current || runIdRef.current !== runId) {
        return;
      }

      scheduleNextRound(runId);
    }, 1500);
  };

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      runIdRef.current += 1;
      clearPendingTimeout();
      void closeAudioContext();
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="relative overflow-hidden border-secondary/30 p-0 md:col-span-2">
          <button
            onMouseDown={handleReaction}
            className={cn(
              "h-[400px] w-full select-none outline-none transition-colors duration-200 focus:outline-none flex flex-col items-center justify-center",
              testState === "IDLE"
                ? "cursor-pointer bg-black/40 hover:bg-black/30"
                : testState === "WAITING"
                  ? "cursor-pointer bg-red-900/40"
                  : testState === "FLASHING"
                    ? "cursor-pointer bg-white text-black shadow-[0_0_100px_rgba(255,255,255,0.8)_inset]"
                    : "cursor-default bg-green-900/40",
            )}
            disabled={testState === "RESULT"}
          >
            {testState === "IDLE" ? (
              <div className="animate-in zoom-in p-8 text-center fade-in">
                <Volume2 className="mx-auto mb-4 h-16 w-16 text-primary opacity-80" />
                <h3 className="mb-2 text-2xl font-orbitron font-bold uppercase tracking-widest text-white">
                  Audio Latency Test
                </h3>
                <p className="font-mono text-muted-foreground">
                  Make sure your sound is on. Click anywhere to begin.
                </p>
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    void startSequence();
                  }}
                  className="mt-6 bg-primary px-8 py-6 font-orbitron tracking-widest text-black hover:bg-primary/80"
                >
                  <Play className="mr-2 h-5 w-5" /> Start Sequence
                </Button>
              </div>
            ) : null}

            {testState === "WAITING" ? (
              <div className="p-8 text-center">
                <h3 className="mb-2 text-4xl font-orbitron font-bold text-red-500">Wait for the beep...</h3>
                <p className="font-mono text-muted-foreground/80">
                  React as quickly as possible when you hear the sound and see the flash.
                </p>
              </div>
            ) : null}

            {testState === "FLASHING" ? (
              <div className="p-8 text-center">
                <h3 className="text-6xl font-orbitron font-black text-black">Click Now</h3>
              </div>
            ) : null}

            {testState === "RESULT" && currentDelay !== null ? (
              <div className="animate-in zoom-in-95 p-8 text-center duration-200">
                <h3 className="mb-2 text-xl font-orbitron uppercase tracking-widest text-neon-green">Reaction Time</h3>
                <div className="mb-4 text-6xl font-orbitron font-bold text-white">
                  {currentDelay}
                  <span className="text-2xl text-muted-foreground">ms</span>
                </div>
                <p className="font-mono text-muted-foreground">Preparing next round...</p>
              </div>
            ) : null}
          </button>

          {testState !== "IDLE" ? (
            <div className="absolute right-4 top-4 z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  finishTest();
                }}
                className="border-secondary/50 bg-black/50 hover:bg-black/80"
              >
                Stop Test
              </Button>
            </div>
          ) : null}
        </Card>

        <div className="space-y-6">
          <DiagnosticStatusCard
            status={status}
            onAction={testState === "IDLE" && status.state !== "unsupported" ? () => void startSequence() : undefined}
            className="bg-surface/70"
          />

          <Card className="relative overflow-hidden border border-secondary/30 bg-surface p-6">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Activity className="h-16 w-16 text-primary" />
            </div>
            <h4 className="relative z-10 mb-1 font-orbitron text-sm uppercase tracking-widest text-muted-foreground">
              Average Latency
            </h4>
            <div className="glow-text relative z-10 mt-2 text-5xl font-orbitron text-primary">
              {averageDelay !== null ? averageDelay : "--"}
              <span className="text-lg text-muted-foreground">ms</span>
            </div>

            {averageDelay !== null ? (
              <div className="mt-4 text-xs font-mono">
                {averageDelay > 200 ? (
                  <span className="font-bold uppercase text-destructive">High Latency Detected</span>
                ) : averageDelay > 100 ? (
                  <span className="font-bold uppercase text-yellow-500">Moderate Latency</span>
                ) : (
                  <span className="font-bold uppercase text-neon-green">Excellent Connection</span>
                )}
              </div>
            ) : null}
          </Card>

          <Card className="flex h-[280px] flex-col border border-secondary/30 bg-surface p-6">
            <div className="mb-4 flex items-center justify-between border-b border-secondary/20 pb-2">
              <h4 className="font-orbitron text-sm uppercase tracking-widest text-white">Recent Samples</h4>
              <span className="text-xs font-mono text-muted-foreground">{samples.length}/5 cap</span>
            </div>

            <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-2">
              {samples.length === 0 ? (
                <div className="flex h-full items-center justify-center font-mono text-sm text-muted-foreground/50">
                  No data recorded yet
                </div>
              ) : (
                [...samples].reverse().map((sample, index) => (
                  <div
                    key={`${sample.delay}-${index}`}
                    className="flex items-center justify-between rounded border border-white/5 bg-black/40 p-2"
                  >
                    <span className="text-xs font-mono text-muted-foreground">Attempt {samples.length - index}</span>
                    <span className="font-orbitron text-primary">{sample.delay}ms</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-secondary/20 pt-4">
              <div className="text-xs font-mono text-muted-foreground">
                False Starts: <span className={falseStarts > 0 ? "text-destructive" : "text-white"}>{falseStarts}</span>
              </div>
              <Button onClick={resetStats} variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:text-white">
                <RefreshCcw className="mr-1 h-3 w-3" /> Reset
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="rounded-lg border border-secondary/30 bg-surface p-8">
        <h2 className="mb-6 border-b border-secondary/30 pb-4 font-orbitron text-2xl uppercase tracking-widest text-primary">
          Understanding Audio Latency (A/V Sync)
        </h2>
        <div className="space-y-6 font-roboto-mono text-lg leading-relaxed text-muted-foreground">
          <p>
            Audio latency is the time delay between when an audio signal is triggered and when it is actually heard.
            This online audio sync test helps you measure the delay of your Bluetooth headphones, wireless earbuds, or
            gaming speakers.
          </p>

          <div>
            <h3 className="mb-2 text-xl font-orbitron text-white">How this test works</h3>
            <p>
              We generate a sharp audio beep using the Web Audio API alongside an instantaneous visual screen flash.
              Because human reaction to visual stimuli is incredibly fast, any delay in your reaction time compared to
              the flash will expose the audio processing delay in your Bluetooth hardware. By averaging several
              samples, the test reduces human reaction variance and reveals the underlying hardware latency.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-orbitron text-white">What is a Good Latency Score?</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-neon-green">Under 50ms:</strong> Typical for wired headphones. Unnoticeable to
                humans. Ideal for competitive gaming.
              </li>
              <li>
                <strong className="text-primary">50ms - 100ms:</strong> Excellent for wireless. Great for casual
                gaming and watching movies without lip-sync issues.
              </li>
              <li>
                <strong className="text-yellow-500">100ms - 200ms:</strong> Noticeable delay. Acceptable for music,
                but distracting for video and dialogue sync.
              </li>
              <li>
                <strong className="text-destructive">Over 200ms:</strong> High latency. Common with cheaper Bluetooth
                devices or strong interference. Very distracting for gaming or editing.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-orbitron text-white">How to Fix Bluetooth Audio Delay</h3>
            <p>
              If you are experiencing high latency on Windows 11 or macOS, try reducing interference by moving your
              router away from your PC. Also ensure your headphones are connected using the highest quality codec
              available, such as aptX Low Latency or LDAC. Gaming headsets with a dedicated 2.4GHz USB dongle usually
              perform better than standard Bluetooth for latency-sensitive use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
