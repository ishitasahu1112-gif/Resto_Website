import React from 'react';
import { motion } from 'framer-motion';
import aboutImg from '../assets/about-img.png';

const About = () => {
    return (
        <section id="about" className="section-padding about-section mt-[12%]">
            <div className="container">
                <div className="flex flex-col md-flex-row items-center gap-lg">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                        style={{ width: '100%', flex: 1 }}
                    >
                        <div className="about-image-container">
                            <div className="about-frame"></div>
                            <img
                                src={aboutImg}
                                alt="Rustic Table Setting"
                                className="about-image"
                            />
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                        style={{ width: '100%', flex: 1 }}
                    >
                        <h2 className="md-text-6xl text-4xl boho-heading mb-6 text-[var(--color-text)]">
                            The Soul of <span className="text-[var(--color-primary)]">Boho</span>
                        </h2>
                        <p className="text-lg mb-6" style={{ color: '#4b5563' }}>
                            The Jhopdi isn't just a place to eat; it's a sanctuary for the free-spirited. Born from a love for earthy flavors and artistic expression, we bring you a dining experience that feels like home.
                        </p>
                        <p className="text-lg mb-8" style={{ color: '#4b5563' }}>
                            Our ingredients are locally sourced, our recipes are inspired by global wanderlust, and our vibe is undeniably chill. Come sit with us, share a story, and nourish your soul.
                        </p>
                        <button className="btn" style={{ color: 'var(--color-primary)', textDecoration: 'underline', padding: 0 }}>
                            Read Our Full Story &rarr;
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
