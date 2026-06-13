# Showcase Component Guide

Follow these instructions to create a showcase page for a this new component.

## 0. Reference Code to go through.

- **Example 1 (Text Component):**
STRICTLY SEARCH AND FIND OUT THESE FILES AND READ THEM BEFORE PERFORMING THESE TASKS.
  - Component: `app/meta/text/TextEnter/RevealUnder.tsx`
  - Showcase Page: `app/pages/RevealUnderPage/RevealUnderPage.tsx`
  - Showcase Data: `app/pages/RevealUnderPage/RevealUnderData.ts`

---
## 1. Directory Structure

- **Core Component**: `app/meta/[Category]/[ComponentName]/[ComponentName].tsx`
- **Showcase Page Folder**: `app/pages/[ComponentName]Page/`
- **Data File**: `app/pages/[ComponentName]Page/[ComponentName]Data.ts` (or `.tsx`)
- **Page File**: `app/pages/[ComponentName]Page/[ComponentName]Page.tsx`

---

## 2. Prepare the Data File (`[ComponentName]Data.ts`)

The data file should export three main constants:

1.  **`loaderProps`**: Array of objects for the API Reference table.
    ```typescript
    export const loaderProps = [
      {
        title: "Category Name",
        props: [
          { name: "propName", type: "string", defaultValue: "'value'", description: "Description..." },
        ],
      },
    ];
    ```
2.  **`componentCode`**: String containing the **entire** source code of the component.
3.  **`creditsData`**: Array for attribution.
    ```typescript
    export const creditsData = [
      {
        title: "Component Source",
        items: [{ name: "Author", role: "Designer", url: "https://..." }],
      },
    ];
    ```

---

## 3. Prepare the Page File (`[ComponentName]Page.tsx`)

The page file is a `"use client"` component that provides an interactive preview.

### Core Elements:
- **State Management**: Use `useState` for all configurable props.
- **`usageCode`**: A template string showing the JSX usage with current state values.
- **`PreviewTab`**:
    - `previewContent`: The component being showcased.
    - `usageCode`: The dynamically generated usage string.
    - `codeContent`: The source code from the data file.
    - `children`: Control components (Inputs, Sliders, ColorPickers).
- **Sections**:
    - `HeaderText` (option 3) for title.
    - `ParagraphText` (option 4) for description.
    - `InstallationTabs`.
    - `PropsTable` (using `loaderProps`).
    - `Credits` (using `creditsData`).

---

## 4. Standard UI Components for Controls

Use these components inside `PreviewTab` for the control panel:
- `DefaultTextInput`: For string props.
- `DiscreteSlider2`: For numeric props (speed, duration, intensity).
- `ColorPicker`: For hex colors.
- `ToggleComponent`: For booleans.
- `DefaultComboBox`: For fixed options (directions, variants) or Presets.

---

## 5. Registration

Finally, register the new page in the centralized registry to make it accessible:

### Registry Registration (`app/components/layout/ComponentRegistry.tsx`)
1. Open [ComponentRegistry.tsx](file:///d:/DEV/Personal/reactbytes/app/components/layout/ComponentRegistry.tsx).
2. Add a new entry to the `ComponentRegistry` dictionary under the appropriate category (`general`, `text`, `background`, `carousel`, `miscellaneous`, or `cursor`).
3. Define the dynamic import using `dynamic()` to lazy-load the page component:
    ```tsx
    "your-component-slug": {
      id: "your-component-slug",
      label: "Display Label",
      category: "text", // "general" | "text" | "background" | "carousel" | "miscellaneous" | "cursor"
      sections: standardSections("your-component-slug"), // Or custom sections array
      component: dynamic(() => import("../../pages/YourComponentPage/YourComponentPage").then(mod => mod.YourComponentPage)),
    },
    ```
    *(Note: If the component is a default export, import it directly: `dynamic(() => import("../../pages/YourComponentPage/YourComponentPage"))`)*

*No other files (like `AppShellData.tsx` or `app/[id]/page.tsx`) need to be touched! The routing, sidebar menu list, and right-hand scroll sections are dynamically generated from this registry entry.*

---

## 6. Common Pitfalls & Rules for LLMs (CRITICAL)

To prevent recurrent errors, adhere strictly to these rules:

1. **String Escaping in Data Files**: Be extremely careful when exporting the `componentCode` string. Use standard backticks to enclose the template literal, and ensure you correctly escape *internal* backticks (e.g., \\\`) without erroneously adding backslashes to standard code.
2. **Presets Implementation**: Always implement a full `presets` array in the `[ComponentName]Page.tsx` file. Map this array to a `DefaultComboBox` within the `header` prop of `PreviewTab`. The `applyPreset` function must update *all* configurable state values simultaneously.
3. **Background Component Boundaries**: When showcasing a Background component, **DO NOT** place it as an absolute sibling next to foreground content—this breaks interaction bounds and pointer events on hover. The Background Component MUST be the root element of `previewContent` (e.g., `<BackgroundComponent className="w-full h-[500px]">`), wrapping the foreground UI via its `children` prop.
4. **Canvas / Background Component Visibility & Resizing**: Canvas background components must handle cases where the parent container dimensions are initially 0 on mount due to page reflows or dynamic tab transitions. Avoid hardcoding `h-full` in the component wrapper if a custom height (e.g. `h-[500px]`) can be passed via `className`. Additionally, the component should monitor canvas client dimensions within its rendering or animation loop to dynamically trigger resizing and reconstruction of visual structures on the fly.

---

## Checklist for LLM:
- [ ] Is `use client` at the top of the page file?
- [ ] Are all imports relative and correct?
- [ ] Does `usageCode` update dynamically with state?
- [ ] Are `loaderProps` and `creditsData` correctly formatted in the Data file?
- [ ] Is the page registered in `app/components/layout/ComponentRegistry.tsx`?
- [ ] Are `presets` fully implemented in the Page header?
- [ ] Are background components wrapping their foreground content correctly?
- [ ] Is the `componentCode` cleanly escaped without syntax errors?
- [ ] Does the background/canvas component handle initial size reflows and dynamic height classes correctly?
