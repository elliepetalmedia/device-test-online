import React from "react";

import { AudioOutputTest } from "@/components/AudioOutputTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function SpeakerPage() {
  return (
    <DiagnosticShell activeModule="speaker" pageTitle="Speaker Test">
      <AudioOutputTest tool="speaker" />
    </DiagnosticShell>
  );
}
