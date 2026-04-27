import React from "react";

import { DoubleClickTest } from "@/components/DoubleClickTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function DoubleClickPage() {
  return (
    <DiagnosticShell activeModule="double-click" pageTitle="Double Click Test">
      <DoubleClickTest />
    </DiagnosticShell>
  );
}
