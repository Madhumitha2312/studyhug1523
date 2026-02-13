import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import AppLayout from "@/components/AppLayout";
import AuthPage from "@/pages/AuthPage";
import OnboardingPage from "@/pages/OnboardingPage";
import DashboardPage from "@/pages/DashboardPage";
import StudyTimerPage from "@/pages/StudyTimerPage";
import AssignmentsPage from "@/pages/AssignmentsPage";
import ExamsPage from "@/pages/ExamsPage";
import TimetablePage from "@/pages/TimetablePage";
import TopicsPage from "@/pages/TopicsPage";
import PerformancePage from "@/pages/PerformancePage";
import AIChatPage from "@/pages/AIChatPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('onboarding_completed').eq('user_id', user.id).single()
      .then(({ data }) => setOnboarded(data?.onboarding_completed ?? false));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse-soft text-primary text-xl font-heading">Loading...</div></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (onboarded === null) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse-soft text-primary text-xl font-heading">Loading...</div></div>;
  if (!onboarded) return <Navigate to="/onboarding" replace />;

  return <AppLayout>{children}</AppLayout>;
}

function OnboardingRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <OnboardingPage />;
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <AuthPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthRoute />} />
              <Route path="/onboarding" element={<OnboardingRoute />} />
              <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/timer" element={<ProtectedRoute><StudyTimerPage /></ProtectedRoute>} />
              <Route path="/assignments" element={<ProtectedRoute><AssignmentsPage /></ProtectedRoute>} />
              <Route path="/exams" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
              <Route path="/timetable" element={<ProtectedRoute><TimetablePage /></ProtectedRoute>} />
              <Route path="/topics" element={<ProtectedRoute><TopicsPage /></ProtectedRoute>} />
              <Route path="/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
              <Route path="/ai-chat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
