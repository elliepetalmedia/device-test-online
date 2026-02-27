import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { testStore } from '@/lib/store';

// Standard ANSI layout mapping
const KEYBOARD_LAYOUT = [
  [
    { key: 'Escape', label: 'ESC', w: 1 },
    { key: 'F1', label: 'F1', w: 1 },
    { key: 'F2', label: 'F2', w: 1 },
    { key: 'F3', label: 'F3', w: 1 },
    { key: 'F4', label: 'F4', w: 1 },
    { key: 'F5', label: 'F5', w: 1 },
    { key: 'F6', label: 'F6', w: 1 },
    { key: 'F7', label: 'F7', w: 1 },
    { key: 'F8', label: 'F8', w: 1 },
    { key: 'F9', label: 'F9', w: 1 },
    { key: 'F10', label: 'F10', w: 1 },
    { key: 'F11', label: 'F11', w: 1 },
    { key: 'F12', label: 'F12', w: 1 },
  ],
  [
    { key: 'Backquote', label: '`', w: 1 },
    { key: 'Digit1', label: '1', w: 1 },
    { key: 'Digit2', label: '2', w: 1 },
    { key: 'Digit3', label: '3', w: 1 },
    { key: 'Digit4', label: '4', w: 1 },
    { key: 'Digit5', label: '5', w: 1 },
    { key: 'Digit6', label: '6', w: 1 },
    { key: 'Digit7', label: '7', w: 1 },
    { key: 'Digit8', label: '8', w: 1 },
    { key: 'Digit9', label: '9', w: 1 },
    { key: 'Digit0', label: '0', w: 1 },
    { key: 'Minus', label: '-', w: 1 },
    { key: 'Equal', label: '=', w: 1 },
    { key: 'Backspace', label: 'BKSP', w: 2 },
  ],
  [
    { key: 'Tab', label: 'TAB', w: 1.5 },
    { key: 'KeyQ', label: 'Q', w: 1 },
    { key: 'KeyW', label: 'W', w: 1 },
    { key: 'KeyE', label: 'E', w: 1 },
    { key: 'KeyR', label: 'R', w: 1 },
    { key: 'KeyT', label: 'T', w: 1 },
    { key: 'KeyY', label: 'Y', w: 1 },
    { key: 'KeyU', label: 'U', w: 1 },
    { key: 'KeyI', label: 'I', w: 1 },
    { key: 'KeyO', label: 'O', w: 1 },
    { key: 'KeyP', label: 'P', w: 1 },
    { key: 'BracketLeft', label: '[', w: 1 },
    { key: 'BracketRight', label: ']', w: 1 },
    { key: 'Backslash', label: '\\', w: 1.5 },
  ],
  [
    { key: 'CapsLock', label: 'CAPS', w: 1.75 },
    { key: 'KeyA', label: 'A', w: 1 },
    { key: 'KeyS', label: 'S', w: 1 },
    { key: 'KeyD', label: 'D', w: 1 },
    { key: 'KeyF', label: 'F', w: 1 },
    { key: 'KeyG', label: 'G', w: 1 },
    { key: 'KeyH', label: 'H', w: 1 },
    { key: 'KeyJ', label: 'J', w: 1 },
    { key: 'KeyK', label: 'K', w: 1 },
    { key: 'KeyL', label: 'L', w: 1 },
    { key: 'Semicolon', label: ';', w: 1 },
    { key: 'Quote', label: "'", w: 1 },
    { key: 'Enter', label: 'ENTER', w: 2.25 },
  ],
  [
    { key: 'ShiftLeft', label: 'SHIFT', w: 2.25 },
    { key: 'KeyZ', label: 'Z', w: 1 },
    { key: 'KeyX', label: 'X', w: 1 },
    { key: 'KeyC', label: 'C', w: 1 },
    { key: 'KeyV', label: 'V', w: 1 },
    { key: 'KeyB', label: 'B', w: 1 },
    { key: 'KeyN', label: 'N', w: 1 },
    { key: 'KeyM', label: 'M', w: 1 },
    { key: 'Comma', label: ',', w: 1 },
    { key: 'Period', label: '.', w: 1 },
    { key: 'Slash', label: '/', w: 1 },
    { key: 'ShiftRight', label: 'SHIFT', w: 2.75 },
  ],
  [
    { key: 'ControlLeft', label: 'CTRL', w: 1.25 },
    { key: 'MetaLeft', label: 'WIN', w: 1.25 },
    { key: 'AltLeft', label: 'ALT', w: 1.25 },
    { key: 'Space', label: 'SPACE', w: 6.25 },
    { key: 'AltRight', label: 'ALT', w: 1.25 },
    { key: 'MetaRight', label: 'WIN', w: 1.25 },
    { key: 'ContextMenu', label: 'MENU', w: 1.25 },
    { key: 'ControlRight', label: 'CTRL', w: 1.25 },
  ]
];

