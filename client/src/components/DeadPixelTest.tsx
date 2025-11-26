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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-center py-8 gap-6 text-center">
        <Button 
          size="lg" 
          onClick={enterFullscreen}
          className="bg-primary text-background hover:bg-primary/80 hover:scale-105 transition-all font-orbitron text-lg px-8 py-6 shadow-[0_0_20px_rgba(102,252,241,0.3)]"
        >
          <Maximize className="mr-2 w-5 h-5" />
          Start Color Cycle
        </Button>
        
        <p className="text-sm text-muted-foreground">Press ESC to exit full screen mode</p>
      </div>

      <div className="p-8 bg-surface border border-secondary/30 rounded-lg">
        <h3 className="text-primary font-orbitron text-2xl mb-4 uppercase tracking-widest">Dead Pixel Detection Guide</h3>
        <div className="space-y-4 text-lg text-muted-foreground font-roboto-mono leading-relaxed">
          <p>
            Dead pixels are a common defect in LCD and LED displays. A dead pixel is a single picture element (pixel) that fails to change color or remain illuminated. This tool helps you detect them by cycling through different colors at full-screen brightness.
          </p>
          <p>
            <strong className="text-primary">What to look for:</strong> Watch carefully for any pixels that don't match the current color. A dead pixel will appear as a different color (usually black or a stuck color) against the uniform background.
          </p>
          <p>
            <strong className="text-primary">Dead Pixel vs. Stuck Pixel:</strong> A dead pixel is a transistor that failed in the "off" position—it will appear as a black dot on any colored background. A stuck pixel is a transistor that failed in the "on" position—it will always be red, green, or blue, no matter what color is displayed.
          </p>
          <p>
            Click the button above to enter full-screen mode. The screen will cycle through Red, Green, Blue, Black, and White. Press the right arrow, spacebar, or Enter to move to the next color. Press ESC or left arrow to go back. Examine each color carefully, paying special attention to monitor edges and corners where manufacturing defects often occur.
          </p>
        </div>
      </div>
    </div>
  );
}
