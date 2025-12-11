import React, { useEffect, useState, useRef } from 'react';
import { Gamepad2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  const requestRef = useRef<number>();

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

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/40 border-primary/20 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Gamepad2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-orbitron font-bold text-foreground mb-2">Gamepad Diagnostics</h3>
            <p className="text-muted-foreground font-roboto-mono text-sm leading-relaxed mb-4">
              Connect a controller to begin testing. Supports Xbox, PlayStation, and generic USB gamepads.
              Press buttons and move joysticks to verify input detection.
            </p>
            
            {!hasGamepads ? (
              <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-4 rounded border border-yellow-500/20">
                <AlertCircle className="w-5 h-5" />
                <span className="font-roboto-mono text-sm">No gamepad detected. Connect a device and press any button to wake it up.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-neon-green bg-neon-green/10 p-4 rounded border border-neon-green/20">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-roboto-mono text-sm">{Object.keys(gamepads).length} device(s) connected</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {Object.values(gamepads).map((gamepad) => (
        <Card key={gamepad.index} className="p-6 bg-black/40 border-primary/20 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h4 className="font-orbitron text-lg text-primary truncate max-w-md" title={gamepad.id}>
                {gamepad.id}
              </h4>
              <div className="text-xs font-mono text-muted-foreground mt-1">
                Index: {gamepad.index} | Buttons: {gamepad.buttons.length} | Axes: {gamepad.axes.length}
              </div>
            </div>
            <div className="px-2 py-1 bg-primary/20 border border-primary text-primary text-xs font-bold rounded uppercase tracking-wider animate-pulse">
              Live Input
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual Controller Representation */}
            <div className="space-y-6">
              <h5 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
                Button State
              </h5>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {gamepad.buttons.map((button, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded border transition-all duration-75 aspect-square",
                      button.pressed 
                        ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(102,252,241,0.5)] scale-95" 
                        : "bg-black/40 text-muted-foreground border-white/10"
                    )}
                  >
                    <span className="font-orbitron font-bold text-lg mb-1">{i}</span>
                    <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-current transition-none" 
                        style={{ width: `${button.value * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest border-l-2 border-secondary pl-3">
                Analog Axes
              </h5>
              
              <div className="grid gap-6">
                {/* Group axes in pairs for X/Y visualization if possible */}
                {Array.from({ length: Math.ceil(gamepad.axes.length / 2) }).map((_, pairIndex) => {
                  const xIndex = pairIndex * 2;
                  const yIndex = pairIndex * 2 + 1;
                  const xValue = gamepad.axes[xIndex] || 0;
                  const yValue = gamepad.axes[yIndex] || 0;
                  const hasY = yIndex < gamepad.axes.length;

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
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
