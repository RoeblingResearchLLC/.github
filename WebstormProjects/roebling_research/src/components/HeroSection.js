// components/HeroSection.js
import { motion } from 'framer-motion';
import { useState } from 'react';
import Geometries from './GeometricHero';
import GeometricHero from "./GeometricHero";

const HeroSection = () => {
    return (
        <div className="flex justify-between items-center h-screen bg-black text-white p-8">
            {/* Left Side: Text */}
            <motion.div
                className="text-4xl font-bold"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            >
                Roebling Research
            </motion.div>

            {/* Right Side: Geometric Shape */}
            <motion.div
                className="w-32 h-32 bg-blue-600"
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 5,
                    ease: "linear",
                }}
            />
            <GeometricHero />
        </div>
    );
};

export default HeroSection;
