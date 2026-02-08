import React from 'react';
import { motion } from 'framer-motion';
import { menuData } from '../data/menuData';

// Select 3 highlights: Paneer Tikka, Special Burger, Veg Hakka Noodles
const highlightIds = ['tikka-1', 'ff-1', 'noodle-1'];
const menuItems = menuData.filter(item => highlightIds.includes(item.id)).map(item => ({
    id: item.id,
    title: item.name,
    desc: item.description,
    price: `₹${item.price}`,
    img: item.image
}));

const MenuHighlights = () => {
    return (
        <section id="menu" className="section-padding menu-section">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="md-text-6xl text-4xl boho-heading mb-4 text-[var(--color-primary)]">
                        Curated Flavors
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: '#4b5563' }}>
                        Seasonally inspired, locally sourced, and made with love.
                    </p>
                </div>

                <div className="menu-grid">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="menu-card"
                        >
                            <div className="menu-image-container">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="menu-image"
                                />

                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-[var(--color-text)]">{item.title}</h3>
                            <p style={{ color: '#4b5563' }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenuHighlights;
