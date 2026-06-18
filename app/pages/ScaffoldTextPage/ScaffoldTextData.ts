export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'SCAFFOLD'",
				description: "The text string to animate.",
			},
			{
				name: "animationState",
				type: "'enter' | 'stable' | 'exit'",
				defaultValue: "'enter'",
				description: "Current state machine lifecycle hook.",
			},
			{
				name: "fontSize",
				type: "number",
				defaultValue: "80",
				description: "Font size scale in pixels (defines structural container bounds).",
			},
			{
				name: "transitionSpeed",
				type: "number",
				defaultValue: "0.04",
				description: "Transition speed factor of the entrance/exit layout tracking.",
			},
			{
				name: "influenceRadius",
				type: "number",
				defaultValue: "65",
				description: "Boundary interaction radius for cursor proximity (in pixels).",
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
				description: "Primary typography color.",
			},
			{
				name: "scaffoldColor",
				type: "string",
				defaultValue: "'rgba(14, 165, 233, 0.4)'",
				description: "Tech scaffolding color (wires, frames, coordinate readouts).",
			},
			{
				name: "className",
				type: "string",
				defaultValue: "''",
				description: "Extra element utility CSS layout classes.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useRef } from "react";

interface ScaffoldNode {
    char: string;
    centerX: number;      // Home layout coordinate X
    centerY: number;      // Home layout coordinate Y
    width: number;        // Character geometry width
    x: number;            // Kinetic displacement X
    y: number;            // Kinetic displacement Y
    vx: number;           // Kinetic velocity X
    vy: number;           // Kinetic velocity Y
    progress: number;     // Core lifecycle timeline progress (0 = gone, 1 = fully stable)
    enterDelay: number;   // Stagger offset for entrance scheduling
    exitDelay: number;    // Stagger offset for exit scheduling
}

export interface ScaffoldTextProps {
    /** The text string to animate */
    text?: string;
    /** Current state machine lifecycle hook */
    animationState?: "enter" | "stable" | "exit";
    /** Font size scale in pixels - drives structural container bounds */
    fontSize?: number;
    /** Primary typography color */
    color?: string;
    /** Tech scaffolding color (wires, frames, coordinate readouts) */
    scaffoldColor?: string;
    /** Transition speed factor of the entrance/exit layout tracking */
    transitionSpeed?: number;
    /** Boundary interaction radius for cursor proximity */
    influenceRadius?: number;
    /** Extra element utility CSS layout classes */
    className?: string;
}

export const ScaffoldText: React.FC<ScaffoldTextProps> = ({
    text = "SCAFFOLD",
    animationState = "enter",
    fontSize = 80,
    color = "#ffffff",
    scaffoldColor = "rgba(14, 165, 233, 0.4)", // Cybernetic telemetry blue
    transitionSpeed = 0.04,
    influenceRadius = 65,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const nodesRef = useRef<ScaffoldNode[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const animationFrameId = useRef<number | null>(null);

    const paddingX = fontSize * 0.6;
    const paddingY = fontSize * 0.5;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const fontStyle = \`900 \${fontSize}px "Space Grotesk", -apple-system, sans-serif\`;
        ctx.font = fontStyle;

        // Bounding metric analysis sweep to frame text width specs perfectly
        const characters = text.split("");
        let currentXOffset = 0;
        const metrics = characters.map((char) => {
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
        const count = characters.length;

        // Map layout nodes and inject staggered timeline delays
        nodesRef.current = metrics.map((m, index) => {
            const nodeCenterX = paddingX + m.startX + m.width / 2;
            return {
                char: m.char,
                centerX: nodeCenterX,
                centerY: centerY,
                width: m.width,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                // If developer mounts component directly as stable, set timeline to 1 immediately
                progress: animationState === "stable" ? 1 : 0,
                enterDelay: index * 6,         // Left-to-right cascade entrance
                exitDelay: (count - 1 - index) * 5, // Right-to-left cascade exit
            };
        });
    }, [text, fontSize, paddingX, paddingY, animationState]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frameCounter = 0;

        const loop = () => {
            frameCounter++;
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            // Isolate layout clears to support native transparent background layouts
            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;
            const nodes = nodesRef.current;

            nodes.forEach((node) => {
                // 1. LIFECYCLE STATE MANAGEMENT DRIVER
                let targetProgress = node.progress;
                
                if (animationState === "enter" || animationState === "stable") {
                    if (frameCounter >= node.enterDelay) {
                        targetProgress = 1; // Pull timeline toward fully completed assembly
                    }
                } else if (animationState === "exit") {
                    if (frameCounter >= node.exitDelay) {
                        targetProgress = 0; // Force collapse downward toward exited void
                    }
                }

                // Smoothly process progress values via timeline interpolation hooks
                node.progress += (targetProgress - node.progress) * transitionSpeed;

                // 2. KINETIC MOUSE INTERACTION PASS (Only active when node structural assembly is stable)
                const dx = mouse.x - (node.centerX + node.x);
                const dy = mouse.y - (node.centerY + node.y);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (mouse.active && distance < influenceRadius && node.progress > 0.85) {
                    const structuralStrain = (influenceRadius - distance) / influenceRadius;
                    const strainAngle = Math.atan2(dy, dx);

                    // Magnetic cursor repulsion pull
                    node.vx -= Math.cos(strainAngle) * structuralStrain * 1.8;
                    node.vy -= Math.sin(strainAngle) * structuralStrain * 1.8;
                }

                // Industrial spring relaxation constants returning node back to true design coordinates
                const stiffness = 0.07;
                const damping = 0.78;
                const springX = (0 - node.x) * stiffness;
                const springY = (0 - node.y) * stiffness;

                node.vx = (node.vx + springX) * damping;
                node.vy = (node.vy + springY) * damping;

                node.x += node.vx;
                node.y += node.vy;

                // 3. GRAPHICS ENGINEERING & RENDERING RASTER PASS
                if (node.progress < 0.005) return; // Skip rendering unformed modules

                const renderX = node.centerX + node.x;
                const renderY = node.centerY + node.y;
                const halfW = node.width / 2 + 6;
                const halfH = fontSize / 2 + 6;

                // VISUAL ELEMENT A: Vertical Architecture Alignment Guide Wires
                ctx.save();
                ctx.strokeStyle = scaffoldColor;
                ctx.globalAlpha = node.progress * 0.35;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(renderX, 0);
                ctx.lineTo(renderX, height);
                ctx.stroke();
                ctx.restore();

                // VISUAL ELEMENT B: Structural Scaffolding Bracket Framing
                ctx.save();
                ctx.strokeStyle = scaffoldColor;
                ctx.lineWidth = 0.8;
                // Fade and scale frame box elements proportional to internal lifecycle metrics
                ctx.globalAlpha = node.progress;
                
                // Animate bracket scaling widths outward from center alignment points
                const currentBoxW = halfW * node.progress;
                ctx.strokeRect(renderX - currentBoxW, renderY - halfH, currentBoxW * 2, halfH * 2);

                // Tiny crosshair registration dots on frame intersections
                if (node.progress > 0.9) {
                    ctx.fillStyle = scaffoldColor;
                    ctx.fillRect(renderX - halfW - 2, renderY - 2, 4, 4);
                    ctx.fillRect(renderX + halfW - 2, renderY - 2, 4, 4);
                }
                ctx.restore();

                // VISUAL ELEMENT C: Masked Slotted Solid Typography Engine
                ctx.save();
                ctx.font = \`900 \${fontSize}px "Space Grotesk", -apple-system, sans-serif\`;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";

                // Construct a tight vector bounding mask window that expands based on timeline progress
                ctx.beginPath();
                const clipHeight = (halfH * 2) * node.progress;
                ctx.rect(renderX - halfW - 5, renderY - halfH, halfW * 2 + 10, clipHeight);
                ctx.clip();

                // Slide typography faces upward through the active window frame
                ctx.fillStyle = color;
                const slideOffsetY = (fontSize * 0.8) * (1 - node.progress);
                ctx.fillText(node.char, renderX, renderY + slideOffsetY);

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(loop);
        };

        animationFrameId.current = requestAnimationFrame(loop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [animationState, color, scaffoldColor, fontSize, transitionSpeed, influenceRadius]);

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
                className="block touch-none cursor-crosshair"
            />
        </div>
    );
};

export default ScaffoldText;`;

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
