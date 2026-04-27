export const SITE_URL = "https://devicetesteronline.com";
export const SITE_NAME = "Device Test Online";
export const SITE_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;
export const PUBLISHER_NAME = "Ellie Petal Media";

export type DiagnosticCategory =
  | "input"
  | "audio"
  | "video-display"
  | "mobile-touch";

export type ModuleType =
  | "dashboard"
  | "mouse"
  | "keyboard"
  | "pixel"
  | "mic"
  | "webcam"
  | "gamepad"
  | "typing"
  | "audio-sync"
  | "speaker"
  | "headphone"
  | "double-click"
  | "refresh-rate"
  | "touchscreen";

export type GuideTarget =
  | "fix-microphone-not-working"
  | "fix-webcam-not-working"
  | "fix-mouse-double-clicking"
  | "fix-monitor-not-running-at-144hz"
  | "fix-headphones-only-playing-in-one-ear";

export type RouteTarget =
  | ModuleType
  | "about"
  | "contact"
  | "privacy"
  | "faq"
  | GuideTarget
  | "not-found";

export interface SiteRouteDefinition {
  path: string;
  target: RouteTarget;
  title: string;
  description: string;
  uiTitle?: string;
  navLabel?: string;
  socialTitle?: string;
  socialDescription?: string;
  canonicalPath?: string;
  indexable: boolean;
}

export interface RouteContentCallout {
  title: string;
  body: string;
  linkTarget?: RouteTarget;
  linkLabel?: string;
}

export interface RouteContentBlock {
  title: string;
  paragraphs: string[];
}

export interface RouteWorkflowCta {
  label: string;
  target: RouteTarget;
  description: string;
}

export interface GuideSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface RouteContentDefinition {
  relatedTargets?: ModuleType[];
  trustCallout?: RouteContentCallout;
  primaryCta?: {
    label: string;
    target: RouteTarget;
  };
  secondaryCta?: {
    label: string;
    target: RouteTarget;
  };
  dashboardCategory?: DiagnosticCategory;
  interpretation?: RouteContentBlock;
  nextSteps?: RouteContentBlock;
  workflowCtas?: RouteWorkflowCta[];
  guideSections?: GuideSection[];
  schemaKind?:
    | "dashboard"
    | "diagnostic"
    | "faq"
    | "about"
    | "contact"
    | "privacy"
    | "guide"
    | "webpage";
}

export const DIAGNOSTIC_TARGETS: ModuleType[] = [
  "dashboard",
  "mouse",
  "keyboard",
  "pixel",
  "mic",
  "webcam",
  "gamepad",
  "typing",
  "audio-sync",
  "speaker",
  "headphone",
  "double-click",
  "refresh-rate",
  "touchscreen",
];

export const GUIDE_TARGETS: GuideTarget[] = [
  "fix-microphone-not-working",
  "fix-webcam-not-working",
  "fix-mouse-double-clicking",
  "fix-monitor-not-running-at-144hz",
  "fix-headphones-only-playing-in-one-ear",
];

