'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
    GraduationCap, Search, Shield, Globe, Lock, Zap, ArrowRight, Github, 
    ExternalLink, Menu, X, AlertTriangle, Briefcase, 
    Building2, Sun, Moon, CheckCircle, Users,
    FileCheck, Sparkles, Play, BookOpen, School, ChevronLeft, ChevronRight
} from 'lucide-react';

// ============================================================================
// LOGO COMPONENT
// ============================================================================
function ProofchainsLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 1011 1116" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <g transform="translate(0, 1116) scale(0.1, -0.1)" fill="currentColor">
                <path d="M5025 9730 c-201 -13 -349 -153 -411 -389 -42 -157 11 -316 145 -444 121 -115 246 -165 386 -154 78 6 157 33 223 78 23 16 47 29 51 29 19 0 126 128 150 179 24 52 26 65 25 191 -1 164 -15 220 -83 322 -104 156 -229 204 -486 188z"/>
                <path d="M5808 9102 c-18 -3 -34 -51 -21 -62 4 -4 42 -15 83 -24 96 -23 172 -40 285 -66 97 -23 173 -47 190 -59 5 -5 19 -11 30 -14 121 -34 689 -313 752 -369 10 -9 37 -26 61 -38 41 -22 44 -22 62 -5 11 10 20 23 19 29 0 18 -244 173 -389 249 -296 155 -969 381 -1072 359z"/>
                <path d="M4270 9079 c-47 -10 -155 -40 -240 -65 -137 -42 -183 -58 -305 -109 -16 -7 -57 -22 -90 -33 -87 -30 -279 -117 -344 -156 -31 -19 -78 -46 -106 -61 -66 -36 -211 -133 -226 -151 -9 -11 -8 -20 6 -40 20 -31 22 -30 122 38 86 57 198 119 373 204 99 48 149 72 265 124 11 5 49 19 85 30 36 12 74 25 85 30 64 29 113 43 282 85 103 26 196 49 206 51 31 9 15 76 -17 73 -6 -1 -49 -10 -96 -20z"/>
                <path d="M2201 8581 c-221 -83 -366 -302 -347 -526 5 -71 32 -171 53 -196 6 -8 23 -32 37 -54 65 -97 161 -171 259 -199 80 -23 255 -24 320 -2 131 45 214 123 289 271 l50 100 -4 115 c-3 114 -4 116 -49 210 -47 95 -119 194 -151 205 -9 3 -32 17 -52 30 -53 36 -127 54 -245 60 -90 5 -114 3 -160 -14z"/>
                <path d="M7770 8594 c-14 -3 -39 -12 -57 -20 -17 -8 -33 -14 -36 -14 -21 0 -136 -82 -176 -126 -85 -93 -119 -182 -128 -331 -5 -90 -3 -110 17 -170 54 -159 183 -293 316 -327 122 -31 307 -16 405 34 20 11 72 57 116 105 172 183 202 346 104 558 -66 144 -172 246 -287 276 -45 12 -234 22 -274 15z"/>
                <path d="M3558 7581 c-76 -36 -102 -73 -118 -177 -8 -47 -11 -651 -11 -1978 0 -1833 4 -2327 21 -2371 14 -36 61 -85 104 -108 l41 -22 1573 -3 1573 -2 54 26 c39 18 64 39 88 72 l32 47 3 1697 2 1698 -22 5 c-13 3 -189 4 -393 3 l-370 -3 -80 39 c-94 47 -189 135 -223 209 -30 64 -33 108 -35 527 l-2 355 -1100 2 c-1027 1 -1102 0 -1137 -16z m2545 -1910 c23 -16 75 -63 115 -105 64 -68 72 -80 72 -115 0 -37 -9 -49 -107 -157 -114 -123 -142 -155 -335 -377 -66 -76 -126 -143 -132 -150 -15 -14 -256 -287 -364 -410 -42 -49 -92 -105 -111 -125 -18 -21 -50 -59 -71 -87 -20 -27 -76 -89 -123 -137 -81 -84 -87 -88 -129 -88 -39 0 -52 7 -109 54 -74 62 -182 168 -476 467 -259 263 -253 247 -140 366 39 42 83 88 97 101 36 35 86 54 123 46 31 -7 131 -101 360 -341 59 -62 113 -113 120 -113 7 0 29 21 49 48 77 98 106 132 223 266 66 75 137 158 158 184 22 26 69 79 106 117 65 67 249 270 350 385 26 30 56 68 67 84 10 16 45 49 77 73 74 54 118 57 180 14z"/>
                <path d="M4980 1901 c-107 -23 -244 -126 -299 -223 -81 -143 -101 -280 -60 -414 51 -166 136 -265 289 -337 61 -29 73 -31 185 -31 138 -1 179 11 285 80 105 69 194 188 218 292 16 70 15 160 -1 247 -29 152 -178 317 -332 369 -56 18 -231 29 -285 17z"/>
            </g>
        </svg>
    );
}

