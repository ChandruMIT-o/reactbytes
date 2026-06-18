export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'ROTOR'",
				description: "The text string to mount onto the kinetic drums.",
			},
			{
				name: "fontSize",
				type: "number",
				defaultValue: "90",
				description: "Font size in pixels (defines the tight bounding canvas constraints).",
			},
			{
				name: "torqueForce",
				type: "number",
				defaultValue: "0.55",
				description: "Sensitivity multiplier of cursor velocity turning into rotational torque.",
			},
			{
				name: "influenceRadius",
				type: "number",
				defaultValue: "70",
				description: "Proximity boundary radius for mouse interaction (in pixels).",
			},
			{
				name: "stiffness",
				type: "number",
				defaultValue: "0.05",
				description: "Torsional spring stiffness index forcing return to 0 degrees.",
			},
			{
				name: "damping",
				type: "number",
				defaultValue: "0.81",
				description: "Friction dampening factor to settle spinning momentum.",
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
				description: "Front-facing color of the solid typography.",
			},
			{
				name: "techColor",
				type: "string",
				defaultValue: "'rgba(245, 158, 11, 0.45)'",
				description: "Technical housing frame and structural indicator accent color.",
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

interface HelixNode {
    char: string;
    centerX: number;   // Layout position X anchor
    centerY: number;   // Layout position Y anchor
    width: number;     // Measured letter width bounds
    angle: number;     // Rotation angle around vertical Y axis (in radians)
    vAngle: number;    // Angular velocity component
}

export interface HelixTextProps {
    /** The text string to mount onto the kinetic drums */
    text?: string;
    /** Font size in pixels - defines the tight bounding canvas constraints */
    fontSize?: number;
    /** Front-facing color of the solid typography */
    color?: string;
    /** Technical housing frame and structural indicator accent color */
    techColor?: string;
    /** Sensitivity multiplier of cursor velocity turning into rotational torque */
    torqueForce?: number;
    /** Proximity boundary radius for mouse interaction */
    influenceRadius?: number;
    /** Torsional spring stiffness forcing return to 0 degrees */
    stiffness?: number;
    /** Friction dampening factor to settle spinning momentum */
    damping?: number;
    /** Extra wrapper element styling classes */
    className?: string;
}

export const HelixText: React.FC<HelixTextProps> = ({
    text = "ROTOR",
    fontSize = 90,
    color = "#ffffff",
    techColor = "rgba(245, 158, 11, 0.45)", // Industrial instrumentation amber
    torqueForce = 0.55,
    influenceRadius = 70,
    stiffness = 0.05,
    damping = 0.81,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const nodesRef = useRef<HelixNode[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, active: false });
    const prevMouseXRef = useRef(-1000);
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

        // Metric scan pass to lock container constraints tightly around characters
        const characters = text.split("");
        let currentXAccumulator = 0;
        const metrics = characters.map((char) => {
            const w = ctx.measureText(char).width;
            const res = { char, width: w, startX: currentXAccumulator };
            currentXAccumulator += w;
            return res;
        });

        const totalWidth = currentXAccumulator + paddingX * 2;
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

        // Mount character nodes to independent rotation axle pivots
        nodesRef.current = metrics.map((m) => ({
            char: m.char,
            centerX: paddingX + m.startX + m.width / 2,
            centerY: centerY,
            width: m.width,
            angle: 0,
            vAngle: 0,
        }));
    }, [text, fontSize, paddingX, paddingY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const loop = () => {
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            // Wipe local canvas cleanly maintaining transparent background flow
            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;
            
            // Extract instant horizontal sweep speed
            if (mouse.active && prevMouseXRef.current !== -1000) {
                mouse.vx = (mouse.x - prevMouseXRef.current) * torqueForce;
            } else {
                mouse.vx *= 0.85;
            }
            prevMouseXRef.current = mouse.x;

            const nodes = nodesRef.current;

            nodes.forEach((node) => {
                const dx = mouse.x - node.centerX;
                const dy = mouse.y - node.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 1. ROTATIONAL KINETICS ENGINE
                if (mouse.active && distance < influenceRadius) {
                    const dynamicProximity = (influenceRadius - distance) / influenceRadius;
                    
                    // Inject spin torque based on pointer velocity and entry trajectory angle
                    node.vAngle += mouse.vx * dynamicProximity * 0.08;
                }

                // Torsional Hooke's return spring formula pulling angle back to 0 (equilibrium)
                const springReturnForce = (0 - node.angle) * stiffness;
                
                node.vAngle = (node.vAngle + springReturnForce) * damping;
                node.angle += node.vAngle;

                // 2. INDUSTRIAL HARDWARE GRAPHICS RENDERING PASSTHROUGH
                const halfFontH = fontSize * 0.45;
                const isSpinning = Math.abs(node.angle) > 0.01;

                // Draw technical chassis wireframes when dynamic activity is detected
                if (isSpinning) {
                    ctx.save();
                    ctx.strokeStyle = techColor;
                    ctx.lineWidth = 0.7;
                    
                    // Draw central rotor spindle core axle line
                    ctx.beginPath();
                    ctx.moveTo(node.centerX, node.centerY - halfFontH - 8);
                    ctx.lineTo(node.centerX, node.centerY + halfFontH + 8);
                    ctx.stroke();

                    // Upper and Lower structural alignment bracket ticks
                    ctx.beginPath();
                    ctx.moveTo(node.centerX - 6, node.centerY - halfFontH - 8);
                    ctx.lineTo(node.centerX + 6, node.centerY - halfFontH - 8);
                    ctx.moveTo(node.centerX - 6, node.centerY + halfFontH + 8);
                    ctx.lineTo(node.centerX + 6, node.centerY + halfFontH + 8);
                    ctx.stroke();
                    
                    // Continuous angular ticker reading displaying spatial values
                    if (Math.abs(node.angle) > 0.4) {
                        ctx.fillStyle = techColor;
                        ctx.font = \`600 9px monospace\`;
                        const degrees = Math.round((node.angle * (180 / Math.PI)) % 360);
                        ctx.fillText(\`\${degrees}°\`, node.centerX, node.centerY + halfFontH + 20);
                    }
                    ctx.restore();
                }

                // Core Transformation Matrix Projection
                ctx.save();
                ctx.font = \`900 \${fontSize}px "Space Grotesk", -apple-system, sans-serif\`;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";

                // Map 2D coordinate adjustments to simulate 3D horizontal compression aspect ratios
                const cosScale = Math.cos(node.angle);
                
                ctx.translate(node.centerX, node.centerY);
                ctx.scale(cosScale, 1); // Compress width matrix dynamically to replicate profile views

                // Dynamic occlusion logic: determine if front-face or hidden back-face wireframe is rendering
                const isFrontFace = Math.cos(node.angle) > 0;

                if (isFrontFace) {
                    // Render solid standard typography layout face
                    ctx.fillStyle = color;
                    ctx.fillText(node.char, 0, 0);
                } else {
                    // Node is facing away: render mechanical skeletal silhouette stroke paths instead
                    ctx.strokeStyle = techColor;
                    ctx.lineWidth = 1;
                    ctx.strokeText(node.char, 0, 0);
                }

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(loop);
        };

        animationFrameId.current = requestAnimationFrame(loop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [color, techColor, fontSize, influenceRadius, torqueForce, stiffness, damping]);

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
                    prevMouseXRef.current = -1000;
                }}
                className="block touch-none cursor-ew-resize"
            />
        </div>
    );
};

export default HelixText;`;

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
