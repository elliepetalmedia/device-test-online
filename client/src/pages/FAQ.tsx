import React from "react";
import { Link } from "wouter";
import {
  FileText,
  HelpCircle,
  Keyboard,
  Mic,
  Monitor,
  MousePointer2,
  Smartphone,
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
              <h2 className="font-orbitron text-2xl text-white">Use the right page faster</h2>
              <p className="text-muted-foreground">
                This FAQ focuses on cross-tool questions, route selection, and the most common interpretation gaps.
              </p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <FileText className="h-6 w-6" /> Which test should I use?
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="which-call">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                What should I run before a call or stream?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Start with the{" "}
                <Link href="/microphone-test" className="text-primary hover:underline">
                  microphone test
                </Link>
                , then continue to{" "}
                <Link href="/speaker-test" className="text-primary hover:underline">
                  speaker output
                </Link>
                ,{" "}
                <Link href="/webcam-test" className="text-primary hover:underline">
                  webcam preview
                </Link>
                , and finally the{" "}
                <Link href="/audio-sync-test" className="text-primary hover:underline">
                  audio sync test
                </Link>
                {" "}if wireless audio feels delayed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="which-mouse">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Which page should I use for a suspicious mouse click?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Use the broader{" "}
                <Link href="/mouse-test" className="text-primary hover:underline">
                  mouse test
                </Link>
                {" "}for buttons, scroll, and polling, then move to the{" "}
                <Link href="/double-click-test" className="text-primary hover:underline">
                  double click test
                </Link>
                {" "}if one switch seems to be bouncing or opening things twice.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="which-display">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Which page should I use for a monitor problem?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Use{" "}
                <Link href="/dead-pixel-test" className="text-primary hover:underline">
                  monitor test
                </Link>
                {" "}for pixel inspection and solid-color checks. Use{" "}
                <Link href="/refresh-rate-test" className="text-primary hover:underline">
                  refresh rate test
                </Link>
                {" "}when motion feels capped or the display seems stuck below its rated Hz.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Mic className="h-6 w-6" /> Permissions and Privacy
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="saved">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Are microphone recordings or webcam previews uploaded?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                The diagnostic flow keeps microphone recordings and webcam previews in the browser session. Site-level
                analytics and ad services are disclosed separately in the privacy policy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="permission">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Why do camera or microphone tests fail immediately?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                The most common causes are browser permission denial, the wrong input device being selected, or another
                app already using the device. Use the dedicated{" "}
                <Link href="/fix-microphone-not-working" className="text-primary hover:underline">
                  microphone
                </Link>
                {" "}or{" "}
                <Link href="/fix-webcam-not-working" className="text-primary hover:underline">
                  webcam
                </Link>
                {" "}troubleshooting page if you need a step-by-step fix path.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <MousePointer2 className="h-6 w-6" /> Input and Hardware Signals
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ghosting">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                What is ghosting, chatter, or switch bounce?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Ghosting is a keyboard matrix limitation where combinations of presses fail or register incorrectly.
                Chatter or switch bounce is the mouse or keyboard equivalent of one physical press generating multiple
                electrical signals. Use the keyboard matrix, typing, and double-click pages together when you need to
                separate raw hardware issues from normal user input.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="drift">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                What causes controller stick drift?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Stick drift usually comes from wear, contamination, or calibration issues in the analog stick assembly.
                The controller page is most useful when you compare repeated resting behavior, not just one quick glance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Monitor className="h-6 w-6" /> Display, Audio, and Touch
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="audio-delay">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Why is Bluetooth audio delayed?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Wireless audio adds encoding, transport, and decoding delay. Use the{" "}
                <Link href="/audio-sync-test" className="text-primary hover:underline">
                  audio sync test
                </Link>
                {" "}to compare perceived delay across wired and wireless paths.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="one-ear">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                What if sound only comes from one speaker or one ear?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                First confirm channel balance on the{" "}
                <Link href="/speaker-test" className="text-primary hover:underline">
                  speaker
                </Link>
                {" "}or{" "}
                <Link href="/headphone-test" className="text-primary hover:underline">
                  headphone
                </Link>
                {" "}page, then use the one-ear troubleshooting guide if the issue persists.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="touch">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                How do I spot a touchscreen dead zone?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Use the{" "}
                <Link href="/touchscreen-test" className="text-primary hover:underline">
                  touchscreen test
                </Link>
                {" "}and drag across edges, corners, and the center. A repeated missed area is more meaningful than one
                missed tap.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-3 border-b border-primary/20 pb-2 font-orbitron text-2xl text-primary">
            <Keyboard className="h-6 w-6" /> Scores and Exports
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="typing">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                How is typing speed measured?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                Words per minute uses the standard five-characters-per-word calculation, combined with an accuracy
                score based on correct versus incorrect keystrokes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="export">
              <AccordionTrigger className="text-lg font-bold text-foreground transition-colors hover:text-primary">
                Where can I see all my current results?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-gray-300">
                The session summary export in the sidebar gathers the current local test results in one place. Call
                routes also keep the checklist export for meeting-oriented workflows.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="rounded-lg border border-primary/20 bg-surface p-6">
          <div className="flex items-start gap-3">
            <Volume2 className="mt-1 h-5 w-5 text-primary" />
            <div className="space-y-2">
              <h2 className="font-orbitron text-lg text-white">Need a guided fix path?</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Use the symptom guides when the test confirms a problem but you need an ordered troubleshooting path.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/fix-microphone-not-working" className="text-primary hover:underline">
                  Fix microphone
                </Link>
                <Link href="/fix-webcam-not-working" className="text-primary hover:underline">
                  Fix webcam
                </Link>
                <Link href="/fix-mouse-double-clicking" className="text-primary hover:underline">
                  Fix double-clicking mouse
                </Link>
                <Link href="/fix-monitor-not-running-at-144hz" className="text-primary hover:underline">
                  Fix 144Hz issues
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicInfoPageLayout>
  );
}
