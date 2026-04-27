export const SITE_URL = "https://devicetesteronline.com";
export const SITE_NAME = "Device Test Online";
export const SITE_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

export type RouteTarget =
  | "home"
  | "about"
  | "contact"
  | "privacy"
  | "faq"
  | "not-found";

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

export interface SiteRouteDefinition {
  path: string;
  target: RouteTarget;
  module?: ModuleType;
  title: string;
  description: string;
  socialTitle?: string;
  socialDescription?: string;
  canonicalPath?: string;
  indexable: boolean;
}

export const SITE_ROUTES: SiteRouteDefinition[] = [
  {
    path: "/",
    target: "home",
    module: "dashboard",
    title: "Device Test Online - Free Hardware Diagnostic Suite",
    description:
      "Test your mouse, keyboard, monitor, microphone, webcam, controller, typing speed, and audio latency directly in your browser.",
    indexable: true,
  },
  {
    path: "/mouse-test",
    target: "home",
    module: "mouse",
    title: "Mouse Test - Check Clicks, Scroll, and Polling Rate",
    description:
      "Test left, right, and middle clicks, scroll behavior, and live mouse polling rate with an in-browser mouse diagnostic tool.",
    indexable: true,
  },
  {
    path: "/keyboard-test",
    target: "home",
    module: "keyboard",
    title: "Keyboard Tester - Check Keys, Ghosting, and NKRO",
    description:
      "Verify stuck keys, rollover behavior, and keyboard ghosting with a live browser-based keyboard tester.",
    indexable: true,
  },
  {
    path: "/dead-pixel-test",
    target: "home",
    module: "pixel",
    title: "Monitor Test - Dead Pixels and Refresh Rate Check",
    description:
      "Detect dead or stuck pixels and verify your display refresh rate with a monitor diagnostic tool that runs locally in your browser.",
    indexable: true,
  },
  {
    path: "/microphone-test",
    target: "home",
    module: "mic",
    title: "Microphone Test - Check Mic Recording and Playback",
    description:
      "Test microphone access, record a short sample, and play it back locally to verify your mic and speakers.",
    indexable: true,
  },
  {
    path: "/webcam-test",
    target: "home",
    module: "webcam",
    title: "Webcam Test - Check Camera Feed, Resolution, and FPS",
    description:
      "Open your webcam in the browser, confirm the video feed, and inspect live resolution and frame rate details.",
    indexable: true,
  },
  {
    path: "/gamepad-test",
    target: "home",
    module: "gamepad",
    title: "Gamepad Tester - Controller Buttons, Sticks, and Drift",
    description:
      "Test controller buttons, analog sticks, vibration support, and drift behavior with a browser-based gamepad diagnostic tool.",
    indexable: true,
  },
  {
    path: "/typing-test",
    target: "home",
    module: "typing",
    title: "Typing Speed Test - Measure WPM and Accuracy Online",
    description:
      "Measure typing speed and accuracy in your browser with a lightweight typing test designed for quick keyboard checks.",
    indexable: true,
  },
  {
    path: "/audio-sync-test",
    target: "home",
    module: "audio-sync",
    title: "Audio Delay Test - Check Headphone and Bluetooth Latency",
    description:
      "Measure apparent audio delay with a flash-and-beep test to estimate headset, speaker, or Bluetooth playback latency.",
    indexable: true,
  },
  {
    path: "/about",
    target: "about",
    title: "About Device Test Online",
    description:
      "Learn what Device Test Online is, who publishes it, and how the site provides privacy-first browser-based hardware diagnostics.",
    indexable: true,
  },
  {
    path: "/contact",
    target: "contact",
    title: "Contact Device Test Online",
    description:
      "Contact Device Test Online for business, advertising, legal, or publisher-related inquiries.",
    indexable: true,
  },
  {
    path: "/privacy",
    target: "privacy",
    title: "Privacy Policy - Device Test Online",
    description:
      "Read how Device Test Online handles local processing, browser storage, and privacy for hardware diagnostics that run on your device.",
    indexable: true,
  },
  {
    path: "/faq",
    target: "faq",
    title: "FAQ and Hardware Diagnostic Guide",
    description:
      "Read the Device Test Online FAQ for explanations of mouse, keyboard, monitor, webcam, microphone, controller, and audio test results.",
    indexable: true,
  },
];

export const MODULE_ROUTE_MAP = Object.fromEntries(
  SITE_ROUTES.filter((route) => route.module).map((route) => [
    route.module as ModuleType,
    route.path,
  ]),
) as Record<ModuleType, string>;

export const MODULE_ROUTES = SITE_ROUTES.filter(
  (route): route is SiteRouteDefinition & { module: ModuleType } =>
    route.target === "home" && Boolean(route.module),
);

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
      indexable: false,
      canonicalPath: path,
    }
  );
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
}
