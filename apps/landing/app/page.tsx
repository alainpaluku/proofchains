'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/sections/HeroSection';
import { StatsSection } from '../components/sections/StatsSection';
import { VideoPresentationSection } from '../components/sections/VideoPresentationSection';
import { VideoDemoSection } from '../components/sections/VideoDemoSection';
import { ProblemSection } from '../components/sections/ProblemSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { StakeholdersSection } from '../components/sections/StakeholdersSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { TechStackSection } from '../components/sections/TechStackSection';
import { IssuersSection } from '../components/sections/IssuersSection';
import { FaqSection } from '../components/sections/FaqSection';
import DocumentationSection from '../components/DocumentationSection';
import { CtaSection } from '../components/sections/CtaSection';
import { Footer } from '../components/Footer';

export default function ProofchainsPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!mounted) return;
        const saved = localStorage.getItem('theme');
        if (saved) {
            setTheme(saved);
            document.documentElement.classList.toggle('dark', saved === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, [mounted]);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }, [theme]);

    useEffect(() => {
        const h = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
            <Navbar theme={theme} toggleTheme={toggleTheme} isScrolled={isScrolled} />
            
            <HeroSection />
            <StatsSection />
            <VideoPresentationSection />
            <VideoDemoSection />
            <ProblemSection />
            <FeaturesSection />
            <StakeholdersSection />
            <HowItWorksSection />
            <TechStackSection />
            <IssuersSection />
            <FaqSection />
            <DocumentationSection />
            <CtaSection />
            
            <Footer />
        </div>
    );
}
