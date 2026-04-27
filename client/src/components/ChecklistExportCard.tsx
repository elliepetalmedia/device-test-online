import React from "react";
import { Download, FileCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTestStore } from "@/lib/store";

const CALL_SETUP_TOOLS = [
  { id: "mic", label: "Microphone" },
  { id: "speaker", label: "Speaker Output" },
  { id: "headphone", label: "Headphone Stereo" },
  { id: "webcam", label: "Webcam Preview" },
];

export function ChecklistExportCard({
  title = "Call Setup Checklist Export",
  description = "Download a quick pre-call checklist with the current results for your audio and video path.",
}: {
  title?: string;
  description?: string;
}) {
  const results = useTestStore();
  const { toast } = useToast();

  const downloadChecklist = () => {
    const lines = [
      "Device Test Online - Call Setup Checklist",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      ...CALL_SETUP_TOOLS.map(({ id, label }) => {
        const result = results[id];
        const status = result ? result.status.toUpperCase() : "UNTESTED";
        return `- ${label}: ${status}`;
      }),
      "",
      "Recommended order:",
      "1. Confirm microphone recording and playback.",
      "2. Confirm speaker or headphone output and stereo balance.",
      "3. Confirm webcam preview and framing.",
      "4. If wireless audio is involved, compare delay on the audio sync test.",
      "",
      "Generated at https://devicetesteronline.com",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "device-test-online-call-checklist.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    toast({
      title: "Checklist Downloaded",
      description: "Your call setup checklist was exported as a text file.",
    });
  };

  return (
    <Card className="border-primary/20 bg-surface p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <FileCheck className="h-5 w-5" />
            <h3 className="font-orbitron text-lg uppercase tracking-widest">
              {title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <Button
          onClick={downloadChecklist}
          variant="outline"
          className="border-primary/40 font-orbitron text-primary hover:bg-primary/10"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Checklist
        </Button>
      </div>
    </Card>
  );
}
