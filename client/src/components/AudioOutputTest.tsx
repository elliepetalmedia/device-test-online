import React, { useRef, useState } from "react";
import { Download, Headphones, Play, RotateCcw, Volume2 } from "lucide-react";

import { ChecklistExportCard } from "@/components/ChecklistExportCard";
import { DiagnosticStatusCard } from "@/components/DiagnosticStatusCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createDiagnosticStatus,
  supportsWebAudio,
  type DiagnosticStatus,
} from "@/lib/diagnosticStatus";
import { testStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

type AudioOutputTool = "speaker" | "headphone";
type ChannelMode = "left" | "right" | "center" | "alternate";

const toolCopy: Record<
  AudioOutputTool,
  {
    title: string;
    intro: string;
    summaryName: string;
  }
> = {
  speaker: {
    title: "Speaker Output Test",
    intro:
      "Play left, right, and centered tones to confirm browser audio output and basic channel routing for speakers or monitor audio.",
    summaryName: "Speaker Output",
  },
  headphone: {
    title: "Headphone Stereo Test",
    intro:
      "Play isolated left and right tones to verify ear-channel routing, stereo balance, and basic output clarity for headsets or earbuds.",
    summaryName: "Headphone Stereo",
  },
};

export function AudioOutputTest({ tool }: { tool: AudioOutputTool }) {
  const [status, setStatus] = useState<DiagnosticStatus>(() =>
    supportsWebAudio()
      ? createDiagnosticStatus(
          "ready",
          `${toolCopy[tool].title} Ready`,
          "Use the playback controls below to confirm left, right, center, and alternating playback on your current audio device.",
          { actionLabel: "Play Center Tone" },
        )
      : createDiagnosticStatus(
          "unsupported",
          "Audio Output Test Unavailable",
          "This browser does not expose the Web Audio APIs required for the output test.",
          {
            notes: ["Try a recent version of Chrome, Edge, Safari, or Firefox."],
          },
        ),
  );
  const [lastAction, setLastAction] = useState<string>("No playback yet");
  const [playCount, setPlayCount] = useState(0);
  const [successfulChannels, setSuccessfulChannels] = useState<Set<ChannelMode>>(
    new Set(),
  );

  const audioContextRef = useRef<AudioContext | null>(null);
  const sequenceTimeoutsRef = useRef<number[]>([]);
  const { toast } = useToast();

  const stopSequence = () => {
    sequenceTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    sequenceTimeoutsRef.current = [];
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
      throw new Error("Audio playback remained suspended.");
    }

    return audioContextRef.current;
  };

  const markSuccess = (mode: ChannelMode, label: string) => {
    setLastAction(label);
    setPlayCount((previous) => previous + 1);
    setSuccessfulChannels((previous) => {
      const next = new Set(previous);
      next.add(mode);
      testStore.addResult(tool, "tested", {
        profile: toolCopy[tool].summaryName,
        lastAction: label,
        channelsVerified: next.size,
      });
      return next;
    });
    setStatus(
      createDiagnosticStatus(
        "active",
        "Playback Triggered",
        "Listen for the selected output pattern. If you hear nothing, confirm browser volume and output-device routing before trying again.",
      ),
    );
  };

  const playTone = async (mode: Exclude<ChannelMode, "alternate">) => {
    stopSequence();

    try {
      const context = await ensureAudioContextReady();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      const panner =
        typeof StereoPannerNode !== "undefined"
          ? new StereoPannerNode(context, {
              pan: mode === "left" ? -1 : mode === "right" ? 1 : 0,
            })
          : null;

      oscillator.type = "sine";
      oscillator.frequency.value = tool === "speaker" ? 660 : 880;
      gainNode.gain.setValueAtTime(0.0001, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.45);

      oscillator.connect(gainNode);
      if (panner) {
        gainNode.connect(panner);
        panner.connect(context.destination);
      } else {
        gainNode.connect(context.destination);
      }

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.45);

      markSuccess(
        mode,
        mode === "center"
          ? "Centered playback"
          : `${mode === "left" ? "Left" : "Right"} channel playback`,
      );
    } catch (error) {
      console.error("Audio output playback error:", error);
      setStatus(
        createDiagnosticStatus(
          "failed",
          "Playback Blocked",
          "The browser did not allow audio playback to start. Interact with the page, confirm audible volume, and try again.",
          {
            notes: ["Bluetooth output paths may also need a moment to reconnect after sleep or device switching."],
          },
        ),
      );
    }
  };

  const playAlternating = async () => {
    stopSequence();

    try {
      await ensureAudioContextReady();
      markSuccess("alternate", "Alternating left/right playback");
      void playTone("left");
      sequenceTimeoutsRef.current.push(
        window.setTimeout(() => {
          void playTone("right");
        }, 650),
      );
      sequenceTimeoutsRef.current.push(
        window.setTimeout(() => {
          toast({
            title: "Alternating Playback Complete",
            description: "If the channels felt swapped, move to the troubleshooting guide below.",
          });
        }, 1350),
      );
    } catch (error) {
      console.error("Alternating playback error:", error);
      setStatus(
        createDiagnosticStatus(
          "failed",
          "Playback Blocked",
          "The browser did not allow the alternating tone sequence to start.",
        ),
      );
    }
  };

  const resetState = async () => {
    stopSequence();
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      await audioContextRef.current.close();
    }
    audioContextRef.current = null;
    setLastAction("No playback yet");
    setPlayCount(0);
    setSuccessfulChannels(new Set());
    setStatus(
      supportsWebAudio()
        ? createDiagnosticStatus(
            "ready",
            `${toolCopy[tool].title} Ready`,
            "Use the playback controls below to confirm left, right, center, and alternating playback on your current audio device.",
            { actionLabel: "Play Center Tone" },
          )
        : createDiagnosticStatus(
            "unsupported",
            "Audio Output Test Unavailable",
            "This browser does not expose the Web Audio APIs required for the output test.",
          ),
    );
  };

  const downloadSummary = () => {
    const lines = [
      `Device Test Online - ${toolCopy[tool].summaryName} Summary`,
      `Generated: ${new Date().toLocaleString()}`,
      `Last playback: ${lastAction}`,
      `Playback actions triggered: ${playCount}`,
      `Channels verified: ${successfulChannels.size}`,
      "",
      "Recommended next checks:",
      tool === "speaker"
        ? "- Run the microphone and webcam tests before your next call."
        : "- Run the audio sync test if your headset works but sounds delayed.",
      "",
      "Generated at https://devicetesteronline.com",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `device-test-online-${tool}-summary.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const Icon = tool === "speaker" ? Volume2 : Headphones;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-1">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary">
              <Icon className="h-7 w-7" />
              <h3 className="font-orbitron text-2xl uppercase tracking-widest">
                {toolCopy[tool].title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {toolCopy[tool].intro}
            </p>
          </div>

          <DiagnosticStatusCard status={status} className="bg-surface/70" />

          <Card className="border-secondary/30 bg-surface p-5">
            <h4 className="mb-4 font-orbitron text-sm uppercase tracking-widest text-primary">
              Playback Actions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => void playTone("left")} className="font-orbitron">
                <Play className="mr-2 h-4 w-4" />
                Left
              </Button>
              <Button onClick={() => void playTone("right")} className="font-orbitron">
                <Play className="mr-2 h-4 w-4" />
                Right
              </Button>
              <Button
                onClick={() => void playTone("center")}
                variant="outline"
                className="border-primary/40 font-orbitron text-primary hover:bg-primary/10"
              >
                <Play className="mr-2 h-4 w-4" />
                Center
              </Button>
              <Button
                onClick={() => void playAlternating()}
                variant="outline"
                className="border-primary/40 font-orbitron text-primary hover:bg-primary/10"
              >
                <Play className="mr-2 h-4 w-4" />
                Alternate
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <Card className="border-secondary/30 bg-black/40 p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded border border-secondary/20 bg-background/40 p-5 text-center">
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Last Playback
                </div>
                <div className="font-orbitron text-xl text-primary">{lastAction}</div>
              </div>
              <div className="rounded border border-secondary/20 bg-background/40 p-5 text-center">
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Actions Triggered
                </div>
                <div className="font-orbitron text-4xl text-white">{playCount}</div>
              </div>
              <div className="rounded border border-secondary/20 bg-background/40 p-5 text-center">
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Channels Verified
                </div>
                <div className="font-orbitron text-4xl text-primary">
                  {successfulChannels.size}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded border border-primary/20 bg-primary/5 p-5">
              <h4 className="mb-2 font-orbitron text-sm uppercase tracking-widest text-primary">
                What to listen for
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Left-only and right-only playback should be obvious on the selected output path. If the wrong side
                plays, channels are swapped. If nothing plays, confirm the browser tab volume, system output selection,
                and whether Bluetooth or monitor audio switched devices in the background.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={downloadSummary}
                variant="outline"
                className="border-primary/40 font-orbitron text-primary hover:bg-primary/10"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Summary
              </Button>
              <Button
                onClick={() => void resetState()}
                variant="ghost"
                className="font-orbitron text-muted-foreground hover:text-white"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Output Test
              </Button>
            </div>
          </Card>

          <ChecklistExportCard
            title="Call Setup Checklist Export"
            description="Export a quick pre-call checklist after you confirm audio output here and continue through microphone and webcam tests."
          />
        </div>
      </div>
    </div>
  );
}
