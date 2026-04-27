import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "wouter";
import { MousePointer2, Keyboard, Monitor, Mic, Camera, Gamepad2, Menu, X, HelpCircle, LayoutGrid, ArrowRight, Type, Volume2 } from 'lucide-react';
import { MouseTest } from '@/components/MouseTest';
import { KeyboardTest } from '@/components/KeyboardTest';
import { DeadPixelTest } from '@/components/DeadPixelTest';
import { MicrophoneTest } from '@/components/MicrophoneTest';
import { WebcamTest } from '@/components/WebcamTest';
import { GamepadTest } from '@/components/GamepadTest';
import { TypingTest } from '@/components/TypingTest';
import { AudioSyncTest } from '@/components/AudioSyncTest';
import { TestSummaryModal } from '@/components/TestSummaryModal';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import {
  getRouteDefinition,
  MODULE_ROUTE_MAP,
  MODULE_ROUTES,
  SITE_NAME,
  SITE_URL,
  type ModuleType,
} from '@/lib/site';

const MODULE_META: Record<ModuleType, { title: string, desc: string, icon?: any }> = {
  dashboard: {
    title: 'Device Test Online - Free Hardware Diagnostic Suite',
    desc: 'Test your mouse, keyboard, monitor, microphone, webcam, and gamepad online instantly. Privacy-first, no installs required.',
    icon: LayoutGrid
  },
  mouse: {
    title: 'Mouse Diagnostics',
    desc: 'Test click behavior, scroll input, and live polling rate in your browser.',
    icon: MousePointer2
  },
  keyboard: {
    title: 'Keyboard Matrix',
    desc: 'Check stuck keys, rollover, and ghosting behavior without installing software.',
    icon: Keyboard
  },
  pixel: {
    title: 'Monitor Test & Refresh Rate',
    desc: 'Cycle test colors and verify real-world display refresh rate from the browser.',
    icon: Monitor
  },
  mic: {
    title: 'Audio Input Check',
    desc: 'Record a local microphone sample, inspect levels, and test your speakers.',
    icon: Mic
  },
  webcam: {
    title: 'Webcam Diagnostics',
    desc: 'Preview your camera feed and inspect live resolution and frame rate details.',
    icon: Camera
  },
  gamepad: {
    title: 'Controller Input',
    desc: 'Visualize buttons, analog axes, vibration support, and stick drift behavior.',
    icon: Gamepad2
  },
  typing: {
    title: 'Typing Speed Test',
    desc: 'Measure words per minute and accuracy to confirm keyboard behavior and responsiveness.',
    icon: Type
  },
  'audio-sync': {
    title: 'Audio Latency Test',
    desc: 'Estimate playback delay for wired, wireless, or Bluetooth audio devices.',
    icon: Volume2
  }
};

export default function Home() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getModuleFromPath = (path: string): ModuleType => {
    return getRouteDefinition(path).module ?? 'dashboard';
  };

  const activeModule = getModuleFromPath(location);

  useEffect(() => {
    setMobileMenuOpen(false);
    const meta = MODULE_META[activeModule];

    // Dynamic JSON-LD structured data injection
    let scriptTag = document.querySelector('#json-ld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }

    const currentUrl = activeModule === 'dashboard' ? SITE_URL : `${SITE_URL}${MODULE_ROUTE_MAP[activeModule]}`;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": SITE_NAME,
      "url": currentUrl,
      "description": meta.desc,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    scriptTag.textContent = JSON.stringify(schemaData);

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeModule]);

  const NavItem = ({ id, icon: Icon, label }: { id: ModuleType, icon: any, label: string }) => {
    const isActive = activeModule === id;
    const href = MODULE_ROUTE_MAP[id];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {MODULE_ROUTES
            .filter((route) => route.module !== 'dashboard')
            .map((route) => {
            const key = route.module;
            const meta = MODULE_META[key];
            const Icon = meta.icon;
            return (
              <Link key={key} href={route.path}>
                <a className="group block h-full">
                  <Card className="h-full bg-black/40 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 p-5 md:p-6 flex flex-col backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Icon className="w-32 h-32 text-primary" />
                    </div>

                    <div className="flex items-center gap-4 mb-4 z-10">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    <h3 className="text-xl font-orbitron font-bold text-foreground mb-2 group-hover:text-primary transition-colors z-10">
                      {meta.title}
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
    <div className="min-h-screen bg-background text-foreground md:flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-[18rem] max-w-[85vw] bg-black/40 backdrop-blur-xl border-r border-secondary/20 transform transition-transform duration-300 overflow-y-auto md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 md:p-6 border-b border-secondary/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <a className="block hover:opacity-80 transition-opacity cursor-pointer">
                  <h1 className="font-orbitron font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_10px_rgba(102,252,241,0.3)]">
                    Device Test Online
                  </h1>
                </a>
              </Link>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Hardware Suite</p>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">Diagnose and test your computer peripherals with interactive hardware diagnostics.</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem id="mouse" icon={MousePointer2} label="MOUSE TEST" />
          <NavItem id="keyboard" icon={Keyboard} label="KEYBOARD TEST" />
          <NavItem id="pixel" icon={Monitor} label="MONITOR TEST" />
          <NavItem id="mic" icon={Mic} label="MICROPHONE" />
          <NavItem id="webcam" icon={Camera} label="WEBCAM TEST" />
          <NavItem id="gamepad" icon={Gamepad2} label="GAMEPAD TEST" />
          <NavItem id="typing" icon={Type} label="TYPING TEST" />
          <NavItem id="audio-sync" icon={Volume2} label="AUDIO SYNC TEST" />

          <div className="pt-4 mt-4 border-t border-secondary/20 space-y-2">
            <div className="px-4 pb-2">
              <TestSummaryModal />
            </div>
            <Link href="/faq" className="w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 font-orbitron text-sm tracking-wide group text-muted-foreground hover:text-primary hover:bg-surface">
              <HelpCircle className="w-5 h-5 group-hover:text-primary transition-colors" />
              FAQ & GUIDE
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-secondary/20 bg-black/20 md:mt-auto">
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
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-secondary/20 flex justify-between items-center bg-background/80 backdrop-blur sticky top-0 z-20">
          <span className="font-orbitron font-bold text-primary">Device Test Online</span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="text-foreground"
            aria-label="Open navigation"
          >
            <Menu />
          </button>
        </header>

        <div className="px-4 py-6 md:px-8 md:py-8 lg:px-12 lg:py-12">
          <div className="max-w-6xl mx-auto space-y-10 md:space-y-12">

            <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-orbitron text-foreground glow-text mb-2">
                {activeModule === 'dashboard' && 'Hardware Diagnostic Suite'}
                {activeModule === 'mouse' && 'Mouse Diagnostics'}
                {activeModule === 'keyboard' && 'Keyboard Matrix'}
                {activeModule === 'pixel' && 'Monitor Test & Refresh Rate'}
                {activeModule === 'mic' && 'Audio Input Check'}
                {activeModule === 'webcam' && 'Webcam Diagnostics'}
                {activeModule === 'gamepad' && 'Controller Input'}
                {activeModule === 'typing' && 'Typing Speed Test'}
                {activeModule === 'audio-sync' && 'Audio Latency Test'}
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
              {activeModule === 'typing' && <TypingTest />}
              {activeModule === 'audio-sync' && <AudioSyncTest />}
            </div>


            <footer className="mt-16 py-8 border-t border-secondary/10 text-center text-sm text-muted-foreground font-mono">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4">
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
