
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Index from "./pages/Index";
import Matches from "./pages/Matches";
import Kichutes from "./pages/Guesses";
import Standings from "./pages/Standings";
import Payments from "./pages/Payments";
import Prizes from "./pages/Prizes";
import RoundReport from "./pages/RoundReport";
import AdminMatches from "./pages/AdminMatches";
import AdminTeams from "./pages/AdminTeams";
import AdminScoring from "./pages/AdminScoring";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";
import TesteEscudos from "./pages/TesteEscudos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./contexts/auth";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/matches" element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            } />
            <Route path="/kichutes" element={
              <ProtectedRoute>
                <Kichutes />
              </ProtectedRoute>
            } />
            <Route path="/standings" element={
              <ProtectedRoute>
                <Standings />
              </ProtectedRoute>
            } />
            <Route path="/prizes" element={
              <ProtectedRoute>
                <Prizes />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path="/round-report" element={
              <ProtectedRoute>
                <RoundReport />
              </ProtectedRoute>
            } />
            
            {/* Admin-only Routes */}
            <Route path="/admin/matches" element={
              <ProtectedRoute adminOnly>
                <AdminMatches />
              </ProtectedRoute>
            } />
            <Route path="/admin/teams" element={
              <ProtectedRoute adminOnly>
                <AdminTeams />
              </ProtectedRoute>
            } />
            <Route path="/admin/scoring" element={
              <ProtectedRoute adminOnly>
                <AdminScoring />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            } />
            
            {/* Misc Routes */}
            <Route path="/teste" element={<TesteEscudos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
