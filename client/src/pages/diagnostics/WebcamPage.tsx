import React from "react";

import { WebcamTest } from "@/components/WebcamTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function WebcamPage() {
  return (
    <DiagnosticShell activeModule="webcam" pageTitle="Webcam Diagnostics">
      <WebcamTest />
    </DiagnosticShell>
  );
}
