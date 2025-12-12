import React, { useEffect, useState, useRef } from 'react';
import { Gamepad2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface GamepadState {
  id: string;
  index: number;
  buttons: readonly GamepadButton[];
  axes: readonly number[];
  connected: boolean;
  timestamp: number;
}

export function GamepadTest() {
  const [gamepads, setGamepads] = useState<Record<number, GamepadState>>({});
  const [selectedLayout, setSelectedLayout] = useState<'generic' | 'xbox' | 'playstation'>('generic');
  const requestRef = useRef<number>();
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
      }
    }

    setGamepads(newGamepads);
    requestRef.current = requestAnimationFrame(scanGamepads);
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
    };
  }, []);

  const hasGamepads = Object.keys(gamepads).length > 0;

  // Placeholder buttons for rendering layout when no controller is connected
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
          <Card key={gamepad.index} className="p-6 bg-black/40 border-primary/20 backdrop-blur-sm relative overflow-hidden group">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h5 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
                  Button State
                </h5>
                {renderLayoutButtons(gamepad)}
              </div>

              <div className="space-y-6">
                <h5 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest border-l-2 border-secondary pl-3">
                  Analog Axes
                </h5>
                {renderLayoutAxes(gamepad)}
              </div>
            </div>
          </Card>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pointer-events-none grayscale">
            <div className="space-y-6">
              <h5 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest border-l-2 border-white/20 pl-3">
                Button State
              </h5>
              {renderLayoutButtons()}
            </div>

            <div className="space-y-6">
              <h5 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest border-l-2 border-white/20 pl-3">
                Analog Axes
              </h5>
              {renderLayoutAxes()}
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