// Navigation Cluster
const NAV_LAYOUT = [
  [
    { key: 'PrintScreen', label: 'PRT', w: 1 },
    { key: 'ScrollLock', label: 'SCR', w: 1 },
    { key: 'Pause', label: 'PAU', w: 1 },
  ],
  [
    { key: 'Insert', label: 'INS', w: 1 },
    { key: 'Home', label: 'HOM', w: 1 },
    { key: 'PageUp', label: 'PGU', w: 1 },
  ],
  [
    { key: 'Delete', label: 'DEL', w: 1 },
    { key: 'End', label: 'END', w: 1 },
    { key: 'PageDown', label: 'PGD', w: 1 },
  ],
  [
    { key: '', label: '', w: 1, invisible: true },
    { key: 'ArrowUp', label: '↑', w: 1 },
    { key: '', label: '', w: 1, invisible: true },
  ],
  [
    { key: 'ArrowLeft', label: '←', w: 1 },
    { key: 'ArrowDown', label: '↓', w: 1 },
    { key: 'ArrowRight', label: '→', w: 1 },
  ]
];

// Numpad Layout
const NUMPAD_LAYOUT = [
  [
    { key: 'NumLock', label: 'NUM', w: 1 },
    { key: 'NumpadDivide', label: '/', w: 1 },
    { key: 'NumpadMultiply', label: '*', w: 1 },
    { key: 'NumpadSubtract', label: '-', w: 1 },
  ],
  [
    { key: 'Numpad7', label: '7', w: 1 },
    { key: 'Numpad8', label: '8', w: 1 },
    { key: 'Numpad9', label: '9', w: 1 },
    { key: 'NumpadAdd', label: '+', w: 1, h: 2 },
  ],
  [
    { key: 'Numpad4', label: '4', w: 1 },
    { key: 'Numpad5', label: '5', w: 1 },
    { key: 'Numpad6', label: '6', w: 1 },
    // + is height 2, so skipped here visually in grid but handled by h prop
  ],
  [
    { key: 'Numpad1', label: '1', w: 1 },
    { key: 'Numpad2', label: '2', w: 1 },
    { key: 'Numpad3', label: '3', w: 1 },
    { key: 'NumpadEnter', label: 'ENT', w: 1, h: 2 },
  ],
  [
    { key: 'Numpad0', label: '0', w: 2 },
    { key: 'NumpadDecimal', label: '.', w: 1 },
    // Enter is height 2
  ]
];