// ============================================================================
// ANIMATED COUNTER COMPONENT
// ============================================================================
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ============================================================================
// THEME TOGGLE COMPONENT
// ============================================================================
function ThemeToggle({ theme, toggleTheme, isScrolled }: { theme: string; toggleTheme: () => void; isScrolled: boolean }) {
    return (
        <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
                isScrolled 
                    ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700' 
                    : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}

// ============================================================================
// DATA - Contenu pertinent pour Proofchains
// ============================================================================

// Images carousel - Crise de l'éducation en RDC
const crisisImages = [
    { url: 'https://www.hrw.org/sites/default/files/styles/16x9_large/public/multimedia_images_2015/drcschools1015_reportcovermainr.jpg?itok=5AeXxSrb', caption: 'Écoles attaquées en RDC - Human Rights Watch' },
    { url: 'https://img.msf.org/AssetLink/6438mu458es74ym450tt22n4wni2647m.jpg', caption: 'Impact du conflit sur l\'éducation - MSF' },
];

// Statistiques du projet (réalistes pour un MVP/Hackathon)
const stats = [
    { value: 100, suffix: '%', label: 'Infalsifiable' },
    { value: 3, suffix: 's', label: 'Vérification' },
    { value: 0, suffix: '', label: 'Intermédiaire' },
    { value: 24, suffix: '/7', label: 'Disponible' },
];

// Fonctionnalités clés
const features = [
    { icon: Shield, title: 'Immuable', description: 'Une fois inscrit sur Cardano, le diplôme ne peut plus être modifié ni supprimé. La preuve existe pour toujours.', color: 'from-purple-500 to-indigo-600' },
    { icon: Globe, title: 'Universel', description: 'Accessible partout dans le monde sans intermédiaire. Un simple lien ou QR code suffit pour vérifier.', color: 'from-blue-500 to-cyan-600' },
    { icon: Lock, title: 'Unique', description: 'Chaque diplôme est un NFT unique avec son propre identifiant. Impossible à dupliquer ou falsifier.', color: 'from-green-500 to-emerald-600' },
    { icon: Zap, title: 'Instantané', description: 'Vérification en temps réel directement sur la blockchain. Plus besoin d\'attendre des jours ou semaines.', color: 'from-orange-500 to-red-600' },
];

// Pour qui est la solution
const valueProps = [
    { icon: GraduationCap, title: 'Diplômés', description: 'Partagez une preuve irréfutable de vos qualifications. Un lien unique que vous pouvez envoyer à n\'importe quel employeur.', benefits: ['Preuve permanente', 'Partage facile', 'Reconnaissance internationale'] },
    { icon: Briefcase, title: 'Employeurs', description: 'Vérifiez instantanément l\'authenticité des diplômes de vos candidats. Gratuit et sans inscription.', benefits: ['Vérification gratuite', 'Résultat immédiat', 'Zéro paperasse'] },
    { icon: Building2, title: 'Institutions', description: 'Universités, écoles et centres de formation : émettez des diplômes numériques certifiés sur la blockchain.', benefits: ['Processus simple', 'Coût réduit', 'Image moderne'] },
];

// Types d'institutions pouvant émettre
const institutionTypes = [
    { icon: School, name: 'Universités', description: 'Licences, Masters, Doctorats' },
    { icon: GraduationCap, name: 'Écoles supérieures', description: 'Diplômes d\'ingénieur, commerce' },
    { icon: BookOpen, name: 'Centres de formation', description: 'Certificats professionnels' },
    { icon: Building2, name: 'Instituts techniques', description: 'Brevets et qualifications' },
];

// Stack technique
const techStack = [
    { name: 'Cardano', description: 'Blockchain proof-of-stake' },
    { name: 'IPFS', description: 'Stockage décentralisé' },
    { name: 'Lucid', description: 'SDK Cardano' },
    { name: 'Blockfrost', description: 'API Blockchain' },
];

// FAQ - Questions fréquentes
const faqs = [
    { 
        question: 'Qu\'est-ce que Proofchains ?', 
        answer: 'Proofchains est une solution basée sur la blockchain Cardano, dont le principal objectif est de lutter contre la falsification des documents scolaires et académiques.' 
    },
    { 
        question: 'À quels défis répondez-vous ?', 
        answer: 'Proofchains répond au défi de la numérisation des documents scolaires et académiques afin de prévenir la perte et la falsification des supports physiques.' 
    },
    { 
        question: 'Pourquoi la blockchain Cardano ?', 
        answer: 'Nous avons choisi la blockchain Cardano car c\'est l\'une des plus décentralisées au monde. Grâce à elle, nous enregistrons chaque document comme un actif numérique unique (NFT) sur un registre immuable et infalsifiable.' 
    },
    { 
        question: 'Quelle est la valeur ajoutée pour l\'utilisateur ?', 
        answer: 'Pour l\'étudiant : une garantie de sécurité et d\'accès à ses documents, même en cas de perte physique. Pour l\'employeur : la possibilité de vérifier rapidement et avec certitude l\'authenticité d\'un document.' 
    },
    { 
        question: 'Quel est l\'impact local de votre solution ?', 
        answer: 'Actuellement, l\'est de la RDC fait face à une situation sécuritaire complexe. Les déplacements massifs de populations qu\'elle entraîne causent souvent la perte définitive des documents scolaires, rendant toute vérification ultérieure impossible. Grâce à Proofchains, ces deux problèmes sont résolus : les documents sont sécurisés à vie et accessibles partout.' 
    },
];

const navLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Fonctionnalités', href: '#features' }, 
    { name: 'Pour qui ?', href: '#pourqui' },
    { name: 'FAQ', href: '#faq' }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ProofchainsPage() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState('light');
    const [isSearching, setIsSearching] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => { setMounted(true); }, []);

    // Auto carousel pour les images
    useEffect(() => {
        const t = setInterval(() => setCurrentSlide((p) => (p + 1) % crisisImages.length), 5000);
        return () => clearInterval(t);
    }, []);



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

    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 1024) setIsMenuOpen(false); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsSearching(true);
        // Petit délai pour l'animation
        await new Promise(r => setTimeout(r, 300));
        router.push(`/verify/${encodeURIComponent(query.trim())}`);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
            {/* ================================================================ */}
            {/* NAVIGATION */}
            {/* ================================================================ */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled 
                    ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg shadow-gray-200/20 dark:shadow-black/20' 
                    : 'bg-transparent'
            }`}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <a href="#accueil" className="flex items-center gap-3 group">
                            <div className={`p-2 rounded-xl transition-all duration-300 ${isScrolled ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-white/10'}`}>
                                <ProofchainsLogo size={28} className={`transition-colors duration-300 ${isScrolled ? 'text-purple-600 dark:text-purple-400' : 'text-cyan-400'}`} />
                            </div>
                            <span className={`text-lg lg:text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                                PROOF<span className="text-cyan-400">CHAINS</span>
                            </span>
                        </a>

                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((l) => (
                                <a key={l.name} href={l.href} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    isScrolled 
                                        ? 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20' 
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}>
                                    {l.name}
                                </a>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-3">
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} isScrolled={isScrolled} />
                            <a href="#verify" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105">
                                <Search className="w-4 h-4" /> Vérifier
                            </a>
                        </div>

                        <div className="flex lg:hidden items-center gap-2">
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} isScrolled={isScrolled} />
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2.5 rounded-xl transition-all duration-300 ${isScrolled ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'}`}>
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`lg:hidden transition-all duration-500 ease-out ${isMenuOpen ? 'max-h-[400px] opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 space-y-1">
                            {navLinks.map((l) => (
                                <a key={l.name} href={l.href} onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors font-medium">
                                    {l.name}
                                </a>
                            ))}
                            <a href="#verify" onClick={() => setIsMenuOpen(false)} className="mt-3 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                                <Search className="w-4 h-4" /> Vérifier un diplôme
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ================================================================ */}
            {/* HERO SECTION */}
            {/* ================================================================ */}
            <header id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />
                
                {/* Animated orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                
                <div className="relative container mx-auto px-4 lg:px-8 py-32">
                    <div className="text-center max-w-5xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8 border border-white/20">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span>Projet Hackathon</span>
                            <span className="w-1 h-1 bg-white/50 rounded-full" />
                            <a href="https://cats.wada.org/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-cyan-400 transition-colors flex items-center gap-1">
                                Cardano Africa Summit <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>

                        {/* Logo animé */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl animate-pulse" />
                                <ProofchainsLogo size={100} className="text-cyan-400 relative animate-float" />
                            </div>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 tracking-tight">
                            PROOF<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">CHAINS</span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-purple-100 mb-4 font-light">
                            Diplômes numériques <span className="font-semibold text-white">infalsifiables</span> sur Cardano
                        </p>

                        <p className="text-base lg:text-lg text-purple-200/70 mb-10 max-w-2xl mx-auto">
                            Émettez des diplômes sous forme de NFT sur la blockchain Cardano. 
                            Vérifiables instantanément par n'importe qui, n'importe où.
                        </p>

                        {/* Search Form */}
                        <div id="verify" className="max-w-2xl mx-auto mb-12">
                            <form onSubmit={handleVerify} className="relative">
                                <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                        <input 
                                            type="text" 
                                            value={query} 
                                            onChange={(e) => setQuery(e.target.value)} 
                                            placeholder="ID du diplôme ou Asset ID blockchain..."
                                            className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/50 focus:outline-none text-lg"
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={!query.trim() || isSearching}
                                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 min-w-[160px]"
                                    >
                                        {isSearching ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <FileCheck className="w-5 h-5" />
                                                <span>Vérifier</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-sm text-purple-200/60 mt-3">
                                    Ex: CD-UG-LICH-20240615-A1B2C3D4 ou asset1abc123...
                                </p>
                            </form>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#features" className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 border border-white/20">
                                <Play className="w-5 h-5" />
                                Découvrir
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="https://github.com/alainpaluku/proofchains" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-gray-900/50 hover:bg-gray-900/70 backdrop-blur-sm text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 border border-white/10">
                                <Github className="w-5 h-5" /> Code Source
                            </a>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </header>

            {/* ================================================================ */}
            {/* STATS SECTION */}
            {/* ================================================================ */}
            <section className="py-16 bg-gradient-to-b from-indigo-900 to-purple-900 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl lg:text-5xl font-black text-white mb-2">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-purple-200/70 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================ */}
            {/* PROBLEM SECTION */}
            {/* ================================================================ */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium mb-6">
                                <AlertTriangle className="w-4 h-4" />
                                Le problème
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                                Un contexte qui exige des solutions durables
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
                                En RD Congo, particulièrement à l'Est du pays, la situation sécuritaire complexe a des conséquences 
                                dramatiques sur l'éducation. Des écoles sont détruites, des archives brûlées, et les déplacements 
                                massifs de populations causent la perte définitive des documents scolaires. Comment prouver ses 
                                qualifications quand tout a disparu ?
                            </p>
                        </div>

                        {/* Crisis Carousel */}
                        <div className="relative max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-xl">
                            <div className="relative aspect-video">
                                {crisisImages.map((img, i) => (
                                    <div 
                                        key={i}
                                        className={`absolute inset-0 transition-opacity duration-500 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                                <AlertTriangle className="w-5 h-5" />
                                                <span className="font-medium">Crise de l'éducation</span>
                                            </div>
                                            <p className="text-white">{img.caption}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => setCurrentSlide((p) => (p - 1 + crisisImages.length) % crisisImages.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={() => setCurrentSlide((p) => (p + 1) % crisisImages.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            {/* Dots indicator */}
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                {crisisImages.map((_, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Consequences */}
                        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-8 border border-red-100 dark:border-red-900/30">
                            <h3 className="text-xl font-bold mb-6 text-center">Les défis à relever</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { title: 'Écoles détruites', desc: 'Les conflits détruisent les établissements et leurs archives, effaçant toute trace des parcours scolaires' },
                                    { title: 'Documents perdus', desc: 'Les déplacements forcés de population causent la perte définitive des diplômes physiques' },
                                    { title: 'Falsification', desc: 'Sans système de vérification fiable, les faux diplômes circulent facilement' },
                                    { title: 'Reconstruction impossible', desc: 'Quand l\'école n\'existe plus, obtenir un duplicata devient impossible' }
                                ].map((item, i) => (
                                    <div key={i} className="text-center">
                                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <X className="w-5 h-5 text-red-500" />
                                        </div>
                                        <h4 className="font-semibold mb-2">{item.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================================ */}
            {/* SOLUTION / FEATURES SECTION */}
            {/* ================================================================ */}
            <section id="features" className="py-24 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium mb-6">
                            <CheckCircle className="w-4 h-4" />
                            La solution
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                            Comment Proofchains résout ce problème
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                            Chaque diplôme devient un NFT unique sur Cardano, avec une preuve cryptographique impossible à falsifier.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="group relative bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800">
                                <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <f.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================ */}
            {/* VALUE PROPS SECTION */}
            {/* ================================================================ */}
            <section id="pourqui" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium mb-6">
                            <Users className="w-4 h-4" />
                            Pour qui ?
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                            Une solution pour tous les acteurs
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                            Proofchains s'adresse à l'ensemble de l'écosystème éducatif et professionnel.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {valueProps.map((v, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
                                    <v.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{v.description}</p>
                                <ul className="space-y-3">
                                    {v.benefits.map((b, j) => (
                                        <li key={j} className="flex items-center gap-3">
                                            <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================ */}
            {/* HOW IT WORKS SECTION */}
            {/* ================================================================ */}
            <section className="py-24 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6">
                            <BookOpen className="w-4 h-4" />
                            Comment ça marche ?
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                            Simple comme 1, 2, 3
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Line connector */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 hidden md:block" />
                            
                            {[
                                { step: '01', title: 'Émission', description: 'L\'institution émet le diplôme sur la blockchain Cardano via notre plateforme Issuer. Un NFT unique est créé.', icon: Building2, color: 'purple' },
                                { step: '02', title: 'Stockage', description: 'Le document est stocké de manière décentralisée sur IPFS. Les métadonnées sont inscrites dans la blockchain.', icon: Shield, color: 'blue' },
                                { step: '03', title: 'Vérification', description: 'N\'importe qui peut vérifier l\'authenticité du diplôme en quelques secondes via notre interface publique.', icon: CheckCircle, color: 'green' },
                            ].map((item, i) => (
                                <div key={i} className="relative flex gap-8 mb-12 last:mb-0">
                                    <div className={`w-16 h-16 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 border-4 border-white dark:border-gray-950`}>
                                        <item.icon className={`w-8 h-8 text-${item.color}-600 dark:text-${item.color}-400`} />
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-1">ÉTAPE {item.step}</div>
                                        <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================================ */}
            {/* TECH STACK SECTION */}
            {/* ================================================================ */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">Technologies utilisées</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Construit avec les meilleures technologies pour garantir performance, sécurité et scalabilité.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {techStack.map((tech, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold text-lg">{tech.name[0]}</span>
                                </div>
                                <h3 className="font-bold mb-1">{tech.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{tech.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================ */}
            {/* EMETTEURS SECTION - Institutions éducatives uniquement */}
            {/* ================================================================ */}
            <section id="emetteurs" className="py-24 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium mb-6">
                            <School className="w-4 h-4" />
                            Plateforme d'émission
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                            Réservé aux institutions éducatives
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
                            L'émission de diplômes sur Proofchains est exclusivement réservée aux établissements d'enseignement accrédités : 
                            universités, écoles, centres de formation et instituts techniques.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {institutionTypes.map((inst, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <inst.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{inst.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{inst.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-8 lg:p-12 text-center border border-indigo-100 dark:border-indigo-800">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4">Vous êtes une institution éducative ?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Accédez à notre plateforme Issuer pour émettre des diplômes certifiés sur la blockchain Cardano. 
                            Processus simple, sécurisé et instantané.
                        </p>
                        <a 
                            href="/issuer" 
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                        >
                            <Building2 className="w-5 h-5" />
                            Accéder à la plateforme Issuer
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* ================================================================ */}
            {/* FAQ SECTION */}
            {/* ================================================================ */}
            <section id="faq" className="py-24 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium mb-6">
                                <BookOpen className="w-4 h-4" />
                                Questions fréquentes
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                                Tout savoir sur Proofchains
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                                        <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400 text-sm font-bold">
                                            {i + 1}
                                        </span>
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================================ */}
            {/* CTA SECTION */}
            {/* ================================================================ */}
            <section className="py-24 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
                
                <div className="relative container mx-auto px-4 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                        Vérifiez un diplôme maintenant
                    </h2>
                    <p className="text-purple-200 text-lg mb-10 max-w-2xl mx-auto">
                        La vérification est gratuite et accessible à tous. Entrez l'identifiant du diplôme pour vérifier son authenticité.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#verify" className="px-8 py-4 bg-white text-purple-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl flex items-center justify-center gap-2">
                            <Search className="w-5 h-5" />
                            Vérifier un diplôme
                        </a>
                        <a href="https://github.com/alainpaluku/proofchains" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center gap-2">
                            <Github className="w-5 h-5" />
                            Code source
                        </a>
                    </div>
                </div>
            </section>

            {/* ================================================================ */}
            {/* FOOTER */}
            {/* ================================================================ */}
            <footer className="py-12 bg-gray-900 dark:bg-black text-white border-t border-gray-800">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-900/50 rounded-xl">
                                <ProofchainsLogo size={24} className="text-cyan-400" />
                            </div>
                            <span className="font-bold text-lg">PROOF<span className="text-cyan-400">CHAINS</span></span>
                        </div>
                        
                        <p className="text-gray-400 text-sm text-center">
                            © 2024 Proofchains. Projet open-source pour le Cardano Africa Summit.
                        </p>
                        
                        <a href="https://github.com/alainpaluku/proofchains" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                            <span className="text-sm">GitHub</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
