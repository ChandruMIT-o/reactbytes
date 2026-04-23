# SOP: Upgrading Component Control Props

This guide explains how to transition component documentation pages from legacy controls to the premium ReactBytes control system.

## 1. Prerequisites & Components
Use the following premium components located in `app/components/`:
- `textinput/DefaultTextInput.tsx`
- `combobox/DefaultComboBox.tsx`
- `slider/DiscreteSlider2.tsx` (Use `showTicks={true}`)
- `buttongroup/ToggleComponent.tsx`
- `colorpicker/ColorPicker.tsx` (Use for hex color values)

## 2. Component Refactoring (Showcase Component)
If the component being showcased (e.g., `FallDown.tsx`) only supports Tailwind color classes, update it to support a `color` prop:
- Add `color?: string` to the Props interface.
- Apply it via `style={{ color }}`.
- If appropriate, add a `loop?: boolean` prop or other interactive toggles to maximize the use of `ToggleComponent`.

## 3. Data File Updates (e.g., `ComponentNameData.ts`)
- Update `loaderProps` to include the new props (`color`, `loop`, etc.).
- Update `componentCode` (the stringified version of the component) to match the new implementation.
- Update `presets` to include the new configuration values.

## 4. Page Implementation (e.g., `ComponentNamePage.tsx`)
### Imports
- Remove legacy `TextInput`, `ComboBox`, `DiscreteSlider`.
- Import the new premium components from their respective paths.

### State Management
- Transition color state from Tailwind classes to hex strings (e.g., `#E8EAF0`).
- Add boolean states for any new toggles.

### PreviewTab Children
- **CRITICAL**: Do NOT wrap the controls in a `div` with `grid` classes. `PreviewTab` already provides an internal grid (`lg:grid-cols-3 gap-4`).
- Pass the premium components as **direct children** of the `PreviewTab` component.
- Ensure all `DiscreteSlider2` instances have `showTicks={true}`.

### Preset Logic
- Update `applyPreset` to handle the new `color` and `loop` (or other) state updates.

## 5. Visual Consistency
- Ensure `PreviewTab` has a `max-w-6xl` class in its implementation to allow the three-column layout to expand properly.
- Ensure the `header` of `PreviewTab` uses `DefaultComboBox` for preset selection with `label="Presets"` and `dynamicWidth={true}`.

---