
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Matches from "./pages/Matches";
import Guesses from "./pages/Guesses";
import Standings from "./pages/Standings";
import Payments from "./pages/Payments";
import Prizes from "./pages/Prizes";
import AdminMatches from "./pages/AdminMatches";
import AdminTeams from "./pages/AdminTeams";
import AdminScoring from "./pages/AdminScoring";
import NotFound from "./pages/NotFound";
import TesteEscudos from "./pages/TesteEscudos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/guesses" element={<Guesses />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/prizes" element={<Prizes />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/admin/matches" element={<AdminMatches />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/scoring" element={<AdminScoring />} />
          <Route path="/teste" element={<TesteEscudos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
