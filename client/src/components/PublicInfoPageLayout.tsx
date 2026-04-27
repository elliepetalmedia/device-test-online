import React, { type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

import { PublicPageCtaSection, RouteTrustCallout } from "@/components/RouteSupportSections";
import { getRouteDefinitionByTarget, type ModuleType, type RouteTarget } from "@/lib/site";

export function PublicInfoPageLayout({
  target,
  children,
}: {
  target: Exclude<RouteTarget, ModuleType | "dashboard" | "not-found">;
  children: ReactNode;
}) {
  const route = getRouteDefinitionByTarget(target);

  return (
    <div className="min-h-screen bg-background px-4 py-6 font-roboto-mono text-foreground md:px-8 md:py-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-2 font-bold text-primary transition-colors hover:text-primary/80">
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Diagnostic Suite
          </Link>
        </div>

        <header className="space-y-4">
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-orbitron text-4xl font-black text-transparent drop-shadow-[0_0_10px_rgba(102,252,241,0.3)] md:text-5xl">
            {route.uiTitle ?? route.title}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{route.description}</p>
        </header>

        <RouteTrustCallout target={target} />

        <div className="space-y-8">{children}</div>

        <PublicPageCtaSection target={target} />
      </div>
    </div>
  );
}
