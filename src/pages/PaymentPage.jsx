import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { clearCart, cartTotal, cart } = useCart();
    const { currentUser } = useAuth();
    const fileInputRef = React.useRef(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [countdown, setCountdown] = useState(5);

    // Update window dimensions for confetti
    useEffect(() => {
        const handleResize = () => setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle countdown and redirect after success
    // FIXED: Removed clearCart() from here to prevent infinite re-render loops due to unstable context function reference
    useEffect(() => {
        let timer;
        if (success) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate('/');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [success, navigate]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        console.log("File selected:", file);
        if (!file) return;

        setUploading(true);
        console.log("Starting upload process...");

        // Simulate upload delay
        setTimeout(async () => {
            let orderSaved = false;
            try {
                console.log("Timeout finished. Processing order...");

                // Save order to Firestore if user is logged in
                if (currentUser) {
                    console.log("User logged in, saving to Firestore...", currentUser.uid);

                    // Create a timeout promise
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Firestore write timed out")), 5000)
                    );

                    try {
                        // Race against timeout
                        await Promise.race([
                            addDoc(collection(db, "users", currentUser.uid, "orders"), {
                                items: cart,
                                total: cartTotal,
                                status: 'placed',
                                createdAt: serverTimestamp(),
                                paymentMethod: 'UPI'
                            }),
                            timeoutPromise
                        ]);
                        console.log("Order saved to Firestore successfully.");
                        orderSaved = true;
                    } catch (error) {
                        console.error("Firestore operation failed or timed out:", error);
                        // Proceed anyway (offline mode behavior)
                    }
                } else {
                    console.log("No logged-in user, skipping Firestore save.");
                }

            } catch (err) {
                console.error("Critical error in upload logic:", err);
            } finally {
                // ALWAYS finish.
                console.log("Finalizing transaction...");
                setUploading(false);
                setSuccess(true);
                clearCart();
            }
        }, 1500);
    };

    if (success) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#F4F1DE',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <Confetti width={windowDimensions.width} height={windowDimensions.height} />
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CheckCircle size={80} color="#059669" style={{ marginBottom: '1.5rem' }} />
                    <h1 style={{ fontSize: '3rem', fontFamily: 'Cinzel Decorative, cursive', color: '#E07A5F', marginBottom: '1rem' }}>Order Placed!</h1>
                    <p style={{ fontSize: '1.25rem', color: '#3D405B', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Thank you for your order. We have received your payment receipt and your food is being prepared.
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '1.1rem', fontWeight: 'bold' }}>Redirecting to home in {countdown} seconds...</p>
                </motion.div>
            </div>
        );
    }



    const handleContainerClick = () => {
        console.log("Container clicked. Ref current:", fileInputRef.current);
        if (!uploading && fileInputRef.current) {
            console.log("Triggering file input click...");
            fileInputRef.current.click();
        } else {
            console.log("Click ignored. Uploading:", uploading);
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '6rem', backgroundColor: '#F4F1DE', color: '#3D405B' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <button
                    onClick={() => navigate('/checkout')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#6B7280', fontSize: '1rem', cursor: 'pointer', marginBottom: '1rem' }}
                >
                    <ArrowLeft size={20} /> Back to Checkout
                </button>

                <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', textAlign: 'center', border: '1px solid #FFE4D6' }}>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'Cinzel Decorative, cursive', color: '#E07A5F', marginBottom: '0.5rem' }}>Complete Payment</h1>
                    <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Scan the QR code to pay <strong>₹{cartTotal.toFixed(2)}</strong></p>

                    <div style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        border: '2px dashed #E07A5F',
                        display: 'inline-block',
                        marginBottom: '2.5rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}>
                        {/* Placeholder QR Code - Using a generic QR API for realism */}
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=restaurant@upi&pn=TheJhopdi&am=${cartTotal}&cu=INR`}
                            alt="Payment QR Code"
                            style={{ display: 'block', width: '200px', height: '200px' }}
                        />
                        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#4B5563', fontWeight: '500' }}>UPI ID: restaurant@upi</p>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem', color: '#374151' }}>Upload Payment Screenshot</label>
                        <div
                            onClick={handleContainerClick}
                            style={{
                                position: 'relative',
                                cursor: uploading ? 'wait' : 'pointer'
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                style={{ display: 'none' }}
                            />
                            <div style={{
                                border: '2px dashed #D1D5DB',
                                borderRadius: '12px',
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: '#F9FAFB',
                                transition: 'all 0.2s',
                            }}>
                                {uploading ? (
                                    <div style={{ width: '2rem', height: '2rem', border: '3px solid #E5E7EB', borderTopColor: '#E07A5F', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <>
                                        <Upload size={32} color="#9CA3AF" />
                                        <span style={{ color: '#4B5563', fontWeight: '500' }}>Click to upload screenshot</span>
                                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>JPG, PNG up to 5MB</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PaymentPage;
