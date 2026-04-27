import React, { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Camera,
  Gamepad2,
  Hand,
  Headphones,
  HelpCircle,
  Keyboard,
  LayoutGrid,
  Menu,
  Mic,
  Monitor,
  MousePointer2,
  RefreshCw,
  Type,
  Volume2,
  X,
} from "lucide-react";

import { TestSummaryModal } from "@/components/TestSummaryModal";
import {
  DiagnosticSupportSection,
  RelatedDiagnosticsSection,
  RouteTrustCallout,
} from "@/components/RouteSupportSections";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MODULE_ROUTES,
  MODULE_ROUTE_MAP,
  getRouteContent,
  getRouteDefinitionByTarget,
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
  speaker: Volume2,
  headphone: Headphones,
  "double-click": MousePointer2,
  "refresh-rate": RefreshCw,
  touchscreen: Hand,
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
        <div className="border-b border-secondary/20 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <a className="block cursor-pointer transition-opacity hover:opacity-80">
                  <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-orbitron text-2xl font-black text-transparent drop-shadow-[0_0_10px_rgba(102,252,241,0.3)]">
                    Device Test Online
                  </h1>
                </a>
              </Link>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Hardware Suite
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground transition-colors hover:text-foreground md:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Diagnose call gear, gaming peripherals, displays, and touch hardware with browser-based checks.
          </p>
        </div>

        <nav className="space-y-2 p-4">
          {MODULE_ROUTES.filter((route) => route.target !== "dashboard").map(
            (route) => (
              <NavItem
                key={route.target}
                id={route.target}
                label={route.navLabel ?? route.uiTitle ?? route.title}
              />
            ),
          )}

          <div className="mt-4 space-y-2 border-t border-secondary/20 pt-4">
            <div className="px-4 pb-2">
              <TestSummaryModal />
            </div>
            <Link
              href="/faq"
              className="w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 font-orbitron text-sm tracking-wide group text-muted-foreground hover:text-primary hover:bg-surface"
            >
              <HelpCircle className="h-5 w-5 transition-colors group-hover:text-primary" />
              FAQ & GUIDE
            </Link>
          </div>
        </nav>

        <div className="border-t border-secondary/20 bg-black/20 p-6 md:mt-auto">
          <div className="flex flex-col gap-2 font-mono text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-neon-green shadow-[0_0_5px_var(--color-neon-green)]"></div>
              <span>Browser Diagnostics Live</span>
            </div>
            <div className="opacity-50">
              Local device checks with site-level analytics disclosure
            </div>
          </div>
        </div>
      </aside>

      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/80 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-secondary/20 bg-background/80 p-4 backdrop-blur md:hidden">
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
          <div className="mx-auto max-w-6xl space-y-10 md:space-y-12">
            <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="mb-2 text-2xl font-orbitron text-foreground glow-text sm:text-3xl md:text-4xl">
                {pageTitle}
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {route.description}
              </p>
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-primary to-transparent"></div>
            </header>

            <div className="min-h-[500px] space-y-8 animate-in fade-in zoom-in-95 duration-300">
              <RouteTrustCallout target={activeModule} />
              {children}
              <DiagnosticSupportSection target={activeModule} />
              {routeContent.relatedTargets?.length ? (
                <RelatedDiagnosticsSection targets={routeContent.relatedTargets} />
              ) : null}
            </div>

            <footer className="mt-16 border-t border-secondary/10 py-8 text-center font-mono text-sm text-muted-foreground">
              <div className="mb-4 flex flex-wrap justify-center gap-4 sm:gap-6">
                <Link href="/about" className="transition-colors hover:text-primary">
                  About
                </Link>
                <Link href="/contact" className="transition-colors hover:text-primary">
                  Contact
                </Link>
                <Link href="/privacy" className="transition-colors hover:text-primary">
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
              <p>&copy; 2026 Ellie Petal Media.</p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

const loadingMessages: Record<ModuleType, string> = {
  dashboard: "Preparing the diagnostic suite...",
  mouse: "Loading mouse diagnostics...",
  keyboard: "Loading keyboard matrix...",
  pixel: "Loading monitor diagnostics...",
  mic: "Loading microphone tools...",
  webcam: "Loading webcam diagnostics...",
  gamepad: "Loading controller diagnostics...",
  typing: "Loading typing tools...",
  "audio-sync": "Loading audio latency tools...",
  speaker: "Loading speaker test...",
  headphone: "Loading headphone test...",
  "double-click": "Loading double click detection...",
  "refresh-rate": "Loading refresh rate monitor...",
  touchscreen: "Loading touchscreen diagnostics...",
};

export function DiagnosticLoadingState({ module }: { module: ModuleType }) {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-black/40 p-6 backdrop-blur-sm md:p-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary/40 border-t-primary" />
          <div className="space-y-2">
            <p className="font-orbitron uppercase tracking-widest text-primary">
              Loading Diagnostics
            </p>
            <p className="font-roboto-mono text-sm text-muted-foreground">
              {loadingMessages[module]}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="space-y-4 border-secondary/20 bg-black/30 p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-primary/10" />
          <div className="h-48 animate-pulse rounded bg-white/5" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
        </Card>
        <Card className="space-y-4 border-secondary/20 bg-black/30 p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-primary/10" />
          <div className="h-24 animate-pulse rounded bg-white/5" />
          <div className="h-24 animate-pulse rounded bg-white/5" />
        </Card>
      </div>
    </div>
  );
}
