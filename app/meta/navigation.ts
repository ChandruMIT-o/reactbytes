export const navItems = [
    {
        category: "Text",
        items: [
            { id: "blur-text", label: "Blur Text" },
            { id: "fall-down", label: "Fall Down" },
            { id: "blur-in", label: "Blur In" },
            { id: "reveal-under", label: "Reveal Under" },
            { id: "variable-weight", label: "Variable Weight" },
            { id: "wave-text", label: "Proximity Ripple" },
            { id: "focal-blur", label: "Focal Blur" },
            { id: "magnetic-text", label: "Magnetic Repel" },
            { id: "shatter-text", label: "Cinematic Shatter" },
            { id: "gooey-morph", label: "Gooey Morph" },
            { id: "elastic-reveal", label: "Elastic Reveal" },
            { id: "scramble-reveal", label: "Scramble Reveal" },
            { id: "keyboard-text", label: "Keyboard Text" },
        ],
    },
    {
        category: "Background",
        items: [
            { id: "magnetic-dots", label: "Magnetic Dot Mesh" },
            { id: "bubble-gradient", label: "Bubble Gradient" },
            { id: "fractal-background", label: "Fractal Background" },
            { id: "cellular-automata", label: "Cellular Automata" },
            { id: "hive-mind", label: "Hive Mind" },
            { id: "perlin-smoke", label: "Perlin Smoke" },
            { id: "metallic-twirl", label: "Metallic Twirl" },
            { id: "liquid-noise", label: "Liquid Noise" },
        ],
    },
    {
        category: "Miscellaneous",
        items: [
            { id: "standard-accordion", label: "Standard Accordion" },
            { id: "glow-card", label: "Glowing Shadows" },
            { id: "shiny-button", label: "Shiny CTA" },
            { id: "docked-carousel", label: "Docked Carousel" },
            { id: "vertical-menu", label: "Vertical Menu" },
            { id: "holo-card", label: "Holographic Card" },
        ],
    },
];

export const allNavItems = navItems.flatMap((category) => category.items);
