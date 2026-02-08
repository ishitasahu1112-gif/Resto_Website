import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';

const Hero = () => {
    return (
        <section className="hero-section">
            {/* Background Image with Overlay */}
            <div
                className="hero-bg"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="hero-overlay"></div>
            </div>

            {/* Content */}
            <div className="hero-content">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-subtitle boho-heading"
                >
                    Welcome to
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="hero-title boho-heading"
                >
                    The Jhopdi
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="hero-description"
                >
                    Where good vibes meet great food. Experience the soul of boho living.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                >
                    <Link
                        to="/menu"
                        className="btn btn-outline"
                        style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-block' }}
                    >
                        Explore Menu
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Elements (Optional) */}
            <div className="absolute bottom-10 w-full flex justify-center z-10 animate-bounce">
                <span className="text-white text-3xl">↓</span>
            </div>
        </section>
    );
};

export default Hero;
