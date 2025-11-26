import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MicrophoneTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(5);
  const [amplitude, setAmplitude] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string>('');
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const reset = () => {
    stopRecording();
    setHasRecording(false);
    setAmplitude(0);
    setRecordingTime(5);
    setError(null);
    chunksRef.current = [];
    audioUrlRef.current = '';
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
  };

  const startRecording = async () => {
    setError(null);
    chunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      
      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0;
      
      source.connect(analyser);
      analyser.connect(silentGain);
      silentGain.connect(audioContext.destination);
      
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAmplitude = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAmplitude(Math.min(100, (avg / 255) * 150));
        animationRef.current = requestAnimationFrame(updateAmplitude);
      };
      updateAmplitude();

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        setHasRecording(true);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }

        setTimeout(() => playRecording(), 500);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(5);

      let time = 5;
      timerRef.current = setInterval(() => {
        time -= 1;
        setRecordingTime(time);
        if (time <= 0) {
          if (timerRef.current) clearTimeout(timerRef.current);
          stopRecording();
        }
      }, 1000);

    } catch (err: any) {
      setError(err.message || "Could not access microphone");
    }
  };

  const playRecording = () => {
    if (audioUrlRef.current) {
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio(audioUrlRef.current);
      }
      audioElementRef.current.play();
    }
  };

  const playTestTone = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 5);

      const notes = [
        { freq: 329.63, start: 0, duration: 1.2 },
        { freq: 392.00, start: 0.4, duration: 1.2 },
        { freq: 493.88, start: 0.8, duration: 1.2 },
        { freq: 329.63, start: 1.5, duration: 0.8 },
        { freq: 392.00, start: 2.0, duration: 0.8 },
        { freq: 493.88, start: 2.5, duration: 2.0 },
      ];

      notes.forEach(({ freq, start, duration }) => {
        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gainNode);
        osc.start(audioContext.currentTime + start);
        osc.stop(audioContext.currentTime + start + duration);
      });
    } catch (err) {
      console.error("Test tone error:", err);
    }
  };

  useEffect(() => {
    return () => {
      stopRecording();
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-primary font-orbitron text-2xl uppercase tracking-widest">Microphone & Speaker Test</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Test your audio input and output devices
            </p>
          </div>

          <div className="space-y-3">
            {!isRecording && !hasRecording && (
              <Button onClick={startRecording} className="bg-primary text-background hover:bg-primary/80 font-orbitron w-full">
                <Mic className="mr-2 w-4 h-4" /> Start Recording (5 seconds)
              </Button>
            )}

            {isRecording && (
              <div className="text-center text-primary font-orbitron text-3xl font-bold">{recordingTime}</div>
            )}

            {hasRecording && (
              <>
                <Button onClick={playRecording} variant="outline" className="w-full font-orbitron">
                  <Play className="mr-2 w-4 h-4" /> Play Your Recording
                </Button>
                <Button onClick={reset} variant="secondary" className="w-full font-orbitron">
                  <Mic className="mr-2 w-4 h-4" /> Reset
                </Button>
              </>
            )}

            <Button onClick={playTestTone} variant="outline" className="w-full font-orbitron">
              <Volume2 className="mr-2 w-4 h-4" /> Test Speakers (5s Tone)
            </Button>
          </div>

          {error && (
            <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded text-sm">
              {error}
            </div>
          )}

          {isRecording && (
            <div className="p-3 bg-surface border border-primary/30 rounded">
              <div className="text-xs font-orbitron text-primary text-center mb-2">
                Recording... Speak now
              </div>
              <div className="w-full bg-background rounded overflow-hidden h-2 border border-primary/50">
                <div 
                  className="h-full bg-primary transition-all duration-75" 
                  style={{ width: `${amplitude}%` }}
                />
              </div>
            </div>
          )}

          {hasRecording && (
            <div className="p-3 bg-surface border border-green-500/30 rounded">
              <p className="text-xs font-orbitron text-green-400">
                ✓ Recording saved and now playing back.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 bg-surface border border-secondary/30 rounded-lg">
        <h3 className="text-primary font-orbitron text-2xl mb-4 uppercase tracking-widest">How to Test Your Microphone</h3>
        <div className="space-y-4 text-lg text-muted-foreground font-roboto-mono leading-relaxed">
          <p>
            <strong className="text-primary">Record Your Voice:</strong> Click "Start Recording" and speak into your microphone. The timer will countdown from 5 seconds. Once it reaches zero, the recording automatically stops and plays back your voice.
          </p>
          <p>
            <strong className="text-primary">Hear Your Recording:</strong> After the countdown finishes, your voice will automatically play back through your speakers. If you can hear yourself, your microphone is working perfectly. This is the definitive test—if audio is captured and played back, the microphone is functional.
          </p>
          <p>
            <strong className="text-primary">Reset:</strong> Click "Reset" to clear everything and record again. This will stop playback and prepare you for a fresh recording.
          </p>
          <p>
            <strong className="text-primary">Speaker Test:</strong> Click "Test Speakers" to play a 5-second musical chord. This verifies your speaker output is working.
          </p>
          <p>
            <strong className="text-primary">Privacy:</strong> All audio is processed locally. Nothing is recorded to a server or saved to your device.
          </p>
        </div>
      </div>
    </div>
  );
}
