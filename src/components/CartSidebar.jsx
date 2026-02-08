import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
    const navigate = useNavigate();
    const {
        cart,
        isCartOpen,
        toggleCart,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    const handleCheckout = () => {
        toggleCart();
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="cart-backdrop"
                    />

                    {/* Sidebar */}
                    <motion.div
                        key="sidebar"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="cart-panel"
                    >
                        {/* Header */}
                        <div className="cart-header">
                            <h2 className="text-2xl boho-heading flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                                <ShoppingBag size={24} /> Your Order
                            </h2>
                            <button
                                onClick={toggleCart}
                                className="close-btn"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="cart-items">
                            {cart.length === 0 ? (
                                <div className="cart-empty">
                                    <ShoppingBag size={48} className="mb-4 opacity-30" />
                                    <p className="text-lg">Your cart is empty.</p>
                                    <p className="text-sm">Add some delicious dishes!</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        className="cart-item"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="cart-item-img"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-[var(--color-text)]">{item.name}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="remove-btn"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[var(--color-primary)] font-medium mb-2">₹{item.price}</p>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="qty-btn"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="qty-text">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="qty-btn"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="cart-footer">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg text-gray-600">Total</span>
                                    <span className="text-3xl font-bold text-[var(--color-primary)] boho-heading">
                                        ₹{cartTotal.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full btn btn-primary py-4 text-lg"
                                >
                                    Checkout Now
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
