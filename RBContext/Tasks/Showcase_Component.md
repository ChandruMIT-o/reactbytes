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

Finally, register the new page to make it accessible:

### 1. Route Registration (`app/[id]/page.tsx`)
1.  Import `[ComponentName]Page`.
2.  Add a conditional check in `renderContent()`:
    ```tsx
    if (id === "your-component-slug") return <[ComponentName]Page />;
    ```

### 2. Sidebar Registration (`app/components/layout/AppShellData.tsx`)
1.  Add the item to the appropriate category list (e.g., `textItems`, `backgroundItems`, `carouselItems`, etc.).
2.  Add the page sections to `pageSections`:
    ```tsx
    "your-component-slug": [
        { id: "component-title-id", label: "Preview" },
        { id: "installation-tabs", label: "Installation" },
        { id: "api-reference", label: "API Reference" },
        { id: "credits", label: "Credits" },
    ],
    ```
    *Note: The first section `id` should match the `id` of the title div in your Page.tsx.*

### 3. Layout Registration (`app/components/layout/AppShell.tsx`)
*   If you added the component to an **existing** category (Text, Background, etc.), no changes are needed here.
*   If you created a **new** category list in `AppShellData.tsx`:
    1.  Export the new list from `AppShellData.tsx`.
    2.  Import it in `AppShell.tsx`.
    3.  Add a new `LeftSidebarMenu` component under the appropriate `activeMainNav` condition.

---

## Checklist for LLM:
- [ ] Is `use client` at the top of the page file?
- [ ] Are all imports relative and correct?
- [ ] Does `usageCode` update dynamically with state?
- [ ] Are `loaderProps` and `creditsData` correctly formatted in the Data file?
- [ ] Is the page registered in `app/[id]/page.tsx`?
- [ ] Is the item added to the correct list in `AppShellData.tsx`?
- [ ] Are the `pageSections` added in `AppShellData.tsx`?
