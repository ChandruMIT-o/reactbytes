"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderChaosBackgroundProps {
	isHovered: boolean;
	isPressed: boolean;
	flippedX?: boolean;
	flippedY?: boolean;
}

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_tap;
  uniform float u_speed;
  uniform float u_amplitude;
  uniform float u_pulseMin;
  uniform float u_pulseMax;
  uniform float u_noiseType;

  float hash(float n) {
    return fract(sin(n) * 753.5453123);
  }

  float noiseHash(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    float n = p.x + p.y * 157.0;
    return mix(
      mix(hash(n + 0.0), hash(n + 1.0), f.x),
      mix(hash(n + 157.0), hash(n + 158.0), f.x),
      f.y
    );
  }

  float noiseTrig(vec2 p) {
    float x = p.x;
    float y = p.y;

    float n = sin(x * 1.0 + sin(y * 1.3)) * 0.5;
    n += sin(y * 1.0 + sin(x * 1.1)) * 0.5;
    n += sin((x + y) * 0.5) * 0.25;
    n += sin((x - y) * 0.7) * 0.25;

    return n * 0.5 + 0.5;
  }

  float noise(vec2 p) {
    if (u_noiseType < 0.5) {
      return noiseHash(p);
    } else {
      return noiseTrig(p);
    }
  }

  float fbm(vec2 p, vec3 a) {
    float v = 0.0;
    v += noise(p * a.x) * 0.50;
    v += noise(p * a.y) * 1.50;
    v += noise(p * a.z) * 0.125 * 0.1;
    return v;
  }

  vec3 drawLines(vec2 uv, vec3 fbmOffset, vec3 color1, float secs, float amplitude) {
    float timeVal = secs * 0.1;
    vec3 finalColor = vec3(0.0);

    vec3 colorSets[4];
    colorSets[0] = vec3(0.7, 0.05, 1.0);
    colorSets[1] = vec3(1.0, 0.19, 0.0);
    colorSets[2] = vec3(0.0, 1.0, 0.3);
    colorSets[3] = vec3(0.0, 0.38, 1.0);

    for(int i = 0; i < 4; i++) {
      float indexAsFloat = float(i);
      float amp = amplitude + (indexAsFloat * 0.0);
      float period = 2.0 + (indexAsFloat + 2.0);
      float thickness = mix(0.4, 0.2, noise(uv * 2.0));
      float t = abs(1.0 / (sin(uv.y + fbm(uv + timeVal * period, fbmOffset)) * amp) * thickness);
      finalColor += t * colorSets[i];
    }

    for(int i = 0; i < 4; i++) {
      float indexAsFloat = float(i);
      float amp = (amplitude * 0.5) + (indexAsFloat * 5.0);
      float period = 9.0 + (indexAsFloat + 2.0);
      float thickness = mix(0.1, 0.1, noise(uv * 12.0));
      float t = abs(1.0 / (sin(uv.y + fbm(uv + timeVal * period, fbmOffset)) * amp) * thickness);
      finalColor += t * colorSets[i] * color1;
    }

    return finalColor;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy / u_resolution.x) * 1.0 - 1.0;
    uv *= 1.5;

    vec3 lineColor1 = vec3(1.0, 0.0, 0.5);
    vec3 lineColor2 = vec3(0.3, 0.5, 1.5);

    float spread = abs(u_tap);
    float t = sin(u_time) * 0.5 + 0.5;
    float pulse = mix(u_pulseMin, u_pulseMax, t);

    vec3 finalColor = drawLines(uv, vec3(65.2, 40.0, 4.0), lineColor1, u_time * u_speed, u_amplitude) * pulse;
    finalColor += drawLines(uv, vec3(5.0 * spread / 2.0, 2.1 * spread, 1.0), lineColor2, u_time * u_speed, u_amplitude);

    // Sparkling noise effect
    float noiseVal = hash(uv.x + uv.y + u_time);
    finalColor += noiseVal * 0.08;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const config = {
	noiseType: "hash",
	restingSpeed: 0.1,
	activeSpeed: 0.8,
	pressedSpeed: 3.5,
	restingAmplitude: 80,
	activeAmplitude: 40,
	pressedAmplitude: 15,
	restingPulseMin: 0.05,
	restingPulseMax: 0.2,
	activePulseMin: 0.1,
	activePulseMax: 0.5,
	pressedPulseMin: 0.2,
	pressedPulseMax: 0.8,
	restingTap: 0.5,
	activeTap: 1.2,
	pressedTap: 2.5,
};

