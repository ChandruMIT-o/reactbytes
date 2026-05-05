export const MorphCarouselProps = [
	{
		name: "items",
		type: "MorphCarouselItem[]",
		defaultValue: "DEFAULT_ITEMS",
		description: "Array of items with title, description, image, and thumb."
	},
	{
		name: "distortion",
		type: "number",
		defaultValue: "1.0",
		description: "Intensity of the morph distortion effect."
	},
	{
		name: "scale",
		type: "number",
		defaultValue: "3.5",
		description: "Scale of the noise pattern."
	},
	{
		name: "transitionDuration",
		type: "number",
		defaultValue: "1200",
		description: "Duration of the transition in ms."
	},
	{
		name: "interval",
		type: "number",
		defaultValue: "5000",
		description: "Time between slides in ms (if autoPlay is true)."
	},
	{
		name: "autoPlay",
		type: "boolean",
		defaultValue: "true",
		description: "Whether to automatically cycle through slides."
	},
	{
		name: "showThumbs",
		type: "boolean",
		defaultValue: "true",
		description: "Whether to show the thumbnail navigation bar."
	},
	{
		name: "showNav",
		type: "boolean",
		defaultValue: "true",
		description: "Whether to show the previous/next arrows."
	},
	{
		name: "showCaptions",
		type: "boolean",
		defaultValue: "true",
		description: "Whether to show the title and description."
	},
	{
		name: "className",
		type: "string",
		defaultValue: "''",
		description: "Additional CSS classes for the container."
	}
];

