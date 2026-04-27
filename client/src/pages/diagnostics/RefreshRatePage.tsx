import React from "react";

import { RefreshRateTest } from "@/components/RefreshRateTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function RefreshRatePage() {
  return (
    <DiagnosticShell activeModule="refresh-rate" pageTitle="Refresh Rate Test">
      <RefreshRateTest />
    </DiagnosticShell>
  );
}
