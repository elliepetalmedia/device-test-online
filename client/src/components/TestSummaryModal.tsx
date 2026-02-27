import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Copy, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { useTestStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function TestSummaryModal() {
    const results = useTestStore();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const modules = [
        { id: 'mouse', name: 'Mouse & Polling Rate' },
        { id: 'keyboard', name: 'Keyboard Matrix' },
        { id: 'pixel', name: 'Monitor & Dead Pixels' },
        { id: 'mic', name: 'Microphone & Audio' },
        { id: 'webcam', name: 'Webcam Stream' },
        { id: 'gamepad', name: 'Controller & Drift' },
        { id: 'typing', name: 'Typing Speed & Accuracy' },
        { id: 'audio-sync', name: 'Audio Latency & Delay' }
    ];

    const generateReportText = () => {
        let report = `=== Device Tester Online - Hardware Report ===\n`;
        report += `Date: ${new Date().toLocaleString()}\n\n`;

        modules.forEach(m => {
            const result = results[m.id];
            if (result) {
                report += `[${result.status.toUpperCase()}] ${m.name}\n`;
                if (result.details) {
                    Object.entries(result.details).forEach(([k, v]) => {
                        report += `  - ${k}: ${v}\n`;
                    });
                }
            } else {
                report += `[UNTESTED] ${m.name}\n`;
            }
        });

        report += `\nGenerated at: https://devicetesteronline.com\n==========================================`;
        return report;
    };

    const copyToClipboard = () => {
        const text = generateReportText();
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: "Report Copied!",
                description: "You can now paste your hardware report anywhere.",
            });
        }).catch(() => {
            toast({
                variant: "destructive",
                title: "Copy Failed",
                description: "Could not access clipboard.",
            });
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 font-orbitron border-primary/50 text-primary hover:bg-primary/10 transition-colors">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate flex-1 text-left">Test Summary / Export</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-black/95 border-primary/50 shadow-[0_0_50px_rgba(102,252,241,0.15)] backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="font-orbitron tracking-widest text-primary flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Hardware Scorecard
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 my-4 font-mono text-sm max-h-[60vh] overflow-y-auto pr-2">
                    <p className="text-muted-foreground text-xs mb-4">
                        This report tracks your active testing session. Complete missing tools to generate a full report.
                    </p>

                    <div className="grid gap-2">
                        {modules.map(m => {
                            const res = results[m.id];
                            let Icon = HelpCircle;
                            let color = "text-muted-foreground";
                            let bg = "bg-surface";
                            let statusText = "Untested";

                            if (res) {
                                if (res.status === 'passed' || res.status === 'tested') {
                                    Icon = CheckCircle2;
                                    color = "text-neon-green";
                                    bg = "bg-neon-green/10 border border-neon-green/20";
                                    statusText = res.status === 'passed' ? 'Passed' : 'Tested';
                                } else if (res.status === 'failed') {
                                    Icon = AlertCircle;
                                    color = "text-destructive";
                                    bg = "bg-destructive/10 border border-destructive/20";
                                    statusText = "Failed Issue";
                                }
                            }

                            return (
                                <div key={m.id} className={cn("p-3 rounded-md flex flex-col gap-1 transition-colors", bg, !res && "border border-secondary/20")}>
                                    <div className="flex justify-between items-center">
                                        <span className="font-orbitron font-bold text-foreground">{m.name}</span>
                                        <div className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider", color)}>
                                            <Icon className="w-4 h-4" /> {statusText}
                                        </div>
                                    </div>

                                    {res?.details && Object.keys(res.details).length > 0 && (
                                        <div className="mt-2 text-xs text-muted-foreground space-y-0.5 border-t border-white/10 pt-2">
                                            {Object.entries(res.details).map(([k, v]) => (
                                                <div key={k} className="flex justify-between">
                                                    <span className="opacity-70">{k}:</span>
                                                    <span className="text-foreground">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button onClick={() => setOpen(false)} variant="ghost" className="text-muted-foreground hover:text-white">
                        Close
                    </Button>
                    <Button onClick={copyToClipboard} className="bg-primary text-black hover:bg-primary/80 font-orbitron">
                        <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
