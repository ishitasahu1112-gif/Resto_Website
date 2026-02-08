import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { menuData, categories } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

const MenuPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [subCategoryFilter, setSubCategoryFilter] = useState('All');
    const { addToCart } = useCart();

    const filteredItems = menuData.filter(item => {
        const catMatch = activeCategory === 'All' || item.category === activeCategory;
        const subCatMatch = subCategoryFilter === 'All' || item.subCategory === subCategoryFilter;
        return catMatch && subCatMatch;
    });

    // Flatten all subcategories for the filter pills
    const allSubCategories = activeCategory === 'All'
        ? [...new Set(menuData.map(item => item.subCategory))]
        : categories[activeCategory] || [];

    return (
        <div className="menu-page">
            {/* Header */}
            <div className="menu-header">
                <div className="container relative z-10">
                    <h1 className="md-text-6xl text-4xl boho-heading mb-4">Our Menu</h1>
                    <p className="text-xl opacity-90">Authentic flavors, crafted with soul.</p>
                </div>
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="container pb-20">
                <div className="menu-layout">
                    {/* Sidebar / Filters */}
                    <div className="menu-sidebar">
                        {/* Sidebar Card */}
                        <div className="sidebar-card">
                            <h3 className="sidebar-title">Categories</h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => { setActiveCategory('All'); setSubCategoryFilter('All'); }}
                                    className={`category-list-btn ${activeCategory === 'All' ? 'active' : ''}`}
                                >
                                    All Dishes
                                </button>
                                {Object.keys(categories).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => { setActiveCategory(cat); setSubCategoryFilter('All'); }}
                                        className={`category-list-btn ${activeCategory === cat ? 'active' : ''}`}
                                    >
                                        {cat} Cuisine
                                    </button>
                                ))}
                            </div>

                            {/* Sub Categories Dropdown */}
                            <div className="mt-10 pt-8 border-t border-gray-100">
                                <h4 className="sidebar-title">Filter By Type</h4>
                                <div className="filter-dropdown-container">
                                    <select
                                        value={subCategoryFilter}
                                        onChange={(e) => setSubCategoryFilter(e.target.value)}
                                        className="filter-dropdown"
                                    >
                                        <option value="All">All Types</option>
                                        {allSubCategories.map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                    <div className="dropdown-arrow">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Grid */}
                    <div className="menu-content">
                        <div className="grid grid-cols-1 md-grid-cols-2 gap-md" style={{ alignItems: 'stretch' }}>
                            {filteredItems.map((item) => (
                                <div key={item.id + '-updated'} className="h-full">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="menu-item-card flex flex-col"
                                        style={{ height: '100%' }}
                                    >
                                        <div style={{ height: '16rem', position: 'relative', flexShrink: 0 }}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '1rem',
                                                    left: '1rem',
                                                    zIndex: 20,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '9999px',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                    border: '2px solid #E07A5F',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <span style={{
                                                    color: '#E07A5F',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.125rem',
                                                    fontFamily: 'var(--font-body)'
                                                }}>
                                                    ₹{item.price}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-1" style={{ padding: '1.5rem' }}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-wide">{item.subCategory}</span>
                                                    <h3 className="text-2xl font-bold text-[var(--color-text)]">{item.name}</h3>
                                                </div>
                                            </div>
                                            <p style={{ color: '#4b5563', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>

                                            <div className="mt-auto pt-4">
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="add-to-cart-btn w-full"
                                                >
                                                    <Plus size={20} /> Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>

                        {filteredItems.length === 0 && (
                            <div className="text-center py-20" style={{ color: '#6b7280' }}>
                                <p className="text-2xl">No items found in this category.</p>
                                <button onClick={() => { setActiveCategory('All'); setSubCategoryFilter('All') }} className="mt-4 text-[var(--color-primary)] underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
