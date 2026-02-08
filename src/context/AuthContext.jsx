import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fallback timeout in case Firebase hangs
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn("Auth check timed out, forcing load");
                setLoading(false);
            }
        }, 3000); // 3 seconds timeout

        return () => clearTimeout(timeoutId);
    }, [loading]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribeAuth;
    }, []);

    useEffect(() => {
        if (!currentUser) {
            setUserData(null);
            return;
        }

        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, async (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                // Initialize user doc if it doesn't exist
                const newData = {
                    phoneNumber: currentUser.phoneNumber,
                    createdAt: new Date(),
                };
                await setDoc(userRef, newData);
                setUserData(newData);
            }
        }, (error) => {
            console.error("Error fetching user data:", error);
        });

        return () => unsubscribeSnapshot();
    }, [currentUser]);

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        userData,
        logout,
        loading
    };

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F4F1DE',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{
                    width: '3rem',
                    height: '3rem',
                    border: '4px solid #E07A5F',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ fontFamily: 'Cinzel Decorative, cursive', fontSize: '1.2rem', color: '#E07A5F' }}>The Jhopdi</p>

                {/* Emergency Reset Button */}
                <button
                    onClick={() => {
                        window.localStorage.clear();
                        window.sessionStorage.clear();
                        window.location.reload();
                    }}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem',
                        color: '#6B7280',
                        textDecoration: 'underline',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Stuck? Click here to reset.
                </button>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
