import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

// --- CUSTOM HOOK TO LOAD ANIME.JS ---
const useAnimeJS = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if ((window as any).anime) {
      setIsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return isLoaded;
};

// --- NAVIGATION DATA ---
const NAV_LINKS = [
  { title: 'HOME', href: '#home' },
  { title: 'WORK', href: '#work' },
  { title: 'SERVICES', href: '#services' },
  { title: 'ABOUT', href: '#about' },
  { title: 'CONTACT', href: '#contact' },
];

// --- NOVEL MENU COMPONENT ---
export default function NovelMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const animeLoaded = useAnimeJS();

  const toggleMenu = () => {
    if (!animeLoaded) return;
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-[#1D1C21] text-[#F2EEE9] font-sans overflow-hidden selection:bg-[#C0DEDD] selection:text-[#000000]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 mix-blend-difference">
        <div className="text-2xl font-bold tracking-widest text-[#F2EEE9] relative z-50 cursor-pointer hover:text-[#C0DEDD] transition-colors duration-300">
          NOVEL<span className="text-[#C0DEDD]">.</span>
        </div>
        <button
          onClick={toggleMenu}
          className="relative z-50 w-12 h-12 rounded-full bg-[#181A1E] border border-[#799996]/30 flex items-center justify-center hover:bg-[#C0DEDD] hover:text-[#060010] hover:border-transparent transition-all duration-300 text-[#F2EEE9]"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* FULL SCREEN OVERLAY MENU */}
      <NavigationPanel isOpen={isOpen} animeLoaded={animeLoaded} onClose={() => setIsOpen(false)} />
    </div>
  );
}

// --- NOVEL NAVIGATION PANEL ---
interface NavigationPanelProps {
  isOpen: boolean;
  animeLoaded: boolean;
  onClose: () => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ isOpen, animeLoaded, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const isFirstRender = useRef(true);

  // Animation Logic
  useEffect(() => {
    if (!animeLoaded || !overlayRef.current) return;
    const anime = (window as any).anime;

    if (isOpen) {
      // PREPARE FOR OPEN
      overlayRef.current.style.pointerEvents = 'auto';
      
      const tl = anime.timeline({
        easing: 'easeInOutQuart',
      });

      // 1. Staggered Columns Reveal
      tl.add({
        targets: columnsRef.current,
        scaleY: [0, 1],
        duration: 800,
        delay: anime.stagger(80),
      })
      // 2. Navigation Links Fade Up
      .add({
        targets: linksRef.current,
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
        delay: anime.stagger(80),
      }, '-=400');

    } else if (!isFirstRender.current) {
      // CLOSE ANIMATION
      const tl = anime.timeline({
        easing: 'easeInOutQuart',
      });

      // 1. Elements Fade Down
      tl.add({
        targets: linksRef.current,
        translateY: [0, 20],
        opacity: [1, 0],
        duration: 400,
        easing: 'easeInExpo',
      })
      // 2. Columns Slide Away
      .add({
        targets: columnsRef.current,
        scaleY: [1, 0],
        duration: 800,
        delay: anime.stagger(80, { direction: 'reverse' }),
        complete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.pointerEvents = 'none';
          }
        }
      }, '-=200');
    }

    isFirstRender.current = false;
  }, [isOpen, animeLoaded]);

  // Hover animation for individual links
  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, isEnter: boolean) => {
    if (!animeLoaded) return;
    const anime = (window as any).anime;
    
    // Nudge text slightly and shift color
    anime({
      targets: e.currentTarget,
      translateX: isEnter ? 24 : 0,
      color: isEnter ? '#E6DFF1' : '#F2EEE9',
      duration: 500,
      easing: 'easeOutElastic(1, .6)',
    });
  };

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-40 pointer-events-none flex flex-col"
    >
      {/* 5 Staggered Columns Background */}
      <div className="absolute inset-0 flex w-full h-full">
        {[...Array(5)].map((_, i) => (
          <div 
            key={`col-${i}`}
            ref={el => { columnsRef.current[i] = el; }}
            className="flex-1 h-full bg-[#060010] origin-top transform scale-y-0 border-r border-[#1D1C21]/20 last:border-r-0"
          />
        ))}
      </div>

      {/* Menu Content Overlay */}
      <div className="relative z-50 w-full h-full flex flex-col justify-center px-8 md:px-20 pt-24 pb-12 overflow-y-auto">
        
        <div className="flex flex-col lg:flex-row justify-center items-center w-full max-w-7xl mx-auto h-full mt-4 lg:mt-12">
          
          {/* Main Navigation Links */}
          <nav className="flex flex-col justify-center items-center gap-2 lg:gap-6 flex-grow mb-12 lg:mb-0">
            {NAV_LINKS.map((link, i) => (
              <div key={link.title} className="py-1 lg:py-2">
                <a
                  href={link.href}
                  ref={el => { linksRef.current[i] = el; }}
                  onClick={onClose}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                  className="inline-block text-5xl md:text-7xl lg:text-8xl font-bold leading-normal text-center text-[#F2EEE9] opacity-0 transform translate-y-10 origin-center"
                >
                  {link.title}
                </a>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}