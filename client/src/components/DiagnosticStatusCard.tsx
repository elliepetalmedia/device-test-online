import { AlertTriangle, CheckCircle2, CircleDot, Info, ShieldAlert, XCircle } from "lucide-react";

import type { DiagnosticStatus } from "@/lib/diagnosticStatus";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DiagnosticStatusCardProps {
  status: DiagnosticStatus;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

const statusStyles: Record<
  DiagnosticStatus["state"],
  {
    icon: typeof Info;
    border: string;
    iconColor: string;
    badge: string;
    badgeLabel: string;
  }
> = {
  supported: {
    icon: CheckCircle2,
    border: "border-neon-green/30 bg-neon-green/5",
    iconColor: "text-neon-green",
    badge: "border-neon-green/30 bg-neon-green/10 text-neon-green",
    badgeLabel: "Supported",
  },
  unsupported: {
    icon: XCircle,
    border: "border-destructive/40 bg-destructive/10",
    iconColor: "text-destructive",
    badge: "border-destructive/40 bg-destructive/10 text-destructive",
    badgeLabel: "Unsupported",
  },
  "permission-required": {
    icon: ShieldAlert,
    border: "border-primary/30 bg-primary/5",
    iconColor: "text-primary",
    badge: "border-primary/30 bg-primary/10 text-primary",
    badgeLabel: "Permission Required",
  },
  "permission-denied": {
    icon: ShieldAlert,
    border: "border-destructive/40 bg-destructive/10",
    iconColor: "text-destructive",
    badge: "border-destructive/40 bg-destructive/10 text-destructive",
    badgeLabel: "Permission Denied",
  },
  "device-unavailable": {
    icon: AlertTriangle,
    border: "border-yellow-500/30 bg-yellow-500/10",
    iconColor: "text-yellow-400",
    badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    badgeLabel: "Device Missing",
  },
  "device-busy": {
    icon: AlertTriangle,
    border: "border-orange-500/30 bg-orange-500/10",
    iconColor: "text-orange-300",
    badge: "border-orange-500/30 bg-orange-500/10 text-orange-300",
    badgeLabel: "Device Busy",
  },
  ready: {
    icon: CircleDot,
    border: "border-primary/30 bg-primary/5",
    iconColor: "text-primary",
    badge: "border-primary/30 bg-primary/10 text-primary",
    badgeLabel: "Ready",
  },
  active: {
    icon: CheckCircle2,
    border: "border-neon-green/30 bg-neon-green/5",
    iconColor: "text-neon-green",
    badge: "border-neon-green/30 bg-neon-green/10 text-neon-green",
    badgeLabel: "Active",
  },
  failed: {
    icon: XCircle,
    border: "border-destructive/40 bg-destructive/10",
    iconColor: "text-destructive",
    badge: "border-destructive/40 bg-destructive/10 text-destructive",
    badgeLabel: "Action Needed",
  },
};

export function DiagnosticStatusCard({
  status,
  onAction,
  actionLabel,
  className,
}: DiagnosticStatusCardProps) {
  const style = statusStyles[status.state];
  const Icon = style.icon;
  const resolvedActionLabel = actionLabel ?? status.actionLabel;

  return (
    <Card className={cn("p-4 border backdrop-blur-sm shadow-none", style.border, className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className={cn("mt-0.5", style.iconColor)}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-orbitron text-sm uppercase tracking-[0.2em] text-white">
                {status.title}
              </h4>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-orbitron uppercase tracking-[0.18em]",
                  style.badge,
                )}
              >
                {style.badgeLabel}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">{status.description}</p>

            {status.notes && status.notes.length > 0 ? (
              <ul className="space-y-1 text-xs text-muted-foreground/90">
                {status.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {onAction && resolvedActionLabel ? (
          <Button onClick={onAction} variant="outline" className="font-orbitron sm:self-start">
            {resolvedActionLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