export function KeyboardTest() {
  const [verifiedKeys, setVerifiedKeys] = useState<Set<string>>(new Set());
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const code = e.code;
      setActiveKeys(prev => new Set(prev).add(code));
      setVerifiedKeys(prev => {
        const next = new Set(prev).add(code);
        testStore.addResult('keyboard', 'tested', { verifiedKeys: next.size });
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const code = e.code;
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, []);

  // Count verifiable keys in our map
  const totalKeys = KEYBOARD_LAYOUT.flat().length + NAV_LAYOUT.flat().filter(k => !k.invisible).length + NUMPAD_LAYOUT.flat().length;

  const resetTest = () => {
    setVerifiedKeys(new Set());
    setActiveKeys(new Set());
  };

  // Calculate scaling factor based on viewport width for responsive sizing
  const KeyCap = ({ k, h = 1 }: { k: any, h?: number }) => {
    if (k.invisible) return <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" style={{ flexGrow: k.w, width: `${k.w * 2.5}rem` }} />;

    const isVerified = verifiedKeys.has(k.key);
    const isActive = activeKeys.has(k.key);
    const heightClass = k.h === 2 ? "h-[4.25rem] md:h-[5.25rem] lg:h-[6.25rem]" : "h-8 md:h-10 lg:h-12";

    return (
      <div
        className={cn(
          `${heightClass} rounded border flex items-center justify-center text-[0.6rem] md:text-xs font-bold transition-all duration-75 select-none`,
          isActive
            ? "bg-primary text-background border-primary shadow-[0_0_10px_var(--color-primary)] scale-95 z-10"
            : isVerified
              ? "bg-secondary/20 border-secondary text-secondary shadow-[0_0_5px_var(--color-secondary)]"
              : "bg-background border-muted text-muted-foreground"
        )}
        style={{ flexGrow: k.w, width: `${k.w * 2.5}rem` }}
      >
        {k.label}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-1">
          <h3 className="text-primary font-orbitron text-2xl uppercase tracking-widest">Keyboard Matrix Test</h3>
          <p className="text-sm text-muted-foreground">Press any key on your keyboard to see it light up below</p>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={resetTest}
            className="px-6 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/50 rounded-md font-orbitron text-sm tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(255,0,0,0.1)]"
          >
            RESET MATRIX
          </button>

          <div className="bg-surface border border-secondary px-4 py-2 rounded text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Verified</div>
            <div className="text-2xl font-orbitron text-primary glow-text">
              {verifiedKeys.size} <span className="text-muted-foreground text-lg">/ {totalKeys}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface/50 p-4 md:p-8 rounded-xl border border-secondary/30 overflow-x-auto">
        {/* Reduced min-width and adjusted gap for better fitting */}
        <div className="min-w-[900px] flex gap-4 md:gap-8 mx-auto justify-center scale-[0.85] md:scale-100 origin-top-left md:origin-center">

          {/* Main Block */}
          <div className="flex flex-col gap-1 md:gap-2">
            {KEYBOARD_LAYOUT.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 md:gap-2">
                {row.map((k) => <KeyCap key={k.key} k={k} />)}
              </div>
            ))}
          </div>

          {/* Nav Block */}
          <div className="flex flex-col gap-1 md:gap-2">
            {/* Top Nav Row (PRT, SCR, PAU) - aligned with F-keys row (row 0) */}
            <div className="flex gap-1 md:gap-2 mb-2 md:mb-4">
              {NAV_LAYOUT[0].map(k => <KeyCap key={k.key} k={k} />)}
            </div>

            {/* Insert/Home/PgUp - Aligned with row 1 */}
            <div className="flex gap-1 md:gap-2">
              {NAV_LAYOUT[1].map(k => <KeyCap key={k.key} k={k} />)}
            </div>

            {/* Del/End/PgDn - Aligned with row 2 */}
            <div className="flex gap-1 md:gap-2">
              {NAV_LAYOUT[2].map(k => <KeyCap key={k.key} k={k} />)}
            </div>

            {/* Spacing */}
            <div className="h-8 md:h-12"></div>

            {/* Arrow Keys Top */}
            <div className="flex gap-1 md:gap-2">
              {NAV_LAYOUT[3].map((k, i) => <KeyCap key={i} k={k} />)}
            </div>

            {/* Arrow Keys Bottom */}
            <div className="flex gap-1 md:gap-2">
              {NAV_LAYOUT[4].map(k => <KeyCap key={k.key} k={k} />)}
            </div>
          </div>

          {/* Numpad Block */}
          <div className="flex flex-col gap-1 md:gap-2">
            {/* Numpad Row 1 */}
            <div className="flex gap-1 md:gap-2">
              {NUMPAD_LAYOUT[0].map(k => <KeyCap key={k.key} k={k} />)}
            </div>

            <div className="flex gap-1 md:gap-2 h-[13.5rem]">
              <div className="flex flex-col gap-1 md:gap-2">
                {/* 7 8 9 */}
                <div className="flex gap-1 md:gap-2">
                  {NUMPAD_LAYOUT[1].slice(0, 3).map(k => <KeyCap key={k.key} k={k} />)}
                </div>
                {/* 4 5 6 */}
                <div className="flex gap-1 md:gap-2">
                  {NUMPAD_LAYOUT[2].map(k => <KeyCap key={k.key} k={k} />)}
                </div>
                {/* 1 2 3 */}
                <div className="flex gap-1 md:gap-2">
                  {NUMPAD_LAYOUT[3].slice(0, 3).map(k => <KeyCap key={k.key} k={k} />)}
                </div>
                {/* 0 . */}
                <div className="flex gap-1 md:gap-2">
                  {NUMPAD_LAYOUT[4].map(k => <KeyCap key={k.key} k={k} />)}
                </div>
              </div>

              <div className="flex flex-col gap-1 md:gap-2">
                {/* + */}
                <KeyCap k={NUMPAD_LAYOUT[1][3]} />
                {/* Enter */}
                <KeyCap k={NUMPAD_LAYOUT[3][3]} />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-center gap-4 text-xs text-muted-foreground font-mono mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-background border border-muted"></div>
          <span>Untested</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-secondary/20 border border-secondary"></div>
          <span>Verified</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary border border-primary"></div>
          <span>Pressed</span>
        </div>
      </div>

      <div className="p-8 bg-surface border border-secondary/30 rounded-lg">
        <h2 className="text-primary font-orbitron text-2xl mb-6 uppercase tracking-widest border-b border-secondary/30 pb-4">Comprehensive Keyboard Diagnostic Guide</h2>
        <div className="space-y-8 text-lg text-muted-foreground font-roboto-mono leading-relaxed">

          <section>
            <h3 className="text-xl font-orbitron text-white mb-2">How to Use the Online Keyboard Tester</h3>
            <p>
              Our free, browser-based keyboard tester allows you to check every single key on your mechanical, membrane, or laptop keyboard. Simply type on your physical keyboard, and the virtual matrix above will illuminate the corresponding keys in real-time. This tool is essential for verifying new keyboard builds, diagnosing liquid damage, or checking for ghosting issues.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-orbitron text-white mb-2">Testing N-Key Rollover (NKRO) & Ghosting</h3>
            <p className="mb-2">
              NKRO (N-Key Rollover) refers to a keyboard's ability to scan each key press individually. This means that no matter how many keys you press simultaneously, every single one will be registered by your computer.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>How to test:</strong> Press down multiple keys at once (e.g., Q, W, E, R, A, S, D, F) with both hands.</li>
              <li><strong>What is Ghosting?</strong> "Ghosting" occurs on cheaper keyboards when pressing a specific combination of keys causes an unpressed third key to register, or causes one of the pressed keys to be ignored (key blocking).</li>
              <li><strong>Gaming Keyboards:</strong> If you are a competitive gamer, 6-Key Rollover (6KRO) or full NKRO is mandatory to ensure complex movement combinations (like sprinting diagonally while crouching and jumping) are never dropped.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-orbitron text-white mb-2">Diagnosing Keyboard Switch Failure</h3>
            <p className="mb-2">
              Mechanical keyboards use individual switches (like Cherry MX, Gateron, or Kailh) for every key. Over time, these can fail. Use our tool to diagnose common issues:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chatter (Double-Typing):</strong> If you tap a key once but the virtual matrix registers it flickering rapidly, or if your text outputs "tthe" instead of "the", your switch is experiencing contact "chatter." The copper leaf inside the switch is bouncing.</li>
              <li><strong>Dead Keys:</strong> If a key remains gray and untested despite being pressed, the switch is dead. This could be due to a bent pin (on hot-swappable boards), a broken solder joint, or a completely failed switch mechanism.</li>
              <li><strong>Liquid Damage:</strong> Spilling water or soda often shorts rows or columns of the keyboard matrix. If pressing the `G` key causes the entire `F,G,H,J` row to light up on our tester, your PCB matrix is shorted.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-orbitron text-white mb-2">Laptop Keyboard Testing</h3>
            <p>
              Replacing a laptop keyboard is notoriously difficult. Before sending your laptop in for repair, use this dashboard to confirm if the issue is software-related (OS language settings, stuck modifier keys) or a hardware failure. If an entire section of keys (e.g., `7, U, J, M`) fails to light up simultaneously, the ribbon cable connecting the keyboard to the motherboard may be loose or damaged.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
