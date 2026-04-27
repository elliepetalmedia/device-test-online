import React from "react";

import { TouchscreenTest } from "@/components/TouchscreenTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function TouchscreenPage() {
  return (
    <DiagnosticShell activeModule="touchscreen" pageTitle="Touchscreen Test">
      <TouchscreenTest />
    </DiagnosticShell>
  );
}
