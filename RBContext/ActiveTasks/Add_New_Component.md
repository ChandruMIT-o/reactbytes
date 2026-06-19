# Guide: Adding a New Component with Dynamic Showcase

Follow these instructions to create a new component and set up its interactive showcase page using the config-driven template architecture.

---

## 1. Create Core Component
Create your new React component and place it in the category-specific metadata directory:
`app/meta/[Category]/[ComponentName]/[ComponentName].tsx`

* *Note: If the component uses client-side hooks, state, or animations (e.g. Framer Motion), mark the file with `"use client"` at the very top.*

---

## 2. Create Colocated Configuration File
Create a configuration file inside your component's directory:
`app/meta/[Category]/[ComponentName]/[ComponentName].config.ts`

### Configuration Schema:
Define the interactive properties, default states, presets, and credits:

```typescript
import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const componentConfig: ComponentConfig = {
  slug: "new-component-slug", // Kebab-case URL slug (e.g., "magnetic-text")
  name: "New Component Name", // Human-readable title
  category: "text", // "text" | "background" | "carousel" | "miscellaneous" | "cursor"
  componentPath: "app/meta/[Category]/[ComponentName]/[ComponentName].tsx",
  props: [
    {
      name: "propName",
      type: "string", // "string" | "number" | "boolean" | "color" | "select"
      default: "defaultVal",
      description: "Short descriptive tooltip label.",
      // min: 0, max: 10, step: 0.1 (For type: "number")
      // options: [{ id: "opt1", label: "Option 1" }] (For type: "select")
    }
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        propName: "defaultVal"
      }
    }
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        { name: "Author", role: "Designer/Developer", url: "https://..." }
      ]
    }
  ],
  staticProps: {
    // Put any static/non-interactive props (like className or textClassName) that need to be passed:
    textClassName: "text-6xl font-bold tracking-tight font-mono"
  }
};
```

---

## 3. Register Client dynamic import
To render the component on the client, register its dynamic bundle loading mapping:

1. Open `app/registry/ComponentMap.ts`.
2. Add the dynamic mapping entry matching the slug:
   ```typescript
   "new-component-slug": dynamic(() => import("../meta/[Category]/[ComponentName]/[ComponentName]")),
   ```

---

## 4. Register in Centralized Registry Database
Hook the configuration file into the static database index:

1. Open `app/registry/ComponentDatabase.ts`.
2. Import the colocated config file:
   ```typescript
   import { componentConfig } from "../meta/[Category]/[ComponentName]/[ComponentName].config";
   ```
3. Add `componentConfig` to the `ComponentDatabase` array.

---

## 5. Verify & Test Page
1. Run local development: `npm run dev`
2. Open `http://localhost:3000/new-component-slug` in your browser.
3. Test your component's interactive controls, presets, play button, and confirm the dynamically generated Usage block is correct.
4. Run production build: `npm run build` (Next.js will automatically pick up the new slug and generate static HTML pages for it).