export const SITE_ROUTES: SiteRouteDefinition[] = [
  {
    path: "/",
    target: "dashboard",
    title: "Device Test Online - Free Hardware Diagnostic Suite",
    uiTitle: "Hardware Diagnostic Suite",
    description:
      "Test your mouse, keyboard, monitor, microphone, webcam, controller, typing speed, speakers, headphones, touchscreen, and audio latency directly in your browser.",
    indexable: true,
  },
  {
    path: "/mouse-test",
    target: "mouse",
    title: "Mouse Test - Check Clicks, Scroll, and Polling Rate",
    uiTitle: "Mouse Diagnostics",
    navLabel: "MOUSE TEST",
    description:
      "Test left, right, and middle clicks, scroll behavior, and live mouse polling rate with an in-browser mouse diagnostic tool.",
    indexable: true,
  },
  {
    path: "/keyboard-test",
    target: "keyboard",
    title: "Keyboard Tester - Check Keys, Ghosting, and NKRO",
    uiTitle: "Keyboard Matrix",
    navLabel: "KEYBOARD TEST",
    description:
      "Verify stuck keys, rollover behavior, and keyboard ghosting with a live browser-based keyboard tester.",
    indexable: true,
  },
  {
    path: "/dead-pixel-test",
    target: "pixel",
    title: "Monitor Test - Dead Pixels and Display Check",
    uiTitle: "Monitor Test & Pixels",
    navLabel: "MONITOR TEST",
    description:
      "Detect dead or stuck pixels and inspect your display with a browser-based monitor diagnostic tool.",
    indexable: true,
  },
  {
    path: "/microphone-test",
    target: "mic",
    title: "Microphone Test - Check Mic Recording and Playback",
    uiTitle: "Audio Input Check",
    navLabel: "MICROPHONE",
    description:
      "Test microphone access, record a short sample, and play it back locally to verify your mic and speakers.",
    indexable: true,
  },
  {
    path: "/webcam-test",
    target: "webcam",
    title: "Webcam Test - Check Camera Feed, Resolution, and FPS",
    uiTitle: "Webcam Diagnostics",
    navLabel: "WEBCAM TEST",
    description:
      "Open your webcam in the browser, confirm the video feed, and inspect live resolution and frame rate details.",
    indexable: true,
  },
  {
    path: "/gamepad-test",
    target: "gamepad",
    title: "Gamepad Tester - Controller Buttons, Sticks, and Drift",
    uiTitle: "Controller Input",
    navLabel: "GAMEPAD TEST",
    description:
      "Test controller buttons, analog sticks, vibration support, and drift behavior with a browser-based gamepad diagnostic tool.",
    indexable: true,
  },
  {
    path: "/typing-test",
    target: "typing",
    title: "Typing Speed Test - Measure WPM and Accuracy Online",
    uiTitle: "Typing Speed Test",
    navLabel: "TYPING TEST",
    description:
      "Measure typing speed and accuracy in your browser with a lightweight typing test designed for quick keyboard checks.",
    indexable: true,
  },
  {
    path: "/audio-sync-test",
    target: "audio-sync",
    title: "Audio Delay Test - Check Headphone and Bluetooth Latency",
    uiTitle: "Audio Latency Test",
    navLabel: "AUDIO SYNC TEST",
    description:
      "Measure apparent audio delay with a flash-and-beep test to estimate headset, speaker, or Bluetooth playback latency.",
    indexable: true,
  },
  {
    path: "/speaker-test",
    target: "speaker",
    title: "Speaker Test - Check Left and Right Audio Output",
    uiTitle: "Speaker Test",
    navLabel: "SPEAKER TEST",
    description:
      "Play left, right, and centered audio directly in your browser to confirm speaker output, channel balance, and basic playback.",
    indexable: true,
  },
  {
    path: "/headphone-test",
    target: "headphone",
    title: "Headphone Test - Check Stereo Balance and Ear Channels",
    uiTitle: "Headphone Test",
    navLabel: "HEADPHONE TEST",
    description:
      "Verify left and right headphone channels, stereo balance, and basic audio clarity with a browser-based headphone test.",
    indexable: true,
  },
  {
    path: "/double-click-test",
    target: "double-click",
    title: "Double Click Test - Detect Mouse Switch Bounce Online",
    uiTitle: "Double Click Test",
    navLabel: "DOUBLE CLICK",
    description:
      "Check whether a mouse button is registering accidental double-clicks and compare suspicious bounce timing in your browser.",
    indexable: true,
  },
  {
    path: "/refresh-rate-test",
    target: "refresh-rate",
    title: "Refresh Rate Test - Check Your Monitor Hz Online",
    uiTitle: "Refresh Rate Test",
    navLabel: "REFRESH RATE",
    description:
      "Measure your browser-visible display refresh rate and compare it with the refresh mode you expect from your monitor.",
    indexable: true,
  },
  {
    path: "/touchscreen-test",
    target: "touchscreen",
    title: "Touchscreen Test - Check Touch Points and Dead Zones",
    uiTitle: "Touchscreen Test",
    navLabel: "TOUCH TEST",
    description:
      "Test touch responsiveness, multi-touch input, and dead zones on phones, tablets, laptops, and touch-enabled monitors.",
    indexable: true,
  },
  {
    path: "/about",
    target: "about",
    title: "About Device Test Online",
    uiTitle: "About Device Test Online",
    description:
      "Learn what Device Test Online is, who publishes it, and how the site provides browser-based hardware diagnostics with local device processing.",
    indexable: true,
  },
  {
    path: "/contact",
    target: "contact",
    title: "Contact Device Test Online",
    uiTitle: "Contact Device Test Online",
    description:
      "Contact Device Test Online for business, advertising, legal, or publisher-related inquiries.",
    indexable: true,
  },
  {
    path: "/privacy",
    target: "privacy",
    title: "Privacy Policy - Device Test Online",
    uiTitle: "Privacy Policy",
    description:
      "Read how Device Test Online handles local processing, browser storage, and privacy for hardware diagnostics that run on your device.",
    indexable: true,
  },
  {
    path: "/faq",
    target: "faq",
    title: "FAQ and Hardware Diagnostic Guide",
    uiTitle: "FAQ & Guide",
    description:
      "Read the Device Test Online FAQ for explanations of mouse, keyboard, monitor, webcam, microphone, controller, touchscreen, and audio test results.",
    indexable: true,
  },
  {
    path: "/fix-microphone-not-working",
    target: "fix-microphone-not-working",
    title: "How to Fix a Microphone That Is Not Working",
    uiTitle: "Fix Microphone Not Working",
    description:
      "Troubleshoot a microphone that is not working with step-by-step checks for browser permissions, input selection, mute states, and device conflicts.",
    indexable: true,
  },
  {
    path: "/fix-webcam-not-working",
    target: "fix-webcam-not-working",
    title: "How to Fix a Webcam That Is Not Working",
    uiTitle: "Fix Webcam Not Working",
    description:
      "Troubleshoot a webcam that is not working by checking permissions, privacy shutters, app conflicts, and camera device settings.",
    indexable: true,
  },
  {
    path: "/fix-mouse-double-clicking",
    target: "fix-mouse-double-clicking",
    title: "How to Fix a Mouse That Keeps Double Clicking",
    uiTitle: "Fix Mouse Double Clicking",
    description:
      "Troubleshoot accidental mouse double-clicks by checking switch bounce, USB issues, double-click speed settings, and hardware wear.",
    indexable: true,
  },
  {
    path: "/fix-monitor-not-running-at-144hz",
    target: "fix-monitor-not-running-at-144hz",
    title: "How to Fix a Monitor That Is Not Running at 144Hz",
    uiTitle: "Fix Monitor Not Running at 144Hz",
    description:
      "Troubleshoot a monitor stuck below 144Hz by checking display settings, cable bandwidth, port limits, adapters, and browser frame caps.",
    indexable: true,
  },
  {
    path: "/fix-headphones-only-playing-in-one-ear",
    target: "fix-headphones-only-playing-in-one-ear",
    title: "How to Fix Headphones That Only Play in One Ear",
    uiTitle: "Fix One-Ear Headphone Audio",
    description:
      "Troubleshoot headphones that only play in one ear by checking stereo balance, connector fit, Bluetooth routing, and mono audio settings.",
    indexable: true,
  },
];

