import React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Camera,
  Gamepad2,
  Keyboard,
  Mic,
  Monitor,
  MousePointer2,
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
            the privacy-first suite for testing your hardware directly in the
            browser. Select any diagnostic tool below to instantly check your
            mouse, keyboard, monitor, or controller. For detailed explanations
            of common issues and test results, please consult our{" "}
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
      </div>
    </DiagnosticShell>
  );
}
