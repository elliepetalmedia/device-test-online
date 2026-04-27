import {
  Suspense,
  lazy,
  useEffect,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Switch, Route, useLocation } from "wouter";

import About from "@/pages/About";
import Contact from "@/pages/Contact";
import DashboardPage from "@/pages/DashboardPage";
import FAQ from "@/pages/FAQ";
import NotFound from "@/pages/not-found";
import Privacy from "@/pages/Privacy";
import {
  DiagnosticLoadingState,
  DiagnosticShell,
} from "@/components/layout/DiagnosticShell";
import { Toaster } from "@/components/ui/toaster";
import {
  applyRouteMetadata,
  getRouteDefinitionByTarget,
  isDiagnosticTarget,
  SITE_ROUTES,
  type ModuleType,
  type RouteTarget,
} from "@/lib/site";

const MousePage = lazy(() => import("@/pages/diagnostics/MousePage"));
const KeyboardPage = lazy(() => import("@/pages/diagnostics/KeyboardPage"));
const PixelPage = lazy(() => import("@/pages/diagnostics/PixelPage"));
const MicrophonePage = lazy(() => import("@/pages/diagnostics/MicrophonePage"));
const WebcamPage = lazy(() => import("@/pages/diagnostics/WebcamPage"));
const GamepadPage = lazy(() => import("@/pages/diagnostics/GamepadPage"));
const TypingPage = lazy(() => import("@/pages/diagnostics/TypingPage"));
const AudioSyncPage = lazy(() => import("@/pages/diagnostics/AudioSyncPage"));

const staticRoutes: Record<
  Exclude<RouteTarget, ModuleType | "not-found">,
  ComponentType
> = {
  about: About,
  contact: Contact,
  privacy: Privacy,
  faq: FAQ,
};

const lazyDiagnosticRoutes: Partial<
  Record<Exclude<ModuleType, "dashboard">, LazyExoticComponent<ComponentType>>
> = {
  mouse: MousePage,
  keyboard: KeyboardPage,
  pixel: PixelPage,
  mic: MicrophonePage,
  webcam: WebcamPage,
  gamepad: GamepadPage,
  typing: TypingPage,
  "audio-sync": AudioSyncPage,
};

function DiagnosticRouteBoundary({ module }: { module: Exclude<ModuleType, "dashboard"> }) {
  const LazyPage = lazyDiagnosticRoutes[module];
  const route = getRouteDefinitionByTarget(module);

  if (!LazyPage) {
    return <NotFound />;
  }

  return (
    <Suspense
      fallback={
        <DiagnosticShell
          activeModule={module}
          pageTitle={route.uiTitle ?? route.title}
        >
          <DiagnosticLoadingState module={module} />
        </DiagnosticShell>
      }
    >
      <LazyPage />
    </Suspense>
  );
}

function renderRouteTarget(target: RouteTarget) {
  if (target === "dashboard") {
    return <DashboardPage />;
  }

  if (isDiagnosticTarget(target)) {
    return (
      <DiagnosticRouteBoundary
        module={target as Exclude<ModuleType, "dashboard">}
      />
    );
  }

  const StaticPage = staticRoutes[target as keyof typeof staticRoutes];
  return StaticPage ? <StaticPage /> : <NotFound />;
}

function Router() {
  return (
    <Switch>
      {SITE_ROUTES.map((route) => (
        <Route key={route.path} path={route.path}>
          {renderRouteTarget(route.target)}
        </Route>
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  useEffect(() => {
    applyRouteMetadata(location);
  }, [location]);

  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