export const creditsData = [
	{
		title: "Tech Stack",
		items: [
			{ name: "WebGL 2.0", role: "Rendering Engine", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" },
			{ name: "Framer Motion", role: "Animations", url: "https://www.framer.com/motion/" },
			{ name: "Lucide React", role: "Icons", url: "https://lucide.dev/" }
		]
	}
];

export const componentCode = `"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

/**
 * --- TYPES ---
 */
export interface MorphCarouselItem {
	title: string;
	description: string;
	image: string;
	thumb: string;
}

export interface MorphCarouselProps {
	items?: MorphCarouselItem[];
	distortion?: number;
	scale?: number;
	transitionDuration?: number;
	interval?: number;
	autoPlay?: boolean;
	showThumbs?: boolean;
	showNav?: boolean;
	showCaptions?: boolean;
	className?: string;
}

const DEFAULT_ITEMS: MorphCarouselItem[] = [
	{
		title: "Cyberpunk Metropolis",
		description: "A neon-drenched city of the future, where technology and humanity collide.",
		image: "https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=2070&auto=format&fit=crop",
		thumb: "https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=200&auto=format&fit=crop"
	},
	{
		title: "Digital Ethereal",
		description: "Transcending physical boundaries through fluid digital geometry.",
		image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2070&auto=format&fit=crop",
		thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop"
	},
	{
		title: "Neural Network",
		description: "Vibrant pathways of information flowing through a synthetic mind.",
		image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
		thumb: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200&auto=format&fit=crop"
	}
];

// --- SHADERS ---
const VERT_SRC = \\\`#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
out vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}\\\`;

const FRAG_SRC = \\\`#version 300 es
precision highp float;

uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_fromAspect;
uniform float u_toAspect;
uniform float u_scale;
uniform float u_distortion;
uniform float u_direction;

in vec2 vUv;
out vec4 outColor;

// Simplex Noise
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float fbm(vec2 v) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
        value += amplitude * snoise(v);
        v *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

vec2 coverUV(vec2 uv, float imgAspect, vec2 resolution) {
    float canvasAspect = resolution.x / resolution.y;
    vec2 scale = (canvasAspect > imgAspect) 
      ? vec2(1.0, imgAspect / canvasAspect) 
      : vec2(canvasAspect / imgAspect, 1.0);
    return (uv - 0.5) * scale + 0.5;
}

void main() {
    float edge = 0.15;
    float adjustedProgress = u_progress * (1.0 + 2.0 * edge) - edge;
    float noise = fbm(vUv * u_scale + vec2(0.0, u_progress * u_direction)) * 0.5 + 0.5;
    float mixFactor = 1.0 - smoothstep(adjustedProgress - edge, adjustedProgress + edge, noise);
    
    float distort_in = noise * u_progress * u_distortion;
    float distort_out = noise * (1.0 - u_progress) * u_distortion;

    vec2 fromUV = coverUV(vUv + vec2(0, distort_in * 0.5 * u_direction), u_fromAspect, u_resolution);
    vec2 toUV = coverUV(vUv + vec2(0, distort_out * -0.25 * u_direction), u_toAspect, u_resolution);

    vec4 fromColor = texture(u_from, fromUV);
    vec4 toColor = texture(u_to, toUV);

    outColor = mix(fromColor, toColor, mixFactor);
}\\\`;

// --- HELPERS ---
const createShader = (gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null => {
	const shader = gl.createShader(type)!;
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("Shader compile error:", gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
};

const createProgram = (gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string): WebGLProgram | null => {
	const vs = createShader(gl, gl.VERTEX_SHADER, vertSrc);
	const fs = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
	if (!vs || !fs) return null;
	const program = gl.createProgram()!;
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("Program link error:", gl.getProgramInfoLog(program));
		return null;
	}
	return program;
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = url;
	});
};

const createTexture = (gl: WebGL2RenderingContext, img: HTMLImageElement): WebGLTexture | null => {
	const tex = gl.createTexture();
	if (!tex) return null;
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	return tex;
};

// --- COMPONENT ---
export const MorphCarousel: React.FC<MorphCarouselProps> = ({
	items = DEFAULT_ITEMS,
	distortion = 1.0,
	scale = 3.5,
	transitionDuration = 1200,
	interval = 5000,
	autoPlay = true,
	showThumbs = true,
	showNav = true,
	showCaptions = true,
	className = ""
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [isLoading, setIsLoading] = useState(true);

	const glRef = useRef<WebGL2RenderingContext | null>(null);
	const programRef = useRef<WebGLProgram | null>(null);
	const texturesRef = useRef<(WebGLTexture | null)[]>([]);
	const aspectsRef = useRef<number[]>([]);
	const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});

	const stateRef = useRef({
		from: 0,
		to: 0,
		progress: 1.0,
		startTime: null as number | null,
		direction: 1,
		raf: null as number | null
	});

	const next = useCallback(() => {
		setActiveIndex(prev => (prev + 1) % items.length);
	}, [items.length]);

	const prev = useCallback(() => {
		setActiveIndex(prev => (prev - 1 + items.length) % items.length);
	}, [items.length]);

	useEffect(() => {
		if (!isPlaying || isLoading) return;
		const timer = setInterval(next, interval);
		return () => clearInterval(timer);
	}, [isPlaying, interval, next, isLoading]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || items.length === 0) return;

		const init = async () => {
			setIsLoading(true);
			const gl = canvas.getContext(\\\"webgl2\\\", { antialias: true, alpha: true });
			if (!gl) return;
			glRef.current = gl;

			const program = createProgram(gl, VERT_SRC, FRAG_SRC);
			if (!program) return;
			programRef.current = program;
			gl.useProgram(program);

			uniformsRef.current = {
				from: gl.getUniformLocation(program, \\\"u_from\\\"),
				to: gl.getUniformLocation(program, \\\"u_to\\\"),
				progress: gl.getUniformLocation(program, \\\"u_progress\\\"),
				resolution: gl.getUniformLocation(program, \\\"u_resolution\\\"),
				fromAspect: gl.getUniformLocation(program, \\\"u_fromAspect\\\"),
				toAspect: gl.getUniformLocation(program, \\\"u_toAspect\\\"),
				scale: gl.getUniformLocation(program, \\\"u_scale\\\"),
				distortion: gl.getUniformLocation(program, \\\"u_distortion\\\"),
				direction: gl.getUniformLocation(program, \\\"u_direction\\\")
			};

			const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
			const buf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buf);
			gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

			try {
				const images = await Promise.all(items.map(item => loadImage(item.image)));
				texturesRef.current = images.map(img => createTexture(gl, img));
				aspectsRef.current = images.map(img => img.naturalWidth / img.naturalHeight);
				setIsLoading(false);
				renderLoop(performance.now());
			} catch (err) {
				console.error(\\\"Failed to load images\\\", err);
			}
		};

		const renderLoop = (time: number) => {
			const gl = glRef.current;
			const state = stateRef.current;
			if (!gl || !canvas) return;

			if (state.startTime !== null) {
				const elapsed = time - state.startTime;
				const t = Math.min(elapsed / transitionDuration, 1.0);
				state.progress = t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2;
				if (t >= 1.0) state.startTime = null;
			}

			const dpr = window.devicePixelRatio || 1;
			const w = Math.round(canvas.clientWidth * dpr);
			const h = Math.round(canvas.clientHeight * dpr);
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
				gl.viewport(0, 0, w, h);
			}

			gl.useProgram(programRef.current!);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texturesRef.current[state.from]);
			gl.uniform1i(uniformsRef.current.from, 0);
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, texturesRef.current[state.to]);
			gl.uniform1i(uniformsRef.current.to, 1);
			gl.uniform1f(uniformsRef.current.progress, state.progress);
			gl.uniform2f(uniformsRef.current.resolution, w, h);
			gl.uniform1f(uniformsRef.current.fromAspect, aspectsRef.current[state.from] || 1);
			gl.uniform1f(uniformsRef.current.toAspect, aspectsRef.current[state.to] || 1);
			gl.uniform1f(uniformsRef.current.scale, scale);
			gl.uniform1f(uniformsRef.current.distortion, distortion);
			gl.uniform1f(uniformsRef.current.direction, state.direction);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			state.raf = requestAnimationFrame(renderLoop);
		};

		init();

		return () => {
			if (stateRef.current.raf) cancelAnimationFrame(stateRef.current.raf);
			const gl = glRef.current;
			if (gl) texturesRef.current.forEach(t => t && gl.deleteTexture(t));
		};
	}, [items, transitionDuration, scale, distortion]);

	useEffect(() => {
		if (isLoading) return;
		const state = stateRef.current;
		if (state.to !== activeIndex) {
			state.from = state.to;
			state.to = activeIndex;
			state.progress = 0.0;
			state.startTime = performance.now();
			state.direction = activeIndex > state.from ? 1.0 : -1.0;
		}
	}, [activeIndex, isLoading]);

	return (
		<div className={\\\`relative w-full h-[600px] bg-black overflow-hidden group select-none rounded-3xl shadow-2xl \\\${className}\\\`}>
			<canvas ref={canvasRef} className="w-full h-full block touch-none" />
			<div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20" />
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
					<div className="flex flex-col items-center gap-4">
						<div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
						<p className="text-white/60 font-medium tracking-widest text-sm uppercase">Loading Visuals</p>
					</div>
				</div>
			)}
			{!isLoading && showCaptions && (
				<div className="absolute bottom-32 left-10 right-10 z-10 transition-all duration-700 pointer-events-none">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeIndex}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
							className="max-w-2xl"
						>
							<h2 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight drop-shadow-lg uppercase">
								{items[activeIndex]?.title}
							</h2>
							<p className="text-lg text-white/70 line-clamp-2 font-light max-w-lg drop-shadow-md">
								{items[activeIndex]?.description}
							</p>
						</motion.div>
					</AnimatePresence>
				</div>
			)}
			{showNav && (
				<>
					<button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 z-20"><ChevronLeft size={28} /></button>
					<button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 z-20"><ChevronRight size={28} /></button>
				</>
			)}
			<div className="absolute top-6 right-6 flex gap-2 z-20">
				<button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
					{isPlaying ? <Pause size={18} /> : <Play size={18} />}
				</button>
			</div>
			{showThumbs && (
				<div className="absolute bottom-8 left-0 right-0 z-20 px-10">
					<div className="flex gap-3 justify-center items-center overflow-x-auto pb-2 no-scrollbar">
						{items.map((item, idx) => (
							<button key={idx} onClick={() => setActiveIndex(idx)} className={\\\`relative flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 \\\${activeIndex === idx ? 'border-white scale-110 shadow-xl' : 'border-transparent opacity-40 hover:opacity-70'}\\\`}>
								<img src={item.thumb} alt={item.title} className="w-full h-full object-cover" />
								{activeIndex === idx && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
							</button>
						))}
					</div>
				</div>
			)}
			<style dangerouslySetInnerHTML={{ __html: \\\`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\\\` }} />
		</div>
	);
};

export default MorphCarousel;
`;
