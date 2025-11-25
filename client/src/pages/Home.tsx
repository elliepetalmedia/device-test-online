import React, { useState } from 'react';
import { Link } from "wouter";
import { MousePointer2, Keyboard, Monitor, Mic, Camera, Menu, X } from 'lucide-react';
import { MouseTest } from '@/components/MouseTest';
import { KeyboardTest } from '@/components/KeyboardTest';
import { DeadPixelTest } from '@/components/DeadPixelTest';
import { MicrophoneTest } from '@/components/MicrophoneTest';
import { WebcamTest } from '@/components/WebcamTest';
import { cn } from '@/lib/utils';

export default function Home() {
  const [activeModule, setActiveModule] = useState<'mouse' | 'keyboard' | 'pixel' | 'mic' | 'webcam'>('mouse');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeModule, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveModule(id);
        setMobileMenuOpen(false);
      }}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 font-orbitron text-sm tracking-wide group",
        activeModule === id 
          ? "bg-primary/10 text-primary border-l-4 border-primary shadow-[inset_10px_0_20px_-10px_rgba(102,252,241,0.2)]" 
          : "text-muted-foreground hover:text-foreground hover:bg-surface"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-colors", activeModule === id ? "text-primary drop-shadow-[0_0_5px_rgba(102,252,241,0.8)]" : "group-hover:text-foreground")} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-black/40 backdrop-blur-xl border-r border-secondary/20 transform transition-transform duration-300 md:translate-x-0 md:relative md:block",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-secondary/20">
          <h1 className="font-orbitron font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_10px_rgba(102,252,241,0.3)]">
            Device Test online
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Hardware Suite</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <NavItem id="mouse" icon={MousePointer2} label="MOUSE TEST" />
          <NavItem id="keyboard" icon={Keyboard} label="KEYBOARD TEST" />
          <NavItem id="pixel" icon={Monitor} label="PIXEL CHECK" />
          <NavItem id="mic" icon={Mic} label="MICROPHONE" />
          <NavItem id="webcam" icon={Camera} label="WEBCAM TEST" />
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-secondary/20 bg-black/20">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground font-mono">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_5px_var(--color-neon-green)]"></div>
               <span>System Online</span>
             </div>
             <div className="opacity-50">v2.5.0-stable</div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-secondary/20 flex justify-between items-center bg-background/80 backdrop-blur sticky top-0 z-20">
          <span className="font-orbitron font-bold text-primary">Device Test online</span>
          <button onClick={() => setMobileMenuOpen(true)} className="text-foreground">
            <Menu />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-12">
            
            <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-3xl md:text-4xl font-orbitron text-foreground glow-text mb-2">
                {activeModule === 'mouse' && 'Mouse Diagnostics'}
                {activeModule === 'keyboard' && 'Keyboard Matrix'}
                {activeModule === 'pixel' && 'Dead Pixel Locator'}
                {activeModule === 'mic' && 'Audio Input Check'}
                {activeModule === 'webcam' && 'Webcam Diagnostics'}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
            </header>

            <div className="min-h-[500px] animate-in fade-in zoom-in-95 duration-300">
              {activeModule === 'mouse' && <MouseTest />}
              {activeModule === 'keyboard' && <KeyboardTest />}
              {activeModule === 'pixel' && <DeadPixelTest />}
              {activeModule === 'mic' && <MicrophoneTest />}
              {activeModule === 'webcam' && <WebcamTest />}
            </div>

            {/* SEO Content Article - EXACT HTML Content Requested */}
            <article className="mt-24 border-t border-secondary/20 pt-12">
               <div style={{ maxWidth: '800px', margin: '0 auto', color: '#c5c6c7' }}>
                <h2 className="text-2xl text-primary font-orbitron mb-4">Diagnosing Mouse Double-Click Issues</h2>
                <p className="mb-8 leading-relaxed">One of the most common failures in modern gaming mice is the "double-click" fault. This occurs when the copper tension spring inside the microswitch degrades, causing a single physical click to register as two rapid electrical signals. Our tool detects this by measuring the milliseconds between signals; anything under 80ms is typically a hardware failure.</p>

                <h2 className="text-2xl text-primary font-orbitron mb-4">What is Keyboard Ghosting?</h2>
                <p className="mb-8 leading-relaxed">"Ghosting" happens when a keyboard cannot register multiple keys pressed simultaneously. This is critical for gamers and fast typists. Use our Keyboard Test to verify your N-Key Rollover (NKRO) capabilities by pressing multiple keys at once.</p>

                <h2 className="text-2xl text-primary font-orbitron mb-4">Checking for Dead Pixels</h2>
                <p className="mb-8 leading-relaxed">A dead pixel is a picture element that fails to change color. By cycling through primary colors (Red, Green, Blue) and extremes (Black, White) in full-screen mode, you can easily spot stuck or dead pixels on your monitor.</p>
              </div>
            </article>

            <footer className="mt-16 py-8 border-t border-secondary/10 text-center text-sm text-muted-foreground font-mono">
              <div className="flex justify-center gap-6 mb-4">
                <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              </div>
              <p>&copy; 2025 Ellie Petal Media. All systems nominal.</p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
