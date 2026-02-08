import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    console.log("LoginModal render. isOpen:", isOpen);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('LOGIN'); // LOGIN, OTP
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('LOGIN');
            setPhoneNumber('');
            setOtp('');
            setErrorMsg('');
        }
    }, [isOpen]);

    // Cleanup Recaptcha on unmount
    useEffect(() => {
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);

    const setupRecaptcha = () => {
        // Clear previous instance if it exists
        if (window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier.clear();
            } catch (e) {
                console.warn("Failed to clear existing recaptcha", e);
            }
            window.recaptchaVerifier = null;
        }

        // Force clear the DOM element to prevent "already rendered" error
        const container = document.getElementById('login-recaptcha');
        if (container) {
            container.innerHTML = '';
        }

        try {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'login-recaptcha', {
                'size': 'invisible',
                'callback': () => {
                    console.log("Recaptcha verified");
                },
                'expired-callback': () => setErrorMsg('Recaptcha expired. Please try again.')
            });
        } catch (error) {
            console.error("Recaptcha init error:", error);
            setErrorMsg("Security check failed. Please refresh.");
        }
    };

    const handleSendOtp = async () => {
        setErrorMsg('');
        setLoading(true);

        try {
            const formattedNumber = phoneNumber.replace(/\s+/g, '');
            const finalNumber = formattedNumber.startsWith('+') ? formattedNumber : `+91${formattedNumber}`;

            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;

            const confirmation = await signInWithPhoneNumber(auth, finalNumber, appVerifier);
            setConfirmationResult(confirmation);
            setStep('OTP');
        } catch (error) {
            console.error("Error sending OTP:", error);
            setErrorMsg(error.message || "Failed to send OTP.");
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            await confirmationResult.confirm(otp);
            onClose();
            if (onLoginSuccess) onLoginSuccess();
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setErrorMsg("Invalid OTP. Please try again.");
        }
        setLoading(false);
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999, // Ensure super high Z
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    {/* ... rest of the modal content same as before ... */}
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(5px)'
                        }}
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        style={{
                            backgroundColor: 'white',
                            padding: '2.5rem',
                            borderRadius: '24px',
                            width: '100%',
                            maxWidth: '440px',
                            position: 'relative',
                            zIndex: 10,
                            border: '2px solid #E07A5F',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                            textAlign: 'center'
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.8rem', fontFamily: 'Cinzel Decorative, cursive', color: '#E07A5F', marginBottom: '0.5rem' }}>Login</h2>
                        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Login to track your orders</p>

                        {step === 'LOGIN' && (
                            <div>
                                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+1 555 555 5555"
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '1.125rem',
                                            backgroundColor: '#F9FAFB',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                {errorMsg && (
                                    <div style={{ color: '#EF4444', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#FEF2F2', borderRadius: '8px', fontSize: '0.875rem' }}>
                                        {errorMsg}
                                    </div>
                                )}
                                <div id="login-recaptcha"></div>
                                <button
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: '#E07A5F',
                                        color: 'white',
                                        borderRadius: '9999px',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 12px rgba(224, 122, 95, 0.3)'
                                    }}
                                >
                                    {loading ? 'Sending Code...' : 'Continue with Phone'}
                                </button>
                                <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: '#F3F4F6', borderRadius: '8px', fontSize: '0.75rem', color: '#6B7280' }}>
                                    <strong>Use Test Credentials:</strong><br />
                                    Number: +1 555-555-5555<br />
                                    Code: 123456
                                </div>
                            </div>
                        )}

                        {step === 'OTP' && (
                            <div>
                                <p style={{ marginBottom: '1.5rem', color: '#4B5563' }}>Enter the verification code sent to <br /><strong style={{ color: 'black' }}>{phoneNumber}</strong></p>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456"
                                        maxLength={6}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            letterSpacing: '0.5em',
                                            textAlign: 'center',
                                            backgroundColor: '#F9FAFB',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                {errorMsg && (
                                    <div style={{ color: '#EF4444', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#FEF2F2', borderRadius: '8px', fontSize: '0.875rem' }}>
                                        {errorMsg}
                                    </div>
                                )}

                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: '#E07A5F',
                                        color: 'white',
                                        borderRadius: '9999px',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 12px rgba(224, 122, 95, 0.3)'
                                    }}
                                >
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                </button>
                                <button
                                    onClick={() => setStep('LOGIN')}
                                    style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#6B7280', fontSize: '0.875rem', textDecoration: 'underline', cursor: 'pointer' }}
                                >
                                    Change Phone Number
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default LoginModal;
