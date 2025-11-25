import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

interface ClickEvent {
  button: string;
  timestamp: string;
  rawTime: number;
}

export function MouseTest() {
  const [history, setHistory] = useState<ClickEvent[]>([]);
  const [activeButtons, setActiveButtons] = useState<Set<number>>(new Set());
  const [faultDetected, setFaultDetected] = useState(false);
  const lastClickRef = useRef<Record<number, number>>({});
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu for right click
    
    const now = Date.now();
    const buttonId = e.button; // 0 = Left, 1 = Middle, 2 = Right
    
    // Update visualizer state
    setActiveButtons(prev => new Set(prev).add(buttonId));
    
    // History Log
    const timeString = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
    const buttonName = buttonId === 0 ? "Left Click" : buttonId === 1 ? "Middle Click" : "Right Click";
    
    const newEvent: ClickEvent = {
      button: buttonName,
      timestamp: timeString,
      rawTime: now
    };
    
    setHistory(prev => [newEvent, ...prev].slice(0, 10));
    
    // Double Click Fault Detection (< 80ms)
    const lastTime = lastClickRef.current[buttonId];
    if (lastTime && (now - lastTime) < 80) {
      setFaultDetected(true);
    }
    
    lastClickRef.current[buttonId] = now;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    const buttonId = e.button;
    setActiveButtons(prev => {
      const next = new Set(prev);
      next.delete(buttonId);
      return next;
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-6">
        <Card className="p-8 bg-surface border border-secondary/50 flex items-center justify-center min-h-[400px] relative overflow-hidden glow-border">
          <div 
            className="w-full h-full absolute inset-0 cursor-crosshair z-10"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onContextMenu={handleContextMenu}
            data-testid="mouse-test-area"
          />
          
          {/* Mouse Graphic */}
          <div className="relative w-64 h-96 pointer-events-none select-none">
            {/* Mouse Body Base */}
            <div className="absolute inset-0 bg-background rounded-[4rem] border-2 border-secondary shadow-[0_0_20px_rgba(70,252,241,0.1)]"></div>
            
            {/* Left Button */}
            <div className={`absolute top-0 left-0 w-1/2 h-40 border-2 border-secondary rounded-tl-[4rem] transition-colors duration-100 ${activeButtons.has(0) ? 'bg-primary shadow-[0_0_15px_var(--color-primary)]' : 'bg-surface'}`}>
              <span className="absolute bottom-4 left-0 w-full text-center text-xs font-orbitron text-foreground/70">LEFT</span>
            </div>
            
            {/* Right Button */}
            <div className={`absolute top-0 right-0 w-1/2 h-40 border-2 border-secondary rounded-tr-[4rem] transition-colors duration-100 ${activeButtons.has(2) ? 'bg-primary shadow-[0_0_15px_var(--color-primary)]' : 'bg-surface'}`}>
              <span className="absolute bottom-4 left-0 w-full text-center text-xs font-orbitron text-foreground/70">RIGHT</span>
            </div>
            
            {/* Middle Button / Scroll Wheel */}
            <div className={`absolute top-16 left-1/2 -translate-x-1/2 w-8 h-20 border-2 border-secondary rounded-full transition-colors duration-100 ${activeButtons.has(1) ? 'bg-primary shadow-[0_0_15px_var(--color-primary)]' : 'bg-background'}`}></div>
            
            {/* Palm Rest Logo */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-secondary/20 font-orbitron text-4xl font-bold">DTO</div>
          </div>
          
          <div className="absolute bottom-4 text-muted-foreground text-sm animate-pulse">
            Click anywhere in this box to test
          </div>
        </Card>

        {faultDetected && (
          <div className="space-y-4 animate-in slide-in-from-bottom fade-in duration-500">
            <Alert variant="destructive" className="border-neon-red bg-neon-red/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-orbitron">Potential Double-Click Fault Detected</AlertTitle>
              <AlertDescription>
                We detected two clicks within 80ms. This typically indicates a failing microswitch.
              </AlertDescription>
            </Alert>
            
            <div id="affiliate-offer" className="p-4 border border-primary bg-primary/5 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
              <div>
                <h4 className="text-primary font-orbitron text-sm mb-1">Mouse switch failing?</h4>
                <p className="text-xs text-muted-foreground">Recommended Replacement: Logitech G502</p>
              </div>
              <ExternalLink className="text-primary w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface border border-secondary/30 rounded-lg p-6 h-full">
        <h3 className="text-primary font-orbitron mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Event Log
        </h3>
        <div className="space-y-2 font-roboto-mono text-sm">
          {history.length === 0 && (
            <div className="text-muted-foreground italic py-4 text-center border border-dashed border-secondary/20 rounded">
              Waiting for input...
            </div>
          )}
          {history.map((event, i) => (
            <div key={event.rawTime + i} className="flex justify-between items-center p-2 bg-background/50 border-l-2 border-secondary animate-in fade-in slide-in-from-left-2">
              <span className="text-foreground">{event.button}</span>
              <span className="text-primary">{event.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
