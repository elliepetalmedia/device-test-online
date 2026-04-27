export const SITE_URL = "https://devicetesteronline.com";
export const SITE_NAME = "Device Test Online";
export const SITE_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

export type ModuleType =
  | "dashboard"
  | "mouse"
  | "keyboard"
  | "pixel"
  | "mic"
  | "webcam"
  | "gamepad"
  | "typing"
  | "audio-sync";

export type RouteTarget =
  | ModuleType
  | "about"
  | "contact"
  | "privacy"
  | "faq"
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
  schemaKind?:
    | "dashboard"
    | "diagnostic"
    | "faq"
    | "about"
    | "contact"
    | "privacy"
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
];

export const SITE_ROUTES: SiteRouteDefinition[] = [
  {
    path: "/",
    target: "dashboard",
    title: "Device Test Online - Free Hardware Diagnostic Suite",
    uiTitle: "Hardware Diagnostic Suite",
    description:
      "Test your mouse, keyboard, monitor, microphone, webcam, controller, typing speed, and audio latency directly in your browser.",
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
    title: "Monitor Test - Dead Pixels and Refresh Rate Check",
    uiTitle: "Monitor Test & Refresh Rate",
    navLabel: "MONITOR TEST",
    description:
      "Detect dead or stuck pixels and verify your display refresh rate with a monitor diagnostic tool that runs locally in your browser.",
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
    path: "/about",
    target: "about",
    title: "About Device Test Online",
    uiTitle: "About Device Test Online",
    description:
      "Learn what Device Test Online is, who publishes it, and how the site provides privacy-first browser-based hardware diagnostics.",
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
      "Read the Device Test Online FAQ for explanations of mouse, keyboard, monitor, webcam, microphone, controller, and audio test results.",
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
    relatedTargets: ["keyboard", "gamepad"],
    trustCallout: {
      title: "Best used as a quick hardware baseline",
      body: "Mouse diagnostics require no browser permissions, making them a good first step when you want to confirm input responsiveness before moving to deeper device tests.",
    },
    schemaKind: "diagnostic",
  },
  keyboard: {
    relatedTargets: ["typing", "mouse"],
    schemaKind: "diagnostic",
  },
  pixel: {
    relatedTargets: ["mouse", "keyboard"],
    trustCallout: {
      title: "Display tests stay visual-only",
      body: "Monitor checks run without device permissions and are useful for confirming panel issues before testing input or audio hardware.",
    },
    schemaKind: "diagnostic",
  },
  mic: {
    relatedTargets: ["webcam", "audio-sync"],
    trustCallout: {
      title: "Microphone capture is processed locally",
      body: "The microphone test records and replays audio in this browser tab only. Analytics and ads are site-level services and do not receive raw microphone data.",
      linkTarget: "privacy",
      linkLabel: "See privacy policy",
    },
    schemaKind: "diagnostic",
  },
  webcam: {
    relatedTargets: ["mic", "audio-sync"],
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
    schemaKind: "diagnostic",
  },
  typing: {
    relatedTargets: ["keyboard", "mouse"],
    schemaKind: "diagnostic",
  },
  "audio-sync": {
    relatedTargets: ["mic", "webcam"],
    trustCallout: {
      title: "Audio sync estimates perceived playback delay",
      body: "This test helps compare relative latency between speakers, headsets, and Bluetooth paths. It is a practical browser estimate, not a lab-grade timing instrument.",
    },
    schemaKind: "diagnostic",
  },
  faq: {
    relatedTargets: ["mouse", "keyboard", "pixel"],
    primaryCta: { label: "Open Diagnostic Suite", target: "dashboard" },
    secondaryCta: { label: "Review privacy details", target: "privacy" },
    schemaKind: "faq",
  },
  about: {
    relatedTargets: ["mouse", "keyboard", "gamepad"],
    primaryCta: { label: "Open Diagnostic Suite", target: "dashboard" },
    secondaryCta: { label: "Read the FAQ", target: "faq" },
    schemaKind: "about",
  },
  contact: {
    relatedTargets: ["mouse", "mic", "webcam"],
    primaryCta: { label: "Open Diagnostic Suite", target: "dashboard" },
    secondaryCta: { label: "Review privacy details", target: "privacy" },
    schemaKind: "contact",
  },
  privacy: {
    relatedTargets: ["mic", "webcam", "audio-sync"],
    primaryCta: { label: "Open Diagnostic Suite", target: "dashboard" },
    secondaryCta: { label: "Read the FAQ", target: "faq" },
    schemaKind: "privacy",
  },
};

const FAQ_SCHEMA_ENTRIES = [
  {
    question: "Is my microphone recording or webcam feed uploaded?",
    answer:
      "No. Device Test Online processes microphone recordings and webcam previews locally in the browser during the diagnostic flow.",
  },
  {
    question: "What causes controller stick drift?",
    answer:
      "Stick drift usually comes from wear, contamination, or calibration issues in the analog stick assembly, which causes movement to register even when the stick is untouched.",
  },
  {
    question: "Why is my refresh rate lower than my monitor rating?",
    answer:
      "Your operating system or cable path may still be set to a lower refresh rate. Check advanced display settings and confirm you are using a cable and port that support the panel's rated mode.",
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
    "Privacy-first browser hardware diagnostics for mice, keyboards, displays, microphones, webcams, controllers, and audio latency.",
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

function getStructuredData(path: string) {
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
        mainEntity: MODULE_ROUTES.filter((moduleRoute) => moduleRoute.target !== "dashboard").map((moduleRoute) => ({
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
          name: "Ellie Petal Media",
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
          name: "Ellie Petal Media",
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
          name: "Ellie Petal Media",
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

  upsertStructuredData("route-schema", getStructuredData(path));
}
