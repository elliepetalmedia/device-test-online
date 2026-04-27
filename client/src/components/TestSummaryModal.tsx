import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  HelpCircle,
} from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTestStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const modules = [
  { id: "mouse", name: "Mouse & Polling Rate" },
  { id: "double-click", name: "Double Click Detection" },
  { id: "keyboard", name: "Keyboard Matrix" },
  { id: "typing", name: "Typing Speed & Accuracy" },
  { id: "pixel", name: "Monitor & Dead Pixels" },
  { id: "refresh-rate", name: "Refresh Rate" },
  { id: "touchscreen", name: "Touchscreen Coverage" },
  { id: "speaker", name: "Speaker Output" },
  { id: "headphone", name: "Headphone Stereo" },
  { id: "mic", name: "Microphone & Audio" },
  { id: "webcam", name: "Webcam Stream" },
  { id: "gamepad", name: "Controller & Drift" },
  { id: "audio-sync", name: "Audio Latency & Delay" },
];

export function TestSummaryModal() {
  const results = useTestStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const generateReportText = () => {
    let report = "=== Device Test Online - Hardware Report ===\n";
    report += `Date: ${new Date().toLocaleString()}\n\n`;

    modules.forEach((module) => {
      const result = results[module.id];
      if (result) {
        report += `[${result.status.toUpperCase()}] ${module.name}\n`;
        if (result.details) {
          Object.entries(result.details).forEach(([key, value]) => {
            report += `  - ${key}: ${value}\n`;
          });
        }
      } else {
        report += `[UNTESTED] ${module.name}\n`;
      }
    });

    report += "\nGenerated at: https://devicetesteronline.com\n";
    report += "==========================================";
    return report;
  };

  const copyToClipboard = () => {
    const text = generateReportText();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Report Copied",
          description: "You can now paste the hardware report into a ticket, message, or support thread.",
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Could not access the clipboard in this browser session.",
        });
      });
  };

  const downloadReport = () => {
    const blob = new Blob([generateReportText()], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "device-test-online-hardware-report.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "The current session summary was exported as a text file.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full gap-2 border-primary/50 font-orbitron text-primary transition-colors hover:bg-primary/10"
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-left">Test Summary / Export</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="border-primary/50 bg-black/95 shadow-[0_0_50px_rgba(102,252,241,0.15)] backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-orbitron tracking-widest text-primary">
            <FileText className="h-5 w-5" /> Hardware Scorecard
          </DialogTitle>
        </DialogHeader>

        <div className="my-4 max-h-[60vh] space-y-4 overflow-y-auto pr-2 font-mono text-sm">
          <p className="mb-4 text-xs text-muted-foreground">
            This report tracks the current local session. Complete more tools to build a fuller report before you copy
            or download it.
          </p>

          <div className="grid gap-2">
            {modules.map((module) => {
              const result = results[module.id];
              let Icon = HelpCircle;
              let color = "text-muted-foreground";
              let bg = "bg-surface";
              let statusText = "Untested";

              if (result) {
                if (result.status === "passed" || result.status === "tested") {
                  Icon = CheckCircle2;
                  color = "text-neon-green";
                  bg = "bg-neon-green/10 border border-neon-green/20";
                  statusText = result.status === "passed" ? "Passed" : "Tested";
                } else if (result.status === "failed") {
                  Icon = AlertCircle;
                  color = "text-destructive";
                  bg = "bg-destructive/10 border border-destructive/20";
                  statusText = "Failed Issue";
                }
              }

              return (
                <div
                  key={module.id}
                  className={cn(
                    "flex flex-col gap-1 rounded-md p-3 transition-colors",
                    bg,
                    !result && "border border-secondary/20",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron font-bold text-foreground">{module.name}</span>
                    <div className={cn("flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider", color)}>
                      <Icon className="h-4 w-4" /> {statusText}
                    </div>
                  </div>

                  {result?.details && Object.keys(result.details).length > 0 ? (
                    <div className="mt-2 space-y-0.5 border-t border-white/10 pt-2 text-xs text-muted-foreground">
                      {Object.entries(result.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between gap-4">
                          <span className="opacity-70">{key}:</span>
                          <span className="text-right text-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-3">
          <Button
            onClick={() => setOpen(false)}
            variant="ghost"
            className="text-muted-foreground hover:text-white"
          >
            Close
          </Button>
          <Button
            onClick={downloadReport}
            variant="outline"
            className="border-primary/40 font-orbitron text-primary hover:bg-primary/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={copyToClipboard}
            className="bg-primary font-orbitron text-black hover:bg-primary/80"
          >
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
