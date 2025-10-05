import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { PageLoadingState } from "./components/ui/loading-spinner";
import { useAuthStore } from "@/store/auth";
import { AppShell } from "./components/layout/app-shell";
import Dashboard from "./pages/dashboard";
import Endpoints from "./pages/endpoints";
import Deliveries from "./pages/deliveries";
import NotFound from "./pages/NotFound";

const Simulator = lazy(() => import("./pages/simulator"));
const Pipelines = lazy(() => import("./pages/pipelines"));
const Metrics = lazy(() => import("./pages/metrics"));
const Terminal = lazy(() => import("./pages/terminal"));
const ConsoleComponent = lazy(() => import("./pages/console"));
const Alerts = lazy(() => import("./pages/alerts"));
const Teams = lazy(() => import("./pages/teams"));
const Integrations = lazy(() => import("./pages/integrations"));
const Audit = lazy(() => import("./pages/audit"));
const Billing = lazy(() => import("./pages/billing"));
const Compliance = lazy(() => import("./pages/compliance"));
const Settings = lazy(() => import("./pages/settings"));

// Auth pages
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/signup"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot-password"));
const ResetPassword = lazy(() => import("./pages/auth/reset-password"));

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <PageLoadingState title="Loading" description="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth/login" element={
        <Suspense fallback={<PageLoadingState title="Loading" description="Loading login..." />}>
          <Login />
        </Suspense>
      } />
      <Route path="/auth/signup" element={
        <Suspense fallback={<PageLoadingState title="Loading" description="Loading signup..." />}>
          <Signup />
        </Suspense>
      } />
      <Route path="/auth/forgot-password" element={
        <Suspense fallback={<PageLoadingState title="Loading" description="Loading..." />}>
          <ForgotPassword />
        </Suspense>
      } />
      <Route path="/auth/reset-password" element={
        <Suspense fallback={<PageLoadingState title="Loading" description="Loading..." />}>
          <ResetPassword />
        </Suspense>
      } />
      
      {/* Protected app routes with AppShell layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="endpoints" element={<Endpoints />} />
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="simulator" element={<Suspense fallback={<PageLoadingState title="Loading Simulator" description="Setting up webhook testing environment..." />}><Simulator /></Suspense>} />
        <Route path="pipelines" element={<Suspense fallback={<PageLoadingState title="Loading Pipelines" description="Preparing pipeline builder..." />}><Pipelines /></Suspense>} />
        <Route path="metrics" element={<Suspense fallback={<PageLoadingState title="Loading Analytics" description="Fetching performance metrics..." />}><Metrics /></Suspense>} />
        <Route path="terminal" element={<Suspense fallback={<PageLoadingState title="Loading Terminal" description="Initializing command interface..." />}><Terminal /></Suspense>} />
        <Route path="console" element={<Suspense fallback={<PageLoadingState title="Loading Console" description="Connecting to live logs..." />}><ConsoleComponent /></Suspense>} />
        <Route path="alerts" element={<Suspense fallback={<PageLoadingState title="Loading Alerts" description="Loading monitoring rules..." />}><Alerts /></Suspense>} />
        <Route path="teams" element={<Suspense fallback={<PageLoadingState title="Loading Teams" description="Fetching team information..." />}><Teams /></Suspense>} />
        <Route path="integrations" element={<Suspense fallback={<PageLoadingState title="Loading Integrations" description="Connecting to services..." />}><Integrations /></Suspense>} />
        <Route path="audit" element={<Suspense fallback={<PageLoadingState title="Loading Audit Logs" description="Fetching security data..." />}><Audit /></Suspense>} />
        <Route path="billing" element={<Suspense fallback={<PageLoadingState title="Loading Billing" description="Calculating usage..." />}><Billing /></Suspense>} />
        <Route path="compliance" element={<Suspense fallback={<PageLoadingState title="Loading Compliance" description="Checking frameworks..." />}><Compliance /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoadingState title="Loading Settings" description="Loading preferences..." />}><Settings /></Suspense>} />
      </Route>

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
