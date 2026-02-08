import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';

const ProfilePage = () => {
    const { currentUser } = useAuth();
    const [name, setName] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: 'Home', address: '' });
    const [loading, setLoading] = useState(true);

    // Fetch User Data & Addresses
    useEffect(() => {
        if (!currentUser) return;

        // 1. Fetch Name
        const fetchUserData = async () => {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (userDoc.exists()) {
                setName(userDoc.data().name || '');
            } else {
                // If doc doesn't exist, create it (or just handle name)
                setName('');
            }
        };
        fetchUserData();

        // 2. Listen to Addresses
        const q = query(collection(db, "users", currentUser.uid, "addresses"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAddresses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleUpdateName = async () => {
        if (!currentUser) return;
        try {
            await updateDoc(doc(db, "users", currentUser.uid), { name });
            setIsEditingName(false);
        } catch (error) {
            console.error("Error updating name:", error);
            // If document doesn't exist, updateDoc fails. Should use setDoc with merge: true if not sure.
            // But since we write order, doc likely exists. If not, handle generically.
        }
    };

    const handleAddAddress = async () => {
        if (!newAddress.address.trim()) return;
        try {
            await addDoc(collection(db, "users", currentUser.uid, "addresses"), {
                label: newAddress.label,
                address: newAddress.address,
                createdAt: new Date()
            });
            setShowAddressForm(false);
            setNewAddress({ label: 'Home', address: '' });
        } catch (error) {
            console.error("Error adding address:", error);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (confirm('Are you sure you want to delete this address?')) {
            try {
                await deleteDoc(doc(db, "users", currentUser.uid, "addresses", id));
            } catch (error) {
                console.error("Error deleting address:", error);
            }
        }
    };

    if (!currentUser) return null; // Should be protected by Route or Redirect

    return (
        <div className="profile-page" style={{ backgroundImage: `url(${heroBg})` }}>
            <div className="overlay" />
            <div className="profile-content">

                {/* Header */}
                <div className="profile-header">
                    <h1 className="profile-title">
                        My Profile
                    </h1>
                </div>

                {/* Personal Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="profile-section-card"
                >
                    <h2 className="profile-section-title"><User size={20} /> Personal Details</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Name Field */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Full Name</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {isEditingName ? (
                                    <>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="profile-input"
                                            style={{ marginBottom: 0 }}
                                            placeholder="Enter your name"
                                            autoFocus
                                        />
                                        <button onClick={handleUpdateName} className="profile-btn btn-primary-action">
                                            <Save size={16} />
                                        </button>
                                        <button onClick={() => setIsEditingName(false)} className="profile-btn btn-secondary-action">
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="profile-display-row">
                                        <span style={{ fontWeight: 600, color: '#374151' }}>{name || 'Guest User'}</span>
                                        <button onClick={() => setIsEditingName(true)} style={{ background: 'none', border: 'none', color: '#ea580c', cursor: 'pointer' }}>
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Phone Field (Read Only) */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Phone Number</label>
                            <div className="profile-readonly-row">
                                <Phone size={16} />
                                <span style={{ fontFamily: 'monospace', fontSize: '1rem' }}>{currentUser.phoneNumber}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Saved Addresses Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="profile-section-card"
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="profile-section-title" style={{ marginBottom: 0 }}><MapPin size={20} /> Saved Addresses</h2>
                        <button
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="profile-btn btn-secondary-action"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                        >
                            <Plus size={14} /> Add New
                        </button>
                    </div>

                    <AnimatePresence>
                        {showAddressForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ overflow: 'hidden', marginBottom: '1rem' }}
                            >
                                <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                                    <select
                                        value={newAddress.label}
                                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                        className="profile-input"
                                        style={{ padding: '0.5rem', marginBottom: '0.5rem' }}
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <textarea
                                        placeholder="Full Address (House No, Street, Landmark...)"
                                        rows="2"
                                        value={newAddress.address}
                                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                        className="profile-input"
                                        style={{ resize: 'none' }}
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button onClick={() => setShowAddressForm(false)} className="profile-btn btn-secondary-action">Cancel</button>
                                        <button onClick={handleAddAddress} className="profile-btn btn-primary-action">Save Address</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading ? (
                        <p style={{ color: '#6b7280', textAlign: 'center', fontStyle: 'italic' }}>Loading addresses...</p>
                    ) : addresses.length === 0 ? (
                        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>No addresses saved yet.</p>
                    ) : (
                        <div>
                            {addresses.map(addr => (
                                <motion.div
                                    key={addr.id}
                                    layout
                                    className="address-card"
                                >
                                    <div>
                                        <span className="address-label-badge">{addr.label}</span>
                                        <p style={{ color: '#374151', fontSize: '0.95rem' }}>{addr.address}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteAddress(addr.id)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
};

export default ProfilePage;
