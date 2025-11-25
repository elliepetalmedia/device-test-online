import React from 'react';
import { Link } from 'wouter';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground font-roboto-mono p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link href="/" className="text-primary hover:underline font-bold flex items-center gap-2">
          &larr; Back to Diagnostics
        </Link>
        
        <h1 className="text-4xl font-orbitron text-primary">Contact Us</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <div>
            <p className="text-foreground font-bold">Publisher:</p>
            <p>Ellie Petal Media</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Support Policy</h3>
            <p>These tools are provided as-is. We cannot provide individual technical support for hardware repairs or warranty claims.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Business Inquiries</h3>
            <p>For advertising and legal matters, please contact: <strong className="text-primary">legal@devicetestonline.com</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