export default function HeaderChaosBackground({ isHovered, isPressed, flippedX, flippedY }: HeaderChaosBackgroundProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const requestRef = useRef<number>(0);
	const startTimeRef = useRef<number>(Date.now());
	const lastTimeRef = useRef<number>(0);
	const phaseRef = useRef<number>(0);
	const programRef = useRef<WebGLProgram | null>(null);
	const glRef = useRef<WebGLRenderingContext | null>(null);
	const uniformLocationsRef = useRef<any>({});

	// Animated values (for smooth transitions)
	const paramsRef = useRef({
		speed: config.restingSpeed,
		amplitude: config.restingAmplitude,
		pulseMin: config.restingPulseMin,
		pulseMax: config.restingPulseMax,
		tap: config.restingTap,
	});

	const compileShader = (gl: WebGLRenderingContext, type: number, source: string) => {
		const shader = gl.createShader(type);
		if (!shader) return null;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error("Shader compile error:", gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	};

	const isHoveredRef = useRef(isHovered);
	const isPressedRef = useRef(isPressed);

	useEffect(() => {
		isHoveredRef.current = isHovered;
	}, [isHovered]);

	useEffect(() => {
		isPressedRef.current = isPressed;
	}, [isPressed]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		let gl: WebGLRenderingContext | null = null;
		let vertexShader: WebGLShader | null = null;
		let fragmentShader: WebGLShader | null = null;
		let program: WebGLProgram | null = null;
		let buffer: WebGLBuffer | null = null;

		const initWebGL = () => {
			gl = canvas.getContext("webgl", { alpha: false, antialias: true });
			if (!gl || gl.isContextLost()) return;
			glRef.current = gl;

			vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
			fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
			if (!vertexShader || !fragmentShader) return;

			program = gl.createProgram();
			if (!program) return;
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);

			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				console.error("Program link error:", gl.getProgramInfoLog(program));
				return;
			}

			programRef.current = program;
			gl.useProgram(program);

			const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
			buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

			const positionLocation = gl.getAttribLocation(program, "a_position");
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

			uniformLocationsRef.current = {
				resolution: gl.getUniformLocation(program, "u_resolution"),
				time: gl.getUniformLocation(program, "u_time"),
				tap: gl.getUniformLocation(program, "u_tap"),
				speed: gl.getUniformLocation(program, "u_speed"),
				amplitude: gl.getUniformLocation(program, "u_amplitude"),
				pulseMin: gl.getUniformLocation(program, "u_pulseMin"),
				pulseMax: gl.getUniformLocation(program, "u_pulseMax"),
				noiseType: gl.getUniformLocation(program, "u_noiseType"),
			};

			handleResize();

			// Start rendering if not already running
			if (!requestRef.current) {
				requestRef.current = requestAnimationFrame(render);
			}
		};

		const cleanupWebGL = () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
				requestRef.current = 0;
			}

			if (gl) {
				if (buffer) {
					gl.deleteBuffer(buffer);
					buffer = null;
				}
				if (program) {
					if (vertexShader) {
						gl.detachShader(program, vertexShader);
						gl.deleteShader(vertexShader);
						vertexShader = null;
					}
					if (fragmentShader) {
						gl.detachShader(program, fragmentShader);
						gl.deleteShader(fragmentShader);
						fragmentShader = null;
					}
					gl.deleteProgram(program);
					program = null;
					programRef.current = null;
				}

				const isRealUnmount = !canvas.isConnected || !document.body.contains(canvas);
				if (isRealUnmount) {
					const loseContextExt = gl.getExtension("WEBGL_lose_context");
					if (loseContextExt) {
						loseContextExt.loseContext();
					}
				}
				glRef.current = null;
				gl = null;
			}
		};

		const handleResize = () => {
			if (!canvas || !gl) return;
			const dpr = Math.min(window.devicePixelRatio, 2);
			const rect = canvas.parentElement?.getBoundingClientRect();
			if (!rect) return;

			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			gl.viewport(0, 0, canvas.width, canvas.height);
			if (uniformLocationsRef.current.resolution) {
				gl.uniform2f(uniformLocationsRef.current.resolution, canvas.width, canvas.height);
			}
		};

		const render = () => {
			if (!gl || gl.isContextLost()) return;

			const time = (Date.now() - startTimeRef.current) / 1000;
			const deltaTime = time - lastTimeRef.current;
			lastTimeRef.current = time;

			// Smoothly interpolate parameters
			const hovered = isHoveredRef.current;
			const pressed = isPressedRef.current;

			let target;
			if (pressed) {
				target = {
					speed: config.pressedSpeed,
					amplitude: config.pressedAmplitude,
					pulseMin: config.pressedPulseMin,
					pulseMax: config.pressedPulseMax,
					tap: config.pressedTap,
				};
			} else if (hovered) {
				target = {
					speed: config.activeSpeed,
					amplitude: config.activeAmplitude,
					pulseMin: config.activePulseMin,
					pulseMax: config.activePulseMax,
					tap: config.activeTap,
				};
			} else {
				target = {
					speed: config.restingSpeed,
					amplitude: config.restingAmplitude,
					pulseMin: config.restingPulseMin,
					pulseMax: config.restingPulseMax,
					tap: config.restingTap,
				};
			}

			const lerp = (current: number, target: number, speed: number) => current + (target - current) * speed;
			const lerpSpeed = pressed ? 0.2 : (hovered ? 0.1 : 0.02);

			paramsRef.current.speed = lerp(paramsRef.current.speed, target.speed, lerpSpeed);
			paramsRef.current.amplitude = lerp(paramsRef.current.amplitude, target.amplitude, lerpSpeed);
			paramsRef.current.pulseMin = lerp(paramsRef.current.pulseMin, target.pulseMin, lerpSpeed);
			paramsRef.current.pulseMax = lerp(paramsRef.current.pulseMax, target.pulseMax, lerpSpeed);
			paramsRef.current.tap = lerp(paramsRef.current.tap, target.tap, lerpSpeed);

			phaseRef.current += deltaTime * paramsRef.current.speed;
			if (phaseRef.current > 1000) phaseRef.current = phaseRef.current % 1000;

			gl.uniform1f(uniformLocationsRef.current.time, phaseRef.current);
			gl.uniform1f(uniformLocationsRef.current.tap, paramsRef.current.tap);
			gl.uniform1f(uniformLocationsRef.current.speed, 1.0);
			gl.uniform1f(uniformLocationsRef.current.amplitude, paramsRef.current.amplitude);
			gl.uniform1f(uniformLocationsRef.current.pulseMin, paramsRef.current.pulseMin);
			gl.uniform1f(uniformLocationsRef.current.pulseMax, paramsRef.current.pulseMax);
			gl.uniform1f(uniformLocationsRef.current.noiseType, config.noiseType === "trig" ? 1.0 : 0.0);

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			requestRef.current = requestAnimationFrame(render);
		};

		const handleContextLost = (e: Event) => {
			e.preventDefault();
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
				requestRef.current = 0;
			}
		};

		const handleContextRestored = () => {
			initWebGL();
		};

		canvas.addEventListener("webglcontextlost", handleContextLost, false);
		canvas.addEventListener("webglcontextrestored", handleContextRestored, false);
		window.addEventListener("resize", handleResize);

		// Initial setup
		initWebGL();

		return () => {
			cleanupWebGL();
			canvas.removeEventListener("webglcontextlost", handleContextLost);
			canvas.removeEventListener("webglcontextrestored", handleContextRestored);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<motion.div
			initial={false}
			animate={{ opacity: isHovered ? 1 : 0 }}
			transition={{ duration: 0.8, ease: "easeInOut" }}
			className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
			style={{
				transform: `${flippedX ? "scaleX(-1)" : ""} ${flippedY ? "scaleY(-1)" : ""}`.trim() || undefined,
			}}
		>
			<canvas
				ref={canvasRef}
				className="block w-full h-full"
			/>
			{/* Bottom Gradient for smooth blending */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40" />
		</motion.div>
	);
}
