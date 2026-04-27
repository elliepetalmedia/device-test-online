import React from "react";
import { Link } from "wouter";
import {
  FileText,
  Gamepad2,
  Headphones,
  HelpCircle,
  Keyboard,
  Mic,
  Monitor,
  MousePointer2,
  Smartphone,
  Type,
  Volume2,
} from "lucide-react";

import { PublicInfoPageLayout } from "@/components/PublicInfoPageLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <PublicInfoPageLayout target="faq">
      <div className="space-y-8">
        <div className="rounded-lg border border-primary/20 bg-surface p-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="mt-1 h-8 w-8 text-primary" />
            <div className="space-y-2">
              <h2 className="font-orbitron text-2xl text-white">Interpret results faster</h2>
              <p className="text-muted-foreground">
                This guide explains the most common failures surfaced by the site, including switch bounce, ghosting,
                dead pixels, one-ear headphone audio, permission issues, stick drift, touch dead zones, and Bluetooth
                delay.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            { href: "/speaker-test", label: "Need a quick call setup path?", body: "Start with speaker output, then continue to microphone and webcam checks." },
            { href: "/double-click-test", label: "Mouse feels unreliable?", body: "Go straight to the dedicated double-click tester before replacing the switch." },
            { href: "/refresh-rate-test", label: "Monitor feels stuck at 60Hz?", body: "Use the standalone refresh-rate page for a cleaner Hz read than the monitor overview route." },
            { href: "/touchscreen-test", label: "Testing a phone or tablet?", body: "Use the touchscreen route to trace dead zones and confirm multi-touch coverage." },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <a className="block h-full rounded-lg border border-primary/20 bg-black/30 p-5 transition-colors hover:bg-primary/5">
                <h3 className="mb-2 font-orbitron text-lg text-white">{item.label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </a>
            </Link>
          ))}
        </div>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <MousePointer2 className="h-6 w-6" /> Mouse Diagnostics
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="double-click">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                What is a mouse double-click fault?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                A double-click fault happens when one physical press registers as two inputs because the switch is
                bouncing electrically. Use the dedicated{" "}
                <Link href="/double-click-test" className="text-primary hover:underline">
                  double click test
                </Link>{" "}
                if you want a cleaner signal than the broader mouse page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="polling-rate">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                What is polling rate and why does it matter?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Polling rate is how often the mouse reports movement to the system. Higher numbers usually feel
                smoother, but unstable readings can still come from hubs, dirty sensors, surfaces, or browser
                sampling limits.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Keyboard className="h-6 w-6" /> Keyboard Diagnostics
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ghosting">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                What is ghosting and NKRO?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Ghosting happens when combinations of simultaneous key presses fail or produce incorrect signals. NKRO
                means the board can register many concurrent presses. Use the{" "}
                <Link href="/typing-test" className="text-primary hover:underline">
                  typing test
                </Link>{" "}
                after the matrix page if you want to compare raw key coverage with real text-entry behavior.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Monitor className="h-6 w-6" /> Display and Refresh
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="dead-vs-stuck">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Dead pixel vs. stuck pixel
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Dead pixels are usually black because the transistor no longer drives light. Stuck pixels remain bright
                on one color channel. Use the{" "}
                <Link href="/refresh-rate-test" className="text-primary hover:underline">
                  refresh-rate test
                </Link>{" "}
                separately if the panel looks fine but motion still feels wrong.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="refresh-rate">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Why am I not getting 144Hz or 165Hz?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                The usual causes are OS settings, cable bandwidth, wrong ports, mirrored displays, or dock limits. The{" "}
                <Link href="/fix-monitor-not-running-at-144hz" className="text-primary hover:underline">
                  144Hz fix guide
                </Link>{" "}
                walks through the common bottlenecks in order.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Mic className="h-6 w-6" /> Call Setup: Mic, Speakers, Webcam
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="mic-privacy">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Is my recording or camera preview saved?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                The diagnostic flow keeps microphone recordings and webcam previews local to the browser session. For
                broader site-level services such as analytics and advertising, see the privacy policy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="permissions">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Why can&apos;t I access my camera or microphone?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Browsers require explicit permission. Look for the lock or media icon in the address bar, and check
                whether another app is already using the device. The{" "}
                <Link href="/fix-microphone-not-working" className="text-primary hover:underline">
                  microphone
                </Link>{" "}
                and{" "}
                <Link href="/fix-webcam-not-working" className="text-primary hover:underline">
                  webcam
                </Link>{" "}
                fix guides walk through the most common blockers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Headphones className="h-6 w-6" /> Speaker and Headphone Audio
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="one-ear">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                What should I do if audio only plays in one ear?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Check left-right balance, mono-audio settings, connector fit, and Bluetooth routing first. Then use
                the{" "}
                <Link href="/headphone-test" className="text-primary hover:underline">
                  headphone test
                </Link>{" "}
                and the{" "}
                <Link href="/fix-headphones-only-playing-in-one-ear" className="text-primary hover:underline">
                  one-ear troubleshooting guide
                </Link>{" "}
                to narrow it down.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="bluetooth-delay">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Why do Bluetooth headphones have delay?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Bluetooth audio adds encoding, transport, and decoding delay. The{" "}
                <Link href="/audio-sync-test" className="text-primary hover:underline">
                  audio sync test
                </Link>{" "}
                helps compare how noticeable that delay is on your current path.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Gamepad2 className="h-6 w-6" /> Gamepad / Controller
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="drift">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                What is stick drift and how do you test it?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Stick drift happens when analog sticks report movement while untouched. The controller page samples the
                resting position and noise floor to estimate whether the deadzone is being compromised.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Smartphone className="h-6 w-6" /> Touchscreen Input
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="touch-zones">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                How do I spot a touch dead zone?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Drag slowly across edges, corners, and the center of the touch pad. If one region consistently stops
                tracking or misses multi-touch contact, that area may have a digitizer or protector-related problem.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Type className="h-6 w-6" /> Typing Speed & Accuracy
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="wpm-calc">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                How is WPM calculated?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Typing speed uses the standard five-characters-per-word formula combined with an accuracy calculation
                based on correct versus incorrect keystrokes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <FileText className="h-6 w-6" /> Result Export
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="hardware-scorecard">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Where can I see or download all my test results?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                The scorecard modal summarizes the current local session and now supports export flows for a broader
                hardware summary. Call-focused routes also include a downloadable pre-call checklist.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </PublicInfoPageLayout>
  );
}
