import React from "react";

import { AudioOutputTest } from "@/components/AudioOutputTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function HeadphonePage() {
  return (
    <DiagnosticShell activeModule="headphone" pageTitle="Headphone Test">
      <AudioOutputTest tool="headphone" />
    </DiagnosticShell>
  );
}
