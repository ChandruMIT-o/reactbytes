# Standard Operating Procedure: Adding a New Component Documentation Page

To add a new component page to React Bytes, follow these steps systematically. This ensures consistency across the library and high-fidelity interactive previews.

---

## 1. Study the Component Source
Read the source code of the component (e.g., `app/meta/.../MyComponent.tsx`). 
- Identify all interactive props (booleans, numbers, enums).
- Note default values.
- Check dependencies for the Credits section.

## 2. Create the Data File
Create `app/pages/[ComponentName]Page/[ComponentName]Data.tsx`.
- **`componentCode`**: A stringified version of the component's source code. Ensure template literals (backticks) are escaped (`\\\``).
- **`[ComponentName]Props`**: An array of prop definitions for the `PropsTable`.
- **`creditsData`**: An array of credits, including any external libraries used.

## 3. Create the Main Page File
Create `app/pages/[ComponentName]Page/[ComponentName]Page.tsx`.
- **Imports**:
    ```tsx
    "use client";
    import React, { useState } from "react";
    import { RotateCcw } from "lucide-react";
    import HeaderText from "../../components/textfields/HeaderText";
    import ParagraphText from "../../components/textfields/ParagraphText";
    import PreviewTab from "../../components/tabsection/PreviewTab";
    import InstallationTabs from "../../components/tabsection/InstallationTabs";
    import { PropsTable } from "../../components/table/PropsTable";
    import MyComponent from "@/app/meta/.../MyComponent";
    import { [ComponentName]Props, componentCode, creditsData } from "./[ComponentName]Data";
    import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
    import { Credits } from "../../components/buttongroup/Credits";
    import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
    import Toggle from "@/app/components/buttongroup/Toggle";
    ```
- **Presets**: Define at least 5 distinct presets that showcase different capabilities of the component.
- **State Management**: Create state for every interactive prop.
- **Preview Content**: Wrap the component in a styled container inside `PreviewTab`.
- **Control Panel**: Use `DiscreteSlider` for numbers, `DefaultComboBox` for enums/types, and `Toggle` for booleans.
- **Critical Layout Note**: The `PreviewTab` component already wraps its `children` in a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`). **Do NOT wrap your columns in an extra `grid` div**, as this will cause the columns to be squeezed into a single grid cell. Instead, pass the column `div`s directly as children.

## 4. Register the Component
1. **`app/components/layout/AppShell.tsx`**:
    - Add the component to the appropriate category (`textItems`, `backgroundItems`, or `miscellaneousItems`).
    - Add a entry to `pageSections` to enable right-sidebar navigation (Preview, Installation, API Reference, Credits).
2. **`app/[id]/page.tsx`**:
    - Import the new page component.
    - Add the conditional return inside `renderContent`.

---

## 💡 Pro-Tip for AI Prompting
When asking an AI to do this, use the following prompt:

> "Build a full documentation page for the @[ComponentPath] component. 
> 1. Create a `[Component]Data.tsx` with stringified code and prop definitions.
> 2. Create a `[Component]Page.tsx` with a high-fidelity interactive playground. Include at least 5 presets (e.g. Minimalist, Dramatic, Auto-play, etc.). Use `DiscreteSlider`, `Toggle`, and `DefaultComboBox` for controls.
> 3. Register the new page in `app/components/layout/AppShell.tsx` and `app/[id]/page.tsx`.
> 4. Ensure the design matches the existing premium aesthetic of the project."

---
