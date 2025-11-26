import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MicrophoneTest() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  };

  const startMicrophone = async () => {
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      visualize();
    } catch (err: any) {
      setError(err.message || "Could not access microphone");
    }
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(10, 10, 12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = Math.max(1, (canvas.width / bufferLength) * 2.5);
      let xPos = 0;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i] / 255;
        const barHeight = value * canvas.height;
        
        const hue = 160 + (value * 60);
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(xPos, canvas.height - barHeight, barWidth, barHeight);
        
        xPos += barWidth + 1;
      }
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

      // Pleasant major chord progression: E-G-B (5 seconds)
      const notes = [
        { freq: 329.63, start: 0, duration: 1.2 },     // E
        { freq: 392.00, start: 0.4, duration: 1.2 },   // G
        { freq: 493.88, start: 0.8, duration: 1.2 },   // B
        { freq: 329.63, start: 1.5, duration: 0.8 },   // E
        { freq: 392.00, start: 2.0, duration: 0.8 },   // G
        { freq: 493.88, start: 2.5, duration: 2.0 },   // B (long hold)
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
            <Volume2 className="mr-2 w-4 h-4" /> Test Speakers (1s Tone)
          </Button>
        </div>

        {error && (
          <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded text-sm">
            {error}
          </div>
        )}

        {isListening && (
          <div className="p-3 bg-surface border border-primary/30 rounded">
            <p className="text-xs font-orbitron text-primary text-center">
              Microphone Active - Speak to see the visualization
            </p>
          </div>
        )}
        </div>
      </div>

      <div className="relative">
        <Card className="bg-black border-secondary/30 p-2 overflow-hidden min-h-[200px] flex items-center justify-center glow-border">
          {!isListening ? (
            <div className="text-center text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm font-orbitron opacity-50">Microphone Offline</p>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={250}
              height={175}
              className="w-full h-full"
              style={{ display: 'block', backgroundColor: 'rgb(10, 10, 12)', maxWidth: '250px', maxHeight: '175px' }}
            />
          )}

          {isListening && (
            <div className="absolute top-2 right-2 text-[10px] text-neon-green font-orbitron border border-neon-green/20 px-2 py-0.5 rounded animate-pulse">
              RECORDING
            </div>
          )}
        </Card>
      </div>

      <div className="p-8 bg-surface border border-secondary/30 rounded-lg">
        <h3 className="text-primary font-orbitron text-2xl mb-4 uppercase tracking-widest">Audio Diagnostics Explained</h3>
        <div className="space-y-4 text-lg text-muted-foreground font-roboto-mono leading-relaxed">
          <p>
            <strong className="text-primary">Microphone Test:</strong> Click "Start Microphone" to begin capturing audio. The visualization displays real-time frequency data from your microphone input. Speak into your mic, tap it, clap your hands, or make any noise to see the frequency bars light up and react. The taller the bars, the stronger the audio signal. This helps verify your microphone is connected, has permissions enabled, and is functioning properly.
          </p>
          <p>
            <strong className="text-primary">What the bars show:</strong> The green-to-blue frequency visualization shows the distribution of sound across different frequency ranges. Low frequencies (bass) appear on the left, high frequencies (treble) on the right. A healthy microphone will show activity across the spectrum when you speak or make noise.
          </p>
          <p>
            <strong className="text-primary">Speaker Test:</strong> Click "Test Speakers (1s Tone)" to play a pleasant 5-second musical chord through your speakers. This verifies that audio output is working on your system. You should hear a smooth, ascending musical tone. If you hear nothing, check your system volume, speaker connections, and audio output settings.
          </p>
          <p>
            <strong className="text-primary">Privacy Note:</strong> No audio is recorded, saved, or transmitted. All analysis happens locally in your browser memory only. Your microphone and speaker data never leaves your computer.
          </p>
        </div>
      </div>
    </div>
  );
}
