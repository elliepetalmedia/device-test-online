import React from "react";
import { ArrowRight, ChevronDown, ShieldCheck, Wrench } from "lucide-react";
import { Link } from "wouter";

import { Card } from "@/components/ui/card";
import {
  MODULE_ROUTE_MAP,
  getRouteContent,
  getRouteDefinitionByTarget,
  type ModuleType,
  type RouteTarget,
} from "@/lib/site";

export function RelatedDiagnosticsSection({
  title = "Next Tests",
  description = "Use one of these adjacent checks to keep narrowing down the same hardware path.",
  targets,
}: {
  title?: string;
  description?: string;
  targets: ModuleType[];
}) {
  if (targets.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-orbitron text-base uppercase tracking-widest text-white">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {targets.map((target) => {
          const route = getRouteDefinitionByTarget(target);

          return (
            <Link key={target} href={MODULE_ROUTE_MAP[target]}>
              <a className="group block h-full">
                <Card className="flex h-full flex-col gap-2 border-primary/20 bg-black/20 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5">
                  <div className="flex-1 space-y-1">
                    <h4 className="font-orbitron text-sm text-white">
                      {route.uiTitle ?? route.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {route.description}
                    </p>
                  </div>
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
    </section>
  );
}

export function RouteTrustCallout({ target }: { target: RouteTarget }) {
  const callout = getRouteContent(target).trustCallout;

  if (!callout) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5 p-4">
      <div className="flex gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
        <div className="space-y-2">
          <h3 className="font-orbitron text-xs uppercase tracking-[0.2em] text-white">
            {callout.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {callout.body}
          </p>
          {callout.linkTarget && callout.linkLabel ? (
            <Link href={getRouteDefinitionByTarget(callout.linkTarget).path}>
              <a className="inline-flex items-center text-sm font-bold text-primary transition-colors hover:text-primary/80">
                {callout.linkLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function DiagnosticSupportSection({ target }: { target: ModuleType }) {
  const content = getRouteContent(target);

  if (!content.interpretation && !content.nextSteps) {
    return null;
  }

  return (
    <details className="group rounded-lg border border-secondary/30 bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            <h3 className="font-orbitron text-sm uppercase tracking-[0.2em] text-primary">
              Help and Troubleshooting
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Expand for quick interpretation notes and the most useful next checks.
          </p>
        </div>
        <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>

      <div className="space-y-5 border-t border-secondary/20 px-5 py-5">
        {content.interpretation ? (
          <div className="space-y-2">
            <h4 className="font-orbitron text-sm uppercase tracking-widest text-white">
              {content.interpretation.title}
            </h4>
            <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {content.interpretation.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ) : null}

        {content.nextSteps ? (
          <div className="space-y-2">
            <h4 className="font-orbitron text-sm uppercase tracking-widest text-white">
              {content.nextSteps.title}
            </h4>
            <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {content.nextSteps.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </details>
  );
}

export function DiagnosticNextSection({ target }: { target: ModuleType }) {
  const content = getRouteContent(target);
  const workflowCta = content.workflowCtas?.[0];
  const relatedTargets = content.relatedTargets ?? [];

  if (!workflowCta && relatedTargets.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {workflowCta ? (
        <Link href={getRouteDefinitionByTarget(workflowCta.target).path}>
          <a className="group block">
            <Card className="border-primary/20 bg-black/20 p-5 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5">
              <div className="mb-2 text-xs font-orbitron uppercase tracking-[0.2em] text-primary">
                Continue Next
              </div>
              <h4 className="mb-2 font-orbitron text-base text-white">{workflowCta.label}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {workflowCta.description}
              </p>
              <div className="mt-4 inline-flex items-center text-sm font-bold uppercase tracking-wider text-primary">
                Continue
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </a>
        </Link>
      ) : null}

      {relatedTargets.length > 0 ? (
        <RelatedDiagnosticsSection targets={relatedTargets} />
      ) : null}
    </section>
  );
}

export function PublicPageCtaSection({ target }: { target: RouteTarget }) {
  const content = getRouteContent(target);
  const relatedTargets = content.relatedTargets ?? [];

  return (
    <div className="space-y-6">
      {relatedTargets.length > 0 ? (
        <RelatedDiagnosticsSection
          title="Recommended Next Tests"
          description="Use these diagnostics to keep narrowing down the same device category or adjacent hardware path."
          targets={relatedTargets}
        />
      ) : null}

      {content.primaryCta ? (
        <Card className="border-primary/20 bg-surface p-6 text-center">
          <h3 className="mb-2 font-orbitron text-lg text-white">Ready to run another check?</h3>
          <p className="mb-5 text-sm text-muted-foreground">
            Return to the suite or jump straight into the next page that fits this topic.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={getRouteDefinitionByTarget(content.primaryCta.target).path}>
              <a className="rounded bg-primary px-6 py-3 font-bold text-black transition-colors hover:bg-primary/80">
                {content.primaryCta.label}
              </a>
            </Link>
            {content.secondaryCta ? (
              <Link href={getRouteDefinitionByTarget(content.secondaryCta.target).path}>
                <a className="rounded border border-secondary/30 px-6 py-3 font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  {content.secondaryCta.label}
                </a>
              </Link>
            ) : null}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