export const ROUTE_CONTENT: Partial<Record<RouteTarget, RouteContentDefinition>> = {
  dashboard: {
    primaryCta: { label: "Open Diagnostic Suite", target: "dashboard" },
    secondaryCta: { label: "Read the FAQ", target: "faq" },
    trustCallout: {
      title: "Local diagnostics with honest disclosure",
      body: "Core device tests run in your browser, while site traffic and ad delivery still rely on Google Analytics and AdSense. Privacy details are documented clearly.",
      linkTarget: "privacy",
      linkLabel: "Review privacy details",
    },
    schemaKind: "dashboard",
  },
  mouse: {
    relatedTargets: ["double-click", "keyboard", "gamepad"],
    dashboardCategory: "input",
    interpretation: {
      title: "How to interpret this mouse test",
      paragraphs: [
        "Consistent button lighting and stable scroll events usually point to a healthy switch and encoder path.",
        "Polling spikes and sudden drops can still be caused by surface quality, USB hubs, power management, or browser sampling limits rather than the sensor alone.",
      ],
    },
    nextSteps: {
      title: "What to try next if something looks wrong",
      paragraphs: [
        "Move to the double click test if one button feels unreliable, then confirm the mouse on another USB port or another computer.",
        "If only motion rate looks unstable, test on a clean pad and disable USB power saving before assuming the sensor is failing.",
      ],
    },
    workflowCtas: [
      {
        label: "Run the gaming input check",
        target: "double-click",
        description: "Start with switch-bounce detection, then continue to keyboard and controller tests for a full input baseline.",
      },
    ],
    trustCallout: {
      title: "Best used as a quick hardware baseline",
      body: "Mouse diagnostics require no browser permissions, making them a good first step when you want to confirm input responsiveness before moving to deeper device tests.",
    },
    schemaKind: "diagnostic",
  },
  "double-click": {
    relatedTargets: ["mouse", "keyboard"],
    dashboardCategory: "input",
    interpretation: {
      title: "How to interpret double click results",
      paragraphs: [
        "Repeated ultra-fast duplicate clicks usually point to switch bounce rather than normal user error.",
        "One suspicious pair is a warning sign, but repeated short intervals under the same button usually indicate wear inside the microswitch.",
      ],
    },
    nextSteps: {
      title: "What to try next if the mouse keeps double clicking",
      paragraphs: [
        "Raise the OS double-click threshold only as a temporary workaround. The long-term fix is usually a switch replacement or a new mouse.",
        "Confirm the issue on another port and machine before replacing hardware so you rule out firmware, USB hubs, or macro software.",
      ],
    },
    workflowCtas: [
      {
        label: "Read the double-click fix guide",
        target: "fix-mouse-double-clicking",
        description: "Use a step-by-step troubleshooting path before deciding whether to replace the mouse.",
      },
      {
        label: "Run the gaming input check",
        target: "mouse",
        description: "Compare switch behavior with your full mouse and keyboard baseline.",
      },
    ],
    schemaKind: "diagnostic",
  },
  keyboard: {
    relatedTargets: ["typing", "mouse"],
    dashboardCategory: "input",
    interpretation: {
      title: "How to interpret this keyboard test",
      paragraphs: [
        "Keys that never light up usually indicate a dead switch, disconnected ribbon, or a matrix issue rather than a typing habit problem.",
        "If groups of keys fail together, think about matrix rows, columns, or liquid damage before assuming isolated switch failure.",
      ],
    },
    nextSteps: {
      title: "What to try next if keys are missing",
      paragraphs: [
        "Use the typing test after this page to confirm whether the issue appears during real text entry, not just isolated presses.",
        "On laptops, reboot once and test an external keyboard to separate OS/input issues from the built-in keyboard hardware path.",
      ],
    },
    workflowCtas: [
      {
        label: "Run the gaming input check",
        target: "typing",
        description: "Continue from raw key detection into real typing flow and accuracy checks.",
      },
    ],
    schemaKind: "diagnostic",
  },
  typing: {
    relatedTargets: ["keyboard", "mouse"],
    dashboardCategory: "input",
    interpretation: {
      title: "How to interpret typing speed results",
      paragraphs: [
        "Low speed with normal key registration often points to familiarity, layout, or fatigue rather than hardware failure.",
        "Accuracy drops with specific letters or modifier combinations are more useful than the headline WPM number when you suspect keyboard issues.",
      ],
    },
    nextSteps: {
      title: "What to try next if typing feels off",
      paragraphs: [
        "Go back to the keyboard matrix if specific keys feel inconsistent, sticky, or repeat unexpectedly during text entry.",
        "Use the mouse and double click tests if the problem is broader and the whole workstation feels unreliable.",
      ],
    },
    workflowCtas: [
      {
        label: "Run the gaming input check",
        target: "keyboard",
        description: "Compare real typing performance with raw matrix detection and adjacent input tests.",
      },
    ],
    schemaKind: "diagnostic",
  },
  pixel: {
    relatedTargets: ["refresh-rate", "touchscreen"],
    dashboardCategory: "video-display",
    interpretation: {
      title: "How to interpret the monitor test",
      paragraphs: [
        "Black dots that never change are usually dead pixels. Bright single-color dots are more often stuck subpixels that may still respond to cycling.",
        "This page is best for visual confirmation, while refresh-rate verification is clearer on the dedicated refresh test route.",
      ],
    },
    nextSteps: {
      title: "What to try next if the panel looks wrong",
      paragraphs: [
        "Use the refresh rate test next if motion still feels off after the panel passes basic color inspection.",
        "If touch is involved on a tablet or all-in-one display, run the touchscreen test to see whether the issue is panel-only or also affects input.",
      ],
    },
    workflowCtas: [
      {
        label: "Check your monitor refresh rate",
        target: "refresh-rate",
        description: "Move from pixel inspection to a dedicated Hz verification page.",
      },
    ],
    trustCallout: {
      title: "Display tests stay visual-only",
      body: "Monitor checks run without device permissions and are useful for confirming panel issues before testing input or audio hardware.",
    },
    schemaKind: "diagnostic",
  },
  "refresh-rate": {
    relatedTargets: ["pixel", "touchscreen"],
    dashboardCategory: "video-display",
    interpretation: {
      title: "How to interpret refresh rate readings",
      paragraphs: [
        "The measured rate reflects what the browser is seeing from your current display path, not just the label printed on the monitor box.",
        "A lower-than-expected number can still come from OS settings, cables, adapters, mirrored displays, or browser frame caps.",
      ],
    },
    nextSteps: {
      title: "What to try next if 144Hz is not showing",
      paragraphs: [
        "Check Windows, macOS, or GPU control panel refresh settings first, then verify cable and port bandwidth before assuming the panel is limited.",
        "Run the monitor guide route if you need a step-by-step checklist for 144Hz and higher display modes.",
      ],
    },
    workflowCtas: [
      {
        label: "Read the 144Hz troubleshooting guide",
        target: "fix-monitor-not-running-at-144hz",
        description: "Walk through the most common cable, port, and display-setting bottlenecks.",
      },
    ],
    schemaKind: "diagnostic",
  },
  touchscreen: {
    relatedTargets: ["pixel", "refresh-rate"],
    dashboardCategory: "mobile-touch",
    interpretation: {
      title: "How to interpret touchscreen results",
      paragraphs: [
        "Missed paths, broken gestures, or dead regions usually point to panel input failure, calibration issues, or interference rather than rendering problems.",
        "Multi-touch limits vary by device, so the useful signal is consistency and coverage rather than the highest count alone.",
      ],
    },
    nextSteps: {
      title: "What to try next if touch feels unreliable",
      paragraphs: [
        "Remove thick or damaged screen protectors, clean the panel, and retest before assuming the digitizer is failing.",
        "If the screen itself also looks wrong, pair this with the monitor test to separate touch-path issues from broader display faults.",
      ],
    },
    workflowCtas: [
      {
        label: "Test a phone or tablet screen",
        target: "pixel",
        description: "Combine touch coverage checks with a visual display inspection for used devices or repairs.",
      },
    ],
    trustCallout: {
      title: "Touch tests stay on the device",
      body: "Touch paths are visualized in the page only and do not require microphone, camera, or other elevated device permissions.",
    },
    schemaKind: "diagnostic",
  },
  mic: {
    relatedTargets: ["speaker", "webcam", "audio-sync"],
    dashboardCategory: "audio",
    interpretation: {
      title: "How to interpret microphone results",
      paragraphs: [
        "A healthy recording path should capture your voice clearly with visible level changes and an audible playback sample.",
        "If recording works but sounds thin, clipped, or distant, the issue may be placement, gain, OS input selection, or noise suppression rather than total mic failure.",
      ],
    },
    nextSteps: {
      title: "What to try next if the mic still fails",
      paragraphs: [
        "Check browser permission, OS input device selection, mute buttons, and whether a call app is already holding the microphone open.",
        "Run the speaker test and webcam test after this page so you can validate the full call setup instead of checking audio input in isolation.",
      ],
    },
    workflowCtas: [
      {
        label: "Run the full call setup check",
        target: "speaker",
        description: "Continue through speaker, webcam, and audio sync checks before a meeting or stream.",
      },
      {
        label: "Read the mic troubleshooting guide",
        target: "fix-microphone-not-working",
        description: "Use a structured fix path for permission, mute, and device-selection issues.",
      },
    ],
    trustCallout: {
      title: "Microphone capture is processed locally",
      body: "The microphone test records and replays audio in this browser tab only. Analytics and ads are site-level services and do not receive raw microphone data.",
      linkTarget: "privacy",
      linkLabel: "See privacy policy",
    },
    schemaKind: "diagnostic",
  },
  speaker: {
    relatedTargets: ["headphone", "mic", "audio-sync"],
    dashboardCategory: "audio",
    interpretation: {
      title: "How to interpret the speaker test",
      paragraphs: [
        "Clear left, right, and center playback usually confirms that the browser can reach your selected output path.",
        "Missing one side often points to output routing, balance, or hardware connection problems rather than a total audio stack failure.",
      ],
    },
    nextSteps: {
      title: "What to try next if sound is missing",
      paragraphs: [
        "Check the browser tab volume, operating-system output device, monitor headphone jack routing, and Bluetooth target before assuming the speakers are dead.",
        "If audio is present but late, continue to the audio sync test to compare apparent delay across output devices.",
      ],
    },
    workflowCtas: [
      {
        label: "Run the full call setup check",
        target: "webcam",
        description: "Continue into webcam and microphone validation for a meeting-ready setup.",
      },
    ],
    trustCallout: {
      title: "Playback tests do not need camera or mic access",
      body: "Speaker diagnostics only use browser audio output. If the browser blocks autoplay, interact with the page and try again.",
    },
    schemaKind: "diagnostic",
  },
  headphone: {
    relatedTargets: ["speaker", "audio-sync", "mic"],
    dashboardCategory: "audio",
    interpretation: {
      title: "How to interpret the headphone test",
      paragraphs: [
        "A good result means left and right channels are distinct, centered playback sounds balanced, and the output path stays stable across repeated plays.",
        "If one ear is silent or reversed, check connectors, mono settings, and Bluetooth output routing before assuming the headset is physically broken.",
      ],
    },
    nextSteps: {
      title: "What to try next if one ear is missing",
      paragraphs: [
        "Re-seat the connector, test another port or device, and check OS balance or accessibility mono-audio settings.",
        "Use the dedicated fix guide if one side remains silent, then compare latency on the audio sync test if wireless playback also feels delayed.",
      ],
    },
    workflowCtas: [
      {
        label: "Run the full call setup check",
        target: "audio-sync",
        description: "Confirm that the headset works and then compare playback delay before a call or stream.",
      },
      {
        label: "Read the one-ear audio guide",
        target: "fix-headphones-only-playing-in-one-ear",
        description: "Work through connector, balance, and mono-audio causes before replacing the headset.",
      },
    ],
    schemaKind: "diagnostic",
  },
  webcam: {
    relatedTargets: ["mic", "speaker", "audio-sync"],
    dashboardCategory: "video-display",
    interpretation: {
      title: "How to interpret webcam results",
      paragraphs: [
        "If the preview opens cleanly and stays active, the browser can reach the selected camera and the video path is fundamentally working.",
        "A black frame, permission error, or missing device is more often a privacy setting, hardware shutter, or app conflict than an in-page rendering bug.",
      ],
    },
    nextSteps: {
      title: "What to try next if the webcam still fails",
      paragraphs: [
        "Check browser permission, laptop privacy toggles, USB connection quality, and whether Zoom, Teams, Discord, or OBS is already using the camera.",
        "Run the microphone and speaker tests after this page so you confirm the whole call path instead of troubleshooting video alone.",
      ],
    },
    workflowCtas: [
      {
        label: "Run the full call setup check",
        target: "mic",
        description: "Continue through mic, speaker, and latency checks for a full meeting-ready verification pass.",
      },
      {
        label: "Read the webcam troubleshooting guide",
        target: "fix-webcam-not-working",
        description: "Use a direct checklist for permissions, privacy shutters, and app conflicts.",
      },
    ],
    trustCallout: {
      title: "Camera preview stays on this device",
      body: "The webcam feed is rendered locally in your browser. Device Test Online does not upload the live preview as part of the diagnostic flow.",
      linkTarget: "privacy",
      linkLabel: "See privacy policy",
    },
    schemaKind: "diagnostic",
  },
  gamepad: {
    relatedTargets: ["mouse", "keyboard"],
    dashboardCategory: "input",
    interpretation: {
      title: "How to interpret gamepad results",
      paragraphs: [
        "Stable resting stick values near center and clean button transitions usually indicate a healthy controller input path.",
        "Small stick movement at rest can be normal, but consistent offset or noisy drift patterns usually point to wear or calibration trouble.",
      ],
    },
    nextSteps: {
      title: "What to try next if the controller looks unstable",
      paragraphs: [
        "Disconnect and reconnect the controller, then compare wired versus wireless behavior before assuming permanent stick drift.",
        "If a gaming setup feels broadly inconsistent, run the mouse and keyboard tests too so you can separate controller problems from wider USB or system issues.",
      ],
    },
    workflowCtas: [
      {
        label: "Run the gaming input check",
        target: "mouse",
        description: "Compare controller behavior with mouse and keyboard responsiveness on the same setup.",
      },
    ],
    schemaKind: "diagnostic",
  },
  "audio-sync": {
    relatedTargets: ["headphone", "speaker", "mic"],
    dashboardCategory: "audio",
    interpretation: {
      title: "How to interpret audio latency results",
      paragraphs: [
        "Lower averages usually mean a faster playback path, but this page estimates perceived delay rather than lab-grade hardware latency.",
        "Bluetooth, TV speakers, and monitor audio paths often add noticeable delay even when basic speaker playback still works correctly.",
      ],
    },
    nextSteps: {
      title: "What to try next if latency feels high",
      paragraphs: [
        "Compare wired versus wireless output, disable extra audio processing, and prefer dedicated 2.4GHz or wired headsets for latency-sensitive use.",
        "If you also have missing channels or no sound, go back to the speaker or headphone test before treating the issue as pure latency.",
      ],
    },
    workflowCtas: [
      {
        label: "Run the full call setup check",
        target: "headphone",
        description: "Compare basic output, channel balance, and then latency across the same headset path.",
      },
    ],
    trustCallout: {
      title: "Audio sync estimates perceived playback delay",
      body: "This test helps compare relative latency between speakers, headsets, and Bluetooth paths. It is a practical browser estimate, not a lab-grade timing instrument.",
    },
    schemaKind: "diagnostic",
  },
  faq: {
    relatedTargets: ["speaker", "double-click", "refresh-rate"],
    primaryCta: { label: "Open Diagnostic Suite", target: "dashboard" },
    secondaryCta: { label: "Review privacy details", target: "privacy" },
    schemaKind: "faq",
  },
  about: {
    relatedTargets: ["speaker", "touchscreen", "gamepad"],
    primaryCta: { label: "Open Diagnostic Suite", target: "dashboard" },
    secondaryCta: { label: "Read the FAQ", target: "faq" },
    schemaKind: "about",
  },
  contact: {
    relatedTargets: ["mic", "webcam", "headphone"],
    primaryCta: { label: "Open Diagnostic Suite", target: "dashboard" },
    secondaryCta: { label: "Review privacy details", target: "privacy" },
    schemaKind: "contact",
  },
  privacy: {
    relatedTargets: ["mic", "webcam", "speaker"],
    primaryCta: { label: "Open Diagnostic Suite", target: "dashboard" },
    secondaryCta: { label: "Read the FAQ", target: "faq" },
    schemaKind: "privacy",
  },
  "fix-microphone-not-working": {
    relatedTargets: ["mic", "speaker", "webcam"],
    primaryCta: { label: "Run the microphone test", target: "mic" },
    secondaryCta: { label: "Run the full call setup check", target: "speaker" },
    guideSections: [
      {
        title: "Symptom summary",
        paragraphs: [
          "If apps cannot hear you, input levels stay flat, or browser recording fails, the problem is usually permission, mute state, device selection, or another app holding the microphone open.",
        ],
      },
      {
        title: "Most common causes",
        bullets: [
          "Browser or OS microphone permission is denied.",
          "The wrong input device is selected.",
          "The mic is muted on the headset, keyboard, or inline cable.",
          "Zoom, Teams, OBS, Discord, or another app is already using the device.",
        ],
      },
      {
        title: "Step-by-step checks",
        bullets: [
          "Confirm the mic is not muted in hardware or the OS sound panel.",
          "Open browser site permissions and allow microphone access.",
          "Select the intended input device in the operating system and in your call app.",
          "Close other recording or conferencing apps and retest.",
        ],
      },
    ],
    schemaKind: "guide",
  },
  "fix-webcam-not-working": {
    relatedTargets: ["webcam", "mic", "speaker"],
    primaryCta: { label: "Run the webcam test", target: "webcam" },
    secondaryCta: { label: "Run the full call setup check", target: "mic" },
    guideSections: [
      {
        title: "Symptom summary",
        paragraphs: [
          "If the camera preview is black, blocked, or unavailable in browser-based tools, check permissions, privacy shutters, USB routing, and app conflicts first.",
        ],
      },
      {
        title: "Most common causes",
        bullets: [
          "Camera permission is denied in the browser or operating system.",
          "Another app is already using the webcam.",
          "A physical privacy shutter or function-key toggle has disabled the camera.",
          "A USB hub, cable, or dock is dropping the device intermittently.",
        ],
      },
      {
        title: "Step-by-step checks",
        bullets: [
          "Allow camera access in the address bar and refresh the page.",
          "Close Zoom, Teams, Discord, OBS, and any camera utilities.",
          "Open the camera app built into the OS to confirm the device appears there too.",
          "Reconnect external webcams directly to the computer instead of through a weak hub.",
        ],
      },
    ],
    schemaKind: "guide",
  },
  "fix-mouse-double-clicking": {
    relatedTargets: ["double-click", "mouse", "keyboard"],
    primaryCta: { label: "Run the double click test", target: "double-click" },
    secondaryCta: { label: "Run the gaming input check", target: "mouse" },
    guideSections: [
      {
        title: "Symptom summary",
        paragraphs: [
          "A mouse that opens files twice, drops drag operations, or selects text unpredictably often has switch bounce inside the left button microswitch.",
        ],
      },
      {
        title: "Most common causes",
        bullets: [
          "Worn microswitch contacts inside the mouse button.",
          "Aggressive debounce or macro software settings.",
          "USB hubs or power saving causing inconsistent polling.",
          "Dust or contamination around the click mechanism.",
        ],
      },
      {
        title: "Step-by-step checks",
        bullets: [
          "Run the dedicated double click test and compare repeated intervals.",
          "Try another USB port and another machine.",
          "Increase OS double-click speed only as a temporary workaround.",
          "Replace the mouse or switch if the issue repeats consistently across systems.",
        ],
      },
    ],
    schemaKind: "guide",
  },
  "fix-monitor-not-running-at-144hz": {
    relatedTargets: ["refresh-rate", "pixel", "touchscreen"],
    primaryCta: { label: "Run the refresh rate test", target: "refresh-rate" },
    secondaryCta: { label: "Run the monitor test", target: "pixel" },
    guideSections: [
      {
        title: "Symptom summary",
        paragraphs: [
          "If a 144Hz or 165Hz monitor feels like 60Hz, the bottleneck is often the display path configuration rather than the panel itself.",
        ],
      },
      {
        title: "Most common causes",
        bullets: [
          "The OS or GPU control panel is still set to 60Hz.",
          "The cable, adapter, or dock cannot carry the full refresh mode.",
          "The display is connected to the wrong port on the computer.",
          "The browser or mirrored display path is capping visible frame delivery.",
        ],
      },
      {
        title: "Step-by-step checks",
        bullets: [
          "Set the refresh rate explicitly in Windows, macOS, or the GPU driver panel.",
          "Use DisplayPort or a certified HDMI cable that supports the target mode.",
          "Disconnect mirrored secondary displays and retest.",
          "Run the refresh rate test again after each change to confirm the visible result.",
        ],
      },
    ],
    schemaKind: "guide",
  },
  "fix-headphones-only-playing-in-one-ear": {
    relatedTargets: ["headphone", "speaker", "audio-sync"],
    primaryCta: { label: "Run the headphone test", target: "headphone" },
    secondaryCta: { label: "Run the speaker test", target: "speaker" },
    guideSections: [
      {
        title: "Symptom summary",
        paragraphs: [
          "When only one ear plays audio, the root cause is often routing or connector fit, but it can also be a damaged cable, dirty jack, or mono-audio setting.",
        ],
      },
      {
        title: "Most common causes",
        bullets: [
          "Loose or partially inserted 3.5mm connector.",
          "Bluetooth audio routed to the wrong device profile.",
          "Left-right balance shifted in OS settings.",
          "Mono accessibility mode or a damaged earcup cable.",
        ],
      },
      {
        title: "Step-by-step checks",
        bullets: [
          "Reseat the connector and test another device or port.",
          "Check left-right balance and mono-audio settings in the operating system.",
          "Reconnect Bluetooth headphones and confirm the correct playback profile.",
          "Run the headphone test and then the latency test if wireless audio also feels delayed.",
        ],
      },
    ],
    schemaKind: "guide",
  },
};

