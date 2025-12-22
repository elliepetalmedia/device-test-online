import React, { useEffect, useState, useRef } from 'react';
import { Gamepad2, AlertCircle, CheckCircle2, Play, RefreshCw, Crosshair, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface GamepadState {
  id: string;
  index: number;
  buttons: readonly GamepadButton[];
  axes: readonly number[];
  connected: boolean;
  timestamp: number;
}

type TestState = 'IDLE' | 'AGITATE' | 'SETTLE' | 'SAMPLING' | 'RESULT';

interface DriftSample {
  x: number;
  y: number;
}

interface AxisResult {
  avg: number;
  jitter: number;
  drift: number;
}

interface StickResult {
  x: AxisResult;
  y: AxisResult;
  driftPercentage: number;
  passed: boolean;
}

interface DriftTestOverlayProps {
  gamepad: GamepadState;
  testState: TestState;
  countdown: number;
  results: Record<number, StickResult>;
  onStartTest: (index: number) => void;
  onResetTest: () => void;
}

const DriftTestOverlay = ({ 
  gamepad, 
  testState, 
  countdown, 
  results, 
  onStartTest, 
  onResetTest 
}: DriftTestOverlayProps) => {
  if (testState === 'IDLE') {
    return (
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center">
        <Crosshair className="w-16 h-16 text-primary mb-4 opacity-50" />
        <h3 className="text-2xl font-orbitron font-bold text-white mb-2">Drift Analysis Protocol</h3>
        <p className="text-muted-foreground max-w-md mb-6 font-mono text-sm">
          This test measures the precise resting position and signal noise (jitter) of your analog sticks to detect hardware drift.
        </p>
        <Button onClick={() => onStartTest(gamepad.index)} className="font-orbitron tracking-widest bg-primary text-black hover:bg-primary/80 relative z-30 pointer-events-auto">
          <Play className="w-4 h-4 mr-2" /> BEGIN TEST sequence
        </Button>
      </div>
    );
  }

  if (testState === 'AGITATE') {
    return (
      <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <Activity className="w-16 h-16 text-primary mb-4 animate-bounce" />
        <h3 className="text-3xl font-orbitron font-bold text-primary mb-2">AGITATE STICKS</h3>
        <p className="text-white max-w-md font-bold text-lg">
          Rotate both sticks in circles vigorously!
        </p>
        <p className="text-muted-foreground mt-2 text-sm">Warming up sensors...</p>
      </div>
    );
  }

  if (testState === 'SETTLE') {
    return (
      <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-8xl font-orbitron font-black text-white mb-4 animate-pulse">{countdown}</div>
        <h3 className="text-2xl font-orbitron font-bold text-neon-red mb-2">RELEASE STICKS NOW!</h3>
        <p className="text-muted-foreground">Do not touch the controller.</p>
      </div>
    );
  }

  if (testState === 'SAMPLING') {
    return (
      <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-orbitron font-bold text-white tracking-widest">SAMPLING SENSOR DATA</h3>
        <p className="text-primary font-mono mt-2">Recording micro-movements...</p>
      </div>
    );
  }

  if (testState === 'RESULT') {
    const leftStick = results[0];
    const rightStick = results[1];
    
    return (
      <div className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-center p-4 md:p-8 animate-in zoom-in-95">
        <h3 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
          <CheckCircle2 className="text-primary" /> ANALYSIS COMPLETE
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Left Stick Report */}
          <div className={cn("p-4 rounded border", leftStick?.passed ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5")}>
            <h4 className="font-orbitron text-sm text-muted-foreground mb-4 uppercase">Left Stick</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-24 h-24 bg-black rounded-full border border-white/10">
                {/* Deadzone */}
                <div className="absolute inset-0 m-auto w-1/2 h-1/2 rounded-full border border-green-500/30 bg-green-500/5"></div>
                {/* Center */}
                <div className="absolute inset-0 m-auto w-1 h-1 bg-white/20 rounded-full"></div>
                {/* Result Point */}
                {leftStick && (
                  <div 
                    className={cn("absolute w-2 h-2 rounded-full shadow-[0_0_10px]", leftStick.passed ? "bg-green-500 shadow-green-500" : "bg-red-500 shadow-red-500")}
                    style={{ 
                      left: `calc(50% + ${leftStick.x.avg * 50}%)`, 
                      top: `calc(50% + ${leftStick.y.avg * 50}%)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  ></div>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold font-orbitron mb-1">
                  {leftStick?.driftPercentage.toFixed(1)}%
                </div>
                <div className={cn("text-xs font-bold uppercase px-2 py-0.5 rounded inline-block", leftStick?.passed ? "bg-green-500 text-black" : "bg-red-500 text-white")}>
                  {leftStick?.passed ? "PASS" : "FAIL"}
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <div className="flex justify-between"><span>Jitter X:</span> <span>{leftStick?.x.jitter.toFixed(5)}</span></div>
              <div className="flex justify-between"><span>Jitter Y:</span> <span>{leftStick?.y.jitter.toFixed(5)}</span></div>
            </div>
          </div>

          {/* Right Stick Report */}
          <div className={cn("p-4 rounded border", rightStick?.passed ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5")}>
            <h4 className="font-orbitron text-sm text-muted-foreground mb-4 uppercase">Right Stick</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-24 h-24 bg-black rounded-full border border-white/10">
                {/* Deadzone */}
                <div className="absolute inset-0 m-auto w-1/2 h-1/2 rounded-full border border-green-500/30 bg-green-500/5"></div>
                {/* Center */}
                <div className="absolute inset-0 m-auto w-1 h-1 bg-white/20 rounded-full"></div>
                {/* Result Point */}
                {rightStick && (
                  <div 
                    className={cn("absolute w-2 h-2 rounded-full shadow-[0_0_10px]", rightStick.passed ? "bg-green-500 shadow-green-500" : "bg-red-500 shadow-red-500")}
                    style={{ 
                      left: `calc(50% + ${rightStick.x.avg * 50}%)`, 
                      top: `calc(50% + ${rightStick.y.avg * 50}%)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  ></div>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold font-orbitron mb-1">
                  {rightStick?.driftPercentage.toFixed(1)}%
                </div>
                <div className={cn("text-xs font-bold uppercase px-2 py-0.5 rounded inline-block", rightStick?.passed ? "bg-green-500 text-black" : "bg-red-500 text-white")}>
                  {rightStick?.passed ? "PASS" : "FAIL"}
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <div className="flex justify-between"><span>Jitter X:</span> <span>{rightStick?.x.jitter.toFixed(5)}</span></div>
              <div className="flex justify-between"><span>Jitter Y:</span> <span>{rightStick?.y.jitter.toFixed(5)}</span></div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={onResetTest} className="border-white/20 hover:bg-white/10 relative z-30 pointer-events-auto">
            Close
          </Button>
          <Button onClick={() => onStartTest(gamepad.index)} className="bg-primary text-black hover:bg-primary/80 relative z-30 pointer-events-auto">
            <RefreshCw className="w-4 h-4 mr-2" /> Retest
          </Button>
        </div>
      </div>
    );
  }
  
  return null;
};

export function GamepadTest() {
  const [gamepads, setGamepads] = useState<Record<number, GamepadState>>({});
  const [selectedLayout, setSelectedLayout] = useState<'generic' | 'xbox' | 'playstation'>('generic');
  
  // Drift Test State
  const [activeTestIndex, setActiveTestIndex] = useState<number | null>(null);
  const [testState, setTestState] = useState<TestState>('IDLE');
  const [countdown, setCountdown] = useState(3);
  const [results, setResults] = useState<Record<number, StickResult>>({}); // Key: Stick Index
  
  const samplesRef = useRef<Record<number, DriftSample[]>>({}); // Use Ref for synchronous sample collection
  const requestRef = useRef<number | null>(null);
  const testTimerRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef(0);
  const { toast } = useToast();

  const scanGamepads = () => {
    // @ts-ignore
    const connectedGamepads = navigator.getGamepads();
    const newGamepads: Record<number, GamepadState> = {};

    for (const gamepad of connectedGamepads) {
      if (gamepad) {
        newGamepads[gamepad.index] = {
          id: gamepad.id,
          index: gamepad.index,
          buttons: gamepad.buttons,
          axes: gamepad.axes,
          connected: gamepad.connected,
          timestamp: gamepad.timestamp
        };

        // Drift Sampling Logic
        if (activeTestIndex === gamepad.index && testState === 'SAMPLING') {
           collectSamples(newGamepads[gamepad.index]);
        }
      }
    }

    setGamepads(newGamepads);
    requestRef.current = requestAnimationFrame(scanGamepads);
  };

  const collectSamples = (gamepad: GamepadState) => {
      // Typically Stick 0 is axes 0,1 and Stick 1 is axes 2,3
      // We'll collect for both sticks simultaneously
      const sticks = [0, 1];
      
      sticks.forEach(stickIdx => {
          const xIndex = stickIdx * 2;
          const yIndex = stickIdx * 2 + 1;
          
          if (xIndex < gamepad.axes.length && yIndex < gamepad.axes.length) {
              const sample: DriftSample = {
                  x: gamepad.axes[xIndex],
                  y: gamepad.axes[yIndex]
              };
              
              if (!samplesRef.current[stickIdx]) {
                samplesRef.current[stickIdx] = [];
              }
              samplesRef.current[stickIdx].push(sample);
          }
      });

      frameCountRef.current++;
      
      // Stop after 60 frames (approx 1 second)
      if (frameCountRef.current >= 60) {
          calculateResults();
          setTestState('RESULT');
      }
  };

  const calculateResults = () => {
      const newResults: Record<number, StickResult> = {};
      
      [0, 1].forEach(stickIdx => {
          const stickSamples = samplesRef.current[stickIdx];
          if (!stickSamples || stickSamples.length === 0) return;
          
          // Calculate Mean
          const sumX = stickSamples.reduce((acc, s) => acc + s.x, 0);
          const sumY = stickSamples.reduce((acc, s) => acc + s.y, 0);
          const avgX = sumX / stickSamples.length;
          const avgY = sumY / stickSamples.length;
          
          // Calculate Variance (Jitter)
          const varX = stickSamples.reduce((acc, s) => acc + Math.pow(s.x - avgX, 2), 0) / stickSamples.length;
          const varY = stickSamples.reduce((acc, s) => acc + Math.pow(s.y - avgY, 2), 0) / stickSamples.length;
          
          const driftDistance = Math.sqrt(Math.pow(avgX, 2) + Math.pow(avgY, 2));
          
          newResults[stickIdx] = {
              x: { avg: avgX, jitter: Math.sqrt(varX), drift: avgX },
              y: { avg: avgY, jitter: Math.sqrt(varY), drift: avgY },
              driftPercentage: driftDistance * 100, // 0-1 scale to percentage
              passed: driftDistance < 0.05 // 5% deadzone tolerance
          };
      });
      
      setResults(newResults);
  };

  const startDriftTest = (gamepadIndex: number) => {
      setActiveTestIndex(gamepadIndex);
      setTestState('AGITATE');
      setCountdown(3);
      samplesRef.current = {}; // Reset samples
      setResults({});
      frameCountRef.current = 0;
      
      // Start Agitate Timer
      if (testTimerRef.current) clearTimeout(testTimerRef.current);
      
      const runTestSequence = async () => {
          // Phase 1: Agitate (3s)
          await new Promise(r => setTimeout(r, 3000));
          
          // Phase 2: Settle (3s countdown)
          setTestState('SETTLE');
          setCountdown(3);
          
          const countdownInterval = setInterval(() => {
              setCountdown(prev => {
                  if (prev <= 1) {
                      clearInterval(countdownInterval);
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
          
          await new Promise(r => setTimeout(r, 3000));
          
          // Phase 3: Sampling
          setTestState('SAMPLING');
          // Sampling happens in scanGamepads loop
      };
      
      runTestSequence();
  };

  useEffect(() => {
    window.addEventListener("gamepadconnected", (e) => {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      console.log("Gamepad disconnected from index %d: %s",
        e.gamepad.index, e.gamepad.id);
    });

    requestRef.current = requestAnimationFrame(scanGamepads);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (testTimerRef.current) {
          clearTimeout(testTimerRef.current);
      }
    };
  }, [activeTestIndex, testState]);

  const hasGamepads = Object.keys(gamepads).length > 0;

  const renderLayoutButtons = (gamepad?: GamepadState) => {
    const buttons = gamepad ? gamepad.buttons : Array.from({ length: 16 }).map(() => ({ pressed: false, value: 0 }));
    
    // Customize button labels based on layout
    const getLabel = (index: number) => {
      if (selectedLayout === 'xbox') {
        const labels = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'LS', 'RS', 'Up', 'Down', 'Left', 'Right'];
        return labels[index] || index.toString();
      }
      if (selectedLayout === 'playstation') {
        const labels = ['✕', '○', '□', '△', 'L1', 'R1', 'L2', 'R2', 'Share', 'Options', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right'];
        return labels[index] || index.toString();
      }
      return index.toString();
    };

    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {buttons.map((button, i) => (
          <div 
            key={i}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded border transition-all duration-75 aspect-square",
              button.pressed 
                ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(102,252,241,0.5)] scale-95" 
                : "bg-black/40 text-muted-foreground border-white/10"
            )}
          >
            <span className="font-orbitron font-bold text-lg mb-1">{getLabel(i)}</span>
            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-current transition-none" 
                // @ts-ignore
                style={{ width: `${button.value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLayoutAxes = (gamepad?: GamepadState) => {
    const axes = gamepad ? gamepad.axes : [0, 0, 0, 0];
    
    return (
      <div className="grid gap-6">
        {Array.from({ length: Math.ceil(axes.length / 2) }).map((_, pairIndex) => {
          const xIndex = pairIndex * 2;
          const yIndex = pairIndex * 2 + 1;
          const xValue = axes[xIndex] || 0;
          const yValue = axes[yIndex] || 0;
          const hasY = yIndex < axes.length;

          return (
            <div key={pairIndex} className="bg-black/20 p-4 rounded border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-muted-foreground">
                  Stick {pairIndex + 1} (Axes {xIndex}{hasY ? ` & ${yIndex}` : ''})
                </span>
              </div>
              
              <div className="flex gap-6 items-center">
                {/* 2D Visualization */}
                <div className="w-24 h-24 rounded-full border border-white/20 bg-black/40 relative shrink-0">
                  <div 
                    className="absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(102,252,241,0.8)] top-1/2 left-1/2 -ml-2 -mt-2 transition-none"
                    style={{ 
                      transform: `translate(${xValue * 40}px, ${hasY ? yValue * 40 : 0}px)`
                    }}
                  />
                  {/* Crosshairs */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
                </div>

                {/* Sliders */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>AXIS {xIndex} (X)</span>
                      <span className={cn(Math.abs(xValue) > 0.1 ? "text-primary" : "text-muted-foreground")}>
                        {xValue.toFixed(4)}
                      </span>
                    </div>
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
                      <div 
                        className="h-full bg-primary/80 absolute top-0 transition-none"
                        style={{ 
                          left: xValue < 0 ? `${(1 + xValue) * 50}%` : '50%',
                          width: `${Math.abs(xValue) * 50}%`
                        }}
                      />
                    </div>
                  </div>

                  {hasY && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span>AXIS {yIndex} (Y)</span>
                        <span className={cn(Math.abs(yValue) > 0.1 ? "text-primary" : "text-muted-foreground")}>
                          {yValue.toFixed(4)}
                        </span>
                      </div>
                      <div className="h-2 bg-black/50 rounded-full overflow-hidden relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
                        <div 
                          className="h-full bg-primary/80 absolute top-0 transition-none"
                          style={{ 
                            left: yValue < 0 ? `${(1 + yValue) * 50}%` : '50%',
                            width: `${Math.abs(yValue) * 50}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const testVibration = async (gamepad: GamepadState) => {
    // @ts-ignore
    const gp = navigator.getGamepads()[gamepad.index];
    
    if (!gp) {
      toast({
        variant: "destructive",
        title: "Controller Not Found",
        description: "Could not find the gamepad instance. Try reconnecting.",
      });
      return;
    }

    // @ts-ignore - vibrationActuator is not fully typed in all TS versions yet
    if (gp.vibrationActuator) {
      try {
        // @ts-ignore
        await gp.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 1000,
          weakMagnitude: 1.0,
          strongMagnitude: 1.0,
        });
        toast({
          title: "Vibration Sent",
          description: "Sent dual-rumble command to controller.",
        });
      } catch (error: any) {
        console.error("Vibration failed:", error);
        toast({
          variant: "destructive",
          title: "Vibration Failed",
          description: `Error: ${error.message || "Unknown error"}`,
        });
      }
    } 
    // Fallback for older implementations (Firefox often uses hapticActuators)
    // @ts-ignore
    else if (gp.hapticActuators && gp.hapticActuators.length > 0) {
       try {
         // @ts-ignore
         await gp.hapticActuators[0].pulse(1.0, 1000);
         toast({
          title: "Vibration Sent",
          description: "Sent haptic pulse command to controller.",
        });
       } catch (error: any) {
         console.error("Haptic pulse failed", error);
         toast({
            variant: "destructive",
            title: "Haptic Pulse Failed",
            description: `Error: ${error.message || "Unknown error"}`,
        });
       }
    } else {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Vibration API is not supported by this browser or controller.",
      });
      console.warn("Vibration not supported on this device or browser");
    }
  };


  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/40 border-primary/20 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Gamepad2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-orbitron font-bold text-foreground mb-2">Gamepad Diagnostics</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
               <div className="flex gap-2">
                 <button 
                   onClick={() => setSelectedLayout('generic')}
                   className={cn(
                     "px-3 py-1.5 text-xs font-bold rounded border transition-colors",
                     selectedLayout === 'generic' ? "bg-primary text-black border-primary" : "bg-black/20 text-muted-foreground border-white/10 hover:border-white/20"
                   )}
                 >
                   GENERIC
                 </button>
                 <button 
                   onClick={() => setSelectedLayout('xbox')}
                   className={cn(
                     "px-3 py-1.5 text-xs font-bold rounded border transition-colors",
                     selectedLayout === 'xbox' ? "bg-green-600 text-white border-green-500" : "bg-black/20 text-muted-foreground border-white/10 hover:border-white/20"
                   )}
                 >
                   XBOX
                 </button>
                 <button 
                   onClick={() => setSelectedLayout('playstation')}
                   className={cn(
                     "px-3 py-1.5 text-xs font-bold rounded border transition-colors",
                     selectedLayout === 'playstation' ? "bg-blue-600 text-white border-blue-500" : "bg-black/20 text-muted-foreground border-white/10 hover:border-white/20"
                   )}
                 >
                   PLAYSTATION
                 </button>
               </div>
            </div>

            {!hasGamepads ? (
              <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-4 rounded border border-yellow-500/20 mb-4">
                <AlertCircle className="w-5 h-5" />
                <span className="font-roboto-mono text-sm">No gamepad detected. Connect a device and press any button to wake it up.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-neon-green bg-neon-green/10 p-4 rounded border border-neon-green/20 mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-roboto-mono text-sm">{Object.keys(gamepads).length} device(s) connected</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {hasGamepads ? (
        Object.values(gamepads).map((gamepad) => (
          <React.Fragment key={gamepad.index}>
            <Card className="p-6 bg-black/40 border-primary/20 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                    <h4 className="font-orbitron text-lg text-primary truncate max-w-md" title={gamepad.id}>
                    {gamepad.id}
                    </h4>
                    <div className="flex gap-4 items-center mt-2">
                    <div className="text-xs font-mono text-muted-foreground">
                        Index: {gamepad.index} | Buttons: {gamepad.buttons.length} | Axes: {gamepad.axes.length}
                    </div>
                    <button 
                        onClick={() => testVibration(gamepad)}
                        className="text-sm bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 px-4 py-2 rounded transition-colors uppercase font-bold tracking-wider"
                    >
                        Test Vibration
                    </button>
                    <div className="flex flex-col text-base leading-tight text-muted-foreground/80 font-mono">
                        <span className="text-green-400">Chrome/Edge: Supported</span>
                        <span className="text-orange-400">Firefox: Limited</span>
                        <span className="text-red-400">Safari: Not Supported</span>
                    </div>
                    </div>
                </div>
                <div className="px-2 py-1 bg-primary/20 border border-primary text-primary text-xs font-bold rounded uppercase tracking-wider animate-pulse">
                    Live Input
                </div>
                </div>

          {/* Two Column Layout for Compactness */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
                 {/* Visualizer */}
                 <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <h5 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
                        Button State
                        </h5>
                        {renderLayoutButtons(gamepad)}
                    </div>

                    <div className="space-y-4">
                        <h5 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest border-l-2 border-secondary pl-3">
                        Analog Axes
                        </h5>
                        {renderLayoutAxes(gamepad)}
                    </div>
                </div>
            </div>

            {/* Drift Test Sidebar */}
            <div className="lg:col-span-5">
                 <Card className="h-full bg-black/40 border-white/10 backdrop-blur-sm relative overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div>
                            <h4 className="font-orbitron text-base text-white">Drift Analysis</h4>
                            <p className="text-xs text-muted-foreground font-mono">Statistical sensor check</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative bg-black/50">
                         <DriftTestOverlay 
                            gamepad={gamepad}
                            testState={activeTestIndex === gamepad.index ? testState : 'IDLE'}
                            countdown={countdown}
                            results={results}
                            onStartTest={startDriftTest}
                            onResetTest={() => setTestState('IDLE')}
                         />
                    </div>
                </Card>
            </div>
          </div>
          </Card>
          </React.Fragment>
        ))
      ) : (
        <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm opacity-60">
           <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h4 className="font-orbitron text-lg text-muted-foreground">
                Device Test Preview
              </h4>
              <div className="text-xs font-mono text-muted-foreground mt-1">
                Waiting for device...
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pointer-events-none grayscale">
            <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <h5 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest border-l-2 border-white/20 pl-3">
                            Button State
                        </h5>
                        {renderLayoutButtons()}
                    </div>

                    <div className="space-y-4">
                        <h5 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest border-l-2 border-white/20 pl-3">
                            Analog Axes
                        </h5>
                        {renderLayoutAxes()}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5">
                 <Card className="h-full bg-black/40 border-white/10 backdrop-blur-sm relative overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div>
                            <h4 className="font-orbitron text-base text-white">Drift Analysis</h4>
                            <p className="text-xs text-muted-foreground font-mono">Statistical sensor check</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative bg-black/50 flex flex-col items-center justify-center p-8 text-center">
                        <Crosshair className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
                        <h3 className="text-2xl font-orbitron font-bold text-muted-foreground mb-2">Drift Analysis Protocol</h3>
                        <p className="text-muted-foreground max-w-md mb-6 font-mono text-sm opacity-50">
                            Connect a controller to enable the drift analysis test sequence.
                        </p>
                        <Button disabled className="font-orbitron tracking-widest bg-white/10 text-muted-foreground">
                            <Play className="w-4 h-4 mr-2" /> BEGIN TEST sequence
                        </Button>
                    </div>
                </Card>
            </div>
          </div>
        </Card>
      )}

      <div className="p-8 bg-surface border border-secondary/30 rounded-lg">
        <h3 className="text-primary font-orbitron text-2xl mb-4 uppercase tracking-widest">Gamepad Diagnostics Guide</h3>
        <div className="space-y-4 text-lg text-muted-foreground font-roboto-mono leading-relaxed">
          <p>
            <strong className="text-primary">1. Connect your controller:</strong> Plug in your controller via USB or connect via Bluetooth to get started.
          </p>
          <p>
            <strong className="text-primary">2. Wake it up:</strong> For privacy reasons, browsers won't detect your controller until you interact with it. Press any button to "wake" it up and register it on this page.
          </p>
          <p>
            <strong className="text-primary">3. Test Inputs:</strong> Systematically press every button and move both analog sticks. The visualizer above will light up to confirm each input is registering correctly.
          </p>
          <p>
            <strong className="text-primary">4. Select Layout:</strong> Use the toggle buttons at the top to switch between Generic, Xbox, and PlayStation visual styles to match your specific hardware.
          </p>
           <p>
            <strong className="text-primary">Note on Drift:</strong> Axis values range from -1.0 to 1.0. If your analog sticks show movement values when you aren't touching them (stick drift), it typically indicates hardware wear on the potentiometer.
          </p>
        </div>
      </div>
    </div>
  );
}
