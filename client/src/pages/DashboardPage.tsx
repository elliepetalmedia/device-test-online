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
import { MODULE_ROUTES, getRouteContent, type DiagnosticCategory, type ModuleType } from "@/lib/site";

const moduleIcons: Record<Exclude<ModuleType, "dashboard">, React.ComponentType<{ className?: string }>> = {
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
  description: string;
}> = [
  {
    key: "input",
    title: "Input Diagnostics",
    description: "Mouse, keyboard, controller, and switch-behavior checks for gamers, office setups, and hardware triage.",
  },
  {
    key: "audio",
    title: "Audio Diagnostics",
    description: "Microphone, speaker, headphone, and latency checks for calls, streaming, and Bluetooth troubleshooting.",
  },
  {
    key: "video-display",
    title: "Video and Display",
    description: "Webcam, monitor, and refresh-rate checks for remote work, used-device inspection, and display tuning.",
  },
  {
    key: "mobile-touch",
    title: "Mobile and Touch",
    description: "Touchscreen and screen-surface checks for phones, tablets, convertibles, and touch-enabled monitors.",
  },
];

const useCases = [
  {
    title: "Before a Zoom, Meet, or Teams call",
    href: "/microphone-test",
    description: "Start with microphone input, then move through speakers, webcam, and latency before you join.",
  },
  {
    title: "Troubleshoot a gaming setup",
    href: "/mouse-test",
    description: "Baseline your mouse, double-click behavior, keyboard matrix, controller drift, and monitor refresh path.",
  },
  {
    title: "Check a used laptop before buying",
    href: "/dead-pixel-test",
    description: "Inspect the screen, keyboard, webcam, microphone, and refresh path before you hand over money.",
  },
  {
    title: "Test a phone or tablet screen",
    href: "/touchscreen-test",
    description: "Confirm touch coverage, dead zones, and visual panel health on mobile or tablet hardware.",
  },
];

export default function DashboardPage() {
  const diagnosticRoutes = MODULE_ROUTES.filter(
    (route): route is (typeof MODULE_ROUTES)[number] & {
      target: Exclude<(typeof MODULE_ROUTES)[number]["target"], "dashboard">;
    } => route.target !== "dashboard",
  );

  return (
    <DiagnosticShell
      activeModule="dashboard"
      pageTitle="Hardware Diagnostic Suite"
    >
      <div className="space-y-10">
        <div className="space-y-4 text-center">
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-muted-foreground font-roboto-mono">
            Device Test Online helps you verify call gear, gaming peripherals, displays, touchscreens, and everyday
            laptop hardware directly in the browser. Choose a workflow below or jump straight into any dedicated test.
          </p>
        </div>

        <section className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-orbitron text-xl uppercase tracking-widest text-primary">
              Common Use Cases
            </h3>
            <p className="text-sm text-muted-foreground">
              Start with the workflow that matches what you are trying to diagnose or verify right now.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {useCases.map((useCase) => (
              <Link key={useCase.href} href={useCase.href}>
                <a className="group block h-full">
                  <Card className="h-full border-primary/20 bg-black/30 p-5 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5">
                    <h4 className="mb-2 font-orbitron text-lg text-white">{useCase.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{useCase.description}</p>
                    <div className="mt-4 inline-flex items-center text-sm font-bold uppercase tracking-wider text-primary">
                      Start Here
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          {groupedCategories.map((group) => {
            const routes = diagnosticRoutes.filter(
              (route) => getRouteContent(route.target).dashboardCategory === group.key,
            );

            if (routes.length === 0) {
              return null;
            }

            return (
              <div key={group.key} className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-orbitron text-xl uppercase tracking-widest text-primary">
                    {group.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {routes.map((route) => {
                    const Icon = moduleIcons[route.target];

                    return (
                      <Link key={route.target} href={route.path}>
                        <a className="group block h-full">
                          <Card className="relative flex h-full flex-col overflow-hidden border-primary/20 bg-black/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
                            <div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                              <Icon className="h-28 w-28 text-primary" />
                            </div>

                            <div className="z-10 mb-4 flex items-center gap-4">
                              <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                                <Icon className="h-7 w-7 text-primary" />
                              </div>
                            </div>

                            <h4 className="z-10 mb-2 font-orbitron text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                              {route.uiTitle ?? route.title}
                            </h4>

                            <p className="z-10 mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                              {route.description}
                            </p>

                            <div className="z-10 flex items-center text-sm font-bold uppercase tracking-wider text-primary">
                              Start Test
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

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              href: "/faq",
              icon: BookOpenText,
              title: "Interpret Results",
              description:
                "Read the FAQ and hardware guide for ghosting, stick drift, one-ear audio, browser permissions, and refresh-rate troubleshooting.",
            },
            {
              href: "/privacy",
              icon: LockKeyhole,
              title: "Review Privacy",
              description:
                "Understand which diagnostics stay local to the browser and how Google Analytics and AdSense are disclosed on the site.",
            },
            {
              href: "/about",
              icon: ShieldCheck,
              title: "Know the Publisher",
              description:
                "See who publishes Device Test Online, why the suite exists, and where to send business or legal questions.",
            },
          ].map(({ href, icon: Icon, title, description }) => (
            <Link key={href} href={href}>
              <a className="group block h-full">
                <Card className="h-full border-secondary/20 bg-surface p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg border border-primary/20 bg-primary/10 p-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-orbitron text-lg text-white">{title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </DiagnosticShell>
  );
}
