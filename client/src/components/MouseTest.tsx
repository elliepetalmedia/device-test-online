import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { testStore } from '@/lib/store';

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
  const [pollingRate, setPollingRate] = useState<number>(0);
  const [peakPollingRate, setPeakPollingRate] = useState<number>(0);
  const [pollingHistory, setPollingHistory] = useState<number[]>([]);

  const lastClickRef = useRef<Record<number, number>>({});
  const lastMoveTimeRef = useRef<number>(0);
  const moveCountRef = useRef<number>(0);
  const lastRateCheckRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const testAreaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const now = performance.now();
    moveCountRef.current++;

    // Update Polling Rate every 1000ms (1 second) or rolling window
    if (now - lastRateCheckRef.current >= 250) { // Check every 250ms for responsiveness
      const timeDiff = now - lastRateCheckRef.current;
      const rate = Math.round((moveCountRef.current / timeDiff) * 1000);

      if (rate > 10) { // Filter out idle/slow movements
        setPollingRate(rate);
        setPeakPollingRate(prev => {
          const newPeak = Math.max(prev, rate);
          testStore.addResult('mouse', 'tested', { maxPollingHz: newPeak });
          return newPeak;
        });
        setPollingHistory(prev => [...prev, rate].slice(-50)); // Keep last 50 points
      }

      moveCountRef.current = 0;
      lastRateCheckRef.current = now;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu for right click

    const now = Date.now();
    const buttonId = e.button;

    // Skip side buttons if we aren't testing them
    if (buttonId === 3 || buttonId === 4) return;

    // Update visualizer state
    setActiveButtons(prev => new Set(prev).add(buttonId));

    // History Log
    const timeString = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });

    let buttonName = "";
    switch (buttonId) {
      case 0: buttonName = "Left Click"; break;
      case 1: buttonName = "Middle Click"; break;
      case 2: buttonName = "Right Click"; break;
      default: buttonName = `Button ${buttonId}`; break;
    }

    addHistoryEvent(buttonName);

    // Double Click Fault Detection (< 80ms)
    const lastTime = lastClickRef.current[buttonId];
    if (lastTime && (now - lastTime) < 80) {
      setFaultDetected(true);
      testStore.addResult('mouse', 'failed', { issue: "Double-Click Fault Detected" });
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

    // Only use non-passive listener for wheel to prevent scroll
    element.addEventListener('wheel', handleWheelNative, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheelNative);
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

    setHistory(prev => [newEvent, ...prev].slice(0, 5));
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <Card className="p-8 bg-surface border border-secondary/50 flex items-center justify-center min-h-[400px] relative overflow-hidden glow-border">
            <div
              ref={testAreaRef}
              className="w-full h-full absolute inset-0 cursor-crosshair z-10"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
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

              {/* Side Buttons REMOVED visually as requested */}
              <div className="absolute top-48 left-[-10px] w-4 h-16 border-2 border-secondary/30 rounded-l-lg opacity-30"></div>

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
            Polling Rate Test
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-background/50 p-4 rounded border border-secondary/20 text-center">
              <div className="text-xs text-muted-foreground font-mono uppercase mb-1">Current Rate</div>
              <div className="text-3xl font-orbitron text-primary glow-text">{pollingRate} <span className="text-sm text-muted-foreground">Hz</span></div>
            </div>
            <div className="bg-background/50 p-4 rounded border border-secondary/20 text-center">
              <div className="text-xs text-muted-foreground font-mono uppercase mb-1">Peak Rate</div>
              <div className="text-3xl font-orbitron text-neon-green">{peakPollingRate} <span className="text-sm text-muted-foreground">Hz</span></div>
            </div>
          </div>

          <div className="h-24 w-full bg-black/40 rounded border border-secondary/20 relative overflow-hidden flex items-end px-1 gap-0.5">
            {pollingHistory.map((rate, i) => {
              const height = Math.min((rate / 1000) * 100, 100); // Normalize 1000hz to 100% height
              const colorClass = rate > 900 ? 'bg-neon-green' : rate > 400 ? 'bg-primary' : 'bg-yellow-500';
              return (
                <div
                  key={i}
                  className={`flex-1 min-w-[4px] rounded-t-sm ${colorClass} transition-all duration-300`}
                  style={{ height: `${height}%` }}
                  title={`${rate} Hz`}
                />
              )
            })}
            <div className="absolute top-2 left-2 text-[10px] text-muted-foreground font-mono">Live Jitter Graph</div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-mono text-center">
            Move your mouse continuously in circles inside the test area to measure.
          </p>
        </div>

        <div className="bg-surface border border-secondary/30 rounded-lg p-6 h-full col-span-1 lg:col-span-2">
          <h3 className="text-primary font-orbitron mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Event Log
          </h3>
          <div className="space-y-2 font-roboto-mono text-sm max-h-[200px] overflow-y-auto">
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

      <div className="p-8 bg-surface border border-secondary/30 rounded-lg">
        <h2 className="text-primary font-orbitron text-2xl mb-6 uppercase tracking-widest border-b border-secondary/30 pb-4">Comprehensive Mouse Diagnostic Guide</h2>
        <div className="space-y-8 text-lg text-muted-foreground font-roboto-mono leading-relaxed">

          <section>
            <h3 className="text-xl font-orbitron text-white mb-2">How to Use the Online Mouse Tester</h3>
            <p>
              This free online tool provides a complete diagnostic suite for your computer mouse without requiring any downloads. Simply interact with the testing area above to verify button functionality, test scroll wheel performance, and measure sensor accuracy in real-time. Whether you're a competitive gamer checking polling rates or simply trying to diagnose a broken left-click, this dashboard gives you instant results.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-orbitron text-white mb-2">Diagnosing the "Double-Click" Mouse Fault</h3>
            <p className="mb-2">
              The most common hardware failure in modern mice (especially gaming mice from Logitech, Razer, and Corsair) is the dreaded double-click issue. This happens when a single physical press registers as two separate clicks, leading to accidental drag-and-drops or accidental right-clicks.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Why it happens:</strong> Inside your mouse are tiny "microswitches" (often made by Omron or Kailh). Over time, the copper tension spring inside these switches degrades, loses its curve, or builds up oxidation. When it snaps back into place, it physically bounces, sending multiple electrical signals.</li>
              <li><strong>How this tool helps:</strong> Our strict 80-millisecond threshold instantly flags these bounces. If you suspect a failing switch, rapidly click the suspect button. If the red warning banner appears, your switch is failing mechanically.</li>
              <li><strong>How to fix a double-clicking mouse:</strong> Temporary software fixes include increasing your OS double-click speed or using debounce delay software. However, the only permanent fix is either replacing the entire mouse or desoldering and replacing the broken microswitch on the PCB with a new one.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-orbitron text-white mb-2">Understanding Mouse Polling Rate & Jitter</h3>
            <p className="mb-2">
              The <strong className="text-primary">Polling Rate</strong> (measured in Hz) dictates how many times per second your mouse reports its position to your computer. A 1000Hz mouse reports every 1ms, while a standard 125Hz office mouse reports every 8ms.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Higher polling rates provide smoother cursor movement and lower input latency, which is crucial for competitive gaming.</li>
              <li><strong>How to test:</strong> Move your mouse continuously in circles inside the test area. The "Current Rate" will display your real-time frequency.</li>
              <li><strong>What is Sensor Jitter?</strong> The bar graph visualizes consistency. If your mouse is set to 1000Hz but the graph constantly drops to 400Hz or spikes unpredictably, your mouse sensor may be experiencing "jitter." This can be caused by a dirty sensor lens, a poor mousepad surface, or USB bandwidth issues.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-orbitron text-white mb-2">Scroll Wheel Not Working Properly?</h3>
            <p>
              If your scroll wheel jumps in the opposite direction or fails to register scrolls, the internal rotary encoder is likely filled with dust or mechanically failing. Use the test area by scrolling up and down. If you scroll continuously down but the green "Scroll Up" arrow briefly flashes, your encoder is faulty. You can often temporarily fix this by blowing compressed air directly into the wheel housing.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}