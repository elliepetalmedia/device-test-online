import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function MicrophoneTest() {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [playbackEnabled, setPlaybackEnabled] = useState(false);
  const [sensitivity, setSensitivity] = useState([50]); // 0-100 multiplier
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const requestRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Cleanup function
  const stopListening = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
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
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }
    
    setIsListening(false);
    setVolume(0);
  };

  const startListening = async () => {
    // Ensure clean slate
    stopListening();
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
            echoCancellation: false, // Disable to prevent chopping
            autoGainControl: false,  // Disable to get raw levels
            noiseSuppression: false, // Disable to hear raw noise floor
            channelCount: 1
        } 
      });

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext({
        latencyHint: 'interactive',
        sampleRate: 44100, 
      });

      await audioContext.resume();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512; // Higher resolution
      analyser.smoothingTimeConstant = 0.5; // More responsive
      analyserRef.current = analyser;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphoneRef.current = microphone;

      // Create Gain Node for Playback volume
      const gainNode = audioContext.createGain();
      gainNode.gain.value = playbackEnabled ? 1.0 : 0;
      gainNodeRef.current = gainNode;

      // Connections
      microphone.connect(analyser); // Mic -> Visualizer
      microphone.connect(gainNode); // Mic -> Gain
      gainNode.connect(audioContext.destination); // Gain -> Speakers

      setIsListening(true);
      draw();
    } catch (err: any) {
      console.error("Microphone error:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  // Handle playback toggle dynamically
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const targetGain = playbackEnabled ? 1.0 : 0;
      // Smooth transition to prevent clicking
      gainNodeRef.current.gain.setTargetAtTime(targetGain, audioContextRef.current.currentTime, 0.05);
    }
  }, [playbackEnabled]);

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate Volume for Progress Bar
    let sum = 0;
    for(let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
    }
    const avg = sum / bufferLength;
    // Apply sensitivity multiplier
    const boost = 1 + (sensitivity[0] / 25); // 1x to 5x boost
    const adjustedVolume = Math.min(avg * boost, 255);
    setVolume(adjustedVolume);

    // Draw Visualization
    ctx.fillStyle = 'rgb(10, 10, 12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
        const barHeight = Math.min(dataArray[i] * boost, 255) / 255 * canvas.height;

        const hue = 160 + (barHeight / canvas.height) * 60; // Cyan/Teal range
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }

    requestRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-primary font-orbitron text-xl mb-2">Microphone Check</h3>
          <p className="text-muted-foreground text-sm">
            Visualize audio input and test loopback. <br/>
            <span className="text-neon-red text-xs">Warning: Loopback may cause feedback if speakers are loud.</span>
          </p>
        </div>

        <div className="space-y-4">
            <div className="flex gap-4">
                {!isListening ? (
                    <Button onClick={startListening} className="bg-primary text-background hover:bg-primary/80 font-orbitron flex-1">
                        <Mic className="mr-2 w-4 h-4" /> Start Microphone
                    </Button>
                ) : (
                    <Button onClick={stopListening} variant="destructive" className="font-orbitron flex-1">
                        <MicOff className="mr-2 w-4 h-4" /> Stop
                    </Button>
                )}
            </div>

            <div className="p-4 border border-secondary/30 rounded-lg bg-surface/50 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Checkbox 
                            id="playback" 
                            checked={playbackEnabled}
                            onCheckedChange={(c) => setPlaybackEnabled(!!c)}
                        />
                        <Label htmlFor="playback" className="text-sm font-orbitron cursor-pointer flex items-center gap-2">
                            {playbackEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                            Playback (Hear Yourself)
                        </Label>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Visualizer Sensitivity</Label>
                    <Slider 
                        value={sensitivity} 
                        onValueChange={setSensitivity} 
                        max={100} 
                        step={1} 
                        className="py-2"
                    />
                </div>
            </div>
        </div>

        {error && (
          <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>INPUT SIGNAL</span>
                <span>{Math.round((volume / 255) * 100)}%</span>
            </div>
            <Progress value={(volume / 255) * 100} className="h-2 bg-surface" />
        </div>
      </div>

      <div className="bg-black border border-secondary/30 rounded-lg p-1 overflow-hidden relative h-64 flex items-center justify-center glow-border">
        {!isListening ? (
          <div className="text-center text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm font-orbitron opacity-50">Awaiting Signal</p>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            width={500} 
            height={300} 
            className="w-full h-full object-cover" 
          />
        )}
        
        {isListening && (
            <div className="absolute top-2 right-2 text-[10px] text-neon-green font-orbitron border border-neon-green/20 px-2 py-0.5 rounded animate-pulse">
                LIVE INPUT
            </div>
        )}
      </div>
    </div>
  );
}
