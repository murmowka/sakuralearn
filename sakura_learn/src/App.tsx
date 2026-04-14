import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import HiraganaKatakana from "./pages/HiraganaKatakana";
import HiraganaKatakanaTest from "./pages/HiraganaKatakanaTest";
import UserProfile from "./pages/UserProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function Router() {
  // Routes for public pages (no authentication required)
  // Routes for authenticated pages (with authentication required)
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={SignIn} />
      <Route path="/profile-setup" component={ProfileSetup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/hiragana" component={HiraganaKatakana} />
      <Route path="/hiragana-test" component={HiraganaKatakanaTest} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster
  richColors
  position="bottom-right"
  toastOptions={{
    style: { background: 'white', color: 'black', border: '1px solid #fecaca' }, // Явно задаем белый фон и розовую рамку в стиле Sakura
  }}
/>

          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
