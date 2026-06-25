import dynamic from "next/dynamic";
import React from "react";
import { ComponentDatabase, type ComponentConfig } from "../../registry/ComponentDatabase";

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
  config?: ComponentConfig;
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
  mcp: {
    id: "mcp",
    label: "Model Context Protocol",
    category: "general",
    sections: [
      { id: "mcp-header", label: "MCP Server" },
      { id: "mcp-setup", label: "Setup" },
      { id: "mcp-usage", label: "Usage" },
    ],
    component: dynamic(() => import("../../pages/McpPage/McpPage").then(mod => mod.McpPage)),
  },
  landing: {
    id: "landing",
    label: "Landing Showcase",
    category: "general",
    sections: [],
    component: dynamic(() => import("../../landing/page").then(mod => mod.default)),
  },

  // Carousel items









  // Miscellaneous items


  // Cursors items

};

export const ComponentRegistry: Record<string, RegistryEntry> = {
  ...baseRegistry,
  ...ComponentDatabase.reduce((acc, comp) => {
    acc[comp.slug] = {
      id: comp.slug,
      label: comp.name,
      category: comp.category,
      sections: standardSections(comp.slug),
      config: comp,
      component: () => null,
    };
    return acc;
  }, {} as Record<string, RegistryEntry>),
};
