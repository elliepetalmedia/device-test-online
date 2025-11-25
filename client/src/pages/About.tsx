import React from 'react';
import { Link } from 'wouter';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground font-roboto-mono p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link href="/" className="text-primary hover:underline font-bold flex items-center gap-2">
          &larr; Back to Diagnostics
        </Link>
        
        <h1 className="text-4xl font-orbitron text-primary">About DeviceTestOnline</h1>
        
        <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
          <p>DeviceTestOnline.com is a digital utility project published by <strong className="text-foreground">Ellie Petal Media</strong>.</p>
          <p>We build privacy-focused diagnostic tools for gamers, remote workers, and IT professionals. Unlike downloaded software, our tools run instantly in your browser to verify hardware functionality without installing bloatware.</p>
        </div>
      </div>
    </div>
  );
}
