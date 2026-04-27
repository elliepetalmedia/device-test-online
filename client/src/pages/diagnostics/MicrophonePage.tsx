import React from "react";

import { MicrophoneTest } from "@/components/MicrophoneTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function MicrophonePage() {
  return (
    <DiagnosticShell activeModule="mic" pageTitle="Audio Input Check">
      <MicrophoneTest />
    </DiagnosticShell>
  );
}
