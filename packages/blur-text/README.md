# @reactbytes/blur-text

A beautiful, premium, and high-performance text blur animation component for React, powered by Framer Motion. Smooth, customizable, and ready to drop into any design system.

---

## 🌟 Features

- ⚡️ **High Performance**: Powered by Framer Motion, utilizing hardware-accelerated transforms and filters.
- 🎨 **Fully Customizable**: Control animation speed, stagger, direction, blur intensity, easing, and trigger behavior.
- 🔄 **Looping/Pulse Effect**: Enable continuous loop animations easily via the `loop` prop.
- 🌐 **Responsive & Flex-ready**: Wraps words or letters naturally using Tailwind flex classes.
- ⚙️ **CJS & ESM Support**: Packaged seamlessly using modern build processes.

---

## 📦 Installation

To install `@reactbytes/blur-text` along with its peer dependencies:

### Using pnpm
```bash
pnpm add @reactbytes/blur-text framer-motion
```

### Using npm
```bash
npm install @reactbytes/blur-text framer-motion
```

### Using yarn
```bash
yarn add @reactbytes/blur-text framer-motion
```

---

## 🚀 Quick Start

Here is a quick example of how to import and use `BlurText` in your application:

```tsx
import React from 'react';
import { BlurText } from '@reactbytes/blur-text';

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-white">
      <BlurText
        text="Experience the Magic"
        delay={0.1}
        stagger={0.05}
        direction="bottom"
        blurAmount={8}
        className="text-4xl font-bold tracking-tight text-white md:text-6xl"
      />
    </div>
  );
}

export default App;
```

---

## 🛠️ API Reference (Props)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `text` | `string` | `""` | The text to be broken down and animated. |
| `animateBy` | `"words" \| "letters"` | `"letters"` | Whether to animate each word or each letter individually. |
| `direction` | `"top" \| "bottom" \| "none"` | `"top"` | The direction from which the text elements appear. |
| `delay` | `number` | `0` | Base delay before the animation sequence starts (in seconds). |
| `stagger` | `number` | `0.05` | Stagger delay between each word/letter (in seconds). |
| `duration` | `number` | `0.5` | The duration of the animation for each individual element (in seconds). |
| `blurAmount` | `number` | `10` | The peak blur intensity in pixels. |
| `easing` | `string \| number[]` | `"easeOut"` | Custom easing function or cubic-bezier array (e.g., `"easeOut"`, `[0.25, 0.1, 0.25, 1]`). |
| `loop` | `boolean` | `false` | Whether the animation should loop continuously (pulsing blur effect). |
| `uppercase` | `boolean` | `false` | Whether to force the text to uppercase. |
| `threshold` | `number` | `0.1` | Intersection observer threshold (0 to 1) to trigger animation when visible. |
| `rootMargin` | `string` | `"0px"` | Intersection observer root margin. |
| `onAnimationComplete`| `() => void` | `undefined` | Callback function triggered when all elements finish animating. |
| `className` | `string` | `""` | Additional CSS classes for the text container. |

---

## 🎨 Tailwind CSS Integration

Since `@reactbytes/blur-text` utilizes tailwind classes for container layout by default, ensure you have Tailwind CSS set up in your consuming application.

The component uses these classes for layout:
```css
flex flex-wrap items-center justify-center
```
You can pass custom utility classes via `className` to style and align the text container, for example:
```tsx
<BlurText
  text="Antigravity UI"
  className="text-center font-extrabold uppercase text-blue-500"
/>
```

---

## 📄 License

MIT © [React Bytes](https://reactbytes.dev)
