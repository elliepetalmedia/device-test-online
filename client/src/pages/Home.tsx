import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "wouter";
import { MousePointer2, Keyboard, Monitor, Mic, Camera, Gamepad2, Menu, X, HelpCircle, LayoutGrid, ArrowRight } from 'lucide-react';
import { MouseTest } from '@/components/MouseTest';
import { KeyboardTest } from '@/components/KeyboardTest';
import { DeadPixelTest } from '@/components/DeadPixelTest';
import { MicrophoneTest } from '@/components/MicrophoneTest';
import { WebcamTest } from '@/components/WebcamTest';
import { GamepadTest } from '@/components/GamepadTest';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

type ModuleType = 'mouse' | 'keyboard' | 'pixel' | 'mic' | 'webcam' | 'gamepad' | 'dashboard';

const MODULE_ROUTES: Record<ModuleType, string> = {
  dashboard: '/',
  mouse: '/mouse-test',
  keyboard: '/keyboard-test',
  pixel: '/dead-pixel-test',
  mic: '/microphone-test',
  webcam: '/webcam-test',
  gamepad: '/gamepad-test'
};

const MODULE_META: Record<ModuleType, { title: string, desc: string, icon?: any }> = {
  dashboard: {
    title: 'Device Test Online - Free Hardware Diagnostic Suite',
    desc: 'Test your mouse, keyboard, monitor, microphone, webcam, and gamepad online instantly. Privacy-first, no installs required.',
    icon: LayoutGrid
  },
  mouse: { 
    title: 'Mouse Test - Check Clicks & Polling Rate', 
    desc: 'Test your mouse double-click, polling rate, and scroll wheel online.',
    icon: MousePointer2
  },
  keyboard: { 
    title: 'Keyboard Tester - Ghosting & Key Check', 
    desc: 'Check for broken keys and ghosting on your keyboard.',
    icon: Keyboard
  },
  pixel: { 
    title: 'Monitor Test - Dead Pixels & Refresh Rate', 
    desc: 'Free online tool to detect dead or stuck pixels and verify monitor refresh rate.',
    icon: Monitor
  },
  mic: { 
    title: 'Mic Test - Check Microphone Online', 
    desc: 'Test your microphone quality and volume instantly.',
    icon: Mic
  },
  webcam: { 
    title: 'Webcam Test - Check Camera Online', 
    desc: 'Test your webcam resolution and functionality online.',
    icon: Camera
  },
  gamepad: { 
    title: 'Gamepad Tester - Controller Input', 
    desc: 'Test your game controller buttons, axes, and vibration.',
    icon: Gamepad2
  }
};

