import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import MenuPage from './pages/Menu.jsx';
import FoodDetails from './pages/FoodDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import { Login, Signup } from './pages/Auth.jsx';
import Reservation from './pages/Reservation.jsx';
import Reservations from './pages/Reservations.jsx';
import Branches from './pages/Branches.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import { Orders, Profile } from './pages/Account.jsx';
import NotFound from './pages/NotFound.jsx';
import { syncCatalog } from './services/api.js';

function RouteEffects() {
  const { pathname } = useLocation();

  // Backend se live menu + branches load karo (backend band ho to bundled menu chalta hai)
  useEffect(() => {
    syncCatalog();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const labels = {
      '/': "Let's Hangout...",
      '/menu': 'Our Menu',
      '/deals': 'Deals',
      '/cart': 'Your Cart',
      '/checkout': 'Checkout',
      '/login': 'Login',
      '/signup': 'Create Account',
      '/reservation': 'Reserve a Table',
      '/my-reservations': 'Your Reservations',
      '/branches': 'Our Branches',
      '/about': 'Our Story',
      '/contact': 'Get in Touch',
      '/orders': 'Your Orders',
      '/profile': 'Your Profile',
    };
    document.title = `${labels[pathname] || 'Your next favourite'} | Caf\u00e9 007`;
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <CartProvider>
            <RouteEffects />
            <Navbar />
            <main id="main" tabIndex={-1}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/deals" element={<MenuPage dealsOnly />} />
                <Route path="/food/:id" element={<FoodDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/my-reservations" element={<Reservations />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}