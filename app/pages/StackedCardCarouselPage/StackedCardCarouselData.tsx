import { PropDefinition } from "../../components/table/PropsTable";


// --- Default Data Payload ---
const defaultThemes = [
    "#261715", // Deep Rust
    "#141c21", // Obsidian Blue
    "#18241b", // Forest Depths
    "#2a1b2e", // Void Purple
    "#282013", // Burned Amber
];

const defaultItems = [
    {
        id: "c1",
        title: "Silent Horizon",
        description: "An exploration into the quiet expanse.",
        image: "https://images.unsplash.com/photo-1543373014-cfe4f4bc1cdf?q=80&w=1000&auto=format&fit=crop",
        serial: "Nº 001",
        category: "Atmospheric"
    },
    {
        id: "c2",
        title: "Monolith",
        description: "Structures defining the modern atmospheric condition.",
        image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1000&auto=format&fit=crop",
        serial: "Nº 002",
        category: "Brutalism"
    },
    {
        id: "c3",
        title: "Alpine Echoes",
        description: "Textures harvested from high-altitude environments.",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1000&auto=format&fit=crop",
        serial: "Nº 003",
        category: "Terrain"
    },
    {
        id: "c4",
        title: "Luminescent Grid",
        description: "Finding geometry in the organic.",
        image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000&auto=format&fit=crop",
        serial: "Nº 004",
        category: "Geometry"
    },
    {
        id: "c5",
        title: "Void Theory",
        description: "Where light ceases to interact with form.",
        image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1000&auto=format&fit=crop",
        serial: "Nº 005",
        category: "Abstract"
    },
];
;

export const StackedCardCarouselProps: PropDefinition[] = [
    {
        name: "items",
        type: "CardItem[]",
        defaultValue: "defaultItems",
        description: "Array of items to display in the carousel.",
    },
    {
        name: "themeColors",
        type: "string[]",
        defaultValue: "defaultThemes",
        description: "Array of hex colors that map to the scroll progression for the background.",
    },
    {
        name: "cardWidth",
        type: "number",
        defaultValue: "320",
        description: "Width of each individual card in pixels.",
    },
    {
        name: "cardHeight",
        type: "number",
        defaultValue: "440",
        description: "Height of each individual card in pixels.",
    },
];

export const creditsData = [
    {
        title: "Design Inspiration",
        items: [
            {
                name: "Framer Motion",
                role: "Animation Library",
                url: "https://www.framer.com/motion/",
            },
            {
                name: "Unsplash",
                role: "Photography",
                url: "https://unsplash.com/",
            },
        ],
    },
];

export const componentCode = `import React, { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue, useSpring, useMotionTemplate, MotionValue } from "framer-motion";
import { Info, X, ChevronRight, ChevronLeft, Mouse } from "lucide-react";

interface CardItem {
    id: string;
    title: string;
    description: string;
    image: string;
    serial: string;
    category: string;
}

// --- Mathematical Interpolation Engine ---
// These functions meticulously replicate the original SCSS @keyframes loop
// by mapping the scroll's relative distance into exact 3D coordinates.

const calculateX = (rel: number) => {
    if (rel === 0) return "0%";
    if (rel > 0 && rel < 1) {
        if (rel <= 0.5) return \`\${rel * 2 * -116}%\`;
        return \`\${-116 + (rel - 0.5) * 2 * 105}%\`;
    }
    if (rel < 0 && rel > -1) {
        if (rel >= -0.5) return \`\${rel * -2 * 116}%\`;
        return \`\${116 - (-rel - 0.5) * 2 * 105}%\`;
    }
    if (rel >= 1) return \`\${-3 - rel * 8}%\`;
    if (rel <= -1) return \`\${3 + Math.abs(rel) * 8}%\`;
    return "0%";
};

const calculateZ = (rel: number) => {
    if (rel === 0) return "0px";
    if (rel > 0 && rel < 1) {
        if (rel <= 0.5) return \`\${rel * 2 * -156}px\`;
        return \`\${-156 + (rel - 0.5) * 2 * -4}px\`;
    }
    if (rel < 0 && rel > -1) {
        if (rel >= -0.5) return \`\${rel * -2 * -156}px\`;
        return \`\${-156 + (-rel - 0.5) * 2 * -4}px\`;
    }
    if (Math.abs(rel) >= 1) return \`\${-140 - Math.abs(rel) * 20}px\`;
    return "0px";
};

const calculateRY = (rel: number) => {
    if (rel === 0) return "0deg";
    if (rel > 0 && rel < 1) {
        if (rel <= 0.5) return \`\${rel * 2 * -24}deg\`;
        return \`\${-24 + (rel - 0.5) * 2 * 24}deg\`;
    }
    if (rel < 0 && rel > -1) {
        if (rel >= -0.5) return \`\${-rel * 2 * 24}deg\`;
        return \`\${24 - (-rel - 0.5) * 2 * 24}deg\`;
    }
    return "0deg";
};

const calculateRZ = (rel: number) => {
    if (rel === 0) return "0deg";
    if (rel > 0 && rel < 1) return \`\${rel * -6}deg\`;
    if (rel < 0 && rel > -1) return \`\${-rel * 6}deg\`;
    if (rel >= 1) return \`\${-4 + rel * -2}deg\`;
    if (rel <= -1) return \`\${4 + Math.abs(rel) * 2}deg\`;
    return "0deg";
};

const calculateRX = (rel: number) => {
    if (rel === 0) return "0deg";
    if (Math.abs(rel) > 0 && Math.abs(rel) < 1) {
        if (Math.abs(rel) <= 0.5) return \`\${Math.abs(rel) * 2 * 2}deg\`;
        return \`\${2 - (Math.abs(rel) - 0.5) * 2 * 2}deg\`;
    }
    return "0deg";
};

const calculateOp = (rel: number) => 1 / Math.pow(3, Math.abs(rel));

// --- Components ---

interface CardProps {
    item: CardItem;
    index: number;
    totalCards: number;
    scrollXProgress: MotionValue<number>;
    bgTransform: MotionValue<string>;
}

const Card = ({ item, index, totalCards, scrollXProgress, bgTransform }: CardProps) => {
    const relTransform = useTransform(scrollXProgress, (p: number) => {
        const maxIndex = Math.max(1, totalCards - 1);
        return p * maxIndex - index;
    });

    const tX = useTransform(relTransform, calculateX);
    const tZ = useTransform(relTransform, calculateZ);
    const rY = useTransform(relTransform, calculateRY);
    const rZ = useTransform(relTransform, calculateRZ);
    const rX = useTransform(relTransform, calculateRX);
    const op = useTransform(relTransform, calculateOp);

    // --- Hover Interaction State ---
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const hoverOpacity = useMotionValue(0);

    const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 20 });
    const smoothHoverOpacity = useSpring(hoverOpacity, { stiffness: 100, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseEnter = () => hoverOpacity.set(1);
    const handleMouseLeave = () => {
        hoverOpacity.set(0);
        mouseX.set(0.5);
        mouseY.set(0.5);
    };
`