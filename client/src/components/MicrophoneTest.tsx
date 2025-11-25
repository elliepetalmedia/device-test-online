import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, Volume2, VolumeX, AlertCircle, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MicrophoneTest() {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [playbackEnabled, setPlaybackEnabled] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const log = (msg: string) => {
    console.log(`[MicTest] ${msg}`);
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString().split(' ')[0]} ${msg}`]);
  };

  const stopListening = async () => {
    log("Stopping...");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    try {
        if (sourceRef.current) sourceRef.current.disconnect();
        if (analyserRef.current) analyserRef.current.disconnect();
        if (gainNodeRef.current) gainNodeRef.current.disconnect();
        
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            await audioContextRef.current.close();
            log("AudioContext closed");
        }
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                log(`Track ${track.kind} stopped`);
            });
        }
    } catch (e) {
        console.error("Error stopping:", e);
    }
    
    audioContextRef.current = null;
    sourceRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    
    setIsListening(false);
    setVolume(0);
  };

  const startListening = async () => {
    await stopListening();
    setError(null);
    setDebugInfo([]);
    log("Starting initialization...");

    try {
      // 1. Get User Media
      log("Requesting permissions...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      log(`Stream active: ${stream.active}, ID: ${stream.id.slice(0,8)}...`);

      // 2. Create Audio Context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      log(`AudioContext created. State: ${audioContext.state}`);

      // 3. Resume Context if needed
      if (audioContext.state === 'suspended') {
          log("Resuming suspended context...");
          await audioContext.resume();
          log(`AudioContext resumed. State: ${audioContext.state}`);
      }

      // 4. Create Analyzer
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; 
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      // 5. Create Source & Gain
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = playbackEnabled ? 1.0 : 0;
      gainNodeRef.current = gainNode;

      // 6. Connect Graph
      source.connect(analyser);
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      log("Audio graph connected");
      setIsListening(true);
      
      // 7. Start Drawing Loop
      draw();
      
    } catch (err: any) {
      console.error("Mic Error:", err);
      log(`Error: ${err.message}`);
      setError(err.message || "Could not access microphone");
    }
  };

  // Toggle Playback Volume
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
        const newVal = playbackEnabled ? 1.0 : 0;
        gainNodeRef.current.gain.setValueAtTime(newVal, audioContextRef.current.currentTime);
        log(`Playback volume set to: ${newVal}`);
    }
  }, [playbackEnabled]);

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const animate = () => {
        if (!analyserRef.current) return;
        
        rafRef.current = requestAnimationFrame(animate);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate Volume
        let sum = 0;
        for(let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setVolume(avg);

        // Draw Frequency Bars
        ctx.fillStyle = 'rgb(10, 10, 12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;

            const hue = 160 + (barHeight / canvas.height) * 60;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    };

    animate();
  };

  // Cleanup
  useEffect(() => {
    return () => stopListening();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-primary font-orbitron text-xl mb-2">Microphone Diagnostic</h3>
          <p className="text-muted-foreground text-sm">
            Low-level audio diagnostic tool. Checks signal path and hardware access.
          </p>
        </div>

        <div className="space-y-4">
            <div className="flex gap-4">
                {!isListening ? (
                    <Button onClick={startListening} className="bg-primary text-background hover:bg-primary/80 font-orbitron flex-1">
                        <Mic className="mr-2 w-4 h-4" /> Initialize Mic
                    </Button>
                ) : (
                    <Button onClick={stopListening} variant="destructive" className="font-orbitron flex-1">
                        <MicOff className="mr-2 w-4 h-4" /> Terminate
                    </Button>
                )}
            </div>

            <div className="p-4 border border-secondary/30 rounded-lg bg-surface/50 space-y-4">
                <div className="flex items-center gap-2">
                    <Checkbox 
                        id="playback" 
                        checked={playbackEnabled}
                        onCheckedChange={(c) => setPlaybackEnabled(!!c)}
                    />
                    <Label htmlFor="playback" className="text-sm font-orbitron cursor-pointer flex items-center gap-2">
                        {playbackEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                        Audio Loopback (Test Speakers)
                    </Label>
                </div>
            </div>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>SIGNAL INTENSITY (RMS)</span>
                <span>{Math.round(volume)}%</span>
            </div>
            <Progress value={volume} className="h-2 bg-surface" />
        </div>

        {/* Debug Log */}
        <div className="p-3 bg-black/50 rounded border border-secondary/20 font-mono text-[10px] text-muted-foreground h-32 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 text-primary border-b border-secondary/20 pb-1">
                <Terminal className="w-3 h-3" />
                <span>SYSTEM LOG</span>
            </div>
            {debugInfo.length === 0 && <span className="opacity-50">Waiting for initialization...</span>}
            {debugInfo.map((msg, i) => (
                <div key={i} className="truncate">{msg}</div>
            ))}
        </div>
      </div>

      <div className="bg-black border border-secondary/30 rounded-lg p-1 overflow-hidden relative h-full min-h-[300px] flex items-center justify-center glow-border">
        {!isListening ? (
          <div className="text-center text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm font-orbitron opacity-50">Signal Offline</p>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={400} 
            className="w-full h-full object-cover" 
          />
        )}
        
        {isListening && (
            <div className="absolute top-2 right-2 text-[10px] text-neon-green font-orbitron border border-neon-green/20 px-2 py-0.5 rounded animate-pulse">
                LIVE WAVEFORM
            </div>
        )}
      </div>
    </div>
  );
}
