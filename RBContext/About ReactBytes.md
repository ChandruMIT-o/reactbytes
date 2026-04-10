# About ReactBytes

React Bytes is a component library (and demo site) inspired by reactbytes.

## Project Folder Structure (`app/`)

This project uses Next.js App Router. The `app/` directory contains the route entrypoints (`layout.tsx`, `page.tsx`, dynamic routes like `[id]/page.tsx`) and also houses most of the UI modules used to render the demo pages.

```text
app/
  favicon.ico
  globals.css
  layout.tsx
  page.tsx
  [id]/
    page.tsx

  components/
    buttongroup/
    buttons/
    combobox/
    layout/
    sidebar/
    slider/
    table/
    tabsection/
    textfields/
    textinput/

  meta/
    background/
      dotted/
      gradient/
    text/
      BlurText/
      Interactive/
      TextEnter/

  pages/
    InstallationPage/
    BlurTextPage/
    MagneticDotMeshPage/
    FallDownPage/
    BlurInPage/
    RevealUnderPage/
    VariableWeightTextPage/
    WaveTextPage/
    FocalBlurTextPage/
    MagneticTextPage/
    ShatterTextPage/
```

### Route entrypoints (what becomes a URL)

These files follow Next.js “special file” conventions and are the only parts of `app/` that directly define routes:

- `app/layout.tsx`: The required root layout. Sets global metadata, loads fonts, imports `globals.css`, and wraps all pages in the shared shell UI (`AppShell`).
- `app/page.tsx`: The home route (`/`). Currently renders the installation experience.
- `app/[id]/page.tsx`: A dynamic route (`/:id`). Reads the URL param and chooses which internal page module to render (for example `install`, `blur-text`, `magnetic-dots`, etc.).
- `app/globals.css`: Global styles for the app.
- `app/favicon.ico`: App icon.

### `app/components/` (shared UI building blocks)

Reusable UI pieces used across multiple pages and sections of the demo site (navigation shell, sidebars, tables, sliders, inputs, etc.). Examples:

- `app/components/layout/`: Layout shell components (notably `AppShell.tsx`).
- `app/components/sidebar/`: Left navigation and “On this page” section list.
- `app/components/tabsection/`, `app/components/table/`, `app/components/slider/`: Documentation-style UI for previews, props tables, and interactive controls.

### `app/pages/` (page modules used by routes)

Despite the name, `app/pages/` is not the Next.js “Pages Router”. In this repo it’s a set of **importable React components** that represent each demo/documentation page (for example `InstallationPage`, `BlurTextPage`, etc.).

The actual URL routing is handled by:

- `app/page.tsx` for `/`
- `app/[id]/page.tsx` for `/:id`

### `app/meta/` (component implementations showcased by pages)

This contains the “library” style components that the pages showcase, grouped by category:

- `app/meta/text/`: Text effects (blur loaders, interactive text, enter animations).
- `app/meta/background/`: Background effects (dotted meshes, gradients).

### Adding a new component/page (practical workflow)

1. Implement the component under `app/meta/...` (pick a category or create a new one).
2. Create a demo/docs module under `app/pages/<Name>Page/`.
3. Add a mapping in `app/[id]/page.tsx` so `/:id` renders your new page.
4. Add a nav item in `app/components/layout/AppShell.tsx` (and optionally page section anchors for the “On this page” menu).
