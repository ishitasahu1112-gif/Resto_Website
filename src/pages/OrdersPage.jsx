import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, ShoppingBag, MapPin, RefreshCw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';

const OrdersPage = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const ordersRef = collection(db, 'users', currentUser.uid, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
            setOrders(ordersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    if (!currentUser) {
        return (
            <div className="login-page-container" style={{ backgroundImage: `url(${heroBg})` }}>
                <div className="overlay" />
                <div className="login-card">
                    <div style={{
                        width: '5rem', height: '5rem', backgroundColor: '#fff7ed', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                    }}>
                        <ShoppingBag size={32} color="#ea580c" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>
                        Login to view orders
                    </h2>
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Track your food journey and reorder your favorites in seconds.</p>
                    <Link to="/" style={{
                        display: 'block', width: '100%', backgroundColor: '#ea580c', color: 'white',
                        padding: '1rem', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none',
                        boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.3)'
                    }}>
                        Login via Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page" style={{ backgroundImage: `url(${heroBg})` }}>
            <div className="overlay" />
            <div className="content-wrapper">
                <div className="orders-header">
                    <div>
                        <h1 className="orders-title">Past Orders</h1>
                        <p className="orders-subtitle">Delicious memories from The Jhopdi</p>
                    </div>
                    <div className="order-count-badge hidden sm:block">
                        {orders.length} Orders
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2].map(i => (
                            <div key={i} className="order-card" style={{ height: '200px', backgroundColor: 'white', opacity: 0.5 }}></div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-orders-container">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/11458/11458282.png"
                            alt="Empty Plate"
                            className="empty-orders-image"
                        />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>No orders yet?</h3>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>You haven't tried our famous Paneer Tikka yet!</p>
                        <Link to="/menu" style={{
                            backgroundColor: '#ea580c', color: 'white', padding: '0.75rem 2rem',
                            borderRadius: '9999px', fontWeight: 'bold', textDecoration: 'none',
                            boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.3)'
                        }}>
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div>
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="order-card"
                                whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                            >
                                {/* Top Section: Restaurant & Status */}
                                <div className="order-card-header">
                                    <div className="restaurant-info">
                                        <div className="restaurant-logo">
                                            <span className="logo-text">TJ</span>
                                        </div>
                                        <div>
                                            <h3 className="restaurant-name">The Jhopdi</h3>
                                            <p className="location-text">
                                                <MapPin size={12} /> Sector 62, Noida
                                            </p>
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem', fontWeight: 500 }}>
                                                {order.createdAt ? order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' at ' + order.createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="status-badge">
                                        <CheckCircle size={14} color="#059669" fill="#059669" style={{ color: 'white' }} />
                                        <span className="status-text">Delivered</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="order-divider" />

                                {/* Middle Section: Items */}
                                <div className="order-card-body">
                                    <div className="item-row">
                                        <div className="items-list-container">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="item-text">
                                                    <div className="veg-icon">
                                                        <div className="veg-dot" />
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: '#111827', marginRight: '0.25rem' }}>{item.quantity} x</span>
                                                    <span>{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <p className="price-label">Total Paid</p>
                                            <p className="total-price">₹{order.total}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Section: Actions */}
                                <div className="card-actions">
                                    <button className="rate-button">
                                        Rate Order <Star size={14} />
                                    </button>
                                    <div className="action-buttons-group">
                                        <button className="help-button">
                                            Help
                                        </button>
                                        <button className="reorder-button">
                                            <RefreshCw size={14} /> Reorder
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
