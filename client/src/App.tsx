import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import FAQ from "@/pages/FAQ";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/mouse-test" component={Home} />
      <Route path="/keyboard-test" component={Home} />
      <Route path="/dead-pixel-test" component={Home} />
      <Route path="/microphone-test" component={Home} />
      <Route path="/webcam-test" component={Home} />
      <Route path="/gamepad-test" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/faq" component={FAQ} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
