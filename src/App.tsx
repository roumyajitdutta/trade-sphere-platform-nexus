
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import CartPage from "@/pages/buyer/CartPage";
import SellerDashboard from "@/pages/seller/SellerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import AddProduct from "./pages/seller/AddProduct";
import ManageProducts from "./pages/seller/ManageProducts";
import ProductListPage from "./pages/buyer/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/buyer/CheckoutPage";
import OrderConfirmation from "./pages/buyer/OrderConfirmation";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerAnalytics from "./pages/seller/SellerAnalytics";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerOrdersPage from "./pages/buyer/BuyerOrdersPage";
import SearchResultsPage from "./pages/SearchResultsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/products" element={<ProductListPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders/confirmation" element={<OrderConfirmation />} />
                  <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                  <Route path="/buyer/orders" element={<BuyerOrdersPage />} />
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  <Route path="/seller/products" element={<ManageProducts />} />
                  <Route path="/seller/products/new" element={<AddProduct />} />
                  <Route path="/seller/orders" element={<SellerOrders />} />
                  <Route path="/seller/analytics" element={<SellerAnalytics />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
