import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PromoCard from './components/PromoCard';
import About from './components/About';
import MenuHighlights from './components/MenuHighlights';
import Footer from './components/Footer';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import OrdersPage from './pages/OrdersPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';

// ScrollToTop component to reset scroll on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      // Small timeout to ensure DOM is ready if navigating from another page
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

function AppContent() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-bg relative overflow-x-hidden">
        <Navbar />
        <CartSidebar />

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <div className="h-12 md:h-16 bg-bg"></div> {/* Spacer to separate Hero and Promo */}
                <PromoCard />
                <About />
                <MenuHighlights />
                <Footer />
              </>
            } />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
