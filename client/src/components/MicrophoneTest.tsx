import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function MicrophoneTest() {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [playbackEnabled, setPlaybackEnabled] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastVolumeUpdateRef = useRef<number>(0);

  const stopListening = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
    }
    if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
    }
    if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
    }
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    
    setIsListening(false);
    setVolume(0);
  };

  const startListening = async () => {
    stopListening();
    try {
      setError(null);
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        } 
      });
      streamRef.current = stream;
      console.log("Microphone access granted:", stream.id);
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      // Explicitly resume audio context if it's suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
          console.log("Resuming suspended AudioContext...");
          await audioContext.resume();
      }
      
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      
      // Create gain node for volume control/muting playback
      const gainNode = audioContext.createGain();
      gainNode.gain.value = playbackEnabled ? 1.0 : 0;
      gainNodeRef.current = gainNode;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      // Route: Source -> Analyser -> Gain -> Destination (Speakers)
      source.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      setIsListening(true);
      
      // Small delay to ensure context is ready before drawing
      setTimeout(() => {
        drawVisualizer();
      }, 100);
      
    } catch (err: any) {
      console.error("Microphone access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError("Microphone permission denied. Please allow access in your browser settings.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError("No microphone found. Please connect a microphone.");
      } else {
          setError(`Could not access microphone: ${err.message}`);
      }
    }
  };

  // Handle playback toggle while active
  useEffect(() => {
    if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(playbackEnabled ? 1.0 : 0, audioContextRef.current?.currentTime || 0, 0.1);
    }
  }, [playbackEnabled]);

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let dataArray: Uint8Array;
    let bufferLength: number;
    
    const draw = (timestamp: number) => {
      if (!isListening) return; 
      if (!analyserRef.current) return; 

      if (!bufferLength) {
         bufferLength = analyserRef.current.frequencyBinCount;
         dataArray = new Uint8Array(bufferLength);
      }

      rafRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Update volume state only every 100ms to save performance
      if (timestamp - lastVolumeUpdateRef.current > 100) {
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          setVolume(average);
          lastVolumeUpdateRef.current = timestamp;
      }
      
      // Clear canvas
      ctx.fillStyle = 'rgb(11, 12, 16)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw bars
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        // Boost the visual height slightly to make it more sensitive
        const rawHeight = dataArray[i];
        const boostedHeight = Math.min(255, rawHeight * 1.2); 
        const barHeight = (boostedHeight / 255) * canvas.height;
        
        // Dynamic color based on volume
        const hue = 180 + (rawHeight / 255) * 60; // Cyan to Blue
        const alpha = 0.5 + (rawHeight / 255) * 0.5;
        
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    rafRef.current = requestAnimationFrame(draw);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-primary font-orbitron text-xl mb-2">Audio Input Visualizer</h3>
          <p className="text-muted-foreground text-sm">
            Check your microphone input levels. Audio is processed locally and never sent to any server.
          </p>
        </div>

        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              {!isListening ? (
                <Button onClick={startListening} className="bg-primary text-background hover:bg-primary/80 font-orbitron flex-1">
                  <Mic className="mr-2 w-4 h-4" /> Start Test
                </Button>
              ) : (
                <Button onClick={stopListening} variant="destructive" className="font-orbitron flex-1">
                  <MicOff className="mr-2 w-4 h-4" /> Stop Test
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 p-4 border border-secondary/30 rounded-md bg-surface/50">
                <Checkbox 
                    id="playback" 
                    checked={playbackEnabled}
                    onCheckedChange={(c) => setPlaybackEnabled(!!c)}
                />
                <Label htmlFor="playback" className="text-sm font-orbitron cursor-pointer flex items-center gap-2">
                    {playbackEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                    Test Speakers (Hear Yourself)
                </Label>
            </div>
        </div>

        {error && (
          <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>INPUT LEVEL</span>
            <span>{Math.round((volume / 255) * 100)}%</span>
          </div>
          <Progress value={(volume / 255) * 100} className="h-2 bg-surface" />
        </div>
      </div>

      <div className="bg-surface border border-secondary/30 rounded-lg p-1 overflow-hidden relative h-64 flex items-center justify-center">
        {!isListening ? (
          <div className="text-center text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Visualizer Inactive</p>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={250} 
            className="w-full h-full object-cover" 
          />
        )}
        
        <div className="absolute top-2 right-2 text-[10px] text-primary/50 font-orbitron border border-primary/20 px-2 py-0.5 rounded">
          REALTIME VISUALIZATION
        </div>
      </div>
      
      <div className="md:col-span-2 p-4 border-l-4 border-secondary bg-background/50">
        <h4 className="text-primary font-orbitron text-sm mb-2">Privacy Note</h4>
        <p className="text-xs text-muted-foreground">
          Your privacy is important. This tool uses the Web Audio API (`AudioContext`) to visualize frequencies directly in your browser memory. 
          No audio data is recorded, stored, or transmitted over the network.
        </p>
      </div>
    </div>
  );
}