import React from "react";

import { MouseTest } from "@/components/MouseTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function MousePage() {
  return (
    <DiagnosticShell activeModule="mouse" pageTitle="Mouse Diagnostics">
      <MouseTest />
    </DiagnosticShell>
  );
}
