import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false); // New state for dropdown
    const { toggleCart, cartCount } = useCart();
    const { currentUser, userData, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuOpen && !event.target.closest('.user-menu-container')) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userMenuOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Our Story', path: '/#about' },
        { name: 'Menu', path: '/menu' },
        { name: 'Contact', path: '/#contact' },
    ];

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            console.log("Attempting logout...");
            await logout();
            console.log("Logout successful");
            setUserMenuOpen(false);
            navigate('/'); // Redirect to home instead of reloading
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const isHome = location.pathname === '/';
    const textColor = isHome && !scrolled ? 'var(--color-bg)' : 'var(--color-text)';

    return (
        <>
            <nav
                className={`nav-bar ${scrolled ? 'scrolled' : ''}`}
            >
                <div className="container nav-container">
                    <Link to="/" className="text-2xl font-bold boho-heading" style={{ color: 'var(--color-primary)', fontSize: '2rem' }}>
                        The Jhopdi
                    </Link>

                    {/* Desktop Menu */}
                    <div className="desktop-menu items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="nav-link text-lg"
                                style={{ color: textColor }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions (Cart + User + Mobile Toggle) */}
                    <div className="nav-actions">

                        {/* User Login Icon & Menu */}
                        <div className="relative user-menu-container" style={{ position: 'relative' }}>
                            <button
                                onClick={() => {
                                    if (currentUser) {
                                        setUserMenuOpen(!userMenuOpen);
                                    } else {
                                        setLoginModalOpen(true);
                                    }
                                }}
                                className="cart-btn"
                                style={{ position: 'relative', color: textColor, marginRight: '0.5rem' }}
                            >
                                <User size={24} />
                                {currentUser && (
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '-4px',
                                        right: '-4px',
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: '#10B981',
                                        borderRadius: '50%',
                                        border: '2px solid white'
                                    }} />
                                )}
                            </button>

                            {/* User Dropdown Menu */}
                            <AnimatePresence>
                                {userMenuOpen && currentUser && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            position: 'absolute',
                                            top: '120%', // Below the icon
                                            right: 0,
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                            padding: '1rem',
                                            minWidth: '220px',
                                            zIndex: 50,
                                            border: '1px solid #E5E7EB'
                                        }}
                                    >
                                        <div style={{ paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #F3F4F6' }}>
                                            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Logged in as</p>
                                            <p style={{ fontWeight: 'bold', color: '#111827' }}>
                                                {/* Display Name or Formatting Phone */}
                                                {(userData?.name && userData.name.trim() !== '')
                                                    ? userData.name
                                                    : currentUser.phoneNumber}
                                            </p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="block w-full text-left"
                                            style={{ padding: '0.5rem 0', color: '#374151', textDecoration: 'none', fontSize: '0.9rem', display: 'block', borderBottom: '1px solid #f3f4f6' }}
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="block w-full text-left"
                                            style={{ padding: '0.5rem 0', color: '#374151', textDecoration: 'none', fontSize: '0.9rem', display: 'block' }}
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            My Orders
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                marginTop: '0.5rem',
                                                width: '100%',
                                                padding: '0.5rem',
                                                backgroundColor: '#FEF2F2',
                                                color: '#EF4444',
                                                borderRadius: '6px',
                                                border: 'none',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Cart Icon */}
                        <button
                            onClick={toggleCart}
                            className="cart-btn"
                            style={{ color: textColor }}
                        >
                            <ShoppingBag size={24} />
                            {cartCount > 0 && (
                                <span className="cart-badge">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Toggle (Hidden on Desktop) */}
                        <button
                            className="mobile-toggle md-hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mobile-menu-overlay"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-2xl font-bold boho-heading"
                                    style={{ color: 'var(--color-text)', marginBottom: '2rem' }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {/* Mobile User Action */}
                            {currentUser ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                                    <p style={{ color: '#4B5563', marginBottom: '1rem' }}>
                                        Hi, {(userData?.name && userData.name.trim() !== '') ? userData.name.split(' ')[0] : 'there'}!
                                    </p>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ fontSize: '1.25rem', color: '#374151', fontWeight: '500', textDecoration: 'none' }}
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/orders"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ fontSize: '1.25rem', color: '#374151', fontWeight: '500', textDecoration: 'none' }}
                                    >
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        style={{ fontSize: '1.25rem', color: '#EF4444', fontWeight: 'bold' }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setLoginModalOpen(true);
                                    }}
                                    style={{ marginTop: '2rem', fontSize: '1.25rem', color: 'var(--color-accent)', fontWeight: 'bold' }}
                                >
                                    Login
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onLoginSuccess={() => setLoginModalOpen(false)}
            />
        </>
    );
};

export default Navbar;
