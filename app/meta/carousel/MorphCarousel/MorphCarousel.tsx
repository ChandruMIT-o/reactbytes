"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import {
	MorphCarouselItem,
	MorphCarouselProps,
	DEFAULT_ITEMS as MOCK_ITEMS
} from "./MorphCarouselData";

/**
 * --- PREMIUM GLSL SHADERS (WebGL 2) ---
 */
const VERT_SRC = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
out vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG_SRC = `#version 300 es
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

// --- Simplex Noise Logic ---
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
}`;

/**
 * --- UTILS ---
 */
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

/**
 * --- COMPONENT ---
 */
const getOffset = (idx: number, current: number, length: number) => {
	let diff = idx - current;
	if (diff > length / 2) diff -= length;
	if (diff < -length / 2) diff += length;
	return diff;
};

export const MorphCarousel: React.FC<MorphCarouselProps> = ({
	items = MOCK_ITEMS,
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

	// Autoplay
	useEffect(() => {
		if (!isPlaying || isLoading) return;
		const timer = setInterval(next, interval);
		return () => clearInterval(timer);
	}, [isPlaying, interval, next, isLoading, activeIndex]);

	// WebGL Initialization
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || items.length === 0) return;

		const init = async () => {
			setIsLoading(true);
			const gl = canvas.getContext("webgl2", { antialias: true, alpha: true });
			if (!gl) return;
			glRef.current = gl;

			const program = createProgram(gl, VERT_SRC, FRAG_SRC);
			if (!program) return;
			programRef.current = program;
			gl.useProgram(program);

			uniformsRef.current = {
				from: gl.getUniformLocation(program, "u_from"),
				to: gl.getUniformLocation(program, "u_to"),
				progress: gl.getUniformLocation(program, "u_progress"),
				resolution: gl.getUniformLocation(program, "u_resolution"),
				fromAspect: gl.getUniformLocation(program, "u_fromAspect"),
				toAspect: gl.getUniformLocation(program, "u_toAspect"),
				scale: gl.getUniformLocation(program, "u_scale"),
				distortion: gl.getUniformLocation(program, "u_distortion"),
				direction: gl.getUniformLocation(program, "u_direction")
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
				console.error("Failed to load images", err);
			}
		};

		const renderLoop = (time: number) => {
			const gl = glRef.current;
			const state = stateRef.current;
			if (!gl || !canvas) return;

			// Handle transition progression with Quintic Easing
			if (state.startTime !== null) {
				const elapsed = time - state.startTime;
				const t = Math.min(elapsed / transitionDuration, 1.0);
				// Quintic easing
				state.progress = t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2;
				if (t >= 1.0) state.startTime = null;
			}

			// Resize
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
			if (gl) {
				texturesRef.current.forEach(t => t && gl.deleteTexture(t));
			}
		};
	}, [items, transitionDuration, scale, distortion]);

	// Sync index changes to WebGL state
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
		<div className={`relative w-full h-[600px] bg-black overflow-hidden group select-none rounded-3xl shadow-2xl flex ${className}`}>
			{/* Background Canvas */}
			<canvas ref={canvasRef} className="absolute inset-0 w-full h-full block touch-none z-0" />

			{/* Depth Overlay */}
			<div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-black/80 via-black/10 to-transparent" />

			{/* Loading State */}
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
					<div className="flex flex-col items-center gap-4">
						<div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
						<p className="text-white/60 font-medium tracking-widest text-sm uppercase">Loading Visuals</p>
					</div>
				</div>
			)}

			{/* Content Layer (Accordion Menu) */}
			{!isLoading && (
				<div className="absolute left-10 top-1/2 -translate-y-1/2 z-20 w-full max-w-sm pointer-events-auto" style={{ perspective: "1000px" }}>
					<div className="flex flex-col gap-2 w-full">
						<AnimatePresence mode="popLayout">
							{items
								.map((item, idx) => ({ item, idx, offset: getOffset(idx, activeIndex, items.length) }))
								.filter(v => Math.abs(v.offset) <= 1)
								.sort((a, b) => a.offset - b.offset)
								.map(({ item, idx, offset }) => {
									const isActive = offset === 0;
									return (
										<motion.div
											key={idx}
											layout
											initial={{ opacity: 0, y: offset * 50 }}
											animate={{
												opacity: isActive ? 1 : 0.3,
												y: 0,
												scale: isActive ? 1 : 0.85,
												zIndex: isActive ? 10 : 5
											}}
											exit={{ opacity: 0, y: offset * -50 }}
											transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
											onClick={() => setActiveIndex(idx)}
											className="group/item flex flex-col cursor-pointer origin-left py-3"
										>
											<div className="flex items-start gap-6">
												{/* Number & Progress Line */}
												<div className="flex flex-col items-center mt-1">
													<span className={`font-mono text-xs tracking-widest transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/40 group-hover/item:text-white/70'}`}>
														{String(idx + 1).padStart(2, '0')}
													</span>
													<div className="w-[2px] h-full min-h-[32px] bg-white/10 mt-3 relative overflow-hidden rounded-full">
														{isActive && isPlaying && (
															<motion.div
																key={`progress-${idx}`}
																initial={{ height: 0 }}
																animate={{ height: "100%" }}
																transition={{ duration: interval / 1000, ease: "linear" }}
																className="absolute top-0 left-0 w-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
															/>
														)}
														{isActive && !isPlaying && (
															<div className="absolute top-0 left-0 w-full h-full bg-white/50" />
														)}
													</div>
												</div>

												{/* Text & Accordion Content */}
												<div className="flex flex-col pb-4 w-full">
													<h2 className={`text-xl md:text-2xl font-bold uppercase tracking-wide transition-all duration-500 ${isActive ? 'text-white translate-x-2' : 'text-white/50 group-hover/item:text-white/80'}`}>
														{item.title}
													</h2>

													<AnimatePresence initial={false}>
														{isActive && (
															<motion.div
																initial={{ height: 0, opacity: 0, marginTop: 0 }}
																animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
																exit={{ height: 0, opacity: 0, marginTop: 0 }}
																transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
																className="overflow-hidden"
															>
																<div className="flex flex-col gap-4 pl-4 border-l-2 border-white/10 ml-2">
																	{showCaptions && (
																		<p className="text-white/70 text-sm leading-relaxed font-light">
																			{item.description}
																		</p>
																	)}
																</div>
															</motion.div>
														)}
													</AnimatePresence>
												</div>
											</div>
										</motion.div>
									)
								})}
						</AnimatePresence>
					</div>
				</div>
			)}

			{/* Floating Controls Island */}
			{showNav && (
				<div className="absolute bottom-8 right-8 z-30 flex items-center gap-1 p-1.5 rounded-full bg-black/20 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
					<button
						onClick={prev}
						className="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
						aria-label="Previous"
					>
						<ChevronLeft size={22} strokeWidth={1.5} />
					</button>
					<div className="w-[1px] h-6 bg-white/10" />
					<button
						onClick={() => setIsPlaying(!isPlaying)}
						className="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
						aria-label="Play/Pause"
					>
						{isPlaying ? <Pause size={20} strokeWidth={1.5} /> : <Play size={20} strokeWidth={1.5} className="ml-0.5" />}
					</button>
					<div className="w-[1px] h-6 bg-white/10" />
					<button
						onClick={next}
						className="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
						aria-label="Next"
					>
						<ChevronRight size={22} strokeWidth={1.5} />
					</button>
				</div>
			)}
		</div>
	);
};

export default MorphCarousel;
