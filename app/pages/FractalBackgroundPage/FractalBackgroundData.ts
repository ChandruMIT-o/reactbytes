export const fractalProps = [
	{
		title: "Color & Intensity",
		props: [
			{
				name: "colorStart",
				type: "string | [r, g, b]",
				defaultValue: "'#0D1526'",
				description: "Background base color of the fractal.",
			},
			{
				name: "colorEnd",
				type: "string | [r, g, b]",
				defaultValue: "'#3366CC'",
				description: "Glow/Detail color of the fractal.",
			},
			{
				name: "intensity",
				type: "number",
				defaultValue: "1.0",
				description: "Overall brightness multiplier for the WebGL output.",
			},
		],
	},
	{
		title: "Dynamics & Math",
		props: [
			{
				name: "speed",
				type: "number",
				defaultValue: "0.15",
				description: "Speed of the fractal's metamorphic animation.",
			},
			{
				name: "zoom",
				type: "number",
				defaultValue: "2.8",
				description: "Zoom level into the Julia set coordinates.",
			},
			{
				name: "morphRange",
				type: "number",
				defaultValue: "0.1",
				description: "Amplitude of the complex constant 'c' transformation.",
			},
			{
				name: "maxIterations",
				type: "number",
				defaultValue: "100",
				description: "Iteration depth. Higher values reveal more detail but increase GPU load.",
			},
		],
	},
	{
		title: "Interactivity & Style",
		props: [
			{
				name: "enableParallax",
				type: "boolean",
				defaultValue: "true",
				description: "Enables mouse-tracking parallax shift for a 3D feeling.",
			},
			{
				name: "uppercase",
				type: "boolean",
				defaultValue: "false",
				description: "Whether to force overlay text to uppercase.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useRef } from "react";

export interface FractalBackgroundProps {
    colorStart?: [number, number, number] | string; 
    colorEnd?: [number, number, number] | string;   
    speed?: number;
    zoom?: number;
    maxIterations?: number;
    morphRange?: number;
    enableParallax?: boolean;
    intensity?: number;
    uppercase?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
};

export const FractalBackground: React.FC<FractalBackgroundProps> = ({
    colorStart = [0.05, 0.08, 0.15],
    colorEnd = [0.2, 0.4, 0.8],
    speed = 0.15,
    zoom = 2.8,
    maxIterations = 100,
    morphRange = 0.1,
    enableParallax = true,
    intensity = 1.0,
    uppercase = false,
    className = "",
    children,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: 0.5, y: 0.5 });
    const targetMousePos = useRef({ x: 0.5, y: 0.5 });

    const rgbStart = typeof colorStart === "string" ? hexToRgb(colorStart) : colorStart;
    const rgbEnd = typeof colorEnd === "string" ? hexToRgb(colorEnd) : colorEnd;

    useEffect(() => {
        if (!enableParallax) return;
        const handleMouseMove = (e: MouseEvent) => {
            targetMousePos.current = { x: e.clientX / window.innerWidth, y: 1.0 - e.clientY / window.innerHeight };
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [enableParallax]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
        if (!(gl instanceof WebGLRenderingContext)) return;

        const vsSource = \\\`attribute vec2 position; varying vec2 vUv; void main() { vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }\\\`;
        const fsSource = \\\`
            precision highp float;
            uniform vec2 u_resolution; uniform float u_time; uniform vec2 u_mouse;
            uniform vec3 u_colorStart; uniform vec3 u_colorEnd; uniform float u_intensity;
            uniform float u_zoom; uniform float u_morphRange; varying vec2 vUv;

            float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

            void main() {
                vec2 mouseShift = (u_mouse - 0.5) * 0.08;
                vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
                uv += mouseShift;
                vec2 z = uv * u_zoom;
                float t = u_time * \${speed.toFixed(3)};
                vec2 c = vec2(-0.745 + u_morphRange * sin(t * 0.5), 0.11 + u_morphRange * cos(t * 0.8));
                float iter = 0.0; float minDist = 100.0;
                for(int i = 0; i < 256; i++) {
                    if (i >= \${Math.floor(maxIterations)}) break;
                    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                    minDist = min(minDist, length(z));
                    if(dot(z, z) > 64.0) break;
                    iter += 1.0;
                }
                float m = iter / \${maxIterations.toFixed(1)};
                vec3 baseCol = mix(u_colorStart, u_colorEnd, pow(m, 0.75));
                baseCol += u_colorEnd * pow(m, 4.0) * 1.5;
                float vignette = smoothstep(0.0, 1.0, 1.0 - length(vUv - 0.5) * 1.1);
                gl_FragColor = vec4(baseCol * vignette * u_intensity, 1.0);
            }
        \\\`;

        const compileShader = (type: number, src: string) => {
            const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s;
        };
        const program = gl.createProgram()!;
        gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource));
        gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource));
        gl.linkProgram(program); gl.useProgram(program);

        const vertices = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]);
        const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const posLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(posLoc); gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        const uniforms = {
            res: gl.getUniformLocation(program, "u_resolution"), time: gl.getUniformLocation(program, "u_time"),
            mouse: gl.getUniformLocation(program, "u_mouse"), colS: gl.getUniformLocation(program, "u_colorStart"),
            colE: gl.getUniformLocation(program, "u_colorEnd"), inten: gl.getUniformLocation(program, "u_intensity"),
            zoom: gl.getUniformLocation(program, "u_zoom"), morph: gl.getUniformLocation(program, "u_morphRange"),
        };

        let frame: number; let start = performance.now();
        const render = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);
            const time = (performance.now() - start) / 1000.0;
            if (enableParallax) {
                mousePos.current.x += (targetMousePos.current.x - mousePos.current.x) * 0.05;
                mousePos.current.y += (targetMousePos.current.y - mousePos.current.y) * 0.05;
            }
            gl.uniform2f(uniforms.res, canvas.width, canvas.height); gl.uniform1f(uniforms.time, time);
            gl.uniform2f(uniforms.mouse, mousePos.current.x, mousePos.current.y);
            gl.uniform3f(uniforms.colS, rgbStart[0], rgbStart[1], rgbStart[2]);
            gl.uniform3f(uniforms.colE, rgbEnd[0], rgbEnd[1], rgbEnd[2]);
            gl.uniform1f(uniforms.inten, intensity); gl.uniform1f(uniforms.zoom, zoom);
            gl.uniform1f(uniforms.morph, morphRange);
            gl.drawArrays(gl.TRIANGLES, 0, 6); frame = requestAnimationFrame(render);
        };
        render();
        return () => { cancelAnimationFrame(frame); gl.deleteProgram(program); gl.deleteBuffer(buffer); };
    }, [rgbStart, rgbEnd, speed, intensity, zoom, maxIterations, morphRange, enableParallax]);

    return (
        <div className=\\\`relative isolate w-full h-full overflow-hidden bg-[#020408] \\\${className}\\\`>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            {children && (
                <div className=\\\`absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none \\\${uppercase ? "uppercase" : ""}\\\`}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default FractalBackground;`;

export const creditsData = [
	{
		title: "Mathematical Foundations",
		items: [
			{
				name: "Julia Set Explorer",
				role: "Fractal Math",
				url: "https://en.wikipedia.org/wiki/Julia_set",
			},
		],
	},
	{
		title: "Project",
		items: [
			{
				name: "React Bytes",
				role: "Component Collection",
				url: "https://reactbytes.dev",
			},
		],
	},
];