export default function Home() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getModuleFromPath = (path: string): ModuleType => {
    switch (path) {
      case '/': return 'dashboard';
      case '/keyboard-test': return 'keyboard';
      case '/dead-pixel-test': return 'pixel';
      case '/microphone-test': return 'mic';
      case '/webcam-test': return 'webcam';
      case '/gamepad-test': return 'gamepad';
      case '/mouse-test': return 'mouse';
      default: return 'dashboard'; 
    }
  };

  const activeModule = getModuleFromPath(location);

  useEffect(() => {
    const meta = MODULE_META[activeModule];
    document.title = meta.title;
    
    // Update meta description if it exists, or create it if not? 
    // Usually it exists in index.html. We just update it.
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', meta.desc);
    }
    
    // Also update OG tags for social sharing
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.desc);

  }, [activeModule]);

  const NavItem = ({ id, icon: Icon, label }: { id: ModuleType, icon: any, label: string }) => {
    const isActive = activeModule === id;
    const href = MODULE_ROUTES[id];
    
    return (
      <Link href={href} onClick={() => setMobileMenuOpen(false)}>
        <a className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 font-orbitron text-sm tracking-wide group cursor-pointer",
          isActive 
            ? "bg-primary/10 text-primary border-l-4 border-primary shadow-[inset_10px_0_20px_-10px_rgba(102,252,241,0.2)]" 
            : "text-muted-foreground hover:text-foreground hover:bg-surface"
        )}>
          <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary drop-shadow-[0_0_5px_rgba(102,252,241,0.8)]" : "group-hover:text-foreground")} />
          {label}
        </a>
      </Link>
    );
  };

  const DashboardView = () => (
    <div className="space-y-8">
      <div className="text-center w-full mb-8">
        <p className="text-lg text-muted-foreground leading-relaxed font-roboto-mono">
          Welcome to <span className="text-primary font-bold">Device Test Online</span>, the privacy-first suite for testing your hardware directly in the browser. 
          Select any diagnostic tool below to instantly check your mouse, keyboard, monitor, or controller. 
          For detailed explanations of common issues and test results, please consult our <Link href="/faq" className="text-primary hover:underline underline-offset-4">FAQ & Guide</Link>.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(Object.keys(MODULE_ROUTES) as ModuleType[])
        .filter(key => key !== 'dashboard')
        .map((key) => {
          const meta = MODULE_META[key];
          const Icon = meta.icon;
          return (
            <Link key={key} href={MODULE_ROUTES[key]}>
              <a className="group block h-full">
                <Card className="h-full bg-black/40 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 p-6 flex flex-col backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon className="w-32 h-32 text-primary" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4 z-10">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-orbitron font-bold text-foreground mb-2 group-hover:text-primary transition-colors z-10">
                    {meta.title.split(' - ')[0]}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 z-10">
                    {meta.desc}
                  </p>
                  
                  <div className="flex items-center text-primary text-sm font-bold uppercase tracking-wider z-10">
                    Start Test <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </a>
            </Link>
          );
      })}
      </div>
    </div>
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
            Device Test Online
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Hardware Suite</p>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">Diagnose and test your computer peripherals with interactive hardware diagnostics.</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <NavItem id="mouse" icon={MousePointer2} label="MOUSE TEST" />
          <NavItem id="keyboard" icon={Keyboard} label="KEYBOARD TEST" />
          <NavItem id="pixel" icon={Monitor} label="MONITOR TEST" />
          <NavItem id="mic" icon={Mic} label="MICROPHONE" />
          <NavItem id="webcam" icon={Camera} label="WEBCAM TEST" />
          <NavItem id="gamepad" icon={Gamepad2} label="GAMEPAD TEST" />
          
          <div className="pt-4 mt-4 border-t border-secondary/20">
            <Link href="/faq" className="w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 font-orbitron text-sm tracking-wide group text-muted-foreground hover:text-primary hover:bg-surface">
              <HelpCircle className="w-5 h-5 group-hover:text-primary transition-colors" />
              FAQ & GUIDE
            </Link>
          </div>
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
          <span className="font-orbitron font-bold text-primary">Device Test Online</span>
          <button onClick={() => setMobileMenuOpen(true)} className="text-foreground">
            <Menu />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-12">
            
            <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-3xl md:text-4xl font-orbitron text-foreground glow-text mb-2">
                {activeModule === 'dashboard' && 'Hardware Diagnostic Suite'}
                {activeModule === 'mouse' && 'Mouse Diagnostics'}
                {activeModule === 'keyboard' && 'Keyboard Matrix'}
                {activeModule === 'pixel' && 'Monitor Test & Refresh Rate'}
                {activeModule === 'mic' && 'Audio Input Check'}
                {activeModule === 'webcam' && 'Webcam Diagnostics'}
                {activeModule === 'gamepad' && 'Controller Input'}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
            </header>

            <div className="min-h-[500px] animate-in fade-in zoom-in-95 duration-300">
              {activeModule === 'dashboard' && <DashboardView />}
              {activeModule === 'mouse' && <MouseTest />}
              {activeModule === 'keyboard' && <KeyboardTest />}
              {activeModule === 'pixel' && <DeadPixelTest />}
              {activeModule === 'mic' && <MicrophoneTest />}
              {activeModule === 'webcam' && <WebcamTest />}
              {activeModule === 'gamepad' && <GamepadTest />}
            </div>


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
