import React from "react";

import { AudioSyncTest } from "@/components/AudioSyncTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function AudioSyncPage() {
  return (
    <DiagnosticShell activeModule="audio-sync" pageTitle="Audio Latency Test">
      <AudioSyncTest />
    </DiagnosticShell>
  );
}
