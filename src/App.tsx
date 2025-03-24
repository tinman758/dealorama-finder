
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import DealDetail from "./pages/DealDetail";
import DealsPage from "./pages/DealsPage";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import StorePage from "./pages/StorePage";
import AllStores from "./pages/AllStores";
import AllCategories from "./pages/AllCategories";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/SignupPage";
import SignupSuccessPage from "./pages/SignupSuccessPage";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import ContactPage from "./pages/ContactPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import ScrollToTop from "./components/ScrollToTop";
import * as React from "react";
import AccountPage from "./pages/AccountPage";
import FavoritesPage from "./pages/FavoritesPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import AccountSecurityPage from "./pages/AccountSecurityPage";

// Admin Dashboard imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDeals from "./pages/admin/AdminDeals";
import AdminStores from "./pages/admin/AdminStores";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminAdmins from "./pages/admin/AdminAdmins";

// Move QueryClient creation inside the component
const App = () => {
  // Create a client inside the function component
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* Ensure TooltipProvider is properly instantiated */}
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/deal/:id" element={<DealDetail />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/store/:id" element={<StorePage />} />
                <Route path="/all-stores" element={<AllStores />} />
                <Route path="/all-categories" element={<AllCategories />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/signup-success" element={<SignupSuccessPage />} />
                
                {/* Auth Callback Route */}
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                
                {/* Account Routes */}
                <Route path="/account" element={<AccountPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/account/settings" element={<AccountSettingsPage />} />
                <Route path="/account/security" element={<AccountSecurityPage />} />
                
                {/* Admin Dashboard Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="deals" element={<AdminDeals />} />
                  <Route path="stores" element={<AdminStores />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="admins" element={<AdminAdmins />} />
                </Route>
                
                {/* New Routes */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