const FAQ_SCHEMA_ENTRIES = [
  {
    question: "Is my microphone recording or webcam feed uploaded?",
    answer:
      "No. Device Test Online processes microphone recordings and webcam previews locally in the browser during the diagnostic flow.",
  },
  {
    question: "How do I test speakers or headphones online?",
    answer:
      "Use the dedicated speaker and headphone routes to play left, right, and centered audio directly in the browser and confirm channel balance.",
  },
  {
    question: "What causes controller stick drift?",
    answer:
      "Stick drift usually comes from wear, contamination, or calibration issues in the analog stick assembly, which causes movement to register even when the stick is untouched.",
  },
  {
    question: "Why is my refresh rate lower than my monitor rating?",
    answer:
      "Your operating system, cable path, or browser-visible display route may still be set to a lower refresh rate than the panel supports.",
  },
  {
    question: "How is typing speed measured?",
    answer:
      "Typing speed is measured as words per minute using the standard five-characters-per-word method, combined with an accuracy score based on correct keystrokes.",
  },
];

export function isDiagnosticTarget(target: RouteTarget): target is ModuleType {
  return DIAGNOSTIC_TARGETS.includes(target as ModuleType);
}

export function isGuideTarget(target: RouteTarget): target is GuideTarget {
  return GUIDE_TARGETS.includes(target as GuideTarget);
}

