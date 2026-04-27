import React from "react";

import { GamepadTest } from "@/components/GamepadTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function GamepadPage() {
  return (
    <DiagnosticShell activeModule="gamepad" pageTitle="Controller Input">
      <GamepadTest />
    </DiagnosticShell>
  );
}
