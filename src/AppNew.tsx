import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar/Navbar";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Standings from "@/pages/Standings";
import Matches from "@/pages/Matches";
import Guesses from "@/pages/Guesses";
import Prizes from "@/pages/Prizes";
import Payments from "@/pages/Payments";
import RoundReport from "@/pages/RoundReport";
import AdminUsers from "@/pages/AdminUsers";
import AdminTeams from "@/pages/AdminTeams";
import AdminMatches from "@/pages/AdminMatches";
import AdminScoring from "@/pages/AdminScoring";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { MatchesProvider } from "@/contexts/MatchesContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <MatchesProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/matches" element={<Matches />} />
          <Route
            path="/guesses"
            element={
              <ProtectedRoute>
                <Guesses />
              </ProtectedRoute>
            }
          />
          <Route path="/prizes" element={<Prizes />} />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/round-report"
            element={
              <ProtectedRoute>
                <RoundReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teams"
            element={
              <ProtectedRoute adminOnly>
                <AdminTeams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/matches"
            element={
              <ProtectedRoute adminOnly>
                <AdminMatches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/scoring"
            element={
              <ProtectedRoute adminOnly>
                <AdminScoring />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </MatchesProvider>
    </AuthProvider>
  );
}

export default App;
