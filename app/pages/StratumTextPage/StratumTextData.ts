export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'STRATA'",
				description: "The text string to slice and animate.",
			},
			{
				name: "sliceCount",
				type: "number",
				defaultValue: "32",
				description: "Number of horizontal stratigraphic slices.",
			},
			{
				name: "stiffness",
				type: "number",
				defaultValue: "0.045",
				description: "Stiffness of the return spring physics (Hooke's law).",
			},
			{
				name: "damping",
				type: "number",
				defaultValue: "0.82",
				description: "Friction/damping factor applied to slice movement.",
			},
			{
				name: "cutForce",
				type: "number",
				defaultValue: "0.45",
				description: "Sensitivity of slices to pointer velocity cuts.",
			},
			{
				name: "influenceRadius",
				type: "number",
				defaultValue: "90",
				description: "Radius of pointer proximity displacement (in pixels).",
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
				description: "Primary text color.",
			},
			{
				name: "bgColor",
				type: "string",
				defaultValue: "'#08080a'",
				description: "Background color of the canvas grid.",
			},
			{
				name: "wireframeColor",
				type: "string",
				defaultValue: "'rgba(14, 165, 233, 0.35)'",
				description: "Color of the technical wireframes and structural readouts.",
			},
			{
				name: "className",
				type: "string",
				defaultValue: "''",
				description: "Extra Tailwind or CSS classes for the container.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useRef } from "react";

interface StratumSlice {
    yOffset: number;   // Source Y position in the offscreen canvas
    height: number;    // Height of this slice
    x: number;         // Dynamic X displacement
    y: number;         // Dynamic Y displacement
    vx: number;        // X velocity
    vy: number;        // Y velocity
    angle: number;     // Shearing rotation angle
    vAngle: number;    // Angular velocity
    targetX: number;   // Home position anchor X
    targetY: number;   // Home position anchor Y
}

export interface StratumTextProps {
    /** The text string to slice and animate */
    text?: string;
    /** Number of horizontal stratigraphic slices */
    sliceCount?: number;
    /** Stiffness of the return spring physics */
    stiffness?: number;
    /** Friction/damping factor of the slices */
    damping?: number;
    /** Sensitivity of slices to pointer velocity cuts */
    cutForce?: number;
    /** Radius of pointer proximity displacement */
    influenceRadius?: number;
    /** Primary text color */
    color?: string;
    /** Background color of the grid architecture */
    bgColor?: string;
    /** Color of technical wireframes and structural readouts */
    wireframeColor?: string;
    /** Extra Tailwind or CSS classes */
    className?: string;
}

export const StratumText: React.FC<StratumTextProps> = ({
    text = "STRATA",
    sliceCount = 32,
    stiffness = 0.045,
    damping = 0.82,
    cutForce = 0.45,
    influenceRadius = 90,
    color = "#ffffff",
    bgColor = "#08080a",
    wireframeColor = "rgba(14, 165, 233, 0.35)",
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    
    const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, active: false });
    const prevMouseRef = useRef({ x: -1000, y: -1000 });
    const slicesRef = useRef<StratumSlice[]>([]);
    const animationFrameId = useRef<number | null>(null);

    const widthRef = useRef(0);
    const heightRef = useRef(0);

    // Initialize the tectonic slices across the canvas height
    const createStrata = (height: number): StratumSlice[] => {
        const slices: StratumSlice[] = [];
        const sliceHeight = height / sliceCount;

        for (let i = 0; i < sliceCount; i++) {
            slices.push({
                yOffset: i * sliceHeight,
                height: sliceHeight,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                angle: 0,
                vAngle: 0,
                targetX: 0,
                targetY: 0,
            });
        }
        return slices;
    };

    // Render the crisp source text onto the hidden offscreen buffer canvas
    const drawOffscreenText = (
        canvas: HTMLCanvasElement, 
        ctx: CanvasRenderingContext2D, 
        width: number, 
        height: number
    ) => {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        const fontSize = width < 640 ? 70 : 140;
        ctx.font = \`900 \${fontSize}px "Space Grotesk", -apple-system, sans-serif\`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        
        // Render crisp central text
        ctx.fillText(text, width / 2, height / 2);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            const width = parent.clientWidth;
            const height = parent.clientHeight;
            widthRef.current = width;
            heightRef.current = height;

            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            
            // Setup main visible canvas
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = \`\${width}px\`;
            canvas.style.height = \`\${height}px\`;

            const ctx = canvas.getContext("2d");
            if (ctx) ctx.scale(dpr, dpr);

            // Setup hidden offscreen layout canvas
            if (!offscreenCanvasRef.current) {
                offscreenCanvasRef.current = document.createElement("canvas");
            }
            const offscreen = offscreenCanvasRef.current;
            offscreen.width = width * dpr;
            offscreen.height = height * dpr;
            
            const oCtx = offscreen.getContext("2d");
            if (oCtx) {
                oCtx.scale(dpr, dpr);
                drawOffscreenText(offscreen, oCtx, width, height);
            }

            slicesRef.current = createStrata(height);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [text, color, bgColor, sliceCount]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const renderLoop = () => {
            const width = widthRef.current;
            const height = heightRef.current;
            const offscreen = offscreenCanvasRef.current;

            if (width === 0 || height === 0 || !offscreen) {
                animationFrameId.current = requestAnimationFrame(renderLoop);
                return;
            }

            // Wipe screen clean
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);

            const mouse = mouseRef.current;
            
            // Extract instant vector delta from mouse movement
            if (mouse.active && prevMouseRef.current.x !== -1000) {
                mouse.vx = (mouse.x - prevMouseRef.current.x) * cutForce;
                mouse.vy = (mouse.y - prevMouseRef.current.y) * cutForce;
            } else {
                mouse.vx *= 0.85;
                mouse.vy *= 0.85;
            }
            prevMouseRef.current.x = mouse.x;
            prevMouseRef.current.y = mouse.y;

            const slices = slicesRef.current;

            // 1. PHYSICS UPDATE PASS
            slices.forEach((slice) => {
                const sliceYGlobal = slice.yOffset + slice.height / 2;
                
                // Calculate precise vertical offset relative to pointer intersection height
                const dy = sliceYGlobal - mouse.y;
                const absDy = Math.abs(dy);

                if (mouse.active && absDy < influenceRadius) {
                    // Normalize proximity metric envelope
                    const proximityFactor = (influenceRadius - absDy) / influenceRadius;
                    
                    // Slice kinetic impulse injection
                    slice.vx += mouse.vx * proximityFactor * 1.5;
                    slice.vy += mouse.vy * proximityFactor * 0.4;
                    
                    // Rotational shear moment generated by distance from friction vector
                    const distanceX = mouse.x - width / 2;
                    slice.vAngle += (mouse.vx * 0.0002) * proximityFactor * (distanceX * 0.01);
                    
                    // Ambient pressure repulsion away from pointer center core
                    const repulsionX = Math.sign(width / 2 - mouse.x) * proximityFactor * 2.5;
                    slice.vx += repulsionX * 0.2;
                }

                // Anisotropic Hooke's Spring mechanics pulling slice back home
                const forceX = (slice.targetX - slice.x) * stiffness;
                const forceY = (slice.targetY - slice.y) * stiffness;
                const forceAngle = (0 - slice.angle) * stiffness;

                slice.vx = (slice.vx + forceX) * damping;
                slice.vy = (slice.vy + forceY) * damping;
                slice.vAngle = (slice.vAngle + forceAngle) * damping;

                slice.x += slice.vx;
                slice.y += slice.vy;
                slice.angle += slice.vAngle;
            });

            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

            // 2. RENDER MATRIX PASS
            slices.forEach((slice) => {
                const sliceCenterY = slice.yOffset + slice.height / 2;
                const sliceCenterX = width / 2;

                // Draw technical telemetry wireframes for heavily warped slabs
                const totalDisplacement = Math.sqrt(slice.x * slice.x + slice.y * slice.y);
                if (totalDisplacement > 4) {
                    ctx.save();
                    ctx.strokeStyle = wireframeColor;
                    ctx.lineWidth = 0.6;
                    ctx.setLineDash([2, 5]);
                    
                    // Anchor Guideline
                    ctx.beginPath();
                    ctx.moveTo(0, sliceCenterY);
                    ctx.lineTo(width, sliceCenterY);
                    ctx.stroke();

                    // Absolute displacement ticker block
                    if (totalDisplacement > 15) {
                        ctx.fillStyle = wireframeColor;
                        ctx.fillRect(sliceCenterX + slice.x - 3, sliceCenterY + slice.y - 3, 6, 6);
                    }
                    ctx.restore();
                }

                ctx.save();
                
                // Shift system matrix to rotation origin point of individual slice plate
                ctx.translate(sliceCenterX + slice.x, sliceCenterY + slice.y);
                ctx.rotate(slice.angle);

                // Blit sliced image strip cleanly out of offscreen buffer matrix
                ctx.drawImage(
                    offscreen,
                    0, slice.yOffset * dpr, 
                    width * dpr, slice.height * dpr, // Source Rect
                    -sliceCenterX, -slice.height / 2, 
                    width, slice.height // Destination Scale Map
                );

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(renderLoop);
        };

        animationFrameId.current = requestAnimationFrame(renderLoop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [bgColor, color, stiffness, damping, cutForce, influenceRadius, wireframeColor]);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.active = true;
    };

    return (
        <div className={\`relative w-full h-full select-none overflow-hidden \${className}\`}>
            <canvas
                ref={canvasRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={() => {
                    mouseRef.current.active = false;
                    prevMouseRef.current = { x: -1000, y: -1000 };
                }}
                className="w-full h-full touch-none cursor-ew-resize"
            />
        </div>
    );
};

export default StratumText;`;

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
