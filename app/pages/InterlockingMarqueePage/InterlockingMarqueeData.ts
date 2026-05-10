export const loaderProps = [
    {
        title: "InterlockingMarquee Props",
        props: [
            {
                name: "items",
                type: "React.ReactNode[]",
                defaultValue: "[]",
                description: "Array of elements (logos/icons) to display inside the jigsaw cards."
            },
            {
                name: "variant",
                type: "'classic' | 'curvy' | 'wave' | 'hex'",
                defaultValue: "'classic'",
                description: "The interlocking pattern to use for the jigsaw cards."
            },
            {
                name: "duration",
                type: "number",
                defaultValue: "30000",
                description: "Duration of the marquee scroll in milliseconds."
            },
            {
                name: "reverse",
                type: "boolean",
                defaultValue: "false",
                description: "Whether to scroll in the reverse direction."
            },
            {
                name: "pauseOnHover",
                type: "boolean",
                defaultValue: "true",
                description: "Whether to pause the animation when the user hovers over the marquee."
            },
            {
                name: "className",
                type: "string",
                defaultValue: '""',
                description: "Additional CSS classes for the container."
            }
        ],
    },
    {
        title: "Base Marquee Props",
        props: [
            {
                name: "axis",
                type: "'horizontal' | 'vertical'",
                defaultValue: "'horizontal'",
                description: "The axis of the scroll."
            },
            {
                name: "gap",
                type: "number",
                defaultValue: "0",
                description: "Gap between items in pixels."
            }
        ]
    }
];

