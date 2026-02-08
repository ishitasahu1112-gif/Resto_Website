import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const offers = [
    {
        id: 1,
        text: "Free Delivery on your first adventure",
        code: "FIRSTBITE",
    },
    {
        id: 2,
        text: "20% Off Full Course Meals",
        code: "FEAST20",
    },
    {
        id: 3,
        text: "BOGO on Beverages",
        code: "REFRESH",
    }
];

const PromoCard = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [copied, setCopied] = useState(false);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % offers.length);
        setCopied(false);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1));
        setCopied(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(offers[currentIndex].code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        })
    };

    return (
        /* Section now has no horizontal padding to allow the banner to touch edges */
        <section className="w-full py-8 md:py-12 bg-bg">
            <div
                className="relative w-full h-32 md:h-40 border-y-2 border-primary flex items-center justify-between px-6 md:px-12 shadow-inner overflow-hidden"
                style={{
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-primary)',
                    backgroundImage: `linear-gradient(rgba(244, 241, 222, 0.8), rgba(244, 241, 222, 0.8)), url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=2000')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.1\'/%3E%3C/svg%3E")' }}></div>

                {/* Left Navigation */}
                <button
                    onClick={prevSlide}
                    className="z-20 group relative p-4 flex items-center justify-center transition-all duration-300 active:scale-90 hidden sm:flex"
                    aria-label="Previous slide"
                >
                    {/* The "Outer Glow/Ring" that appears on hover */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-125 transition-transform duration-500 blur-xl" style={{ backgroundColor: 'rgba(224, 122, 95, 0.2)' }} />

                    {/* The Main Button Body */}
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full 
                  bg-white/40 backdrop-blur-md border border-white/60 
                  text-text transition-all duration-300
                  group-hover:bg-primary group-hover:text-white group-hover:border-primary
                  group-hover:shadow-lg"
                        style={{ color: 'var(--color-text)' }}
                    >
                        <ChevronLeft
                            size={26}
                            strokeWidth={2.5}
                            className="transition-transform duration-300 group-hover:-translate-x-0.5"
                        />
                    </div>
                </button>

                {/* Content - Responsive Centering */}
                <div className="flex-1 relative h-full flex items-center justify-center z-10 max-w-7xl mx-auto">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-12"
                        >
                            <h2 className="boho-heading text-xl md:text-3xl text-text font-bold tracking-tight text-center lg:text-left" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)' }}>
                                {offers[currentIndex].text}
                            </h2>

                            <div
                                className="group flex items-center bg-white rounded-xl shadow-lg border-2 border-primary cursor-pointer overflow-hidden transition-all hover:shadow-primary/20 active:scale-95"
                                style={{ borderColor: 'var(--color-primary)' }}
                                onClick={copyToClipboard}
                            >
                                <span className="bg-primary/10 px-4 py-2 text-[10px] md:text-xs font-black uppercase text-primary tracking-tighter border-r-2 border-primary/10" style={{ backgroundColor: 'rgba(224, 122, 95, 0.1)', color: 'var(--color-primary)', borderColor: 'rgba(224, 122, 95, 0.1)' }}>Promo</span>
                                <span className="px-5 py-2 font-mono text-lg md:text-xl font-bold text-text" style={{ color: 'var(--color-text)' }}>{offers[currentIndex].code}</span>
                                <div className={`px-5 py-2 flex items-center justify-center transition-all`}
                                    style={{ backgroundColor: copied ? 'var(--color-secondary)' : 'var(--color-primary)' }}
                                >
                                    {copied ? <Check size={20} className="text-white" strokeWidth={3} /> : <span className="text-xs font-bold text-white uppercase tracking-widest">Copy</span>}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Navigation */}
                <button
                    onClick={nextSlide}
                    className="z-20 p-3 bg-white/80 hover:bg-white rounded-full shadow-md transition-all active:scale-90 hidden sm:block"
                    style={{ color: 'var(--color-primary)' }}
                >
                    <ChevronRight size={28} strokeWidth={2.5} />
                </button>

                {/* Adaptive Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 w-full" style={{ backgroundColor: 'rgba(224, 122, 95, 0.1)' }}>
                    <motion.div
                        className="h-full"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentIndex + 1) / offers.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>
        </section>
    );
};

export default PromoCard;