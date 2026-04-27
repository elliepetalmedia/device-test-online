import React from "react";

import { Card } from "@/components/ui/card";
import { PublicInfoPageLayout } from "@/components/PublicInfoPageLayout";

export default function About() {
  return (
    <PublicInfoPageLayout target="about">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-primary/20 bg-surface p-6">
          <h2 className="mb-3 font-orbitron text-xl text-white">What Device Test Online is</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Device Test Online is a browser-based hardware diagnostic suite published by{" "}
              <strong className="text-foreground">Ellie Petal Media</strong>.
            </p>
            <p>
              The product is designed to help gamers, remote workers, IT staff, and everyday users check common input,
              display, audio, and controller problems without installing native utilities first.
            </p>
          </div>
        </Card>

        <Card className="border-primary/20 bg-surface p-6">
          <h2 className="mb-3 font-orbitron text-xl text-white">How the site operates</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Core diagnostics such as mouse, keyboard, monitor, microphone, webcam, gamepad, typing, and audio
              latency checks run directly in the browser and are intended to be fast, disposable first-pass tests.
            </p>
            <p>
              Device-specific inputs used by those tools stay within the browser execution context for the diagnostic
              flow. Site traffic measurement and ad delivery are handled separately through Google Analytics and Google
              AdSense, both of which are disclosed in the privacy policy.
            </p>
          </div>
        </Card>
      </div>

      <Card className="border-primary/20 bg-surface p-6">
        <h2 className="mb-3 font-orbitron text-xl text-white">What this site is not</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Device Test Online is not a replacement for vendor firmware tools, hardware RMA inspection, electrical
            testing equipment, or enterprise fleet management software.
          </p>
          <p>
            The site helps narrow down common failures and browser-visible symptoms. If a device still appears faulty
            after repeated checks here, the next step is usually a second machine, a different cable/port, or a
            manufacturer-specific utility.
          </p>
        </div>
      </Card>
    </PublicInfoPageLayout>
  );
}
