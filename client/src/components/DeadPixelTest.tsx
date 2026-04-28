import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Maximize, X, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Blue', value: '#0000FF' },
];

// ...
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Disc } from 'lucide-react';
import { testStore } from '@/lib/store';

export function DeadPixelTest() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);

  // Fixer Mode State
  const [isFixerMode, setIsFixerMode] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [fixerDuration, setFixerDuration] = useState('10'); // minutes
  const [fixerTimeLeft, setFixerTimeLeft] = useState(0);

  const lastTimeRef = useRef(performance.now());
  const requestRef = useRef<number>(0);
  const fixerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fixerTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startStandardTest = () => {
    setIsFixerMode(false);
    enterFullscreen();
  };

  const attemptFixerStart = () => {
    setShowWarningModal(true);
  };

  const confirmFixerStart = () => {
    setShowWarningModal(false);
    setIsFixerMode(true);
    const durationMs = parseInt(fixerDuration) * 60 * 1000;
    setFixerTimeLeft(durationMs);
    enterFullscreen();
  };

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setColorIndex(0);
        testStore.addResult('pixel', 'tested', { mode: isFixerMode ? 'Stuck Pixel Fixer' : 'Standard Diagnostic' });

        if (isFixerMode || showWarningModal) { // Start flashing immediately if fixer mode was confirmed
          // Wait for fullscreen then start
          setTimeout(startFlashing, 100);
        }

      }).catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    }
  };

  const startFlashing = () => {
    if (fixerIntervalRef.current) clearInterval(fixerIntervalRef.current);
    if (fixerTimerRef.current) clearInterval(fixerTimerRef.current);

    // Flash rapidly (every ~16ms/60hz or ~33ms/30hz, let's use 60ms to guarantee color change visibility but still be very fast)
    fixerIntervalRef.current = setInterval(() => {
      setColorIndex(prev => (prev + 1) % COLORS.length);
    }, 60);

    // Countdown Timer
    fixerTimerRef.current = setInterval(() => {
      setFixerTimeLeft(prev => {
        if (prev <= 1000) {
          exitFullscreen();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }

    // Cleanup Fixer
    setIsFullscreen(false);
    setIsFixerMode(false);
    if (fixerIntervalRef.current) clearInterval(fixerIntervalRef.current);
    if (fixerTimerRef.current) clearInterval(fixerTimerRef.current);

  }, []);

  const cycleColor = useCallback(() => {
    if (isFixerMode) return; // Don't manually cycle during fixer mode
    setColorIndex((prev) => (prev + 1) % COLORS.length);
  }, [isFixerMode]);

  const animate = (time: number) => {
    setFrameCount(prev => {
      const newCount = prev + 1;
      const elapsed = time - lastTimeRef.current;

      if (elapsed >= 1000) {
        setFps(Math.round((newCount * 1000) / elapsed));
        lastTimeRef.current = time;
        return 0;
      }
      return newCount;
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (fixerIntervalRef.current) clearInterval(fixerIntervalRef.current);
      if (fixerTimerRef.current) clearInterval(fixerTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      if (e.key === 'Escape') {
        exitFullscreen();
      } else if (!isFixerMode && (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter')) {
        cycleColor();
      } else if (!isFixerMode && e.key === 'ArrowLeft') {
        setColorIndex((prev) => (prev - 1 + COLORS.length) % COLORS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, exitFullscreen, cycleColor, isFixerMode]);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // We exited full screen. Ensure we clean up fixer state too.
        exitFullscreen();
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [exitFullscreen]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isFullscreen && !showWarningModal) {
    return (
      <div
        className="fixed inset-0 z-50 cursor-none flex items-center justify-center"
        style={{ backgroundColor: COLORS[colorIndex].value }}
        onClick={cycleColor}
      >
        {!isFixerMode ? (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-mono opacity-0 hover:opacity-100 transition-opacity cursor-default select-none pointer-events-none">
            Current: {COLORS[colorIndex].name} (Click to cycle, ESC to exit)
          </div>
        ) : (
          <div className="bg-black/80 backdrop-blur-sm border border-secondary/50 p-6 rounded-xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500 shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-none select-none">
            <Disc className="w-12 h-12 text-neon-red animate-spin" style={{ animationDuration: '3s' }} />
            <h2 className="text-2xl font-orbitron font-bold text-white tracking-widest uppercase">Fixing Pixel</h2>
            <div className="text-5xl font-mono text-primary font-black drop-shadow-[0_0_10px_var(--color-primary)]">
              {formatTime(fixerTimeLeft)}
            </div>
            <p className="text-muted-foreground text-sm font-roboto-mono mt-2">DO NOT LOOK DIRECTLY AT SCREEN</p>
            <p className="text-xs text-white/50">Press ESC to abort</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Warning Modal */}
      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent className="bg-black/95 border-neon-red shadow-[0_0_50px_rgba(255,0,0,0.15)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-neon-red font-orbitron text-xl">
              <AlertTriangle className="animate-pulse" />
              CRITICAL SAFETY WARNING
            </DialogTitle>
            <DialogDescription className="font-roboto-mono text-foreground text-base leading-relaxed pt-4">
              This tool uses <strong className="text-white">rapidly flashing lights and alternating contrasting colors</strong> to attempt to unstick dead pixels.
              <br /><br />
              <strong className="text-neon-red uppercase">Epilepsy Warning:</strong> This may induce seizures for people with Photosensitive Epilepsy.
              <br /><br />
              If you or anyone in your household has a history of epilepsy or seizures, <strong>DO NOT PROCEED.</strong>
              <br /><br />
              It is highly recommended that you step away from the monitor or look away while this tool is running.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowWarningModal(false)} className="w-full sm:w-auto border-secondary/20 hover:bg-secondary/10">
              Cancel
            </Button>
            <Button onClick={confirmFixerStart} className="w-full sm:w-auto bg-neon-red hover:bg-neon-red/80 text-white font-bold tracking-wider">
              I Understand, Start Flashing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Standard Test */}
        <div className="flex flex-col items-center justify-center py-8 gap-6 text-center bg-surface border border-secondary/30 rounded-lg p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-primary font-orbitron text-xl uppercase tracking-widest z-10">Diagnostic Mode</h3>
          <p className="text-sm text-muted-foreground z-10 h-10">Manually inspect your screen for dead pixels by cycling solid colors.</p>
          <Button
            size="lg"
            onClick={startStandardTest}
            className="bg-primary text-background hover:bg-primary/80 hover:scale-105 transition-all font-orbitron text-lg px-8 py-6 shadow-[0_0_20px_rgba(102,252,241,0.3)] w-full md:w-auto z-10"
          >
            <Maximize className="mr-2 w-5 h-5" />
            Start Color Cycle
          </Button>
        </div>

        {/* Fixer Mode */}
        <div className="flex flex-col items-center justify-center py-8 gap-6 text-center bg-black/40 border border-neon-red/30 rounded-lg p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-neon-red font-orbitron text-xl uppercase tracking-widest z-10 flex items-center gap-2">
            Stuck Pixel Fixer
          </h3>
          <div className="flex items-center gap-2 z-10">
            <span className="text-muted-foreground text-sm">Duration:</span>
            <Select value={fixerDuration} onValueChange={setFixerDuration}>
              <SelectTrigger className="w-[120px] bg-black/50 border-secondary/30 text-sm h-8">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-secondary/30">
                <SelectItem value="5">5 Minutes</SelectItem>
                <SelectItem value="10">10 Minutes</SelectItem>
                <SelectItem value="20">20 Minutes</SelectItem>
                <SelectItem value="60">1 Hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            size="lg"
            onClick={attemptFixerStart}
            className="bg-neon-red text-white hover:bg-neon-red/80 hover:scale-105 transition-all font-orbitron text-lg px-8 py-6 shadow-[0_0_20px_rgba(255,0,0,0.2)] w-full md:w-auto z-10"
          >
            <AlertTriangle className="mr-2 w-5 h-5 animate-pulse" />
            Attempt Repair
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="p-8 bg-surface border border-secondary/30 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Activity className="w-24 h-24 text-primary" />
          </div>
          <h3 className="text-muted-foreground font-orbitron text-sm uppercase tracking-widest mb-2 z-10">Monitor Refresh Rate</h3>
          <div className="text-6xl font-orbitron text-primary glow-text z-10 mb-2">
            {fps} <span className="text-xl text-muted-foreground">Hz</span>
          </div>
          <div className="text-xs text-muted-foreground font-mono z-10 bg-black/40 px-3 py-1 rounded-full border border-white/5">
            Real-time Detection
          </div>
        </Card>
      </div>
    </div>
  );
}
