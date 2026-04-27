import React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpenText,
  Camera,
  Gamepad2,
  LockKeyhole,
  Keyboard,
  Mic,
  Monitor,
  MousePointer2,
  ShieldCheck,
  Type,
  Volume2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { DiagnosticShell } from "@/components/layout/DiagnosticShell";
import { MODULE_ROUTES } from "@/lib/site";

const moduleIcons = {
  mouse: MousePointer2,
  keyboard: Keyboard,
  pixel: Monitor,
  mic: Mic,
  webcam: Camera,
  gamepad: Gamepad2,
  typing: Type,
  "audio-sync": Volume2,
} as const;

export default function DashboardPage() {
  return (
    <DiagnosticShell
      activeModule="dashboard"
      pageTitle="Hardware Diagnostic Suite"
    >
      <div className="space-y-8">
        <div className="text-center w-full mb-8">
          <p className="text-lg text-muted-foreground leading-relaxed font-roboto-mono">
            Welcome to <span className="text-primary font-bold">Device Test Online</span>,
            the browser-based suite for testing input devices, displays,
            cameras, microphones, controllers, and apparent audio delay without
            installing extra software. Select any diagnostic tool below to run
            the test locally in your browser. For deeper explanations of common
            issues, interpretation help, and policy details, use the resources
            below or consult our{" "}
            <Link
              href="/faq"
              className="text-primary hover:underline underline-offset-4"
            >
              FAQ & Guide
            </Link>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {MODULE_ROUTES.filter(
            (route): route is (typeof MODULE_ROUTES)[number] & {
              target: Exclude<(typeof MODULE_ROUTES)[number]["target"], "dashboard">;
            } => route.target !== "dashboard",
          ).map((route) => {
              const Icon = moduleIcons[route.target];

              return (
                <Link key={route.target} href={route.path}>
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
                        {route.uiTitle ?? route.title}
                      </h3>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 z-10">
                        {route.description}
                      </p>

                      <div className="flex items-center text-primary text-sm font-bold uppercase tracking-wider z-10">
                        Start Test{" "}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </a>
                </Link>
              );
            })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              href: "/faq",
              icon: BookOpenText,
              title: "Interpret Results",
              description:
                "Read the FAQ and hardware guide for stuck pixels, ghosting, drift, and browser permission troubleshooting.",
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
