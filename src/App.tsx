import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PartnerRegister from "./pages/PartnerRegister";
import ExplorarAgencias from "./pages/explorar/ExplorarAgencias";
import ExplorarHospedagem from "./pages/explorar/ExplorarHospedagem";
import ExplorarExperiencias from "./pages/explorar/ExplorarExperiencias";
import ExplorarTransporte from "./pages/explorar/ExplorarTransporte";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/partner-register" element={<PartnerRegister />} />
          <Route path="/explorar/agencias" element={<ExplorarAgencias />} />
          <Route path="/explorar/hospedagem" element={<ExplorarHospedagem />} />
          <Route path="/explorar/experiencias" element={<ExplorarExperiencias />} />
          <Route path="/explorar/transporte" element={<ExplorarTransporte />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
