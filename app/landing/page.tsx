"use client";

import React, { useState, useEffect } from "react";

import dynamic from "next/dynamic";
import FbmNoise from "../meta/background/liquid/FbmNoise";
import LazySection from "./components/LazySection";
import CreativeNavbar from "./components/CreativeNavbar";
import ScrollTimeline from "./components/ScrollTimeline";
import CreativeFooter from "./components/CreativeFooter";
import SmoothScrollProvider from "./components/SmoothScrollProvider";


// Lazy-loaded section components for performance optimization
const HeroSection = dynamic(() => import("./components/HeroSection"), { ssr: false });
const FeatureDetailsSection = dynamic(() => import("./components/FeatureDetailsSection"), { ssr: false });
const InteractiveShowcaseSection = dynamic(() => import("./components/InteractiveShowcaseSection"), { ssr: false });
const VisualPlaygroundSection = dynamic(() => import("./components/VisualPlaygroundSection"), { ssr: false });
const PageSpecs = dynamic(() => import("./components/PageSpecs"), { ssr: false });
const BentoShowcaseSection = dynamic(() => import("./components/BentoShowcaseSection"), { ssr: false });

// --- FbmNoise presets for fluid simulation ---
interface ShaderPreset {
  name: string;
  speed: number;
  scale: number;
  colorR: number;
  colorG: number;
  colorB: number;
  brightness: number;
}

