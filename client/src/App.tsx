import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import FAQ from "@/pages/FAQ";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";
import { applyRouteMetadata, SITE_ROUTES } from "@/lib/site";

function Router() {
  return (
    <Switch>
      {SITE_ROUTES.map((route) => (
        <Route key={route.path} path={route.path}>
          {route.target === "home" && <Home />}
          {route.target === "about" && <About />}
          {route.target === "contact" && <Contact />}
          {route.target === "privacy" && <Privacy />}
          {route.target === "faq" && <FAQ />}
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
