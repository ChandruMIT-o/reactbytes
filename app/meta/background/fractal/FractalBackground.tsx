"use client";

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
    zoom = 2.8, // Restored to original zoom
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
            targetMousePos.current = {
                x: e.clientX / window.innerWidth,
                y: 1.0 - e.clientY / window.innerHeight,
            };
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [enableParallax]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
        if (!(gl instanceof WebGLRenderingContext)) {
            console.error("WebGL not supported");
            return;
        }

        const vsSource = `
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fsSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform vec3 u_colorStart;
            uniform vec3 u_colorEnd;
            uniform float u_intensity;
            uniform float u_zoom;
            uniform float u_morphRange;
            varying vec2 vUv;

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }

            void main() {
                vec2 mouseShift = (u_mouse - 0.5) * 0.08;
                
                // --- RESTORED UNSTRETCHED PROPORTIONS ---
                vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
                uv += mouseShift;
                
                vec2 z = uv * u_zoom;
                float t = u_time * ${speed.toFixed(3)};
                
                vec2 c = vec2(
                    -0.745 + u_morphRange * sin(t * 0.5),
                    0.11 + u_morphRange * cos(t * 0.8)
                );

                float iter = 0.0;
                float minDist = 100.0;
                const int MAX_I = ${Math.floor(maxIterations)};

                for(int i = 0; i < 256; i++) {
                    if (i >= MAX_I) break;
                    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                    minDist = min(minDist, length(z));
                    if(dot(z, z) > 64.0) break;
                    iter += 1.0;
                }

                if (iter < float(MAX_I)) {
                    float log_zn = log(dot(z, z)) / 2.0;
                    float nu = log(log_zn / log(2.0)) / log(2.0);
                    iter = iter + 1.0 - nu;
                }

                // Clamp m to prevent negative value glitches on certain GPUs
                float m = clamp(iter / float(MAX_I), 0.0, 1.0);
                vec3 hueShift = vec3(0.05 * sin(u_time * 0.1), 0.05 * sin(u_time * 0.15 + 1.0), 0.05 * sin(u_time * 0.2 + 2.0));
                
                // Calculate raw background color
                vec3 bgCol = u_colorStart + hueShift;
                
                // Calculate full fractal generation color
                vec3 fractalCol = mix(u_colorStart, u_colorEnd, pow(m, 0.75)) + hueShift;
                fractalCol += u_colorEnd * pow(m, 4.0) * 1.5;
                
                float trap = pow(max(0.0, 1.0 - minDist), 8.0);
                fractalCol = mix(fractalCol, vec3(1.0, 0.9, 0.7), trap * 0.4);
                vec3 totalFractalGlow = fractalCol + vec3(0.05, 0.1, 0.2) * pow(m, 2.0);
                
                // --- SMOOTH BOUNDARY DISSOLVE ---
                // Gradually blends the fractal details into the pure background color 
                // outward from the center, feathering out the sharp edge completely.
                float boundaryFade = smoothstep(2.4, 0.3, length(uv));
                vec3 finalCol = mix(bgCol, totalFractalGlow, boundaryFade);
                
                finalCol += (hash(vUv + fract(u_time)) - 0.5) * 0.02;

                gl_FragColor = vec4(finalCol * u_intensity, 1.0);
            }
        `;

        const compileShader = (type: number, source: string) => {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const program = gl.createProgram()!;
        gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource));
        gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource));
        gl.linkProgram(program);
        gl.useProgram(program);

        const vertices = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        const uniforms = {
            res: gl.getUniformLocation(program, "u_resolution"),
            time: gl.getUniformLocation(program, "u_time"),
            mouse: gl.getUniformLocation(program, "u_mouse"),
            colS: gl.getUniformLocation(program, "u_colorStart"),
            colE: gl.getUniformLocation(program, "u_colorEnd"),
            inten: gl.getUniformLocation(program, "u_intensity"),
            zoom: gl.getUniformLocation(program, "u_zoom"),
            morph: gl.getUniformLocation(program, "u_morphRange"),
        };

        let frame: number;
        let start = performance.now();

        const render = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);

            const time = (performance.now() - start) / 1000.0;
            if (enableParallax) {
                mousePos.current.x += (targetMousePos.current.x - mousePos.current.x) * 0.05;
                mousePos.current.y += (targetMousePos.current.y - mousePos.current.y) * 0.05;
            } else {
                mousePos.current = { x: 0.5, y: 0.5 };
            }

            gl.uniform2f(uniforms.res, canvas.width, canvas.height);
            gl.uniform1f(uniforms.time, time);
            gl.uniform2f(uniforms.mouse, mousePos.current.x, mousePos.current.y);
            gl.uniform3f(uniforms.colS, rgbStart[0], rgbStart[1], rgbStart[2]);
            gl.uniform3f(uniforms.colE, rgbEnd[0], rgbEnd[1], rgbEnd[2]);
            gl.uniform1f(uniforms.inten, intensity);
            gl.uniform1f(uniforms.zoom, zoom);
            gl.uniform1f(uniforms.morph, morphRange);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            frame = requestAnimationFrame(render);
        };

        render();
        return () => {
            cancelAnimationFrame(frame);
            gl.deleteProgram(program);
            gl.deleteBuffer(buffer);
        };
    }, [rgbStart, rgbEnd, speed, intensity, zoom, maxIterations, morphRange, enableParallax]);

    return (
        <div className={`relative isolate w-full h-full overflow-hidden bg-[#020408] ${className}`}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            <div className="absolute inset-0 pointer-events-none" />
            {children && (
                <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none ${uppercase ? "uppercase" : ""}`}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default FractalBackground;