export const MODULE_ROUTES = SITE_ROUTES.filter(
  (route): route is SiteRouteDefinition & { target: ModuleType } =>
    isDiagnosticTarget(route.target),
);

export const MODULE_ROUTE_MAP = Object.fromEntries(
  MODULE_ROUTES.map((route) => [route.target, route.path]),
) as Record<ModuleType, string>;

const defaultMeta = {
  title: SITE_NAME,
  description:
    "Browser-based hardware diagnostics with local device processing for mice, keyboards, displays, microphones, webcams, speakers, headphones, controllers, touchscreens, and audio latency.",
  indexable: true,
  canonicalPath: "/",
};

export function getRouteDefinition(path: string): SiteRouteDefinition {
  return (
    SITE_ROUTES.find((route) => route.path === path) ?? {
      path,
      target: "not-found",
      title: `Page Not Found - ${SITE_NAME}`,
      description:
        "The page you requested could not be found. Use Device Test Online to return to the diagnostic tools.",
      uiTitle: "Page Not Found",
      indexable: false,
      canonicalPath: path,
    }
  );
}

export function getRouteDefinitionByTarget(
  target: RouteTarget,
): SiteRouteDefinition {
  return (
    SITE_ROUTES.find((route) => route.target === target) ?? {
      path: "/",
      target: "not-found",
      title: `Page Not Found - ${SITE_NAME}`,
      description:
        "The page you requested could not be found. Use Device Test Online to return to the diagnostic tools.",
      uiTitle: "Page Not Found",
      indexable: false,
      canonicalPath: "/",
    }
  );
}

