# Title: Refactor: Replace Hardcoded Showcase Pages with Config-Driven Dynamic Template

## Description

Our current architecture for the open component distribution system requires creating three separate files for every new component: the core component file (`Component.tsx`), a separate data file (`ComponentData.ts`), and a boilerplate interactive layout page (`ComponentPage.tsx`).

This pattern creates a massive amount of code duplication, presents string-escaping vulnerabilities for component source code, and introduces high maintenance friction as the library grows.

To improve developer velocity and ensure consistency across component playgrounds (similar to libraries like *React Bits*), we should migrate to a **centralized configuration-driven registry** powered by a **Next.js Dynamic Route Template**.

---

## Proposed Architecture

### 1. Unified Configuration Registry (`app/registry/ComponentDatabase.ts`)

Instead of standalone data files, all component metadata, structural configurations, adjustable properties, and playground presets will be defined in a single, strictly typed TypeScript registry file.

```typescript
export interface PropConfig {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select';
  default: any;
  min?: number;
  max?: number;
  options?: string[];
}

export interface ComponentConfig {
  slug: string;
  name: string;
  category: string;
  component: any; // Dynamic import
  props: PropConfig[];
  presets: Record<string, Record<string, any>>;
}

export const ComponentDatabase: ComponentConfig[] = [
  // Registry entries map here
];

```

### 2. Single Dynamic Route Layout (`app/components/[slug]/page.tsx`)

A unified Next.js dynamic page template will handle the presentation logic for all components.

* **Static Generation:** It will utilize `generateStaticParams()` to pre-compile every component showcase page at build time for instant CDN delivery.
* **Auto-Generated Controls:** The playground UI will map over the selected component's `props` array schema to automatically render the appropriate controls (`DefaultTextInput`, `DiscreteSlider2`, `ColorPicker`, etc.).
* **Universal Preset Handler:** Presets will automatically bind to the dynamic state, wiping out custom boilerplate implementation.

---

## Todo / Checklist

### Phase 1: Setup & Core Infrastructure

* [ ] Create the strict TypeScript interfaces and schema definitions in `app/registry/ComponentDatabase.ts`.
* [ ] Create the dynamic page architecture at `app/components/[slug]/page.tsx`.
* [ ] Implement `generateStaticParams()` on the dynamic route to loop through the configuration registry and guarantee pre-rendering.
* [ ] Build the dynamic control panel to dynamically map input types based on property types (`string` ➔ Text Input, `number` ➔ Slider, etc.).

### Phase 2: Migration

* [ ] Migrate the baseline component (`RevealUnder`) into the new configuration array layout as a proof of concept.
* [ ] Ensure that component source code loading is extracted gracefully (e.g., using a text/raw-loader layer or direct server-side reading) to eliminate manual string-escaping.
* [ ] Verify that background component boundary rules and resizing loops function accurately inside the unified template.

### Phase 3: Cleanup

* [ ] Delete legacy boilerplate folders under `app/pages/*` once successfully moved over.
* [ ] Update the `LLM Guideline Prompt / Instructions` documentation to instruct AI assistance to write *only* the core component file and register its schema block.

---

## Benefits

* **Zero Page Boilerplate:** Adding a new component scales down to writing just the asset file itself and adding a data block to the registry.
* **Centralized Design System:** Updating a playground UI enhancement or fixing a visual quirk instantly propagates to 100% of our showcase listings simultaneously.
* **Safer Automation:** Drastically reduces the operational syntax errors created by manual string-escaping parameters or absolute styling variations.