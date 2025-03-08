
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import Admin from "./pages/Admin";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { useAppContext } from "./context/AppContext";

// Protected route wrapper
const ProtectedRoute = ({ element, allowedRoles }: { element: React.ReactNode, allowedRoles: Array<string> }) => {
  const { isLoggedIn, userRole } = useAppContext();
  
  if (!isLoggedIn || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{element}</>;
};

const queryClient = new QueryClient();

const App = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/customer" /> : <Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customer" element={
              <ProtectedRoute element={<Customer />} allowedRoles={['customer']} />
            } />
            <Route path="/admin" element={
              <ProtectedRoute element={<Admin />} allowedRoles={['admin']} />
            } />
            <Route path="/security" element={
              <ProtectedRoute element={<Security />} allowedRoles={['security']} />
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
