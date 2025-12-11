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

export function DeadPixelTest() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const lastTimeRef = useRef(performance.now());
  const requestRef = useRef<number>();

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setColorIndex(0);
      }).catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    }
  };

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  }, []);

  const cycleColor = useCallback(() => {
    setColorIndex((prev) => (prev + 1) % COLORS.length);
  }, []);

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
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      if (e.key === 'Escape') {
        exitFullscreen();
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        cycleColor();
      } else if (e.key === 'ArrowLeft') {
        setColorIndex((prev) => (prev - 1 + COLORS.length) % COLORS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, exitFullscreen, cycleColor]);

  useEffect(() => {
    // Listen for ESC key exiting fullscreen natively
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  if (isFullscreen) {
    return (
      <div 
        className="fixed inset-0 z-50 cursor-none"
        style={{ backgroundColor: COLORS[colorIndex].value }}
        onClick={cycleColor}
      >
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-mono opacity-0 hover:opacity-100 transition-opacity cursor-default select-none pointer-events-none">
          Current: {COLORS[colorIndex].name} (Click to cycle, ESC to exit)
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center py-8 gap-6 text-center bg-surface border border-secondary/30 rounded-lg p-8">
          <Button 
            size="lg" 
            onClick={enterFullscreen}
            className="bg-primary text-background hover:bg-primary/80 hover:scale-105 transition-all font-orbitron text-lg px-8 py-6 shadow-[0_0_20px_rgba(102,252,241,0.3)] w-full md:w-auto"
          >
            <Maximize className="mr-2 w-5 h-5" />
            Start Color Cycle
          </Button>
          
          <p className="text-sm text-muted-foreground">Press ESC to exit full screen mode</p>
        </div>

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

      <div className="p-8 bg-surface border border-secondary/30 rounded-lg">
        <h3 className="text-primary font-orbitron text-2xl mb-4 uppercase tracking-widest">Monitor Diagnostics Explained</h3>
        <div className="space-y-4 text-lg text-muted-foreground font-roboto-mono leading-relaxed">
          <p>
            <strong className="text-primary">Dead Pixel Check:</strong> Dead pixels are picture elements that fail to light up or change color. Use the "Start Color Cycle" button to flash your screen with solid colors (Red, Green, Blue, Black, White). Look closely for any tiny dots that don't match the background color.
          </p>
          <p>
            <strong className="text-primary">Refresh Rate (Hz):</strong> This number represents how many times per second your monitor updates the image. A higher number (like 144Hz or 240Hz) means smoother motion in games and scrolling. If this number is lower than your monitor's advertised speed, check your display settings in Windows/macOS.
          </p>
          <p>
            <strong className="text-primary">Stuck vs. Dead Pixels:</strong> A "dead" pixel is usually black (off), while a "stuck" pixel is frozen on a specific color (red, green, or blue). Stuck pixels can sometimes be fixed with rapid flashing tools, but dead pixels are often permanent hardware defects.
          </p>
        </div>
      </div>
    </div>
  );
}
