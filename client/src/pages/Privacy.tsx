import React from 'react';
import { Link } from 'wouter';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground font-roboto-mono p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link href="/" className="text-primary hover:underline font-bold flex items-center gap-2">
          &larr; Back to Diagnostics
        </Link>

        <h1 className="text-4xl font-orbitron text-primary">Privacy Policy</h1>

        <div className="space-y-6 text-muted-foreground flex-1">
          <p><strong className="text-foreground">Last Updated:</strong> February 26, 2026</p>
          <p>This Privacy Policy applies to DeviceTesterOnline.com, published by Ellie Petal Media. We are fully committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR) and other global privacy standards.</p>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">1. 100% Client-Side Processing</h3>
            <p>This website runs diagnostic scripts locally within your browser. When you test your microphone, webcam, or other hardware, the data (audio, video, keystrokes, mouse movements) is processed securely in your device's RAM to generate the visualizer. It is <strong className="text-primary tracking-widest">NEVER</strong> transmitted to our servers or stored externally.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">2. Local Storage (Not Cookies)</h3>
            <p>We use your browser's <code className="bg-white/10 px-1 py-0.5 rounded text-sm font-mono">localStorage</code> API strictly to save your test results locally so you can generate a "Hardware Scorecard" summary. This data remains on your physical device and is not used for tracking, analytics, or advertising. You can clear this data at any time by clearing your browser data or closing the application context.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">3. No Data Collection or Third-Party Tracking</h3>
            <p>Because no personal data is transmitted to us, there is no data to collect, sell, or share. We do not use third-party tracking cookies or invasive analytics scripts that compromise your privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