export function getRouteContent(target: RouteTarget): RouteContentDefinition {
  return ROUTE_CONTENT[target] ?? { schemaKind: "webpage" };
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as
    | HTMLMetaElement
    | HTMLLinkElement
    | null;

  if (!element) {
    element = document.createElement(
      selector.startsWith("link") ? "link" : "meta",
    ) as HTMLMetaElement | HTMLLinkElement;
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
}

function upsertStructuredData(id: string, data: Record<string, unknown>) {
  let element = document.head.querySelector(
    `script[data-schema-id="${id}"]`,
  ) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.dataset.schemaId = id;
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

export function buildStructuredData(path: string) {
  const route = getRouteDefinition(path);
  const meta = { ...defaultMeta, ...route };
  const currentUrl = `${SITE_URL}${meta.canonicalPath ?? meta.path}`;
  const routeContent = getRouteContent(route.target);

  switch (routeContent.schemaKind) {
    case "dashboard":
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: meta.title,
        url: currentUrl,
        description: meta.description,
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        },
        mainEntity: MODULE_ROUTES.filter(
          (moduleRoute) => moduleRoute.target !== "dashboard",
        ).map((moduleRoute) => ({
          "@type": "SoftwareApplication",
          name: moduleRoute.title,
          url: `${SITE_URL}${moduleRoute.path}`,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        })),
      };
    case "diagnostic":
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: meta.title,
        url: currentUrl,
        description: meta.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        publisher: {
          "@type": "Organization",
          name: PUBLISHER_NAME,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      };
    case "faq":
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        name: meta.title,
        url: currentUrl,
        description: meta.description,
        mainEntity: FAQ_SCHEMA_ENTRIES.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: entry.answer,
          },
        })),
      };
    case "about":
      return {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: meta.title,
        url: currentUrl,
        description: meta.description,
        mainEntity: {
          "@type": "Organization",
          name: PUBLISHER_NAME,
          url: SITE_URL,
        },
      };
    case "contact":
      return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: meta.title,
        url: currentUrl,
        description: meta.description,
        mainEntity: {
          "@type": "Organization",
          name: PUBLISHER_NAME,
          email: "legal@devicetesteronline.com",
        },
      };
    case "privacy":
      return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: meta.title,
        url: currentUrl,
        description: meta.description,
        about: {
          "@type": "Thing",
          name: "Privacy Policy",
        },
      };
    case "guide":
      return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: meta.title,
        url: currentUrl,
        description: meta.description,
        about: {
          "@type": "Thing",
          name: meta.uiTitle ?? meta.title,
        },
        publisher: {
          "@type": "Organization",
          name: PUBLISHER_NAME,
        },
      };
    default:
      return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: meta.title,
        url: currentUrl,
        description: meta.description,
      };
  }
}

