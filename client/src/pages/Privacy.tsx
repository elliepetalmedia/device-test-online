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
        
        <div className="space-y-6 text-muted-foreground">
          <p><strong className="text-foreground">Last Updated:</strong> 2025</p>
          <p>This Privacy Policy applies to DeviceTestOnline.com, published by Ellie Petal Media.</p>
          
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">1. Client-Side Processing</h3>
            <p>This website runs diagnostic scripts locally in your browser. When you test your microphone, the audio data is processed in your device's RAM to generate the visualizer and is never transmitted to our servers or stored.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">2. Cookies</h3>
            <p>We may use cookies to ensure the website functions correctly. By using this site, you consent to the use of cookies.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">3. Contact</h3>
            <p>legal@devicetestonline.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
