import React from "react";

import { Card } from "@/components/ui/card";
import { PublicInfoPageLayout } from "@/components/PublicInfoPageLayout";

export default function Contact() {
  return (
    <PublicInfoPageLayout target="contact">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-primary/20 bg-surface p-6">
          <h2 className="mb-3 font-orbitron text-xl text-white">Publisher Contact</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">Publisher:</strong> Ellie Petal Media
            </p>
            <p>
              <strong className="text-foreground">Contact Email:</strong>{" "}
              <span className="text-primary">legal@devicetesteronline.com</span>
            </p>
            <p>Use this address for business, legal, privacy, and advertising questions related to Device Test Online.</p>
          </div>
        </Card>

        <Card className="border-primary/20 bg-surface p-6">
          <h2 className="mb-3 font-orbitron text-xl text-white">Support Boundaries</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              These tools are provided as self-serve diagnostics. Individual hardware troubleshooting, warranty
              claims, repair walkthroughs, and device-specific support are not offered through direct email support.
            </p>
            <p>
              If you are trying to interpret a test result, the FAQ and the related diagnostics on this site should be
              your first stop before escalating to the hardware vendor.
            </p>
          </div>
        </Card>
      </div>

      <Card className="border-primary/20 bg-surface p-6">
        <h2 className="mb-3 font-orbitron text-xl text-white">Advertising and privacy questions</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Device Test Online may load Google Analytics and Google AdSense in the site shell. Questions about those
            disclosures, consent expectations, or policy wording should be sent to the publisher email above.
          </p>
          <p>
            For details on local diagnostic processing versus third-party site services, review the privacy policy
            alongside the specific diagnostic page you are using.
          </p>
        </div>
      </Card>
    </PublicInfoPageLayout>
  );
}
