import React from 'react';
import { Link } from 'wouter';
import { HelpCircle, ArrowLeft, MousePointer2, Keyboard, Monitor, Mic, Camera, Gamepad2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background text-foreground font-roboto-mono p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Diagnostics
          </Link>
        </div>

        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_10px_rgba(102,252,241,0.3)] flex items-center gap-4">
            <HelpCircle className="w-10 h-10 text-primary" />
            FAQ & Guide
          </h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about hardware diagnostics and common issues.
          </p>
        </header>

        <div className="space-y-8">
          {/* Mouse Section */}
          <section>
            <h2 className="text-2xl font-orbitron text-primary mb-4 flex items-center gap-3 border-b border-primary/20 pb-2">
              <MousePointer2 className="w-6 h-6" /> Mouse Diagnostics
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="double-click">
                <AccordionTrigger className="font-bold text-lg text-foreground hover:text-primary transition-colors">What is the "Double-Click Fault"?</AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed text-base">
                  <p className="mb-2">
                    A double-click fault occurs when a single physical click registers as two or more electrical signals sent to your computer. This happens when the metal contact leaf inside the mouse's microswitch degrades or oxidizes over time.
                  </p>
                  <p>
                    Our test detects this by measuring the time between clicks. If two clicks happen within <strong>80 milliseconds</strong> (faster than humanly possible for most people), it flags a potential hardware fault.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="polling-rate">
                <AccordionTrigger className="font-bold text-lg text-foreground hover:text-primary transition-colors">What is Polling Rate and why does it matter?</AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed text-base">
                  <p className="mb-2">
                    Polling rate (measured in Hz) is how often your mouse reports its position to your computer. 
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li><strong>125Hz:</strong> Standard office mouse (reports every 8ms).</li>
                    <li><strong>500Hz:</strong> Good gaming standard (reports every 2ms).</li>
                    <li><strong>1000Hz:</strong> Pro gaming standard (reports every 1ms).</li>
                  </ul>
                  <p>
                    A higher polling rate results in smoother cursor movement and lower latency.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="jitter">
                <AccordionTrigger className="font-bold text-lg text-foreground hover:text-primary transition-colors">What does the Jitter Graph show?</AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed text-base">
                  <p>
                    The Jitter Graph visualizes the consistency of your polling rate. Ideally, the bars should be all the same height. If you see wild fluctuations (e.g., jumping between 500Hz and 1000Hz), it could indicate a dirty sensor, a poor USB connection, or an overloaded CPU.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Keyboard Section */}
          <section>
            <h2 className="text-2xl font-orbitron text-primary mb-4 flex items-center gap-3 border-b border-primary/20 pb-2">
              <Keyboard className="w-6 h-6" /> Keyboard Diagnostics
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ghosting">
                <AccordionTrigger className="font-bold text-lg text-foreground hover:text-primary transition-colors">What is Ghosting and NKRO?</AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed text-base">
                  <p className="mb-2">
                    <strong>Ghosting</strong> happens when you press multiple keys simultaneously, and some of them don't register. This is common in cheaper membrane keyboards.
                  </p>
                  <p>
                    <strong>NKRO (N-Key Rollover)</strong> means you can press any number of keys simultaneously, and all will register. Gaming keyboards usually feature 6-Key Rollover or full NKRO. Use our keyboard test to press as many keys as you can to verify your keyboard's limit.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Monitor Section */}
          <section>
            <h2 className="text-2xl font-orbitron text-primary mb-4 flex items-center gap-3 border-b border-primary/20 pb-2">
              <Monitor className="w-6 h-6" /> Monitor & Pixels
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="dead-vs-stuck">
                <AccordionTrigger className="font-bold text-lg text-foreground hover:text-primary transition-colors">Dead Pixel vs. Stuck Pixel</AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed text-base">
                  <p className="mb-2">
                    <strong className="text-white">Dead Pixel:</strong> Appears as a black dot. The transistor is dead and blocks light. These are usually permanent.
                  </p>
                  <p>
                    <strong className="text-white">Stuck Pixel:</strong> Appears as a bright red, green, or blue dot. The transistor is stuck in the "on" position. These can sometimes be fixed by gently massaging the area or using software that rapidly flashes colors.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="refresh-rate">
                <AccordionTrigger className="font-bold text-lg text-foreground hover:text-primary transition-colors">My refresh rate is lower than advertised!</AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed text-base">
                  <p className="mb-2">
                    If you bought a 144Hz monitor but our test shows 60Hz, it's a common configuration issue.
                  </p>
                  <p>
                    <strong>Fix:</strong> Go to your OS Display Settings (Windows: Settings &gt; System &gt; Display &gt; Advanced display) and manually select the higher refresh rate from the dropdown menu. Also ensure you are using a high-bandwidth cable (DisplayPort is often better than HDMI for high refresh rates).
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Audio Section */}
          <section>
            <h2 className="text-2xl font-orbitron text-primary mb-4 flex items-center gap-3 border-b border-primary/20 pb-2">
              <Mic className="w-6 h-6" /> Microphone & Webcam
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="mic-privacy">
                <AccordionTrigger className="font-bold text-lg text-foreground hover:text-primary transition-colors">Is my recording saved?</AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed text-base">
                  <p>
                    <strong>No.</strong> All microphone and webcam testing happens locally in your browser's memory (RAM). The video feed and audio recordings never leave your device and are never uploaded to any server. Once you close the tab, that data is gone forever.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="permissions">
                <AccordionTrigger className="font-bold text-lg text-foreground hover:text-primary transition-colors">Why can't I see my camera/mic?</AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed text-base">
                  <p>
                    Browsers require explicit permission to access these devices. Look for a lock icon or a camera icon in your browser's address bar and click "Allow." If you denied it previously, you may need to reset permissions for this site.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Gamepad Section */}
          <section>
            <h2 className="text-2xl font-orbitron text-primary mb-4 flex items-center gap-3 border-b border-primary/20 pb-2">
              <Gamepad2 className="w-6 h-6" /> Gamepad / Controller
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="drift">
                <AccordionTrigger className="font-bold text-lg text-foreground hover:text-primary transition-colors">What is Stick Drift?</AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed text-base">
                  <p className="mb-2">
                    Stick drift happens when the analog sticks on your controller register movement even when you aren't touching them. This is caused by wear and tear on the internal potentiometers.
                  </p>
                  <p>
                    Check the "Analog Axes" section of our Gamepad Test. If the values aren't settling at exactly <strong>0.0000</strong> (or very close to it) when you let go of the stick, you have some drift. Small amounts are normal; large amounts will affect gameplay.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="no-vibration">
                <AccordionTrigger className="font-bold text-lg text-foreground hover:text-primary transition-colors">Why isn't my controller vibrating?</AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed text-base">
                  <p>
                    Web vibration support depends heavily on your browser and OS drivers.
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Chrome/Edge:</strong> Best support.</li>
                    <li><strong>Firefox:</strong> Often blocks vibration by default.</li>
                    <li><strong>macOS:</strong> Bluetooth controllers often don't support vibration over the web.</li>
                  </ul>
                  <p className="mt-2">
                    Try connecting via USB cable if Bluetooth vibration isn't working.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        <div className="bg-surface border border-primary/20 p-8 rounded-lg text-center mt-12">
          <h3 className="font-orbitron text-xl text-white mb-2">Still having trouble?</h3>
          <p className="text-muted-foreground mb-4">
            If a test indicates a hardware failure, try testing the device on a different computer to confirm before replacing it.
          </p>
          <Link href="/" className="inline-block bg-primary text-black font-bold py-3 px-8 rounded hover:bg-primary/80 transition-colors">
            Run Diagnostics Now
          </Link>
        </div>
      </div>
    </div>
  );
}
