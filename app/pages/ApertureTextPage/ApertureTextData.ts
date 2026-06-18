export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'DESTRUCT'",
				description: "The typography string to separate and animate.",
			},
			{
				name: "fontSize",
				type: "number",
				defaultValue: "85",
				description: "Scale of font size in pixels (defines localized canvas bounds).",
			},
			{
				name: "expansionForce",
				type: "number",
				defaultValue: "18",
				description: "Maximum displacement reach of the separating plates.",
			},
			{
				name: "influenceRadius",
				type: "number",
				defaultValue: "75",
				description: "Proximity threshold for the pointer pressure trigger.",
			},
			{
				name: "stiffness",
				type: "number",
				defaultValue: "0.07",
				description: "Mechanical lock-back spring stiffness index (Hooke's spring constant).",
			},
			{
				name: "damping",
				type: "number",
				defaultValue: "0.76",
				description: "Kinetic friction dampening index (velocity decay multiplier).",
			},
		],
	},
	{
		title: "Styling & Color Props",
		props: [
			{
				name: "color",
				type: "string",
				defaultValue: "'#ffffff'",
				description: "Foreground color of the solid shifting character plates.",
			},
			{
				name: "blueprintColor",
				type: "string",
				defaultValue: "'rgba(244, 63, 94, 0.45)'",
				description: "Color of the inner wireframe blueprint revealed on fracture.",
			},
			{
				name: "className",
				type: "string",
				defaultValue: "''",
				description: "Extra wrapper element styling classes.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useRef } from "react";

interface QuadrantPlate {
    x: number;        // Spatial X displacement from center
    y: number;        // Spatial Y displacement from center
    vx: number;       // Kinetic velocity X
    vy: number;       // Kinetic velocity Y
    dirX: number;     // Natural structural expansion vector X
    dirY: number;     // Natural structural expansion vector Y
}

interface ApertureNode {
    char: string;
    centerX: number;  // Local layout center coordinates
    centerY: number;
    width: number;
    plates: QuadrantPlate[]; // 0: Top, 1: Right, 2: Bottom, 3: Left
}

export interface ApertureTextProps {
    /** The typography string to separate and animate */
    text?: string;
    /** Scale of font size in pixels - defines localized canvas bounds */
    fontSize?: number;
    /** Foreground color of the solid shifting character plates */
    color?: string;
    /** Color of the inner wireframe blueprint revealed on fracture */
    blueprintColor?: string;
    /** Maximum displacement reach of the separating plates */
    expansionForce?: number;
    /** Proximity threshold for the pointer pressure trigger */
    influenceRadius?: number;
    /** Mechanical lock-back spring stiffness index */
    stiffness?: number;
    /** Kinetic friction dampening index */
    damping?: number;
    /** Extra wrapper element styling classes */
    className?: string;
}

export const ApertureText: React.FC<ApertureTextProps> = ({
    text = "DESTRUCT",
    fontSize = 85,
    color = "#ffffff",
    blueprintColor = "rgba(244, 63, 94, 0.45)", // Technical mechanical rose/red
    expansionForce = 18,
    influenceRadius = 75,
    stiffness = 0.07,
    damping = 0.76,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const nodesRef = useRef<ApertureNode[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const animationFrameId = useRef<number | null>(null);

    const paddingX = fontSize * 0.5;
    const paddingY = fontSize * 0.4;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const fontStyle = \`900 \${fontSize}px "Space Grotesk", -apple-system, sans-serif\`;
        ctx.font = fontStyle;

        // Metric sweep to compute precise width parameters
        const characters = text.split("");
        let currentXOffset = 0;
        const layoutMetrics = characters.map((char) => {
            const w = ctx.measureText(char).width;
            const res = { char, width: w, startX: currentXOffset };
            currentXOffset += w;
            return res;
        });

        const totalWidth = currentXOffset + paddingX * 2;
        const totalHeight = fontSize + paddingY * 2;
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        canvas.width = totalWidth * dpr;
        canvas.height = totalHeight * dpr;
        canvas.style.width = \`\${totalWidth}px\`;
        canvas.style.height = \`\${totalHeight}px\`;

        ctx.scale(dpr, dpr);
        ctx.font = fontStyle;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        const centerY = totalHeight / 2;

        // Map layout nodes and generate orthogonal expansion trajectories
        nodesRef.current = layoutMetrics.map((m) => {
            const nodeCenterX = paddingX + m.startX + m.width / 2;
            return {
                char: m.char,
                centerX: nodeCenterX,
                centerY: centerY,
                width: m.width,
                plates: [
                    { x: 0, y: 0, vx: 0, vy: 0, dirX: 0, dirY: -1 },  // Top Shard
                    { x: 0, y: 0, vx: 0, vy: 0, dirX: 1, dirY: 0 },  // Right Shard
                    { x: 0, y: 0, vx: 0, vy: 0, dirX: 0, dirY: 1 },  // Bottom Shard
                    { x: 0, y: 0, vx: 0, vy: 0, dirX: -1, dirY: 0 }, // Left Shard
                ],
            };
        });
    }, [text, fontSize, paddingX, paddingY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const animationLoop = () => {
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            // Keep the canvas background entirely transparent
            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;
            const nodes = nodesRef.current;

            nodes.forEach((node) => {
                const dx = mouse.x - node.centerX;
                const dy = mouse.y - node.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 1. ENGINE PHYSICS PASS
                node.plates.forEach((plate) => {
                    if (mouse.active && distance < influenceRadius) {
                        const pressureFactor = (influenceRadius - distance) / influenceRadius;
                        
                        // Inject kinetic energy directly matching the shard's directional rail layout
                        plate.vx += plate.dirX * pressureFactor * expansionForce * 0.25;
                        plate.vy += plate.dirY * pressureFactor * expansionForce * 0.25;
                    }

                    // Snap-back spring formulas matching Hooke's Law bounds
                    const forceX = (0 - plate.x) * stiffness;
                    const forceY = (0 - plate.y) * stiffness;

                    plate.vx = (plate.vx + forceX) * damping;
                    plate.vy = (plate.vy + forceY) * damping;

                    plate.x += plate.vx;
                    plate.y += plate.vy;
                });

                // 2. RENDERING PASS
                ctx.save();
                ctx.font = \`900 \${fontSize}px "Space Grotesk", -apple-system, sans-serif\`;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";

                // Step A: Draw internal blueprint skeleton underneath
                ctx.strokeStyle = blueprintColor;
                ctx.lineWidth = 1.2;
                ctx.strokeText(node.char, node.centerX, node.centerY);

                // Step B: Set boundaries for geometric quadrant slice intersections
                const halfW = node.width / 2 + 15;
                const halfH = fontSize / 2 + 15;

                node.plates.forEach((plate, index) => {
                    ctx.save();

                    // Generate triangular clipping matrix paths matching the shard index
                    ctx.beginPath();
                    ctx.moveTo(node.centerX, node.centerY);

                    if (index === 0) { // Top Plate clipping triangle
                        ctx.lineTo(node.centerX - halfW, node.centerY - halfH);
                        ctx.lineTo(node.centerX + halfW, node.centerY - halfH);
                    } else if (index === 1) { // Right Plate clipping triangle
                        ctx.lineTo(node.centerX + halfW, node.centerY - halfH);
                        ctx.lineTo(node.centerX + halfW, node.centerY + halfH);
                    } else if (index === 2) { // Bottom Plate clipping triangle
                        ctx.lineTo(node.centerX + halfW, node.centerY + halfH);
                        ctx.lineTo(node.centerX - halfW, node.centerY + halfH);
                    } else if (index === 3) { // Left Plate clipping triangle
                        ctx.lineTo(node.centerX - halfW, node.centerY + halfH);
                        ctx.lineTo(node.centerX - halfW, node.centerY - halfH);
                    }
                    ctx.closePath();
                    ctx.clip();

                    // Dislocate the coordinate grid based on spring calculations
                    ctx.translate(plate.x, plate.y);

                    // Render solid plate face texture
                    ctx.fillStyle = color;
                    ctx.fillText(node.char, node.centerX, node.centerY);

                    // Optional subtle tech alignment tick marker for deep separations
                    const displacementMag = Math.sqrt(plate.x * plate.x + plate.y * plate.y);
                    if (displacementMag > 3) {
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(node.centerX + plate.dirX * 5, node.centerY + plate.dirY * 5);
                        ctx.lineTo(node.centerX + plate.dirX * 12, node.centerY + plate.dirY * 12);
                        ctx.stroke();
                    }

                    ctx.restore();
                });

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(animationLoop);
        };

        animationFrameId.current = requestAnimationFrame(animationLoop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [color, blueprintColor, fontSize, influenceRadius, expansionForce, stiffness, damping]);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            active: true,
        };
    };

    return (
        <div className={\`inline-block select-none overflow-visible \${className}\`}>
            <canvas
                ref={canvasRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={() => {
                    mouseRef.current = { x: -1000, y: -1000, active: false };
                }}
                className="block touch-none cursor-cell"
            />
        </div>
    );
};

export default ApertureText;`;

export const creditsData = [
	{
		title: "Component Source",
		items: [
			{
				name: "React Bytes",
				role: "Author",
				url: "https://reactbytes.dev",
			},
		],
	},
	{
		title: "Open Source Libraries",
		items: [
			{
				name: "React",
				role: "UI Framework",
				url: "https://react.dev",
			},
		],
	},
];