export function applyRouteMetadata(path: string) {
  const route = getRouteDefinition(path);
  const meta = { ...defaultMeta, ...route };
  const canonicalUrl = `${SITE_URL}${meta.canonicalPath ?? meta.path}`;

  document.title = meta.title;

  upsertMeta('meta[name="description"]', {
    name: "description",
    content: meta.description,
  });
  upsertMeta('meta[property="og:title"]', {
    property: "og:title",
    content: meta.socialTitle ?? meta.title,
  });
  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: meta.socialDescription ?? meta.description,
  });
  upsertMeta('meta[property="og:type"]', {
    property: "og:type",
    content: "website",
  });
  upsertMeta('meta[property="og:url"]', {
    property: "og:url",
    content: canonicalUrl,
  });
  upsertMeta('meta[property="og:image"]', {
    property: "og:image",
    content: SITE_OG_IMAGE,
  });
  upsertMeta('meta[name="twitter:card"]', {
    name: "twitter:card",
    content: "summary_large_image",
  });
  upsertMeta('meta[name="twitter:title"]', {
    name: "twitter:title",
    content: meta.socialTitle ?? meta.title,
  });
  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: meta.socialDescription ?? meta.description,
  });
  upsertMeta('meta[name="twitter:image"]', {
    name: "twitter:image",
    content: SITE_OG_IMAGE,
  });
  upsertMeta('meta[name="robots"]', {
    name: "robots",
    content: meta.indexable ? "index,follow" : "noindex,nofollow",
  });
  upsertMeta('link[rel="canonical"]', {
    rel: "canonical",
    href: canonicalUrl,
  });

  upsertStructuredData("route-schema", buildStructuredData(path));
}
