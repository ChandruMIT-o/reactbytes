import dynamic from "next/dynamic";
import React from "react";
import { ComponentDatabase } from "../../registry/ComponentDatabase";

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

const baseRegistry: Record<string, RegistryEntry> = {
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
  admin: {
    id: "admin",
    label: "Admin Dashboard",
    category: "general",
    sections: [],
    component: dynamic(() => import("../../pages/AdminPage/AdminPage").then(mod => mod.AdminPage)),
  },

  // Carousel items

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
  "rotary-carousel": {
    id: "rotary-carousel",
    label: "Rotary Dial Carousel",
    category: "carousel",
    sections: standardSections("rotary-carousel"),
    component: dynamic(() => import("../../pages/RotaryCarouselPage/RotaryCarouselPage").then(mod => mod.RotaryCarouselPage)),
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
  "dither-carousel": {
    id: "dither-carousel",
    label: "Dither Carousel",
    category: "carousel",
    sections: standardSections("dither-carousel"),
    component: dynamic(() => import("../../pages/DitherCarouselPage/DitherCarouselPage").then(mod => mod.DitherCarouselPage)),
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
  "sliding-menu": {
    id: "sliding-menu",
    label: "Sliding Menu",
    category: "miscellaneous",
    sections: standardSections("sliding-menu"),
    component: dynamic(() => import("../../pages/SlidingMenuPage/SlidingMenuPage").then(mod => mod.SlidingMenuPage)),
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
  "malakor-singularity": {
    id: "malakor-singularity",
    label: "Malakor Singularity",
    category: "miscellaneous",
    sections: standardSections("malakor-singularity"),
    component: dynamic(() => import("../../pages/MalakorSingularityPage/MalakorSingularityPage").then(mod => mod.MalakorSingularityPage)),
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

export const ComponentRegistry: Record<string, RegistryEntry> = {
  ...baseRegistry,
  ...ComponentDatabase.reduce((acc, comp) => {
    acc[comp.slug] = {
      id: comp.slug,
      label: comp.name,
      category: comp.category,
      sections: standardSections(comp.slug),
      component: () => null,
    };
    return acc;
  }, {} as Record<string, RegistryEntry>),
};
