import React from "react";
import {
  FileText,
  Gamepad2,
  HelpCircle,
  Keyboard,
  Mic,
  Monitor,
  MousePointer2,
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
                This guide explains the most common failures surfaced by the site, including double-click faults,
                ghosting, dead pixels, permission issues, stick drift, and Bluetooth audio delay.
              </p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <MousePointer2 className="h-6 w-6" /> Mouse Diagnostics
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="double-click">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">What is the "Double-Click Fault"?</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p className="mb-2">
                  A double-click fault occurs when a single physical click registers as two or more electrical signals sent to your computer. This happens when the metal contact leaf inside the mouse microswitch degrades or oxidizes over time.
                </p>
                <p>
                  Our test detects this by measuring the time between clicks. If two clicks happen within <strong>80 milliseconds</strong>, it flags a potential hardware fault.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="polling-rate">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">What is polling rate and why does it matter?</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p className="mb-2">Polling rate, measured in Hz, is how often your mouse reports position changes to your computer.</p>
                <ul className="mb-2 list-disc space-y-1 pl-6">
                  <li><strong>125Hz:</strong> Standard office mouse.</li>
                  <li><strong>500Hz:</strong> Common gaming baseline.</li>
                  <li><strong>1000Hz:</strong> High-frequency gaming standard.</li>
                </ul>
                <p>A higher polling rate generally reduces perceived input latency and improves motion consistency.</p>
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
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">What is ghosting and NKRO?</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p className="mb-2">
                  <strong>Ghosting</strong> happens when you press multiple keys simultaneously and some do not register. This is common in cheaper membrane keyboards or boards with limited matrix design.
                </p>
                <p>
                  <strong>NKRO (N-Key Rollover)</strong> means the keyboard can register many simultaneous key presses. Use the keyboard and typing tools together to confirm both raw key detection and real typing behavior.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Monitor className="h-6 w-6" /> Monitor Test
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="dead-vs-stuck">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">Dead pixel vs. stuck pixel</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p className="mb-2">
                  <strong className="text-white">Dead pixel:</strong> Appears black because the pixel transistor no longer passes light.
                </p>
                <p className="mb-2">
                  <strong className="text-white">Stuck pixel:</strong> Appears bright red, green, or blue because one channel remains active.
                </p>
                <p>
                  The monitor test helps distinguish these cases and verify whether a higher refresh mode is actually active in the operating system.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Mic className="h-6 w-6" /> Microphone & Webcam
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="mic-privacy">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">Is my recording or camera preview saved?</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p>
                  The diagnostic flow is designed to keep microphone recordings and webcam previews local to the browser session. For broader site-level services such as analytics and ads, refer to the privacy policy.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="permissions">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">Why can&apos;t I access my camera or microphone?</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p>
                  Browsers require explicit permission to access those devices. Look for the lock or media icon in the address bar and confirm the site has permission. If another app is already using the device, close it and try again.
                </p>
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
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">What is stick drift and how do you test it?</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p className="mb-2">
                  Stick drift happens when analog sticks report movement while untouched. It is usually caused by wear, contamination, or calibration problems inside the stick assembly.
                </p>
                <p>
                  The drift protocol warms the sticks up, lets them settle, then samples the resting position and noise floor to estimate whether the default deadzone is likely compromised.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="no-vibration">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">Why isn&apos;t my controller vibrating?</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p>
                  Vibration support depends on the browser, operating system, drivers, and whether the controller exposes a compatible haptic API. Chrome and Edge are typically the most reliable choices.
                </p>
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
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">How is WPM calculated?</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p>
                  Typing speed uses the standard words-per-minute formula based on five characters per word, combined with an accuracy calculation from correct versus incorrect keystrokes.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Volume2 className="h-6 w-6" /> Audio Latency Test
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="bluetooth-delay">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">Why do Bluetooth headphones have delay?</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p>
                  Bluetooth audio must be encoded, transmitted, received, and decoded before playback, which adds delay. The audio sync test helps compare how noticeable that delay is across your current output path.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <FileText className="h-6 w-6" /> Test Summary Export
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="hardware-scorecard">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">Where can I see all my test results?</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                <p>
                  Completed diagnostics are summarized locally in the scorecard export flow so you can review findings together and share a quick text summary with a technician or support thread.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </PublicInfoPageLayout>
  );
}
