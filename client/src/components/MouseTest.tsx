import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
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
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [faultDetected, setFaultDetected] = useState(false);
  const lastClickRef = useRef<Record<number, number>>({});
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const testAreaRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu for right click
    
    const now = Date.now();
    const buttonId = e.button; 
    
    // Update visualizer state
    setActiveButtons(prev => new Set(prev).add(buttonId));
    
    // History Log
    const timeString = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
    
    let buttonName = "";
    switch(buttonId) {
        case 0: buttonName = "Left Click"; break;
        case 1: buttonName = "Middle Click"; break;
        case 2: buttonName = "Right Click"; break;
        case 3: buttonName = "Back Button (Side)"; break;
        case 4: buttonName = "Forward Button (Side)"; break;
        default: buttonName = `Button ${buttonId}`; break;
    }
    
    addHistoryEvent(buttonName);
    
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

  useEffect(() => {
    const element = testAreaRef.current;
    if (!element) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      
      const direction = e.deltaY < 0 ? 'up' : 'down';
      setScrollDirection(direction);
      
      if (!scrollTimeoutRef.current) {
          addHistoryEvent(direction === 'up' ? "Scroll Up" : "Scroll Down");
          scrollTimeoutRef.current = setTimeout(() => {
              scrollTimeoutRef.current = null;
              setScrollDirection(null);
          }, 150);
      } else {
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = setTimeout(() => {
              scrollTimeoutRef.current = null;
              setScrollDirection(null);
          }, 150);
      }
    };

    // Prevent side button navigation - Use capture phase at window level
    // Handling mousedown, mouseup, etc directly here to access state
    const handleMouseNative = (e: MouseEvent) => {
        // Check if back (3) or forward (4) buttons
        if (e.button === 3 || e.button === 4) {
            e.preventDefault();
            
            // We used to stop propagation here, but that killed our own event logic
            // Now we just prevent default and let it bubble so our React state can update
            
            console.log("Prevented side button navigation", e.type);
            
            const buttonId = e.button;
            const buttonName = e.button === 3 ? "Back Button (Side)" : "Forward Button (Side)";
            const now = Date.now();

            if (e.type === 'mousedown') {
                setActiveButtons(prev => new Set(prev).add(buttonId));
                const timeString = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
                const newEvent: ClickEvent = {
                  button: buttonName,
                  timestamp: timeString,
                  rawTime: now
                };
                setHistory(prev => [newEvent, ...prev].slice(0, 10));
            } else if (e.type === 'mouseup') {
                setActiveButtons(prev => {
                    const next = new Set(prev);
                    next.delete(buttonId);
                    return next;
                });
            }
            
            // Also try to push state to prevent back nav if it slips through
            window.history.pushState(null, document.title, window.location.href);
            
            // IMPORTANT: Return false to help prevent default in some browsers
            return false;
        }
    };

    // Add pointer events listener for better compatibility
    const handlePointerNative = (e: PointerEvent) => {
         if (e.button === 3 || e.button === 4) {
            e.preventDefault();
            // No stopPropagation to ensure it registers
         }
    };

    // Prevent popstate if it was triggered by a side button
    const handlePopState = (e: PopStateEvent) => {
        // Push state back to keep user on page
        window.history.pushState(null, document.title, window.location.href);
    };

    // Important: use capture: true to intercept before browser default
    element.addEventListener('wheel', handleWheelNative, { passive: false });
    
    window.addEventListener('mouseup', handleMouseNative, { capture: true });
    window.addEventListener('mousedown', handleMouseNative, { capture: true });
    window.addEventListener('pointerup', handlePointerNative, { capture: true });
    window.addEventListener('pointerdown', handlePointerNative, { capture: true });
    
    window.addEventListener('click', handleMouseNative, { capture: true }); // Add click just in case
    window.addEventListener('auxclick', handleMouseNative, { capture: true }); // Add auxclick for non-primary buttons
    window.addEventListener('popstate', handlePopState);

    // Initial push to create history buffer
    window.history.pushState(null, document.title, window.location.href);

    return () => {
      element.removeEventListener('wheel', handleWheelNative);
      window.removeEventListener('mouseup', handleMouseNative, { capture: true });
      window.removeEventListener('mousedown', handleMouseNative, { capture: true });
      window.removeEventListener('pointerup', handlePointerNative, { capture: true });
      window.removeEventListener('pointerdown', handlePointerNative, { capture: true });
      window.removeEventListener('click', handleMouseNative, { capture: true });
      window.removeEventListener('auxclick', handleMouseNative, { capture: true });
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const addHistoryEvent = (name: string) => {
    const now = Date.now();
    const timeString = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
    
    const newEvent: ClickEvent = {
      button: name,
      timestamp: timeString,
      rawTime: now
    };
    
    setHistory(prev => [newEvent, ...prev].slice(0, 10));
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-6">
        <Card className="p-8 bg-surface border border-secondary/50 flex items-center justify-center min-h-[400px] relative overflow-hidden glow-border">
          <div 
            ref={testAreaRef}
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
            
            {/* Side Buttons (Back/Forward) - Visualized on left side */}
            <div className={`absolute top-48 left-[-10px] w-4 h-16 border-2 border-secondary rounded-l-lg transition-colors duration-100 flex flex-col overflow-hidden ${activeButtons.has(3) || activeButtons.has(4) ? 'shadow-[0_0_15px_var(--color-primary)]' : ''}`}>
                 {/* Forward (Button 4) */}
                 <div className={`h-1/2 w-full border-b border-secondary transition-colors ${activeButtons.has(4) ? 'bg-primary' : 'bg-surface'}`}></div>
                 {/* Back (Button 3) */}
                 <div className={`h-1/2 w-full transition-colors ${activeButtons.has(3) ? 'bg-primary' : 'bg-surface'}`}></div>
            </div>

            {/* Middle Button / Scroll Wheel Area */}
            <div className={`absolute top-16 left-1/2 -translate-x-1/2 w-8 h-24 flex flex-col items-center justify-center gap-1 transition-colors duration-100`}>
               {/* Scroll Up Indicator */}
               <div className={`transition-all duration-100 ${scrollDirection === 'up' ? 'text-neon-green translate-y-[-2px]' : 'text-secondary/20'}`}>
                 <ArrowUp size={16} />
               </div>
               
               {/* Physical Wheel */}
               <div className={`w-8 h-12 border-2 border-secondary rounded-full transition-colors duration-100 flex items-center justify-center overflow-hidden ${activeButtons.has(1) ? 'bg-primary shadow-[0_0_15px_var(--color-primary)]' : 'bg-background'}`}>
                  {/* Wheel Ridges Animation */}
                  <div className={`w-full h-full bg-[linear-gradient(transparent_45%,currentColor_50%,transparent_55%)] bg-[length:100%_6px] opacity-30 ${scrollDirection === 'up' ? 'animate-[moveBackground_0.5s_linear_infinite_reverse]' : scrollDirection === 'down' ? 'animate-[moveBackground_0.5s_linear_infinite]' : ''}`}></div>
               </div>

               {/* Scroll Down Indicator */}
               <div className={`transition-all duration-100 ${scrollDirection === 'down' ? 'text-neon-green translate-y-[2px]' : 'text-secondary/20'}`}>
                 <ArrowDown size={16} />
               </div>
            </div>
            
            {/* Palm Rest Logo */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-secondary/20 font-orbitron text-4xl font-bold">DTO</div>
          </div>
          
          <div className="absolute bottom-4 text-muted-foreground text-sm animate-pulse">
            Click or scroll inside this box to test
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
