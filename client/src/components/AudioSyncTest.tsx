import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Play, MousePointerClick, RefreshCcw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { testStore } from '@/lib/store';

// We synthesize a short, sharp beep using Web Audio API for minimal latency
const playBeep = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch A5

    // Quick attack and decay for a sharp click/beep
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);

    // Resume context if suspended (browser autoplay policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

interface TestSample {
    delay: number; // in milliseconds
}

export function AudioSyncTest() {
    const [testState, setTestState] = useState<'IDLE' | 'WAITING' | 'FLASHING' | 'RESULT'>('IDLE');
    const [samples, setSamples] = useState<TestSample[]>([]);
    const [currentDelay, setCurrentDelay] = useState<number | null>(null);
    const [averageDelay, setAverageDelay] = useState<number | null>(null);

    // To track false starts
    const [falseStarts, setFalseStarts] = useState(0);

    const flashTimeRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startTestRound = useCallback(() => {
        setTestState('WAITING');

        // Random wait between 2 and 5 seconds to prevent anticipation
        const waitTime = 2000 + Math.random() * 3000;

        timeoutRef.current = setTimeout(() => {
            setTestState('FLASHING');
            flashTimeRef.current = performance.now();
            playBeep();
        }, waitTime);
    }, []);

    const handleReaction = useCallback(() => {
        if (testState === 'WAITING') {
            // User clicked too early
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setFalseStarts(prev => prev + 1);
            setTestState('IDLE');
        } else if (testState === 'FLASHING') {
            const reactionTime = performance.now();
            const delay = Math.round(reactionTime - flashTimeRef.current);

            setCurrentDelay(delay);

            setSamples(prev => {
                const newSamples = [...prev, { delay }];

                // Calculate average
                const total = newSamples.reduce((acc, curr) => acc + curr.delay, 0);
                const avg = Math.round(total / newSamples.length);
                setAverageDelay(avg);

                // Keep last 5 samples
                return newSamples.slice(-5);
            });

            setTestState('RESULT');

            // Auto start next round after 1.5 seconds if they haven't manually stopped
            timeoutRef.current = setTimeout(() => {
                startTestRound();
            }, 1500);
        }
    }, [testState, startTestRound]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const finishTest = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setTestState('IDLE');

        if (samples.length > 0 && averageDelay !== null) {
            testStore.addResult('audio-sync', 'tested', {
                latency: `${averageDelay}ms avg`,
                samples: `${samples.length} valid tests`,
                falseStarts: falseStarts
            });
        }
    };

    const resetStats = () => {
        setSamples([]);
        setAverageDelay(null);
        setCurrentDelay(null);
        setFalseStarts(0);
        setTestState('IDLE');
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Interactive Area */}
                <Card className="p-0 md:col-span-2 overflow-hidden border-secondary/30 relative">
                    <button
                        onMouseDown={handleReaction}
                        className={cn(
                            "w-full h-[400px] flex flex-col items-center justify-center transition-colors duration-200 select-none outline-none focus:outline-none",
                            testState === 'IDLE' ? "bg-black/40 hover:bg-black/30 cursor-pointer" :
                                testState === 'WAITING' ? "bg-red-900/40 cursor-pointer" :
                                    testState === 'FLASHING' ? "bg-white text-black cursor-pointer shadow-[0_0_100px_rgba(255,255,255,0.8)_inset]" :
                                        "bg-green-900/40 cursor-default"
                        )}
                        disabled={testState === 'RESULT'}
                    >
                        {testState === 'IDLE' && (
                            <div className="text-center p-8 animate-in fade-in zoom-in">
                                <Volume2 className="w-16 h-16 text-primary mx-auto mb-4 opacity-80" />
                                <h3 className="text-2xl font-orbitron font-bold text-white mb-2 tracking-widest uppercase">Audio Latency Test</h3>
                                <p className="text-muted-foreground font-mono">Ensure your sound is turn on. Click anywhere to begin.</p>
                                <Button
                                    onClick={(e) => { e.stopPropagation(); startTestRound(); }}
                                    className="mt-6 bg-primary text-black hover:bg-primary/80 font-orbitron tracking-widest px-8 py-6"
                                >
                                    <Play className="w-5 h-5 mr-2" /> Start Sequence
                                </Button>
                            </div>
                        )}

                        {testState === 'WAITING' && (
                            <div className="text-center p-8">
                                <h3 className="text-4xl font-orbitron font-bold text-red-500 mb-2">Wait for the beep...</h3>
                                <p className="text-muted-foreground/80 font-mono">React as quickly as possible when you hear the sound AND see the flash.</p>
                            </div>
                        )}

                        {testState === 'FLASHING' && (
                            <div className="text-center p-8">
                                <h3 className="text-6xl font-orbitron font-black text-black">CLICK NOW!</h3>
                            </div>
                        )}

                        {testState === 'RESULT' && currentDelay !== null && (
                            <div className="text-center p-8 animate-in zoom-in-95 duration-200">
                                <h3 className="text-xl font-orbitron text-neon-green mb-2 uppercase tracking-widest">Reaction Time</h3>
                                <div className="text-6xl font-orbitron font-bold text-white mb-4">
                                    {currentDelay}<span className="text-2xl text-muted-foreground">ms</span>
                                </div>
                                <p className="text-muted-foreground font-mono">Preparing next round...</p>
                            </div>
                        )}
                    </button>

                    {testState !== 'IDLE' && (
                        <div className="absolute top-4 right-4 z-10">
                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); finishTest(); }} className="bg-black/50 border-secondary/50 hover:bg-black/80">
                                Stop Test
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6 bg-surface border border-secondary/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Activity className="w-16 h-16 text-primary" />
                        </div>
                        <h4 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest mb-1 z-10 relative">Average Latency</h4>
                        <div className="text-5xl font-orbitron text-primary glow-text z-10 relative mt-2">
                            {averageDelay !== null ? averageDelay : '--'}<span className="text-lg text-muted-foreground">ms</span>
                        </div>

                        {averageDelay !== null && (
                            <div className="mt-4 text-xs font-mono">
                                {averageDelay > 200 ? (
                                    <span className="text-destructive uppercase font-bold">High Latency Detected</span>
                                ) : averageDelay > 100 ? (
                                    <span className="text-yellow-500 uppercase font-bold">Moderate Latency</span>
                                ) : (
                                    <span className="text-neon-green uppercase font-bold">Excellent Connection</span>
                                )}
                            </div>
                        )}
                    </Card>

                    <Card className="p-6 bg-surface border border-secondary/30 h-[280px] flex flex-col">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-secondary/20">
                            <h4 className="font-orbitron text-sm text-white uppercase tracking-widest">Recent Samples</h4>
                            <span className="text-xs font-mono text-muted-foreground">{samples.length}/5 cap</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {samples.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-muted-foreground/50 font-mono text-sm">
                                    No data recorded yet
                                </div>
                            ) : (
                                [...samples].reverse().map((sample, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
                                        <span className="text-xs text-muted-foreground font-mono">Attempt {samples.length - idx}</span>
                                        <span className="font-orbitron text-primary">{sample.delay}ms</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-4 border-t border-secondary/20 flex justify-between items-center">
                            <div className="text-xs text-muted-foreground font-mono">
                                False Starts: <span className={falseStarts > 0 ? "text-destructive" : "text-white"}>{falseStarts}</span>
                            </div>
                            <Button onClick={resetStats} variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:text-white">
                                <RefreshCcw className="w-3 h-3 mr-1" /> Reset
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* SEO Content */}
            <div className="p-8 bg-surface border border-secondary/30 rounded-lg">
                <h2 className="text-primary font-orbitron text-2xl mb-6 uppercase tracking-widest border-b border-secondary/30 pb-4">Understanding Audio Latency (A/V Sync)</h2>
                <div className="space-y-6 text-lg text-muted-foreground font-roboto-mono leading-relaxed">
                    <p>
                        Audio latency is the time delay between when an audio signal is triggered and when it is actually heard. This online audio sync test helps you measure the delay of your Bluetooth headphones, wireless earbuds (like AirPods), or gaming speakers.
                    </p>

                    <div>
                        <h3 className="text-xl font-orbitron text-white mb-2">How this test works</h3>
                        <p>
                            We generate a sharp audio beep using the Web Audio API alongside an instantaneous visual screen flash. Because human reaction to visual stimuli is incredibly fast, any delay in your reaction time compared to the flash will expose the audio processing delay in your Bluetooth hardware. By taking the average over 5 samples, we account for human reaction variance, revealing the underlying hardware latency.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-orbitron text-white mb-2">What is a "Good" Latency Score?</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong className="text-neon-green">Under 50ms:</strong> Typical for wired headphones. Unnoticeable to humans. Perfect for competitive gaming.</li>
                            <li><strong className="text-primary">50ms - 100ms:</strong> Excellent for wireless. Great for casual gaming and watching movies without lip-sync issues.</li>
                            <li><strong className="text-yellow-500">100ms - 200ms:</strong> Noticeable delay. Acceptable for music, but can be distracting when watching video (dialogue won't match lip movements perfectly).</li>
                            <li><strong className="text-destructive">Over 200ms:</strong> High latency. Common in cheaper Bluetooth devices or when dealing with heavy interference. Very distracting for gaming or video editing.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-orbitron text-white mb-2">How to Fix Bluetooth Audio Delay</h3>
                        <p>
                            If you're experiencing high latency on Windows 11 or macOS, try removing interference by moving your router away from your PC. Also, ensure your headphones are connected using the highest quality codec available (like aptX Low Latency or LDAC). Some gaming headsets come with a dedicated 2.4GHz USB dongle—always use the dongle instead of standard Bluetooth for gaming.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
