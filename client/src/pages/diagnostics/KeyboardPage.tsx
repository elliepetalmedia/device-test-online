import React from "react";

import { KeyboardTest } from "@/components/KeyboardTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function KeyboardPage() {
  return (
    <DiagnosticShell activeModule="keyboard" pageTitle="Keyboard Matrix">
      <KeyboardTest />
    </DiagnosticShell>
  );
}
