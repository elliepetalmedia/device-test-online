import React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpenText,
  Camera,
  Gamepad2,
  Hand,
  Headphones,
  Keyboard,
  LockKeyhole,
  Mic,
  Monitor,
  MousePointer2,
  RefreshCw,
  ShieldCheck,
  Type,
  Volume2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";
import {
  MODULE_ROUTES,
  getRouteContent,
  type DiagnosticCategory,
  type ModuleType,
} from "@/lib/site";

const moduleIcons: Record<
  Exclude<ModuleType, "dashboard">,
  React.ComponentType<{ className?: string }>
> = {
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
};

const groupedCategories: Array<{
  key: DiagnosticCategory;
  title: string;
}> = [
  { key: "input", title: "Input" },
  { key: "audio", title: "Audio" },
  { key: "video-display", title: "Video / Display" },
  { key: "mobile-touch", title: "Mobile / Touch" },
];

const useCases = [
  {
    title: "Call Setup",
    href: "/microphone-test",
    description: "Mic, speaker, webcam, latency",
  },
  {
    title: "Gaming Input",
    href: "/mouse-test",
    description: "Mouse, double-click, keyboard, controller",
  },
  {
    title: "Used Laptop Check",
    href: "/dead-pixel-test",
    description: "Display, keyboard, webcam, microphone",
  },
  {
    title: "Phone or Tablet Screen",
    href: "/touchscreen-test",
    description: "Touch coverage and panel health",
  },
];

export default function DashboardPage() {
  const diagnosticRoutes = MODULE_ROUTES.filter(
    (route): route is (typeof MODULE_ROUTES)[number] & {
      target: Exclude<(typeof MODULE_ROUTES)[number]["target"], "dashboard">;
    } => route.target !== "dashboard",
  );

  return (
    <DiagnosticShell activeModule="dashboard" pageTitle="Hardware Diagnostic Suite">
      <div className="space-y-8">
        <div className="max-w-3xl">
          <p className="text-base leading-relaxed text-muted-foreground font-roboto-mono">
            Quick browser checks for call gear, gaming peripherals, displays, and touch hardware. Start with a use
            case or jump straight to a test.
          </p>
        </div>

        <section className="space-y-3">
          <h3 className="font-orbitron text-base uppercase tracking-widest text-primary">
            Common Use Cases
          </h3>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {useCases.map((useCase) => (
              <Link key={useCase.href} href={useCase.href}>
                <a className="group block h-full">
                  <Card className="h-full border-primary/20 bg-black/20 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-orbitron text-sm text-white">{useCase.title}</h4>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {useCase.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          {groupedCategories.map((group) => {
            const routes = diagnosticRoutes.filter(
              (route) => getRouteContent(route.target).dashboardCategory === group.key,
            );

            if (routes.length === 0) {
              return null;
            }

            return (
              <div key={group.key} className="space-y-3">
                <h3 className="font-orbitron text-base uppercase tracking-widest text-primary">
                  {group.title}
                </h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {routes.map((route) => {
                    const Icon = moduleIcons[route.target];

                    return (
                      <Link key={route.target} href={route.path}>
                        <a className="group block h-full">
                          <Card className="flex h-full flex-col border-primary/20 bg-black/30 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5">
                            <div className="mb-3 flex items-center gap-3">
                              <div className="rounded-lg border border-primary/20 bg-primary/10 p-2.5">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <h4 className="font-orbitron text-base text-white">
                                {route.uiTitle ?? route.title}
                              </h4>
                            </div>

                            <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground">
                              {route.description}
                            </p>

                            <div className="flex items-center text-xs font-bold uppercase tracking-wider text-primary">
                              Open Test
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                          </Card>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        <section className="space-y-3">
          <h3 className="font-orbitron text-base uppercase tracking-widest text-primary">
            Resources
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              {
                href: "/faq",
                icon: BookOpenText,
                title: "FAQ",
                description: "Cross-tool guidance and troubleshooting routes.",
              },
              {
                href: "/privacy",
                icon: LockKeyhole,
                title: "Privacy",
                description: "Local device processing and site-level disclosure.",
              },
              {
                href: "/about",
                icon: ShieldCheck,
                title: "About",
                description: "Publisher context and contact path.",
              },
            ].map(({ href, icon: Icon, title, description }) => (
              <Link key={href} href={href}>
                <a className="group block h-full">
                  <Card className="h-full border-secondary/20 bg-surface p-4 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="rounded-lg border border-primary/20 bg-primary/10 p-2.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-orbitron text-sm text-white">{title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DiagnosticShell>
  );
}
