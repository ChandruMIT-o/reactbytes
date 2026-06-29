"useclient";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

// Register CustomEase safely on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  try {
    CustomEase.create("slidingMenuEase", "0.65, 0.01, 0.05, 0.99");
  } catch (e) {
    console.warn("GSAP CustomEase registration failed, falling back to standard ease.", e);
  }
}

export interface MenuItem {
  label: string;
  href: string;
  eyebrow?: string;
}

export interface SlidingMenuProps {
  /** List of main menu links */
  menuItems?: MenuItem[];
  /** Primary color for first background panel */
  primaryColor?: string;
  /** Secondary color for second background panel */
  secondaryColor?: string;
  /** Neutral color for third background panel */
  neutralColor?: string;
  /** Accent color (eyebrows, hover text shadows, etc.) */
  accentColor?: string;
  /** Hover background block shade for menu links */
  hoverBgColor?: string;
  /** Text color */
  textColor?: string;
  /** Position fixed (fills viewport) vs absolute (scoped to parent container) */
  isFixed?: boolean;
  /** Controlled state for opening/closing the menu */
  isOpen?: boolean;
  /** Callback triggered when state toggles */
  onToggle?: (isOpen: boolean) => void;
  /** Custom additional styling class */
  className?: string;

  /* ── NEW AESTHETIC PROPS ── */
  /** Custom tailwind panel width layout (Container-relative responsive defaults provided) */
  panelWidth?: string;
  /** Panel corner radius styling */
  borderRadius?: string;
  /** Typography font size for menu links */
  linkFontSize?: string;
  /** Fallback or custom font family class name */
  fontFamily?: string;
  /** Menu open/close animation speed in seconds */
  duration?: number;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { label: "About us", href: "#", eyebrow: "01" },
  { label: "Our work", href: "#", eyebrow: "02" },
  { label: "Services", href: "#", eyebrow: "03" },
  { label: "Blog", href: "#", eyebrow: "04" },
  { label: "Contact us", href: "#", eyebrow: "05" },
];

const STYLES = `
@font-face {
  font-family: 'PP Neue Corp Tight';
  src: url('https://cdn.prod.website-files.com/673af51dea86ab95d124c3ee/673b0f5784f7060c0ac05534_PPNeueCorp-TightUltrabold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
`;

