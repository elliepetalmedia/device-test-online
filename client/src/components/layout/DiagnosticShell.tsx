import React, { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Camera,
  Gamepad2,
  HelpCircle,
  Keyboard,
  LayoutGrid,
  Menu,
  Mic,
  Monitor,
  MousePointer2,
  Type,
  Volume2,
  X,
} from "lucide-react";

import { TestSummaryModal } from "@/components/TestSummaryModal";
import {
  RelatedDiagnosticsSection,
  RouteTrustCallout,
} from "@/components/RouteSupportSections";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MODULE_ROUTES,
  getRouteContent,
  getRouteDefinitionByTarget,
  MODULE_ROUTE_MAP,
  type ModuleType,
} from "@/lib/site";

const moduleIcons = {
  dashboard: LayoutGrid,
  mouse: MousePointer2,
  keyboard: Keyboard,
  pixel: Monitor,
  mic: Mic,
  webcam: Camera,
  gamepad: Gamepad2,
  typing: Type,
  "audio-sync": Volume2,
} as const;

interface DiagnosticShellProps {
  activeModule: ModuleType;
  pageTitle: string;
  children: ReactNode;
}

export function DiagnosticShell({
  activeModule,
  pageTitle,
  children,
}: DiagnosticShellProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeModule, location]);

  const route = getRouteDefinitionByTarget(activeModule);
  const routeContent = getRouteContent(activeModule);

  const NavItem = ({
    id,
    label,
  }: {
    id: ModuleType;
    label: string;
  }) => {
    const Icon = moduleIcons[id];
    const isActive = activeModule === id;
    const href = MODULE_ROUTE_MAP[id];

    return (
      <Link href={href} onClick={() => setMobileMenuOpen(false)}>
        <a
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 font-orbitron text-sm tracking-wide group cursor-pointer",
            isActive
              ? "bg-primary/10 text-primary border-l-4 border-primary shadow-[inset_10px_0_20px_-10px_rgba(102,252,241,0.2)]"
              : "text-muted-foreground hover:text-foreground hover:bg-surface",
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5 transition-colors",
              isActive
                ? "text-primary drop-shadow-[0_0_5px_rgba(102,252,241,0.8)]"
                : "group-hover:text-foreground",
            )}
          />
          {label}
        </a>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[18rem] max-w-[85vw] bg-black/40 backdrop-blur-xl border-r border-secondary/20 transform transition-transform duration-300 overflow-y-auto md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
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
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">
                Hardware Suite
              </p>
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
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                Diagnose and test your computer peripherals with interactive
                hardware diagnostics.
              </p>
        </div>

        <nav className="p-4 space-y-2">
          {MODULE_ROUTES.filter((route) => route.target !== "dashboard").map(
            (route) => (
              <NavItem
                key={route.target}
                id={route.target}
                label={route.navLabel ?? route.uiTitle ?? route.title}
              />
            ),
          )}

          <div className="pt-4 mt-4 border-t border-secondary/20 space-y-2">
            <div className="px-4 pb-2">
              <TestSummaryModal />
            </div>
            <Link
              href="/faq"
              className="w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 font-orbitron text-sm tracking-wide group text-muted-foreground hover:text-primary hover:bg-surface"
            >
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

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0">
        <header className="md:hidden p-4 border-b border-secondary/20 flex justify-between items-center bg-background/80 backdrop-blur sticky top-0 z-20">
          <span className="font-orbitron font-bold text-primary">
            Device Test Online
          </span>
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
                {pageTitle}
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {route.description}
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
            </header>

            <div className="min-h-[500px] animate-in fade-in zoom-in-95 duration-300 space-y-8">
              <RouteTrustCallout target={activeModule} />
              {children}
              {routeContent.relatedTargets?.length ? (
                <RelatedDiagnosticsSection targets={routeContent.relatedTargets} />
              ) : null}
            </div>

            <footer className="mt-16 py-8 border-t border-secondary/10 text-center text-sm text-muted-foreground font-mono">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4">
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy
                </Link>
              </div>
              <p className="mb-2">
                Device Test Online uses Google Analytics and may load Google AdSense to support the site. See{" "}
                <Link href="/privacy" className="text-primary transition-colors hover:text-primary/80">
                  Privacy
                </Link>{" "}
                for details.
              </p>
              <p>&copy; 2026 Ellie Petal Media. All systems nominal.</p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

const loadingMessages: Record<ModuleType, string> = {
  dashboard: "Preparing the diagnostic suite…",
  mouse: "Loading mouse diagnostics…",
  keyboard: "Loading keyboard matrix…",
  pixel: "Loading monitor diagnostics…",
  mic: "Loading microphone tools…",
  webcam: "Loading webcam diagnostics…",
  gamepad: "Loading controller diagnostics…",
  typing: "Loading typing tools…",
  "audio-sync": "Loading audio latency tools…",
};

export function DiagnosticLoadingState({ module }: { module: ModuleType }) {
  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-primary/20 backdrop-blur-sm p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
          <div className="space-y-2">
            <p className="font-orbitron text-primary tracking-widest uppercase">
              Loading Diagnostics
            </p>
            <p className="text-sm text-muted-foreground font-roboto-mono">
              {loadingMessages[module]}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/30 border-secondary/20 p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-primary/10 animate-pulse" />
          <div className="h-48 rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
        </Card>
        <Card className="bg-black/30 border-secondary/20 p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-primary/10 animate-pulse" />
          <div className="h-24 rounded bg-white/5 animate-pulse" />
          <div className="h-24 rounded bg-white/5 animate-pulse" />
        </Card>
      </div>
    </div>
  );
}
