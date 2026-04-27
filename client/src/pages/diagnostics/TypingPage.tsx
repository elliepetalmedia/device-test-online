import React from "react";

import { TypingTest } from "@/components/TypingTest";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";

export default function TypingPage() {
  return (
    <DiagnosticShell activeModule="typing" pageTitle="Typing Speed Test">
      <TypingTest />
    </DiagnosticShell>
  );
}