export const SlidingMenu: React.FC<SlidingMenuProps> = ({
  menuItems = DEFAULT_MENU_ITEMS,
  primaryColor = "#0055ff",
  secondaryColor = "#f2eee9",
  neutralColor = "#111111",
  accentColor = "#0055ff",
  hoverBgColor = "#222222",
  textColor = "#ffffff",
  isFixed = false,
  isOpen: controlledIsOpen,
  onToggle,
  className = "",

  // Dynamic Aesthetic Defaults
  panelWidth = "w-full [@container_(min-width:480px)]:w-[28em] [@container_(min-width:1024px)]:w-[35em]",
  borderRadius = "rounded-none [@container_(min-width:768px)]:rounded-l-2xl",
  linkFontSize = "text-[2.75em] [@container_(min-width:480px)]:text-[3.5em] [@container_(min-width:768px)]:text-[4.5em] [@container_(min-width:1025px)]:text-[5.625em]",
  fontFamily = "font-sans",
  duration = 0.7,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isMenuOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  const navWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const btnTextsRef = useRef<HTMLParagraphElement[]>([]);
  const btnIconRef = useRef<SVGSVGElement>(null);

  const addPanelRef = (el: HTMLDivElement | null) => {
    if (el && !panelsRef.current.includes(el)) {
      panelsRef.current.push(el);
    }
  };

  const addLinkRef = (el: HTMLAnchorElement | null) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(nextState);
    }
    if (onToggle) {
      onToggle(nextState);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        if (controlledIsOpen === undefined) {
          setInternalIsOpen(false);
        }
        if (onToggle) {
          onToggle(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, controlledIsOpen, onToggle]);

  useEffect(() => {
    panelsRef.current = [];
    linksRef.current = [];
  }, [menuItems]);

  useEffect(() => {
    const navWrap = navWrapRef.current;
    const menuPanel = menuPanelRef.current;
    const overlay = overlayRef.current;
    const bgPanels = panelsRef.current;
    const menuLinks = linksRef.current;
    const btnTexts = btnTextsRef.current;
    const btnIcon = btnIconRef.current;

    if (!navWrap || !menuPanel || !overlay) return;

    const ease = CustomEase.get("slidingMenuEase") || "power4.inOut";

    if (isMenuOpen) {
      gsap.killTweensOf([navWrap, menuPanel, overlay, bgPanels, menuLinks, btnTexts, btnIcon]);

      const tl = gsap.timeline({
        defaults: { ease, duration: duration }
      });

      tl.set(navWrap, { display: "block" })
        .set(menuPanel, { xPercent: 0 })
        .fromTo(btnTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.1, duration: duration * 0.7 }, 0)
        .fromTo(btnIcon, { rotate: 0 }, { rotate: 315, duration: duration * 0.7 }, 0)
        .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: duration * 0.7 }, 0)
        .fromTo(bgPanels,
          { xPercent: 101 },
          { xPercent: 0, stagger: 0.12, duration: duration * 0.82 },
          0
        )
        .fromTo(menuLinks,
          { yPercent: 140, rotate: 10 },
          { yPercent: 0, rotate: 0, stagger: 0.05, duration: duration },
          duration * 0.42
        );

    } else {
      gsap.killTweensOf([navWrap, menuPanel, overlay, bgPanels, menuLinks, btnTexts, btnIcon]);

      const tl = gsap.timeline({
        defaults: { ease, duration: duration * 0.7 }
      });

      tl.to(overlay, { autoAlpha: 0, duration: duration * 0.57 })
        .to(menuPanel, { xPercent: 120, duration: duration * 0.7 }, 0)
        .to(btnTexts, { yPercent: 0, duration: duration * 0.57 }, 0)
        .to(btnIcon, { rotate: 0, duration: duration * 0.57 }, 0)
        .set(navWrap, { display: "none" });
    }
  }, [isMenuOpen, duration]);

  const customStyles = {
    '--color-primary': primaryColor,
    '--color-neutral-100': secondaryColor,
    '--color-neutral-300': neutralColor,
    '--color-neutral-800': hoverBgColor,
    '--color-neutral-200': accentColor,
    '--color-dark': textColor,
  } as React.CSSProperties;

  return (
    <>
      <style>{STYLES}</style>

      {/* Main Container Wrapper - Marked for Contextual Container Queries */}
      <div
        ref={containerRef}
        className={`w-full relative h-full min-h-[50px] overflow-hidden [container-type:inline-size] ${fontFamily} ${className}`}
        style={customStyles}
      >

        {/* TOP BAR TRIGGER ROW */}
        <div className="z-50 pointer-events-none flex flex-col justify-between items-stretch w-full">
          <header className={`z-[110] pt-6 absolute inset-x-0 top-0 pointer-events-none ${isFixed ? 'fixed' : ''}`}>
            <div className="z-10 w-full mx-auto relative px-4 [@container_(min-width:480px)]:px-5 [@container_(min-width:768px)]:px-8 max-w-full">
              <nav className="justify-end items-center w-full flex pointer-events-auto">
                <div className="flex gap-[0.625rem] pointer-events-auto justify-end items-center">
                  <button
                    role="button"
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle menu"
                    onClick={handleToggle}
                    className="group flex gap-[0.625em] bg-transparent justify-end items-center -m-4 p-4 border-none cursor-pointer outline-none"
                    style={{ color: textColor }}
                  >
                    <div className="flex flex-col justify-start items-end h-[1.125em] overflow-hidden">
                      <p ref={el => { if (el) btnTextsRef.current[0] = el; }} className="m-0 text-[1.125em] leading-[1.125em] font-medium" style={{ color: textColor }}>Menu</p>
                      <p ref={el => { if (el) btnTextsRef.current[1] = el; }} className="m-0 text-[1.125em] leading-[1.125em] font-medium" style={{ color: textColor }}>Close</p>
                    </div>
                    <div className="flex items-center justify-center transition-transform duration-400 ease-[cubic-bezier(0.65,0.05,0,1)] group-hover:rotate-90">
                      <svg ref={btnIconRef} viewBox="0 0 16 16" fill="none" className="w-4 h-4" style={{ color: textColor }}>
                        <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>
                        <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>
                        <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor"></path>
                        <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor"></path>
                        <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor"></path>
                        <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor"></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </nav>
            </div>
          </header>
        </div>

        {/* DRAWER LAYER */}
        <div ref={navWrapRef} data-nav={isMenuOpen ? "open" : "closed"} className={`z-[100] w-full h-full absolute inset-0 hidden ${isFixed ? 'fixed h-screen' : ''}`}>
          <div ref={overlayRef} onClick={() => handleToggle()} className="z-0 cursor-pointer bg-black/40 w-full h-full absolute inset-0" />

          <nav
            ref={menuPanelRef}
            className={`pb-[2em] [@container_(min-width:480px)]:pb-[1.25em] [@container_(min-width:768px)]:pb-[2em] pt-[6em] [@container_(min-width:480px)]:pt-[6.25em] [@container_(min-width:768px)]:pt-[7em] flex flex-col justify-center items-start h-full ml-auto relative overflow-y-auto overflow-x-hidden ${panelWidth}`}
          >
            {/* Multi-layered sliding background panels */}
            <div className="z-0 absolute inset-0 w-full h-full">
              <div ref={addPanelRef} className={`z-0 bg-[var(--color-primary)] absolute inset-0 ${borderRadius}`} />
              <div ref={addPanelRef} className={`z-0 bg-[var(--color-neutral-100)] absolute inset-0 ${borderRadius}`} />
              <div ref={addPanelRef} className={`z-0 bg-[var(--color-neutral-300)] absolute inset-0 ${borderRadius}`} />
            </div>

            <div className="z-10 flex flex-col justify-start items-start w-full relative">
              <ul className="flex flex-col w-full m-0 p-0 list-none">
                {menuItems.map((item, idx) => (
                  <li key={idx} className="relative overflow-hidden w-full">
                    <a
                      ref={addLinkRef}
                      href={item.href}
                      className="group/link pt-[0.75em] pb-[0.75em] px-4 [@container_(min-width:480px)]:px-5 [@container_(min-width:768px)]:px-8 gap-[0.75em] w-full no-underline flex items-start relative"
                      style={{ color: textColor }}
                    >
                      {/* Typographic rolling effect header */}
                      <p
                        className={`z-10 uppercase font-['PP_Neue_Corp_Tight',_Arial,_sans-serif] font-bold leading-[0.75] transition-transform duration-[550ms] ease-[cubic-bezier(0.65,0.05,0,1)] relative [text-shadow:0_1em_0_var(--color-neutral-200)] group-hover/link:-translate-y-[1em] group-hover/link:delay-50 ${linkFontSize}`}
                        style={{ color: textColor, '--color-neutral-200': accentColor } as React.CSSProperties}
                      >
                        {item.label}
                      </p>
                      {item.eyebrow && (
                        <span className="z-10 text-[var(--color-primary)] uppercase font-mono font-normal text-sm [@container_(min-width:480px)]:text-[1rem] [@container_(min-width:768px)]:text-[1.25rem] relative mt-[0.15em]" style={{ color: accentColor }}>
                          {item.eyebrow}
                        </span>
                      )}

                      {/* Background block slide hover effect */}
                      <div className="z-0 bg-[var(--color-neutral-800)] origin-bottom transition-transform duration-[550ms] ease-[cubic-bezier(0.65,0.05,0,1)] absolute inset-0 scale-y-0 group-hover/link:scale-y-100 group-active/link:scale-y-100" style={{ backgroundColor: hoverBgColor }} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

      </div>
    </>
  );
};

export default SlidingMenu;