import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import LanguageSubPage from "./pages/LanguageSubPage.tsx";
import TheologySubPage from "./pages/TheologySubPage.tsx";
import SemesterSubPage from "./pages/SemesterSubPage.tsx";
import SubjectSubPage from "./pages/SubjectSubPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/categoria/:id" element={<CategoryPage />} />
            <Route path="/categoria/:id/linguagem/:slug" element={<LanguageSubPage />} />
            <Route path="/categoria/:id/topico/:slug" element={<TheologySubPage />} />
            <Route path="/categoria/:id/semestre/:slug" element={<SemesterSubPage />} />
            <Route path="/categoria/:id/semestre/:slug/materia/:subjectSlug" element={<SubjectSubPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
