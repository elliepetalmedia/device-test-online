import React from "react";

import { Card } from "@/components/ui/card";
import { PublicInfoPageLayout } from "@/components/PublicInfoPageLayout";

export default function Privacy() {
  return (
    <PublicInfoPageLayout target="privacy">
      <Card className="border-primary/20 bg-surface p-6">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Last Updated:</strong> April 27, 2026
        </p>
      </Card>

      <div className="space-y-6">
        <Card className="border-primary/20 bg-surface p-6">
          <h2 className="mb-3 font-orbitron text-xl text-white">1. Local diagnostic processing</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Device Test Online runs core hardware diagnostics inside your browser. Tests for microphone, webcam,
              keyboard, mouse, gamepad, typing, monitor, refresh rate, touchscreen, speaker, headphone, and audio
              latency use browser APIs or in-page event handling to produce the diagnostic result locally on your
              device.
            </p>
            <p>
              That means the diagnostic interaction itself is not designed to upload raw microphone audio, raw webcam
              video, keystroke logs, or controller state to Device Test Online servers as part of the test flow.
            </p>
          </div>
        </Card>

        <Card className="border-primary/20 bg-surface p-6">
          <h2 className="mb-3 font-orbitron text-xl text-white">2. Local storage and saved results</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The site uses your browser&apos;s <code className="rounded bg-white/10 px-1 py-0.5 text-sm">localStorage</code>{" "}
              to keep diagnostic summary data on your device so the scorecard and export views can persist across page
              navigation.
            </p>
            <p>
              This local result data is stored on the device you are using and can be cleared through browser storage
              controls or by removing site data for Device Test Online.
            </p>
          </div>
        </Card>

        <Card className="border-primary/20 bg-surface p-6">
          <h2 className="mb-3 font-orbitron text-xl text-white">3. Analytics and advertising</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Device Test Online currently loads <strong className="text-foreground">Google Analytics</strong> for site
              traffic measurement and may load <strong className="text-foreground">Google AdSense</strong> for
              advertising support.
            </p>
            <p>
              These third-party services operate separately from the local diagnostic logic and may collect data
              according to their own technologies, cookie behavior, browser settings, and published policies. If you
              need the detailed terms for those services, refer to Google&apos;s privacy and advertising documentation in
              addition to this page.
            </p>
          </div>
        </Card>

        <Card className="border-primary/20 bg-surface p-6">
          <h2 className="mb-3 font-orbitron text-xl text-white">4. Permissions and browser controls</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Camera and microphone tests require explicit browser permission. You can allow, deny, or revoke those
              permissions through the browser prompt or the site-permission controls in the address bar.
            </p>
            <p>
              Denying a permission will prevent the related diagnostic from running, but it does not stop you from
              using the rest of the site&apos;s browser-safe tests such as mouse, keyboard, display, typing, and some
              controller checks.
            </p>
          </div>
        </Card>

        <Card className="border-primary/20 bg-surface p-6">
          <h2 className="mb-3 font-orbitron text-xl text-white">5. Publisher and questions</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Device Test Online is published by <strong className="text-foreground">Ellie Petal Media</strong>. For
              privacy, legal, or advertising questions, use the contact details listed on the contact page.
            </p>
            <p>
              This policy describes the current site behavior at a high level and may be updated as the diagnostic
              suite, analytics usage, or advertising setup changes.
            </p>
          </div>
        </Card>
      </div>
    </PublicInfoPageLayout>
  );
}
