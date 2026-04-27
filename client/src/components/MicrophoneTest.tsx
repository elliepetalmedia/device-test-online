import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Play, Volume2 } from "lucide-react";

import { DiagnosticStatusCard } from "@/components/DiagnosticStatusCard";
import { Button } from "@/components/ui/button";
import {
  classifyMediaError,
  createDiagnosticStatus,
  getMicrophonePreflightStatus,
  supportsWebAudio,
  type DiagnosticStatus,
} from "@/lib/diagnosticStatus";
import { testStore } from "@/lib/store";

export function MicrophoneTest() {
  const [status, setStatus] = useState<DiagnosticStatus>(getMicrophonePreflightStatus);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(5);
  const [amplitude, setAmplitude] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string>("");
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const sessionRef = useRef(0);
  const mountedRef = useRef(true);

  const clearRecordingArtifact = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = "";
      audioElementRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = "";
    }
  };

  const closeAudioContext = async () => {
    if (audioContextRef.current) {
      const activeContext = audioContextRef.current;
      audioContextRef.current = null;
      if (activeContext.state !== "closed") {
        await activeContext.close();
      }
    }
  };

  const cleanupStream = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const stopRecording = async () => {
    const recorder = mediaRecorderRef.current;
    mediaRecorderRef.current = null;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    cleanupStream();
    setIsRecording(false);
    setAmplitude(0);
    await closeAudioContext();
  };

  const reset = async () => {
    sessionRef.current += 1;
    await stopRecording();
    clearRecordingArtifact();
    chunksRef.current = [];
    setHasRecording(false);
    setRecordingTime(5);
    setStatus(getMicrophonePreflightStatus());
  };

  const startRecording = async () => {
    if (status.state === "unsupported") {
      return;
    }

    const sessionId = sessionRef.current + 1;
    sessionRef.current = sessionId;

    await stopRecording();
    clearRecordingArtifact();
    chunksRef.current = [];
    setHasRecording(false);
    setRecordingTime(5);
    setAmplitude(0);
    setStatus(
      createDiagnosticStatus(
        "permission-required",
        "Awaiting Microphone Access",
        "Approve microphone access in the browser prompt to begin the 5 second local recording test.",
      ),
    );

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mountedRef.current || sessionRef.current !== sessionId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const AudioContextCtor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      const audioContext = new AudioContextCtor();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0;

      source.connect(analyser);
      analyser.connect(silentGain);
      silentGain.connect(audioContext.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAmplitude = () => {
        if (!mountedRef.current || sessionRef.current !== sessionId) {
          return;
        }

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let index = 0; index < dataArray.length; index += 1) {
          sum += dataArray[index];
        }

        const avg = sum / dataArray.length;
        setAmplitude(Math.min(100, (avg / 255) * 150));
        animationRef.current = requestAnimationFrame(updateAmplitude);
      };

      updateAmplitude();

      mediaRecorder.ondataavailable = (event) => {
        if (sessionRef.current !== sessionId) {
          return;
        }

        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        if (!mountedRef.current || sessionRef.current !== sessionId) {
          return;
        }

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        clearRecordingArtifact();
        audioUrlRef.current = URL.createObjectURL(blob);
        setHasRecording(true);
        setStatus(
          createDiagnosticStatus(
            "ready",
            "Recording Ready",
            "Playback is available locally. Use the recording playback button to confirm clarity, gain, and background noise.",
            {
              notes: ["Audio is processed only in this tab and is discarded when you reset the test."],
            },
          ),
        );
        testStore.addResult("mic", "passed", { description: "5s audio recorded locally" });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus(
        createDiagnosticStatus(
          "active",
          "Recording In Progress",
          "Speak normally for 5 seconds while the amplitude meter responds to your input.",
        ),
      );

      let remaining = 5;
      timerRef.current = window.setInterval(() => {
        if (!mountedRef.current || sessionRef.current !== sessionId) {
          return;
        }

        remaining -= 1;
        setRecordingTime(remaining);

        if (remaining <= 0) {
          void stopRecording();
        }
      }, 1000);
    } catch (error) {
      if (!mountedRef.current || sessionRef.current !== sessionId) {
        return;
      }

      console.error("Microphone access error:", error);
      setStatus(classifyMediaError(error, "microphone"));
      cleanupStream();
      await closeAudioContext();
      setIsRecording(false);
      setAmplitude(0);
    }
  };

  const playRecording = async () => {
    if (!audioUrlRef.current) {
      return;
    }

    try {
      const audio = audioElementRef.current ?? new Audio(audioUrlRef.current);
      audioElementRef.current = audio;
      audio.src = audioUrlRef.current;
      await audio.play();
    } catch (error) {
      console.error("Recording playback error:", error);
      setStatus(
        createDiagnosticStatus(
          "failed",
          "Playback Blocked",
          "The browser blocked audio playback. Increase volume and interact with the page, then try the recording playback again.",
        ),
      );
    }
  };

  const playTestTone = async () => {
    if (!supportsWebAudio()) {
      setStatus(
        createDiagnosticStatus(
          "unsupported",
          "Speaker Test Unavailable",
          "This browser does not expose the Web Audio APIs required for the tone playback check.",
        ),
      );
      return;
    }

    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      const audioContext = new AudioContextCtor();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      if (audioContext.state === "suspended") {
        throw new Error("AudioContext remained suspended after resume.");
      }

      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 5);

      const notes = [
        { freq: 329.63, start: 0, duration: 1.2 },
        { freq: 392.0, start: 0.4, duration: 1.2 },
        { freq: 493.88, start: 0.8, duration: 1.2 },
        { freq: 329.63, start: 1.5, duration: 0.8 },
        { freq: 392.0, start: 2.0, duration: 0.8 },
        { freq: 493.88, start: 2.5, duration: 2.0 },
      ];

      notes.forEach(({ freq, start, duration }) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = freq;
        oscillator.connect(gainNode);
        oscillator.start(audioContext.currentTime + start);
        oscillator.stop(audioContext.currentTime + start + duration);
      });

      window.setTimeout(() => {
        void audioContext.close();
      }, 5500);
    } catch (error) {
      console.error("Test tone error:", error);
      setStatus(
        createDiagnosticStatus(
          "failed",
          "Speaker Test Blocked",
          "The browser did not allow tone playback to start. Interact with the page and verify system volume, then try again.",
        ),
      );
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      sessionRef.current += 1;
      cleanupStream();
      clearRecordingArtifact();
      void closeAudioContext();
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h3 className="font-orbitron text-2xl uppercase tracking-widest text-primary">
              Microphone & Speaker Test
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Test your audio input and output devices locally in your browser.
            </p>
          </div>

          <DiagnosticStatusCard
            status={status}
            onAction={!isRecording && !hasRecording && status.state !== "unsupported" ? startRecording : undefined}
            className="bg-surface/70"
          />

          <div className="space-y-3">
            {!isRecording && !hasRecording ? (
              <Button
                onClick={startRecording}
                disabled={status.state === "unsupported"}
                className="w-full bg-primary font-orbitron text-background transition-transform hover:scale-105 hover:bg-primary/80"
              >
                <Mic className="mr-2 h-4 w-4" /> Start Recording (5 seconds)
              </Button>
            ) : null}

            {isRecording ? (
              <div className="text-center font-orbitron text-3xl font-bold text-primary">{recordingTime}</div>
            ) : null}

            {hasRecording ? (
              <Button
                onClick={() => void playRecording()}
                variant="outline"
                className="w-full font-orbitron transition-transform hover:scale-105"
              >
                <Play className="mr-2 h-4 w-4" /> Play Your Recording
              </Button>
            ) : null}

            <Button
              onClick={() => void playTestTone()}
              variant="outline"
              className="w-full font-orbitron transition-transform hover:scale-105"
            >
              <Volume2 className="mr-2 h-4 w-4" /> Test Speakers (5s Tone)
            </Button>

            <Button
              onClick={() => void reset()}
              variant="outline"
              className="w-full font-orbitron transition-transform hover:scale-105"
            >
              <MicOff className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          {isRecording ? (
            <div className="rounded border border-primary/30 bg-surface p-3">
              <div className="mb-2 text-center text-xs font-orbitron text-primary">Recording... Speak now</div>
              <div className="h-2 w-full overflow-hidden rounded border border-primary/50 bg-background">
                <div
                  className="h-full bg-primary transition-all duration-75"
                  style={{ width: `${amplitude}%` }}
                />
              </div>
            </div>
          ) : null}

          {hasRecording ? (
            <div className="rounded border border-green-500/30 bg-surface p-3">
              <p className="text-xs font-orbitron text-green-400">
                Recording captured locally. Use playback to hear exactly what your mic recorded.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-lg border border-secondary/30 bg-surface p-8">
        <h2 className="mb-6 border-b border-secondary/30 pb-4 font-orbitron text-2xl uppercase tracking-widest text-primary">
          Comprehensive Mic & Audio Diagnostic Guide
        </h2>
        <div className="space-y-8 font-roboto-mono text-lg leading-relaxed text-muted-foreground">
          <section>
            <h3 className="mb-2 text-xl font-orbitron text-white">How to Use the Online Microphone Tester</h3>
            <p>
              This free online microphone and speaker tester provides a secure, private way to verify your audio
              equipment is working perfectly before your next Zoom call, Discord session, or podcast recording. Just
              click "Start Recording" to begin a seamless loopback test right in your browser.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-xl font-orbitron text-white">Diagnosing Common Microphone Issues</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Microphone extremely quiet?</strong> If the blue amplitude bar barely moves when you speak
                loudly, your input volume is too low. In Windows, go to Sound Settings &gt; Recording &gt; Properties
                &gt; Levels and increase the slider. You may also need to increase the "Microphone Boost" if you are
                using an analog headset.
              </li>
              <li>
                <strong>Static or buzzing noise?</strong> If you hear a constant hum during playback, your microphone
                cable might be picking up electromagnetic interference (EMI), or you have a ground-loop issue. Try
                plugging your headset into the back motherboard ports instead of the front panel of your PC case.
              </li>
              <li>
                <strong>Browser permission denied?</strong> If the tool immediately throws an error, your browser is
                blocking microphone access. Click the padlock icon in your browser&apos;s URL bar and ensure
                "Microphone" is set to "Allow".
              </li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-xl font-orbitron text-white">How the Loopback Test Works</h3>
            <p>
              The most reliable way to test a microphone is not just looking at a volume meter, it is hearing yourself
              exactly as others hear you.
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Record phase:</strong> We capture exactly 5 seconds of raw audio from your default input
                device.
              </li>
              <li>
                <strong>Playback phase:</strong> By clicking "Play Your Recording," you hear the raw audio file. If
                your voice sounds robotic, muffled, or delayed in the recording, that is exactly how other people hear
                you.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-xl font-orbitron text-white">Local Recording Privacy</h3>
            <p>
              <strong>Device Test Online keeps the recording flow in this browser session.</strong> Your microphone
              sample is not uploaded as part of the diagnostic itself and is discarded when you reset the test or close
              the tab. Site-level analytics and advertising disclosures are documented separately in the privacy policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
