import React from "react";

import { DeadPixelTest } from "@/components/DeadPixelTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function PixelPage() {
  return (
    <DiagnosticShell
      activeModule="pixel"
      pageTitle="Monitor Test & Refresh Rate"
    >
      <DeadPixelTest />
    </DiagnosticShell>
  );
}
