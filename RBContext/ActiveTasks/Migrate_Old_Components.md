# Guide: Migrating Existing Components to Config-Driven Registry

Follow these instructions to migrate an existing component's showcase page to the new centralized config-driven architecture.

---

## 1. Locate Legacy Files
Identify the component name and locate its three existing files:
- **Core Component:** `app/meta/[Category]/[ComponentName]/[ComponentName].tsx`
- **Legacy Showcase Page:** `app/pages/[ComponentName]Page/[ComponentName]Page.tsx`
- **Legacy Showcase Data:** `app/pages/[ComponentName]Page/[ComponentName]Data.ts`

---

## 2. Create Colocated Configuration File
Create a new configuration file in the same directory as the core component:
`app/meta/[Category]/[ComponentName]/[ComponentName].config.ts`

### Schema Structure:
Copy the props, presets, credits, and static classes from the legacy showcase page and data file into the following schema format:

```typescript
import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const componentConfig: ComponentConfig = {
  slug: "component-slug", // kebab-case string used in URLs
  name: "Display Title",
  category: "text", // "text" | "background" | "carousel" | "miscellaneous" | "cursor"
  componentPath: "app/meta/[Category]/[ComponentName]/[ComponentName].tsx",
  props: [
    {
      name: "propName",
      type: "string", // "string" | "number" | "boolean" | "color" | "select"
      default: "defaultValue",
      description: "Description of what this prop controls.",
      // min: 0, max: 10, step: 0.1 (For type: "number")
      // options: [{ id: "opt1", label: "Option 1" }] (For type: "select")
    }
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        propName: "defaultValue"
      }
    }
  ],
  credits: [
    {
      title: "Credits Group",
      items: [
        { name: "Author Name", role: "Role", url: "https://..." }
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

## 3. Register Client-Side Component Import
Add the component dynamic mapping so it resolves on the client without breaking React Server Components compilation boundaries:

1. Open `app/registry/ComponentMap.ts`.
2. Add a dynamic import matching the component's slug:
   ```typescript
   "component-slug": dynamic(() => import("../meta/[Category]/[ComponentName]/[ComponentName]")),
   ```

---

## 4. Register Configuration in Database Index
Hook the colocated configuration into the centralized database index:

1. Open `app/registry/ComponentDatabase.ts`.
2. Import the config:
   ```typescript
   import { componentConfig } from "../meta/[Category]/[ComponentName]/[ComponentName].config";
   ```
3. Add the imported object to the `ComponentDatabase` export array.

---

## 5. Remove Legacy Registration
Clean up the static registration list:

1. Open `app/components/layout/ComponentRegistry.tsx`.
2. Delete the entry for the migrated component slug. (It is now automatically merged from `ComponentDatabase` at runtime).

---

## 6. Retain Legacy Files (Do Not Delete)
Do NOT delete the legacy boilerplate folder or its contents (`app/pages/[ComponentName]Page/`). Keep them in the codebase as a fallback and reference.

---

## 7. Verify Setup
1. Run local development: `npm run dev`
2. Navigate to `http://localhost:3000/component-slug` and verify that the page renders, interactive inputs work, presets apply, and the dynamically generated Usage/Code tabs show correct outputs.
3. Run a build to verify static pre-rendering compiles correctly: `npm run build`
