export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'PHASE'",
				description: "The string to pass to the chronographic layout matrix.",
			},
			{
				name: "fontSize",
				type: "number",
				defaultValue: "95",
				description: "Absolute size of font in pixels (manages tightly bounded box metrics).",
			},
			{
				name: "impactForce",
				type: "number",
				defaultValue: "1.3",
				description: "Global force multiplier of pointer kinetic impact.",
			},
			{
				name: "influenceRadius",
				type: "number",
				defaultValue: "80",
				description: "Proximity trigger radius for pointer intersection (in pixels).",
			},
		],
	},
	{
		title: "Layer & Color Props",
		props: [
			{
				name: "coreColor",
				type: "string",
				defaultValue: "'#ffffff'",
				description: "Color of the center Core typography layer.",
			},
			{
				name: "inertialColor",
				type: "string",
				defaultValue: "'rgba(129, 140, 248, 0.5)'",
				description: "Color of the heavy lagging Inertial outline shell.",
			},
			{
				name: "tensionColor",
				type: "string",
				defaultValue: "'rgba(6, 182, 212, 0.4)'",
				description: "Color of the volatile Tension wireframe shell and vector trusses.",
			},
			{
				name: "className",
				type: "string",
				defaultValue: "''",
				description: "Extra wrapper element CSS utility layout classes.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useRef } from "react";

interface ShellLayer {
    x: number;         // Current relative spatial X
    y: number;         // Current relative spatial Y
    vx: number;        // Velocity X
    vy: number;        // Velocity Y
    massFactor: number;// Unique kinetic weight allocation
    stiffness: number; // Tailored return response
    damping: number;   // Friction profile
}

interface PhaseNode {
    char: string;
    centerX: number;   // True system anchor layout X
    centerY: number;   // True system anchor layout Y
    width: number;
    layers: ShellLayer[]; // 0: Core (Rigid), 1: Inertial (Heavy), 2: Tension (Volatile)
}

export interface PhaseShellTextProps {
    /** The string to pass to the chronographic layout matrix */
    text?: string;
    /** Absolute size of font in pixels - manages tightly bounded box metrics */
    fontSize?: number;
    /** Color of the center Core typography layer */
    coreColor?: string;
    /** Color of the heavy lagging Inertial outline shell */
    inertialColor?: string;
    /** Color of the volatile Tension wireframe shell and vector trusses */
    tensionColor?: string;
    /** Global force multiplier of pointer kinetic impact */
    impactForce?: number;
    /** Proximity trigger radius for pointer intersection */
    influenceRadius?: number;
    /** Extra wrapper element CSS utility layout classes */
    className?: string;
}

export const PhaseShellText: React.FC<PhaseShellTextProps> = ({
    text = "PHASE",
    fontSize = 95,
    coreColor = "#ffffff",
    inertialColor = "rgba(129, 140, 248, 0.5)", // Structural slate indigo
    tensionColor = "rgba(6, 182, 212, 0.4)",    // High-frequency telemetry cyan
    impactForce = 1.3,
    influenceRadius = 80,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const nodesRef = useRef<PhaseNode[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, active: false });
    const prevMouseRef = useRef({ x: -1000, y: -1000 });
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

        // Perform strict text dimension analysis to bound canvas frame exactly to contents
        const characters = text.split("");
        let accumulatedX = 0;
        const metrics = characters.map((char) => {
            const w = ctx.measureText(char).width;
            const res = { char, width: w, startX: accumulatedX };
            accumulatedX += w;
            return res;
        });

        const totalWidth = accumulatedX + paddingX * 2;
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

        // Construct character arrays initialized with 3 fully decoupled physical layers
        nodesRef.current = metrics.map((m) => {
            const nodeCenterX = paddingX + m.startX + m.width / 2;
            return {
                char: m.char,
                centerX: nodeCenterX,
                centerY: centerY,
                width: m.width,
                layers: [
                    // Layer 0: Core (Fast snap-back, low tracking deflection)
                    { x: 0, y: 0, vx: 0, vy: 0, massFactor: 0.3, stiffness: 0.09, damping: 0.72 },
                    // Layer 1: Inertial (Heavy mass, massive tracking latency)
                    { x: 0, y: 0, vx: 0, vy: 0, massFactor: 1.1, stiffness: 0.04, damping: 0.84 },
                    // Layer 2: Tension (Hyper-light, massive orbital displacement envelope)
                    { x: 0, y: 0, vx: 0, vy: 0, massFactor: 2.4, stiffness: 0.06, damping: 0.78 },
                ],
            };
        });
    }, [text, fontSize, paddingX, paddingY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const executionLoop = () => {
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            // Isolate local frame changes cleanly over a native transparent background
            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;
            
            // Extract kinetic displacement vector from tracking updates
            if (mouse.active && prevMouseRef.current.x !== -1000) {
                mouse.vx = (mouse.x - prevMouseRef.current.x) * 0.4;
                mouse.vy = (mouse.y - prevMouseRef.current.y) * 0.4;
            } else {
                mouse.vx *= 0.8;
                mouse.vy *= 0.8;
            }
            prevMouseRef.current.x = mouse.x;
            prevMouseRef.current.y = mouse.y;

            const nodes = nodesRef.current;

            nodes.forEach((node) => {
                const dx = mouse.x - node.centerX;
                const dy = mouse.y - node.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 1. CHRONOGRAPHIC SYSTEM PHYSICS KINETICS
                node.layers.forEach((layer, idx) => {
                    if (mouse.active && distance < influenceRadius) {
                        const proximityFactor = (influenceRadius - distance) / influenceRadius;
                        const angle = Math.atan2(dy, dx);

                        // Differentiate repulsion velocity metrics based on layer identity
                        const forceEnvelope = proximityFactor * impactForce * layer.massFactor;
                        
                        // Push layers outward while blending pointer cross-velocities
                        layer.vx += Math.cos(angle) * forceEnvelope * 1.5 + mouse.vx * 0.15;
                        layer.vy += Math.sin(angle) * forceEnvelope * 1.5 + mouse.vy * 0.15;
                    }

                    // Hooke's Vector Spring equations governing return profiles
                    const springForceX = (0 - layer.x) * layer.stiffness;
                    const springForceY = (0 - layer.y) * layer.stiffness;

                    layer.vx = (layer.vx + springForceX) * layer.damping;
                    layer.vy = (layer.vy + springForceY) * layer.damping;

                    layer.x += layer.vx;
                    layer.y += layer.vy;
                });

                // Short references to layer positions for clean rendering offsets
                const cL = node.layers[0]; // Core
                const iL = node.layers[1]; // Inertial
                const tL = node.layers[2]; // Tension

                // 2. TECH WIREFRAME TRUSS RENDERING PASS
                const combinedVariance = Math.sqrt(
                    (tL.x - cL.x) * (tL.x - cL.x) + (tL.y - cL.y) * (tL.y - cL.y)
                );

                if (combinedVariance > 3) {
                    ctx.save();
                    ctx.strokeStyle = tensionColor;
                    ctx.lineWidth = 0.6;

                    // Geometric connection links drawing a physical lattice between layer vertices
                    ctx.beginPath();
                    ctx.moveTo(node.centerX + cL.x, node.centerY + cL.y);
                    ctx.lineTo(node.centerX + iL.x, node.centerY + iL.y);
                    ctx.lineTo(node.centerX + tL.x, node.centerY + tL.y);
                    ctx.stroke();

                    // Micro-Telemetry Data Readout
                    if (combinedVariance > 18) {
                        ctx.fillStyle = tensionColor;
                        ctx.font = \`500 8px monospace\`;
                        ctx.textAlign = "left";
                        
                        const varianceString = \`Δ:\${combinedVariance.toFixed(1)}\`;
                        ctx.fillText(
                            varianceString, 
                            node.centerX + tL.x + (node.width / 2) - 4, 
                            node.centerY + tL.y - (fontSize * 0.3)
                        );
                    }
                    ctx.restore();
                }

                // 3. TYPOGRAPHY HULL RENDERING PASS
                ctx.save();
                ctx.font = \`900 \${fontSize}px "Space Grotesk", -apple-system, sans-serif\`;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";

                // Step A: Draw Outer Tension Hull (Light wireframe dash)
                ctx.save();
                ctx.strokeStyle = tensionColor;
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 4]);
                ctx.strokeText(node.char, node.centerX + tL.x, node.centerY + tL.y);
                ctx.restore();

                // Step B: Draw Middle Inertial Hull (Translucent outline)
                ctx.save();
                ctx.strokeStyle = inertialColor;
                ctx.lineWidth = 1.5;
                ctx.strokeText(node.char, node.centerX + iL.x, node.centerY + iL.y);
                ctx.restore();

                // Step C: Draw Core Hull (Solid base typography face)
                ctx.fillStyle = coreColor;
                ctx.fillText(node.char, node.centerX + cL.x, node.centerY + cL.y);

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(executionLoop);
        };

        animationFrameId.current = requestAnimationFrame(executionLoop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [coreColor, inertialColor, tensionColor, fontSize, influenceRadius, impactForce]);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.active = true;
    };

    return (
        <div className={\`inline-block select-none overflow-visible \${className}\`}>
            <canvas
                ref={canvasRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={() => {
                    mouseRef.current.active = false;
                    prevMouseRef.current = { x: -1000, y: -1000 };
                }}
                className="block touch-none cursor-none"
            />
        </div>
    );
};

export default PhaseShellText;`;

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
