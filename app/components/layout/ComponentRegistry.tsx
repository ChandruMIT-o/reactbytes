import dynamic from "next/dynamic";
import React from "react";

export interface RegistrySection {
  id: string;
  label: string;
}

export interface RegistryEntry {
  id: string;
  label: string;
  category: "general" | "text" | "background" | "carousel" | "miscellaneous" | "cursor";
  sections: RegistrySection[];
  component: React.ComponentType<any>;
}

const standardSections = (id: string) => [
  { id: `${id}-title`, label: "Preview" },
  { id: "installation-tabs", label: "Installation" },
  { id: "api-reference", label: "API Reference" },
  { id: "credits", label: "Credits" },
];

export const ComponentRegistry: Record<string, RegistryEntry> = {
  // General items
  intro: {
    id: "intro",
    label: "Introduction",
    category: "general",
    sections: [
      { id: "welcome", label: "Welcome" },
      { id: "mission", label: "Our Mission" },
      { id: "principles", label: "Core Principles" },
    ],
    component: dynamic(() => import("../../pages/IntroductionPage/IntroductionPage").then(mod => mod.IntroductionPage)),
  },
  install: {
    id: "install",
    label: "Installation",
    category: "general",
    sections: [
      { id: "installation-title", label: "Installation" },
      { id: "api-reference", label: "API Reference" },
      { id: "credits", label: "Credits" },
    ],
    component: dynamic(() => import("../../pages/InstallationPage/InstallationPage").then(mod => mod.InstallationPage)),
  },
  changelog: {
    id: "changelog",
    label: "Changelog",
    category: "general",
    sections: [
      { id: "changelog-header", label: "Updates" },
      { id: "changelog-filters", label: "Filters" },
      { id: "changelog-timeline", label: "Timeline" },
    ],
    component: dynamic(() => import("../../pages/ChangelogPage/ChangelogPage").then(mod => mod.ChangelogPage)),
  },

  // Text items
  "blur-text": {
    id: "blur-text",
    label: "Blur Text",
    category: "text",
    sections: standardSections("blur-text"),
    component: dynamic(() => import("../../pages/BlurTextPage/BlurTextPage").then(mod => mod.BlurTextPage)),
  },
  "fall-down": {
    id: "fall-down",
    label: "Fall Down",
    category: "text",
    sections: standardSections("fall-down"),
    component: dynamic(() => import("../../pages/FallDownPage/FallDownPage").then(mod => mod.FallDownPage)),
  },
  "blur-in": {
    id: "blur-in",
    label: "Blur In",
    category: "text",
    sections: standardSections("blur-in"),
    component: dynamic(() => import("../../pages/BlurInPage/BlurInPage").then(mod => mod.BlurInPage)),
  },
  "reveal-under": {
    id: "reveal-under",
    label: "Reveal Under",
    category: "text",
    sections: standardSections("reveal-under"),
    component: dynamic(() => import("../../pages/RevealUnderPage/RevealUnderPage").then(mod => mod.RevealUnderPage)),
  },
  "variable-weight": {
    id: "variable-weight",
    label: "Variable Weight",
    category: "text",
    sections: standardSections("variable-weight"),
    component: dynamic(() => import("../../pages/VariableWeightTextPage/VariableWeightTextPage")),
  },
  "wave-text": {
    id: "wave-text",
    label: "Proximity Ripple",
    category: "text",
    sections: standardSections("wave-text"),
    component: dynamic(() => import("../../pages/WaveTextPage/WaveTextPage").then(mod => mod.WaveTextPage)),
  },
  "focal-blur": {
    id: "focal-blur",
    label: "Focal Blur",
    category: "text",
    sections: standardSections("focal-blur"),
    component: dynamic(() => import("../../pages/FocalBlurTextPage/FocalBlurTextPage").then(mod => mod.FocalBlurTextPage)),
  },
  "magnetic-text": {
    id: "magnetic-text",
    label: "Magnetic Repel",
    category: "text",
    sections: standardSections("magnetic-text"),
    component: dynamic(() => import("../../pages/MagneticTextPage/MagneticTextPage").then(mod => mod.MagneticTextPage)),
  },
  "shatter-text": {
    id: "shatter-text",
    label: "Cinematic Shatter",
    category: "text",
    sections: standardSections("shatter-text"),
    component: dynamic(() => import("../../pages/ShatterTextPage/ShatterTextPage").then(mod => mod.ShatterTextPage)),
  },
  "gooey-morph": {
    id: "gooey-morph",
    label: "Gooey Morph",
    category: "text",
    sections: standardSections("gooey-morph"),
    component: dynamic(() => import("../../pages/MorphTextPage/GooeyMorphTextPage").then(mod => mod.GooeyMorphTextPage)),
  },
  "elastic-reveal": {
    id: "elastic-reveal",
    label: "Elastic Reveal",
    category: "text",
    sections: standardSections("elastic-reveal"),
    component: dynamic(() => import("../../pages/ElasticRevealPage/ElasticRevealPage").then(mod => mod.ElasticRevealPage)),
  },
  "scramble-reveal": {
    id: "scramble-reveal",
    label: "Scramble Reveal",
    category: "text",
    sections: standardSections("scramble-reveal"),
    component: dynamic(() => import("../../pages/ScrambleRevealPage/ScrambleRevealPage").then(mod => mod.ScrambleRevealPage)),
  },
  "keyboard-text": {
    id: "keyboard-text",
    label: "Keyboard Text",
    category: "text",
    sections: standardSections("keyboard-text"),
    component: dynamic(() => import("../../pages/KeyboardTextPage/KeyboardTextPage").then(mod => mod.KeyboardTextPage)),
  },

  // Background items
  "ascii-wave": {
    id: "ascii-wave",
    label: "ASCII Wave",
    category: "background",
    sections: standardSections("ascii-wave"),
    component: dynamic(() => import("../../pages/AsciiWavePage/AsciiWavePage").then(mod => mod.AsciiWavePage)),
  },
  "magnetic-dots": {
    id: "magnetic-dots",
    label: "Magnetic Dot Mesh",
    category: "background",
    sections: standardSections("magnetic-dots"),
    component: dynamic(() => import("../../pages/MagneticDotMeshPage/MagneticDotMeshPage").then(mod => mod.MagneticDotMeshPage)),
  },
  "bubble-gradient": {
    id: "bubble-gradient",
    label: "Bubble Gradient",
    category: "background",
    sections: standardSections("bubble-gradient"),
    component: dynamic(() => import("../../pages/BubbleGradientPage/BubbleGradientPage")),
  },
  "fractal-background": {
    id: "fractal-background",
    label: "Fractal Background",
    category: "background",
    sections: [
      { id: "fractal-title", label: "Preview" },
      { id: "installation-tabs", label: "Installation" },
      { id: "api-reference", label: "API Reference" },
      { id: "credits", label: "Credits" },
    ],
    component: dynamic(() => import("../../pages/FractalBackgroundPage/FractalBackgroundPage").then(mod => mod.FractalBackgroundPage)),
  },
  "cellular-automata": {
    id: "cellular-automata",
    label: "Cellular Automata",
    category: "background",
    sections: [
      { id: "cellular-title", label: "Preview" },
      { id: "installation-tabs", label: "Installation" },
      { id: "api-reference", label: "API Reference" },
      { id: "credits", label: "Credits" },
    ],
    component: dynamic(() => import("../../pages/CellularAutomataPage/CellularAutomataPage").then(mod => mod.CellularAutomataPage)),
  },
  "hive-mind": {
    id: "hive-mind",
    label: "Hive Mind",
    category: "background",
    sections: standardSections("hive-mind"),
    component: dynamic(() => import("../../pages/HiveMindPage/HiveMindPage").then(mod => mod.HiveMindPage)),
  },
  "perlin-smoke": {
    id: "perlin-smoke",
    label: "Perlin Smoke",
    category: "background",
    sections: standardSections("perlin-smoke"),
    component: dynamic(() => import("../../pages/PerlinSmokePage/PerlinSmokePage").then(mod => mod.PerlinSmokePage)),
  },
  "metallic-twirl": {
    id: "metallic-twirl",
    label: "Metallic Twirl",
    category: "background",
    sections: standardSections("metallic-twirl"),
    component: dynamic(() => import("../../pages/MetallicTwirlPage/MetallicTwirlPage").then(mod => mod.MetallicTwirlPage)),
  },
  "liquid-noise": {
    id: "liquid-noise",
    label: "Liquid Noise",
    category: "background",
    sections: standardSections("liquid-noise"),
    component: dynamic(() => import("../../pages/LiquidNoisePage/LiquidNoisePage").then(mod => mod.LiquidNoisePage)),
  },
  "iridescent-gradient": {
    id: "iridescent-gradient",
    label: "Iridescent Gradient",
    category: "background",
    sections: standardSections("iridescent-gradient"),
    component: dynamic(() => import("../../pages/IridescentGradientPage/IridescentGradientPage").then(mod => mod.IridescentGradientPage)),
  },
  "kaleidoscopic": {
    id: "kaleidoscopic",
    label: "Kaleidoscopic",
    category: "background",
    sections: standardSections("kaleidoscopic"),
    component: dynamic(() => import("../../pages/KaleidoscopicPage/KaleidoscopicPage").then(mod => mod.KaleidoscopicPage)),
  },
  "dotted-vortex": {
    id: "dotted-vortex",
    label: "Dotted Vortex",
    category: "background",
    sections: standardSections("dotted-vortex"),
    component: dynamic(() => import("../../pages/DottedVortexPage/DottedVortexPage").then(mod => mod.DottedVortexPage)),
  },
  "concentric-waves": {
    id: "concentric-waves",
    label: "Concentric Waves",
    category: "background",
    sections: standardSections("concentric-waves"),
    component: dynamic(() => import("../../pages/ConcentricWavesPage/ConcentricWavesPage").then(mod => mod.ConcentricWavesPage)),
  },
  spacetime: {
    id: "spacetime",
    label: "Spacetime Grid",
    category: "background",
    sections: standardSections("spacetime"),
    component: dynamic(() => import("../../pages/SpaceTimePage/SpaceTimePage").then(mod => mod.SpaceTimePage)),
  },
  dither: {
    id: "dither",
    label: "Dither Mesh",
    category: "background",
    sections: standardSections("dither"),
    component: dynamic(() => import("../../pages/DitherPage/DitherPage").then(mod => mod.DitherPage)),
  },

  // Carousel items
  "docked-carousel": {
    id: "docked-carousel",
    label: "Docked Carousel",
    category: "carousel",
    sections: standardSections("docked-carousel"),
    component: dynamic(() => import("../../pages/DockedCarouselPage/DockedCarouselPage").then(mod => mod.DockedCarouselPage)),
  },
  "stacked-carousel": {
    id: "stacked-carousel",
    label: "Stacked Carousel",
    category: "carousel",
    sections: standardSections("stacked-carousel"),
    component: dynamic(() => import("../../pages/StackedCarouselPage/StackedCarouselPage")),
  },
  "stacked-card-carousel": {
    id: "stacked-card-carousel",
    label: "Stacked Card Carousel",
    category: "carousel",
    sections: standardSections("stacked-card-carousel"),
    component: dynamic(() => import("../../pages/StackedCardCarouselPage/StackedCardCarouselPage")),
  },
  "void-carousel": {
    id: "void-carousel",
    label: "Void Carousel",
    category: "carousel",
    sections: standardSections("void-carousel"),
    component: dynamic(() => import("../../pages/VoidCarouselPage/VoidCarouselPage").then(mod => mod.VoidCarouselPage)),
  },
  "morph-carousel": {
    id: "morph-carousel",
    label: "Morph Carousel",
    category: "carousel",
    sections: standardSections("morph-carousel"),
    component: dynamic(() => import("../../pages/MorphCarouselPage/MorphCarouselPage").then(mod => mod.MorphCarouselPage)),
  },
  "split-carousel": {
    id: "split-carousel",
    label: "Split Carousel",
    category: "carousel",
    sections: standardSections("split-carousel"),
    component: dynamic(() => import("../../pages/SplitCarouselPage/SplitCarouselPage").then(mod => mod.SplitCarouselPage)),
  },
  "list-carousel": {
    id: "list-carousel",
    label: "List Carousel",
    category: "carousel",
    sections: standardSections("list-carousel"),
    component: dynamic(() => import("../../pages/ListCarouselPage/ListCarouselPage").then(mod => mod.ListCarouselPage)),
  },
  "interlocking-marquee": {
    id: "interlocking-marquee",
    label: "Interlocking Marquee",
    category: "carousel",
    sections: standardSections("interlocking-marquee"),
    component: dynamic(() => import("../../pages/InterlockingMarqueePage/InterlockingMarqueePage").then(mod => mod.InterlockingMarqueePage)),
  },

  // Miscellaneous items
  "standard-accordion": {
    id: "standard-accordion",
    label: "Standard Accordion",
    category: "miscellaneous",
    sections: [
      { id: "accordion-title", label: "Preview" },
      { id: "installation-tabs", label: "Installation" },
      { id: "api-reference", label: "API Reference" },
      { id: "credits", label: "Credits" },
    ],
    component: dynamic(() => import("../../pages/StandardAccordionPage/StandardAccordionPage").then(mod => mod.StandardAccordionPage)),
  },
  "glow-card": {
    id: "glow-card",
    label: "Glowing Shadows",
    category: "miscellaneous",
    sections: standardSections("glow-card"),
    component: dynamic(() => import("../../pages/GlowCardPage/GlowCardPage").then(mod => mod.GlowCardPage)),
  },
  "shiny-button": {
    id: "shiny-button",
    label: "Shiny CTA",
    category: "miscellaneous",
    sections: standardSections("shiny-button"),
    component: dynamic(() => import("../../pages/ShinyButtonPage/ShinyButtonPage").then(mod => mod.ShinyButtonPage)),
  },
  "vertical-menu": {
    id: "vertical-menu",
    label: "Vertical Menu",
    category: "miscellaneous",
    sections: standardSections("vertical-menu"),
    component: dynamic(() => import("../../pages/VerticalMenuPage/VerticalMenuPage")),
  },
  "novel-menu": {
    id: "novel-menu",
    label: "Novel Menu",
    category: "miscellaneous",
    sections: standardSections("novel-menu"),
    component: dynamic(() => import("../../pages/NovelMenuPage/NovelMenuPage")),
  },
  "holo-card": {
    id: "holo-card",
    label: "Holographic Card",
    category: "miscellaneous",
    sections: standardSections("holo-card"),
    component: dynamic(() => import("../../pages/HoloCardPage/HoloCardPage")),
  },
  "stacked-cards": {
    id: "stacked-cards",
    label: "Stacked Cards",
    category: "miscellaneous",
    sections: standardSections("stacked-cards"),
    component: dynamic(() => import("../../pages/StackedCardsPage/StackedCardsPage")),
  },
  "tabbed-section": {
    id: "tabbed-section",
    label: "Tabbed Section",
    category: "miscellaneous",
    sections: standardSections("tabbed-section"),
    component: dynamic(() => import("../../pages/TabbedSectionPage/TabbedSectionPage").then(mod => mod.TabbedSectionPage)),
  },
  "pill-tabbed-section": {
    id: "pill-tabbed-section",
    label: "Pill Tabbed Section",
    category: "miscellaneous",
    sections: standardSections("pill-tabbed-section"),
    component: dynamic(() => import("../../pages/PillTabbedSectionPage/PillTabbedSectionPage").then(mod => mod.PillTabbedSectionPage)),
  },
  "endless-motion-footer": {
    id: "endless-motion-footer",
    label: "Endless Motion Footer",
    category: "miscellaneous",
    sections: standardSections("endless-motion-footer"),
    component: dynamic(() => import("../../pages/EndlessMotionFooterPage/EndlessMotionFooterPage").then(mod => mod.EndlessMotionFooterPage)),
  },

  // Cursors items
  "follow-cursor": {
    id: "follow-cursor",
    label: "Follow Cursor",
    category: "cursor",
    sections: standardSections("follow-cursor"),
    component: dynamic(() => import("../../pages/FollowCursorPage/FollowCursorPage").then(mod => mod.FollowCursorPage)),
  },
};
