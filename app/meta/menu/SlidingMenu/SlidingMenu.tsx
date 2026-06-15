"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import './SlidingMenu.css';

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

export interface SocialLink {
  label: string;
  href: string;
}

export interface SlidingMenuProps {
  /** Logo text or branding title */
  logoText?: string;
  /** Logo link destination */
  logoHref?: string;
  /** Optional custom logo icon element */
  logoIcon?: React.ReactNode;
  /** List of main menu links */
  menuItems?: MenuItem[];
  /** List of secondary details/social links */
  socialLinks?: SocialLink[];
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
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { label: "About us", href: "#", eyebrow: "01" },
  { label: "Our work", href: "#", eyebrow: "02" },
  { label: "Services", href: "#", eyebrow: "03" },
  { label: "Blog", href: "#", eyebrow: "04" },
  { label: "Contact us", href: "#", eyebrow: "05" },
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "X/Twitter", href: "#" },
  { label: "Awwwards", href: "#" },
];

export const SlidingMenu: React.FC<SlidingMenuProps> = ({
  logoText = "BRAND",
  logoHref = "#",
  logoIcon,
  menuItems = DEFAULT_MENU_ITEMS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
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
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isMenuOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  const navWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const fadeTargetsRef = useRef<HTMLElement[]>([]);
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

  const addFadeRef = (el: HTMLElement | null) => {
    if (el && !fadeTargetsRef.current.includes(el)) {
      fadeTargetsRef.current.push(el);
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
    fadeTargetsRef.current = [];
  }, [menuItems, socialLinks]);

  useEffect(() => {
    const navWrap = navWrapRef.current;
    const menuPanel = menuPanelRef.current;
    const overlay = overlayRef.current;
    const bgPanels = panelsRef.current;
    const menuLinks = linksRef.current;
    const fadeTargets = fadeTargetsRef.current;
    const btnTexts = btnTextsRef.current;
    const btnIcon = btnIconRef.current;

    if (!navWrap || !menuPanel || !overlay) return;

    const ease = CustomEase.get("slidingMenuEase") || "power4.inOut";

    if (isMenuOpen) {
      gsap.killTweensOf([navWrap, menuPanel, overlay, bgPanels, menuLinks, fadeTargets, btnTexts, btnIcon]);

      const tl = gsap.timeline({
        defaults: { ease, duration: 0.7 }
      });

      tl.set(navWrap, { display: "block" })
        .set(menuPanel, { xPercent: 0 })
        .fromTo(btnTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.1, duration: 0.5 }, 0)
        .fromTo(btnIcon, { rotate: 0 }, { rotate: 315, duration: 0.5 }, 0)
        .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0)
        .fromTo(bgPanels, 
          { xPercent: 101 }, 
          { xPercent: 0, stagger: 0.12, duration: 0.575 }, 
          0
        )
        .fromTo(menuLinks, 
          { yPercent: 140, rotate: 10 }, 
          { yPercent: 0, rotate: 0, stagger: 0.05, duration: 0.7 }, 
          0.3
        )
        .fromTo(fadeTargets, 
          { autoAlpha: 0, yPercent: 50 }, 
          { autoAlpha: 1, yPercent: 0, stagger: 0.04, duration: 0.5 }, 
          0.45
        );

    } else {
      gsap.killTweensOf([navWrap, menuPanel, overlay, bgPanels, menuLinks, fadeTargets, btnTexts, btnIcon]);

      const tl = gsap.timeline({
        defaults: { ease, duration: 0.5 }
      });

      tl.to(overlay, { autoAlpha: 0, duration: 0.4 })
        .to(menuPanel, { xPercent: 120, duration: 0.5 }, 0)
        .to(btnTexts, { yPercent: 0, duration: 0.4 }, 0)
        .to(btnIcon, { rotate: 0, duration: 0.4 }, 0)
        .set(navWrap, { display: "none" });
    }
  }, [isMenuOpen]);

  const customStyles = {
    '--color-primary': primaryColor,
    '--color-neutral-100': secondaryColor,
    '--color-neutral-300': neutralColor,
    '--color-neutral-800': hoverBgColor,
    '--color-neutral-200': accentColor,
    '--color-dark': textColor,
  } as React.CSSProperties;

  return (
    <div ref={containerRef} className={`sliding-menu-container w-full relative h-full min-h-[50px] overflow-hidden ${className}`} style={customStyles}>
      
      {/* HEADER ROW */}
      <div className="sliding-menu-ui">
        <header className={`sliding-menu-header ${isFixed ? 'is-fixed' : ''}`}>
          <div className="sliding-menu-inner-container is--full">
            <nav className="sliding-menu-nav-row">
              <a href={logoHref} className="sliding-menu-logo-row">
                {logoIcon && <div className="flex items-center mr-2">{logoIcon}</div>}
                <span className="font-bold text-lg tracking-wider" style={{ color: textColor }}>
                  {logoText}
                </span>
              </a>

              <div className="sliding-menu-nav-row__right">
                <button 
                  role="button" 
                  aria-expanded={isMenuOpen} 
                  aria-label="Toggle menu" 
                  onClick={handleToggle}
                  className="sliding-menu-button"
                  style={{ color: textColor }}
                >
                  <div className="sliding-menu-button-text">
                    <p ref={el => { if (el) btnTextsRef.current[0] = el; }} style={{ color: textColor }}>Menu</p>
                    <p ref={el => { if (el) btnTextsRef.current[1] = el; }} style={{ color: textColor }}>Close</p>
                  </div>
                  <div className="sliding-menu-icon-wrap">
                    <svg ref={btnIconRef} viewBox="0 0 16 16" fill="none" className="sliding-menu-button-icon" style={{ color: textColor }}>
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

      {/* DRAWER & OVERLAY */}
      <div ref={navWrapRef} data-nav={isMenuOpen ? "open" : "closed"} className={`sliding-menu-nav ${isFixed ? 'is-fixed' : ''}`}>
        <div ref={overlayRef} onClick={() => handleToggle()} className="sliding-menu-overlay" />
        
        <nav ref={menuPanelRef} className="sliding-menu-panel">
          <div className="sliding-menu-bg">
            <div ref={addPanelRef} className="sliding-menu-bg-panel first" />
            <div ref={addPanelRef} className="sliding-menu-bg-panel second" />
            <div ref={addPanelRef} className="sliding-menu-bg-panel" />
          </div>

          <div className="sliding-menu-inner">
            <ul className="sliding-menu-list">
              {menuItems.map((item, idx) => (
                <li key={idx} className="sliding-menu-list-item">
                  <a 
                    ref={addLinkRef} 
                    href={item.href} 
                    className="sliding-menu-link"
                    style={{ color: textColor }}
                  >
                    <p className="sliding-menu-link-heading" style={{ color: textColor, '--color-neutral-200': accentColor } as React.CSSProperties}>
                      {item.label}
                    </p>
                    {item.eyebrow && (
                      <span className="sliding-menu-eyebrow" style={{ color: accentColor }}>
                        {item.eyebrow}
                      </span>
                    )}
                    <div className="sliding-menu-link-bg" style={{ backgroundColor: hoverBgColor }} />
                  </a>
                </li>
              ))}
            </ul>

            <div className="sliding-menu-details">
              <p ref={addFadeRef} className="sliding-menu-p-small" style={{ color: textColor }}>Links</p>
              <div className="sliding-menu-socials-row">
                {socialLinks.map((link, idx) => (
                  <a 
                    key={idx} 
                    ref={addFadeRef} 
                    href={link.href} 
                    className="sliding-menu-p-large sliding-menu-text-link"
                    style={{ color: textColor }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>

    </div>
  );
};

export default SlidingMenu;
