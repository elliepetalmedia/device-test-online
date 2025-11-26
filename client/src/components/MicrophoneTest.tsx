import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MicrophoneTest() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amplitude, setAmplitude] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const stopMicrophone = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setIsListening(false);
    setAmplitude(0);
  };

  const startMicrophone = async () => {
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      console.log("[MicTest] Stream obtained");

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      console.log("[MicTest] AudioContext created");

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
        console.log("[MicTest] Context resumed");
      }

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;

      // IMPORTANT: Connect analyser to a muted output so audio flows through the graph
      // This is necessary for the analyser to receive data
      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0; // Mute so user doesn't hear loopback
      
      source.connect(analyser);
      analyser.connect(silentGain);
      silentGain.connect(audioContext.destination);
      
      analyserRef.current = analyser;
      console.log("[MicTest] Audio graph connected with muted output");

      setIsListening(true);
      visualize();
    } catch (err: any) {
      console.error("[MicTest] Error:", err);
      setError(err.message || "Could not access microphone");
    }
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const normalized = (dataArray[i] - 128) / 128;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / bufferLength);
      setAmplitude(Math.min(100, rms * 300));

      // Clear canvas
      ctx.fillStyle = 'rgb(10, 10, 12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(102, 252, 241, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(102, 252, 241)';
      ctx.shadowColor = 'rgba(102, 252, 241, 0.8)';
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowColor = 'transparent';
    };

    draw();
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
    return () => stopMicrophone();
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
            <div className="flex gap-3">
              {!isListening ? (
                <Button onClick={startMicrophone} className="bg-primary text-background hover:bg-primary/80 font-orbitron flex-1">
                  <Mic className="mr-2 w-4 h-4" /> Start Microphone
                </Button>
              ) : (
                <Button onClick={stopMicrophone} variant="destructive" className="font-orbitron flex-1">
                  <MicOff className="mr-2 w-4 h-4" /> Stop
                </Button>
              )}
            </div>

            <Button onClick={playTestTone} variant="outline" className="w-full font-orbitron">
              <Volume2 className="mr-2 w-4 h-4" /> Test Speakers (5s Tone)
            </Button>
          </div>

          {error && (
            <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded text-sm">
              {error}
            </div>
          )}

          {isListening && (
            <div className="p-3 bg-surface border border-primary/30 rounded">
              <div className="text-xs font-orbitron text-primary text-center mb-2">
                Microphone Active - Speak now
              </div>
              <div className="w-full bg-background rounded overflow-hidden h-2 border border-primary/50">
                <div 
                  className="h-full bg-primary transition-all duration-75" 
                  style={{ width: `${amplitude}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <Card className="bg-black border-primary/50 p-2 overflow-hidden h-[250px] flex items-center justify-center glow-border">
            {!isListening ? (
              <div className="text-center text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-orbitron opacity-50">Microphone Offline</p>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                width={400}
                height={250}
                className="w-full h-full"
                style={{ display: 'block', backgroundColor: 'rgb(10, 10, 12)' }}
              />
            )}

            {isListening && (
              <div className="absolute top-2 right-2 text-[10px] text-neon-green font-orbitron border border-neon-green/20 px-2 py-0.5 rounded animate-pulse">
                LIVE
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="p-8 bg-surface border border-secondary/30 rounded-lg">
        <h3 className="text-primary font-orbitron text-2xl mb-4 uppercase tracking-widest">Audio Diagnostics Explained</h3>
        <div className="space-y-4 text-lg text-muted-foreground font-roboto-mono leading-relaxed">
          <p>
            <strong className="text-primary">Microphone Test:</strong> Click "Start Microphone" to begin capturing audio. The visualization displays a real-time waveform of your audio input. Speak, tap your microphone, clap your hands, or make any noise to see the cyan waveform move and react.
          </p>
          <p>
            <strong className="text-primary">Understanding the Visualization:</strong> The bright cyan oscilloscope display shows the actual sound waves being captured from your microphone. Higher peaks indicate louder sounds. You'll also see an amplitude meter on the left that fills up as you make noise, giving you instant visual feedback that audio is being detected.
          </p>
          <p>
            <strong className="text-primary">Speaker Test:</strong> Click "Test Speakers" to play a 5-second musical chord through your speakers. This verifies that audio output is working on your system.
          </p>
          <p>
            <strong className="text-primary">Privacy Note:</strong> No audio is recorded, saved, or transmitted. All analysis happens locally in your browser memory only.
          </p>
        </div>
      </div>
    </div>
  );
}