export const componentCode = `import React, { useEffect, useRef } from 'react';

// --- Types ---

export interface MarqueeProps {
    /** Array of elements to scroll */
    items: React.ReactNode[];
    /** Direction of scroll */
    axis?: 'horizontal' | 'vertical';
    /** Whether to scroll in reverse direction */
    reverse?: boolean;
    /** Animation duration in milliseconds */
    duration?: number;
    /** Gap between items in pixels */
    gap?: number;
    /** Whether to pause the animation on hover */
    pauseOnHover?: boolean;
    /** Additional CSS classes for the container */
    className?: string;
}

export interface InterlockingMarqueeProps {
    /** Array of logos/elements to display in the jigsaw cards */
    items: React.ReactNode[];
    /** Animation duration in milliseconds */
    duration?: number;
    /** Whether to scroll in reverse direction */
    reverse?: boolean;
    /** Whether to pause on hover */
    pauseOnHover?: boolean;
    /** The interlocking pattern to use */
    variant?: 'classic' | 'curvy' | 'wave' | 'hex';
    /** Additional CSS classes */
    className?: string;
}

// --- Jigsaw Shape Configurations ---
const VARIANTS = {
    classic: [
        {
            // 1: Left Slot, Right Tab
            path: 'polygon(0 0, 0 35%, 22px 42%, 22px 58%, 0 65%, 0 100%, calc(100% - 22px) 100%, calc(100% - 22px) 65%, 100% 58%, 100% 42%, calc(100% - 22px) 35%, calc(100% - 22px) 0)',
            offset: '-translate-x-[4px]',
            width: 220,
            height: 120,
            ml: -20
        },
        {
            // 2: Left Slot, Right Slot
            path: 'polygon(0 0, 0 35%, 22px 42%, 22px 58%, 0 65%, 0 100%, 100% 100%, 100% 65%, calc(100% - 22px) 58%, calc(100% - 22px) 42%, 100% 35%, 100% 0)',
            offset: 'translate-x-0',
            width: 220,
            height: 120,
            ml: -20
        },
        {
            // 3: Left Tab, Right Slot
            path: 'polygon(22px 0, 22px 35%, 0 42%, 0 58%, 22px 65%, 22px 100%, 100% 100%, 100% 65%, calc(100% - 22px) 58%, calc(100% - 22px) 42%, 100% 35%, 100% 0)',
            offset: 'translate-x-[4px]',
            width: 220,
            height: 120,
            ml: -20
        },
        {
            // 4: Left Tab, Right Tab
            path: 'polygon(22px 0, 22px 35%, 0 42%, 0 58%, 22px 65%, 22px 100%, calc(100% - 22px) 100%, calc(100% - 22px) 65%, 100% 58%, 100% 42%, calc(100% - 22px) 35%, calc(100% - 22px) 0)',
            offset: 'translate-x-0',
            width: 220,
            height: 120,
            ml: -20
        }
    ],
    curvy: [
        {
            // p1: 84x60
            path: 'url(#cp-p1)',
            offset: 'translate-x-0',
            width: 168,
            height: 120,
            ml: -22
        },
        {
            // p2: 60x60
            path: 'url(#cp-p2)',
            offset: 'translate-x-0',
            width: 120,
            height: 120,
            ml: -22
        },
        {
            // p3: 72x60
            path: 'url(#cp-p3)',
            offset: 'translate-x-0',
            width: 144,
            height: 120,
            ml: -22
        }
    ],
    wave: [
        {
            // Wave Pattern
            path: 'polygon(18px 0, 24px 20%, 0 35%, 8px 50%, 0 65%, 24px 80%, 18px 100%, calc(100% - 18px) 100%, calc(100% - 24px) 80%, 100% 65%, calc(100% - 8px) 50%, 100% 35%, calc(100% - 24px) 20%, calc(100% - 18px) 0)',
            offset: 'translate-x-0',
            width: 220,
            height: 120,
            ml: -20
        }
    ],
    hex: [
        {
            // Hex Lock Pattern
            path: 'polygon(20px 0, 0 25%, 20px 50%, 0 75%, 20px 100%, calc(100% - 20px) 100%, 100% 75%, calc(100% - 20px) 50%, 100% 25%, calc(100% - 20px) 0)',
            offset: 'translate-x-0',
            width: 220,
            height: 120,
            ml: -20
        }
    ]
};

const HOVER_COLORS = [
    'group-hover:text-[#F2EEE9]',
    'group-hover:text-[#E6DFF1]',
    'group-hover:text-[#C0DEDD]'
];

// --- Base Marquee Component ---
export const Marquee: React.FC<MarqueeProps> = ({
    items,
    axis = 'horizontal',
    reverse = false,
    duration = 25000,
    gap = 0,
    pauseOnHover = true,
    className = "",
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<Animation | null>(null);
    const isVertical = axis === 'vertical';

    useEffect(() => {
        if (!trackRef.current) return;

        const translateProp = isVertical ? 'translateY' : 'translateX';
        const from = reverse ? '-50%' : '0%';
        const to = reverse ? '0%' : '-50%';

        animationRef.current = trackRef.current.animate(
            [
                { transform: \`\${translateProp}(\${from})\` },
                { transform: \`\${translateProp}(\${to})\` }
            ],
            {
                duration: duration,
                iterations: Infinity,
                easing: 'linear'
            }
        );

        return () => {
            animationRef.current?.cancel();
        };
    }, [axis, reverse, duration, isVertical]);

    const handleMouseEnter = () => {
        if (pauseOnHover) animationRef.current?.pause();
    };

    const handleMouseLeave = () => {
        if (pauseOnHover) animationRef.current?.play();
    };

    const maskStyle: React.CSSProperties = isVertical
        ? { WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }
        : { WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' };

    return (
        <div
            className={\`flex w-full overflow-hidden \${isVertical ? 'h-full w-max flex-col' : 'w-full h-max py-4'} \${className}\`}
            style={maskStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={trackRef}
                className={\`flex \${isVertical ? 'flex-col' : 'flex-row'} w-max h-max\`}
            >
                {/* Group 1 */}
                <div
                    className={\`flex shrink-0 \${isVertical ? 'flex-col' : 'flex-row'}\`}
                    style={{
                        gap: \`\${gap}px\`,
                        paddingRight: isVertical ? 0 : \`\${gap}px\`,
                        paddingBottom: isVertical ? \`\${gap}px\` : 0,
                    }}
                >
                    {items.map((item, i) => (
                        <div key={\`g1-\${i}\`} className="flex shrink-0">
                            {item}
                        </div>
                    ))}
                </div>

                {/* Group 2 (Duplicate for seamless loop) */}
                <div
                    className={\`flex shrink-0 \${isVertical ? 'flex-col' : 'flex-row'}\`}
                    style={{ gap: \`\${gap}px\` }}
                >
                    {items.map((item, i) => (
                        <div key={\`g2-\${i}\`} className="flex shrink-0">
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Interlocking Marquee Component ---
export const InterlockingMarquee: React.FC<InterlockingMarqueeProps> = ({
    items,
    variant = 'classic',
    duration = 30000,
    reverse = false,
    pauseOnHover = true,
    className = "",
}) => {
    const jigsawItems = items.map((logo, idx) => {
        const shapes = VARIANTS[variant] || VARIANTS.classic;
        const config = shapes[idx % shapes.length];
        const hoverColor = HOVER_COLORS[idx % HOVER_COLORS.length];
        const animDuration = 3;
        const delay = [1, 2, 2, 1, 1, 2, 1, 2][idx % 8];

        return (
            <div
                key={idx}
                className="shrink-0 group transition-all duration-500 relative hover:!z-50"
                style={{
                    animation: \`shiftDepth \${animDuration}s ease-in-out \${delay}s infinite alternate\`,
                    marginLeft: \`\${config.ml}px\`,
                }}
            >
                <div
                    className={\`relative flex items-center justify-center bg-[#181A1E] text-[#799996] \${hoverColor} transition-all duration-500 cursor-pointer overflow-hidden\`}
                    style={{ 
                        clipPath: config.path,
                        width: \`\${config.width}px\`,
                        height: \`\${config.height}px\`,
                    }}
                >
                    {/* Shimmering sharp noise overlay */}
                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] z-0"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <filter id="pillNoiseFilter">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.75"
                                numOctaves="4"
                                stitchTiles="stitch"
                            />
                            {/* Higher contrast and slight silver tint for 'shimmering' */}
                            <feColorMatrix type="matrix" values="
                                1 0 0 0 0.1 
                                0 1 0 0 0.1 
                                0 0 1 0 0.2 
                                0 0 0 2.2 -0.9"
                            />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#pillNoiseFilter)" />
                    </svg>

                    {/* Subtle inner bevel */}
                    <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),inset_0_0_8px_rgba(0,0,0,0.2)] pointer-events-none" />

                    {/* Centered Logo */}
                    <div className={\`relative z-10 scale-75 md:scale-100 transition-all duration-500 group-hover:scale-[0.85] md:group-hover:scale-110 group-hover:drop-shadow-[0_0_3px_currentColor] \${config.offset}\`}>
                        {logo}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className={\`w-full \${className}\`}>
            <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                <defs>
                    <clipPath id="cp-p1" clipPathUnits="objectBoundingBox">
                        <path transform="scale(0.01190476, 0.01666667)" d="M30 0C30 6.62742 35.3726 12 42 12C48.6274 12 54 6.62742 54 0H70C71.1046 9.01957e-07 72 0.895431 72 2V18C78.6274 18 84 23.3726 84 30C84 36.6274 78.6274 42 72 42V58C72 59.1046 71.1046 60 70 60H54C54 53.3726 48.6274 48 42 48C35.3726 48 30 53.3726 30 60H14C12.8954 60 12 59.1046 12 58V42C5.37258 42 0 36.6274 0 30C0 23.3726 5.37258 18 12 18V2C12 0.895431 12.8954 5.63724e-08 14 0H30Z" />
                    </clipPath>
                    <clipPath id="cp-p1" clipPathUnits="objectBoundingBox">
                        <path transform="scale(0.01190476, 0.01666667)" d="M30 0C30 6.62742 35.3726 12 42 12C48.6274 12 54 6.62742 54 0H70C71.1046 9.01957e-07 72 0.895431 72 2V18C78.6274 18 84 23.3726 84 30C84 36.6274 78.6274 42 72 42V58C72 59.1046 71.1046 60 70 60H54C54 53.3726 48.6274 48 42 48C35.3726 48 30 53.3726 30 60H14C12.8954 60 12 59.1046 12 58V42C5.37258 42 0 36.6274 0 30C0 23.3726 5.37258 18 12 18V2C12 0.895431 12.8954 5.63724e-08 14 0H30Z" />
                    </clipPath>
                    <clipPath id="cp-p2" clipPathUnits="objectBoundingBox">
                        <path transform="scale(0.01666667, 0.01666667)" d="M30 12C23.3726 12 18 6.62742 18 0H2C0.895431 0 0 0.895431 0 2V18C6.62742 18 12 23.3726 12 30C12 36.6274 6.62742 42 0 42V58C0 59.1046 0.895431 60 2 60H42H58C59.1046 60 60 59.1046 60 58V42C53.3726 42 48 36.6274 48 30C48 23.3726 53.3726 18 60 18V2C60 0.895431 59.1046 0 58 0H42C42 6.62742 36.6274 12 30 12Z" />
                    </clipPath>
                    <clipPath id="cp-p3" clipPathUnits="objectBoundingBox">
                        <path transform="scale(0.01388889, 0.01666667)" d="M42 12C35.3726 12 30 6.62742 30 0H14C12.8954 0 12 0.895431 12 2V18C5.37258 18 0 23.3726 0 30C0 36.6274 5.37258 42 12 42V58C12 59.1046 12.8954 60 14 60H54H70C71.1046 60 72 59.1046 72 58V42C65.3726 42 60 36.6274 60 30C60 23.3726 65.3726 18 72 18V2C72 0.895431 71.1046 0 70 0H54C54 6.62742 48.6274 12 42 12Z" />
                    </clipPath>
                </defs>
            </svg>
            <style>{\`
                @keyframes shiftDepth {
                    0% { 
                        z-index: 10; 
                        transform: scale(1); 
                        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3)) drop-shadow(0 1px 2px rgba(0,0,0,0.5));
                    }
                    100% { 
                        z-index: 30; 
                        transform: scale(1.015); 
                        filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)) drop-shadow(0 2px 4px rgba(0,0,0,0.7));
                    }
                }
            \`}</style>
            <Marquee
                items={jigsawItems}
                duration={duration}
                reverse={reverse}
                pauseOnHover={pauseOnHover}
                gap={0}
            />
        </div>
    );
};

export default InterlockingMarquee;
`;

export const creditsData = [
    {
        title: "Component Source",
        items: [
            { name: "ReactBytes", role: "Library", url: "https://github.com/ChandruMIT-o/reactbytes" },
            { name: "Magic UI", role: "Inspiration", url: "https://magicui.design" },
        ],
    },
];