const SHADER_PRESETS: Record<string, ShaderPreset> = {
  cyberpunk: {
    name: "Cyberpunk Neon",
    speed: 0.16,
    scale: 3.2,
    colorR: 1.2,
    colorG: 0.1,
    colorB: 0.8,
    brightness: 1.1
  },
  aurora: {
    name: "Cosmic Aurora",
    speed: 0.08,
    scale: 2.2,
    colorR: 0.15,
    colorG: 1.2,
    colorB: 0.6,
    brightness: 1.0
  },
  ember: {
    name: "Volcanic Flame",
    speed: 0.22,
    scale: 4.0,
    colorR: 1.4,
    colorG: 0.3,
    colorB: 0.05,
    brightness: 1.25
  },
  void: {
    name: "Deep Space Void",
    speed: 0.05,
    scale: 2.8,
    colorR: 0.45,
    colorG: 0.5,
    colorB: 1.2,
    brightness: 0.9
  }
};

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("hero");

  // Global FbmNoise parameters state
  const [activePreset, setActivePreset] = useState<string>("cyberpunk");
  const [speed, setSpeed] = useState<number>(SHADER_PRESETS.cyberpunk.speed);
  const [scale, setScale] = useState<number>(SHADER_PRESETS.cyberpunk.scale);
  const [colorR, setColorR] = useState<number>(SHADER_PRESETS.cyberpunk.colorR);
  const [colorG, setColorG] = useState<number>(SHADER_PRESETS.cyberpunk.colorG);
  const [colorB, setColorB] = useState<number>(SHADER_PRESETS.cyberpunk.colorB);
  const [brightness, setBrightness] = useState<number>(SHADER_PRESETS.cyberpunk.brightness);

  // IntersectionObserver to trace active sections
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = ["hero", "features", "marquee", "scroll-marquee", "shader-playground", "specs", "production-ready"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Section-driven background profile morphing
  useEffect(() => {
    if (activeSection === "shader-playground") {
      return;
    }

    switch (activeSection) {
      case "hero":
        setSpeed(0.12);
        setScale(2.5);
        setColorR(0.85);
        setColorG(0.45);
        setColorB(1.2);
        setBrightness(1.1);
        break;
      case "features":
        setSpeed(0.09);
        setScale(3.5);
        setColorR(1.2);
        setColorG(0.4);
        setColorB(0.2);
        setBrightness(0.9);
        break;
      case "marquee":
      case "scroll-marquee":
        setSpeed(0.07);
        setScale(1.8);
        setColorR(0.2);
        setColorG(0.7);
        setColorB(1.0);
        setBrightness(0.8);
        break;
      case "specs":
        setSpeed(0.10);
        setScale(4.0);
        setColorR(0.5);
        setColorG(1.2);
        setColorB(0.8);
        setBrightness(1.0);
        break;
      case "production-ready":
        setSpeed(0.06);
        setScale(2.0);
        setColorR(0.3);
        setColorG(0.6);
        setColorB(0.9);
        setBrightness(0.7);
        break;
      default:
        break;
    }
  }, [activeSection]);

  const applyPreset = (key: string) => {
    const p = SHADER_PRESETS[key];
    if (p) {
      setActivePreset(key);
      setSpeed(p.speed);
      setScale(p.scale);
      setColorR(p.colorR);
      setColorG(p.colorG);
      setColorB(p.colorB);
      setBrightness(p.brightness);
    }
  };

  const sectionsList = [
    { id: "hero", label: "Hero" },
    { id: "features", label: "Core Specs" },
    { id: "marquee", label: "Component Deck" },
    { id: "shader-playground", label: "Shader Deck" },
    { id: "specs", label: "Tech Details" },
    { id: "production-ready", label: "Ready" },
  ];

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#060010] text-[#f2eee9] font-sans selection:bg-[#c0dedd]/30 selection:text-white overflow-x-hidden">

        {/* Root-level FbmNoise shader backdrop */}
        <FbmNoise
          complex={false}
          speed={speed}
          scale={scale}
          brightness={brightness}
          colorR={colorR}
          colorG={colorG}
          colorB={colorB}
          mouseInfluence={0.5}
          paused={false}
          observeVisibility={false}
          className="fixed inset-0 z-0 w-full h-full"
        />

        {/* Floating Layout Indicators */}
        {/* <CreativeNavbar activeSection={activeSection} /> */}
        <ScrollTimeline sections={sectionsList} activeSection={activeSection} />


        {/* Orchestrated Section Views — each section has its own unique scroll choreography */}
        <div className="relative z-10 w-full flex flex-col">
          {/* Hero — parallax layers, pinned entrance, cinematic exit */}
          <LazySection id="hero">
            <HeroSection />
          </LazySection>

          {/* Features — GSAP staggered cards, scroll-driven title, circuit SVG lines */}
          <LazySection id="features">
            <FeatureDetailsSection />
          </LazySection>

          {/* Showcase — pinned horizontal scroll gallery (no LazySection wrapper — GSAP pin needs direct DOM) */}
          <div id="marquee">
            <InteractiveShowcaseSection />
          </div>

          {/* Shader Playground — interactive WebGL controls */}
          <LazySection id="shader-playground">
            <VisualPlaygroundSection
              presets={SHADER_PRESETS}
              activePreset={activePreset}
              speed={speed}
              scale={scale}
              colorR={colorR}
              colorG={colorG}
              colorB={colorB}
              brightness={brightness}
              onPresetChange={applyPreset}
              onSpeedChange={(val) => { setSpeed(val); setActivePreset(""); }}
              onScaleChange={(val) => { setScale(val); setActivePreset(""); }}
              onColorRChange={(val) => { setColorR(val); setActivePreset(""); }}
              onColorGChange={(val) => { setColorG(val); setActivePreset(""); }}
              onColorBChange={(val) => { setColorB(val); setActivePreset(""); }}
              onBrightnessChange={(val) => { setBrightness(val); setActivePreset(""); }}
            />
          </LazySection>

          {/* Specs — scroll-driven counters, animated bars, waterfall cascade */}
          <LazySection id="specs">
            <PageSpecs />
          </LazySection>

          {/* Production-Ready capabilities bento grid showcase */}
          <LazySection id="production-ready">
            <BentoShowcaseSection />
          </LazySection>

          <CreativeFooter />
        </div>

      </div>
    </SmoothScrollProvider>
  );
}
