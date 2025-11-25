import React, { useState, useEffect, useCallback } from 'react';
import { Maximize, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="flex flex-col items-center justify-center py-16 gap-8 text-center">
      <div className="max-w-lg space-y-4">
        <h3 className="text-2xl font-orbitron text-primary">Dead Pixel Locator</h3>
        <p className="text-muted-foreground">
          This tool cycles your screen through primary colors (Red, Green, Blue) and extremes (Black, White) 
          to help you spot stuck or dead pixels.
        </p>
        <div className="p-4 bg-surface border border-secondary/30 rounded text-left text-sm font-mono space-y-2">
          <p><strong className="text-primary">Dead Pixel:</strong> Usually black dot (transistor failed off).</p>
          <p><strong className="text-primary">Stuck Pixel:</strong> Usually red, green, or blue (transistor failed on).</p>
        </div>
      </div>

      <Button 
        size="lg" 
        onClick={enterFullscreen}
        className="bg-primary text-background hover:bg-primary/80 hover:scale-105 transition-all font-orbitron text-lg px-8 py-6 shadow-[0_0_20px_rgba(102,252,241,0.3)]"
      >
        <Maximize className="mr-2 w-5 h-5" />
        Start Color Cycle
      </Button>
      
      <p className="text-xs text-muted-foreground">Press ESC to exit full screen mode</p>
    </div>
  );
}
