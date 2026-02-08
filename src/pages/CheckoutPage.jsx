import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

const CheckoutPage = () => {
    const { cart, cartTotal } = useCart();
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            setLoginModalOpen(true);
        } else {
            setLoginModalOpen(false);
        }
    }, [currentUser]);

    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '8rem', paddingLeft: '1rem', paddingRight: '1rem', textAlign: 'center', backgroundColor: '#F4F1DE' }}>
                <h2 style={{ fontSize: '2rem', fontFamily: 'Cinzel Decorative, cursive', color: '#E07A5F', marginBottom: '1rem' }}>Your Cart is Empty</h2>
                <button
                    onClick={() => navigate('/menu')}
                    style={{
                        backgroundColor: '#E07A5F',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '9999px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '8rem', paddingBottom: '5rem', backgroundColor: '#F4F1DE', color: '#3D405B', position: 'relative' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', filter: loginModalOpen ? 'blur(5px)' : 'none', pointerEvents: loginModalOpen ? 'none' : 'auto', transition: 'filter 0.3s' }}>
                <h1 style={{ fontSize: '2.5rem', fontFamily: 'Cinzel Decorative, cursive', color: '#E07A5F', marginBottom: '2rem', textAlign: 'center' }}>Checkout</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>
                    {/* Left Column: Address */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #FFE4D6' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#3D405B' }}>Delivery Details</h2>
                        {currentUser && (
                            <div style={{ padding: '0.75rem', backgroundColor: '#ECFDF5', color: '#047857', marginBottom: '1.5rem', borderRadius: '8px', border: '1px solid #A7F3D0', fontWeight: '500' }}>
                                ✔ Logged in as {currentUser.phoneNumber}
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                disabled={!currentUser}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '1rem',
                                    backgroundColor: currentUser ? 'white' : '#F9FAFB'
                                }}
                            />
                            <textarea
                                placeholder="Delivery Address"
                                disabled={!currentUser}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    height: '120px',
                                    fontSize: '1rem',
                                    resize: 'none',
                                    backgroundColor: currentUser ? 'white' : '#F9FAFB'
                                }}
                            ></textarea>
                            <button
                                onClick={() => navigate('/payment')}
                                disabled={!currentUser}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: currentUser ? '#E07A5F' : '#D1D5DB',
                                    color: 'white',
                                    borderRadius: '9999px',
                                    fontWeight: 'bold',
                                    fontSize: '1.125rem',
                                    border: 'none',
                                    cursor: currentUser ? 'pointer' : 'not-allowed',
                                    marginTop: '1rem',
                                    boxShadow: currentUser ? '0 4px 14px rgba(224, 122, 95, 0.4)' : 'none'
                                }}
                            >
                                Place Order
                            </button>
                        </div>
                        {currentUser && (
                            <button
                                onClick={() => logout()}
                                style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#EF4444', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div style={{ backgroundColor: '#FFF7ED', padding: '2rem', borderRadius: '16px', border: '1px solid #FFEDD5', position: 'sticky', top: '7rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#E07A5F', fontFamily: 'Cinzel Decorative, cursive' }}>Order Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ backgroundColor: 'white', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #FED7AA' }}>{item.quantity}</span>
                                        {item.name}
                                    </span>
                                    <span style={{ fontWeight: '500' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '2px dashed #E07A5F', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span style={{ color: '#E07A5F' }}>₹{cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onLoginSuccess={() => setLoginModalOpen(false)}
            />
        </div>
    );
};

export default CheckoutPage;
