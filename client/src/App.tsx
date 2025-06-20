import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import StoreManagerDashboard from "@/pages/store-manager-dashboard";
import SupplierDashboard from "@/pages/supplier-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login/:role" component={LoginPage} />
      <Route path="/store-manager/dashboard" component={StoreManagerDashboard} />
      <Route path="/store-manager/suppliers" component={StoreManagerDashboard} />
      <Route path="/supplier/dashboard" component={SupplierDashboard} />
      
      {/* Additional supplier routes */}
      <Route path="/supplier/stores" component={SupplierDashboard} />
      <Route path="/supplier/shipments" component={SupplierDashboard} />
      <Route path="/supplier/requests" component={SupplierDashboard} />
      <Route path="/supplier/analytics" component={SupplierDashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
