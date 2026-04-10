"use client";

import React, { useEffect, useRef, useMemo } from "react";

export interface EnergyFlowBackgroundProps {
    colorA?: string;
    colorB?: string;
    colorC?: string;
    speed?: number;
    intensity?: number;
    scale?: number;
    opacity?: number;
    vignetteIntensity?: number;
    blurAmount?: number;
    className?: string;
    children?: React.ReactNode;
}

const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
};

/**
 * EnergyFlowBackground (Flux Energy)
 * A premium, silk-like flowing animation using multi-layered Simplex noise.
 * Replaces the Cellular Automata idea with a more modern, fluid aesthetic.
 */
export const CellularAutomataBackground: React.FC<EnergyFlowBackgroundProps> = ({
    colorA = "#050812",
    colorB = "#1e1b4b",
    colorC = "#818cf8",
    speed = 0.5,
    intensity = 1.0,
    scale = 1.0,
    opacity = 1.0,
    vignetteIntensity = 0.6,
    blurAmount = 0,
    className = "",
    children,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: 0.5, y: 0.5 });
    const targetMousePos = useRef({ x: 0.5, y: 0.5 });

    const rgbA = useMemo(() => hexToRgb(colorA), [colorA]);
    const rgbB = useMemo(() => hexToRgb(colorB), [colorB]);
    const rgbC = useMemo(() => hexToRgb(colorC), [colorC]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            targetMousePos.current = {
                x: (e.clientX - rect.left) / rect.width,
                y: 1.0 - (e.clientY - rect.top) / rect.height,
            };
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) return;

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
            uniform float u_time;
            uniform vec2 u_res;
            uniform vec2 u_mouse;
            uniform vec3 u_colorA;
            uniform vec3 u_colorB;
            uniform vec3 u_colorC;
            uniform float u_intensity;
            uniform float u_scale;
            uniform float u_opacity;
            uniform float u_vignetteIntensity;
            varying vec2 vUv;

            // Simplex Noise 2D
            vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
            float snoise(vec2 v){
              const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
              vec2 i  = floor(v + dot(v, C.yy) );
              vec2 x0 = v -   i + dot(i, C.xx);
              vec2 i1;
              i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
              vec4 x12 = x0.xyxy + C.xxzz;
              x12.xy -= i1;
              i = mod(i, 289.0);
              vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                    + i.x + vec3(0.0, i1.x, 1.0 ));
              vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                dot(x12.zw,x12.zw)), 0.0);
              m = m*m ;
              m = m*m ;
              vec3 x = 2.0 * fract(p * C.www) - 1.0;
              vec3 h = abs(x) - 0.5;
              vec3 a0 = x - floor(x + 0.5);
              vec3 g = a0 * vec3(x0.x,x12.xz) + h * vec3(x0.y,x12.yw);
              vec3 l = 1.79284291400159 - 0.85373472095314 * ( g*g + h*h );
              vec3 normalize_v = g * l;
              return 130.0 * dot(m, normalize_v);
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy * 2.0 - u_res.xy) / min(u_res.x, u_res.y);
                uv *= u_scale;
                
                // Mouse distortion
                float mDist = distance(vUv, u_mouse);
                uv += (vUv - u_mouse) * smoothstep(0.5, 0.0, mDist) * 0.2;

                float t = u_time * 0.2;
                
                // Multi-layered flow
                float n = snoise(uv + t);
                n += 0.5 * snoise(uv * 2.0 - t * 1.2);
                n += 0.25 * snoise(uv * 4.0 + t * 1.5);
                
                // Create silk ribbons
                float ring = sin(uv.x * 2.0 + n * 3.0 + t);
                ring = 0.01 / abs(ring); // Sharp lines
                
                float waves = sin(uv.y * 3.0 + n * 2.0 - t * 0.5);
                waves = smoothstep(0.4, 0.6, waves * n);

                // Color mapping
                vec3 col = mix(u_colorA, u_colorB, n * 0.5 + 0.5);
                col = mix(col, u_colorC, waves);
                col += u_colorC * ring * 0.4; // Highlights

                // Chromatic Aberration
                float shift = 0.005 * n;
                float r = snoise(uv + vec2(shift, 0.0));
                float g = snoise(uv);
                float b = snoise(uv - vec2(shift, 0.0));
                col.r += r * 0.05;
                col.b += b * 0.05;

                // Vignette & Brightness
                float dist = length(vUv - 0.5);
                float vignette = smoothstep(1.5, 0.4, dist);
                col *= mix(1.0, vignette, u_vignetteIntensity);
                col *= u_intensity;

                gl_FragColor = vec4(col, u_opacity);
            }
        `;

        const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
            }
            return shader;
        };

        const program = gl.createProgram()!;
        gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
        gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
        gl.linkProgram(program);

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, "position");
        const timeLoc = gl.getUniformLocation(program, "u_time");
        const resLoc = gl.getUniformLocation(program, "u_res");
        const mouseLoc = gl.getUniformLocation(program, "u_mouse");
        const colorALoc = gl.getUniformLocation(program, "u_colorA");
        const colorBLoc = gl.getUniformLocation(program, "u_colorB");
        const colorCLoc = gl.getUniformLocation(program, "u_colorC");
        const intensityLoc = gl.getUniformLocation(program, "u_intensity");
        const scaleLoc = gl.getUniformLocation(program, "u_scale");
        const opacityLoc = gl.getUniformLocation(program, "u_opacity");
        const vignetteLoc = gl.getUniformLocation(program, "u_vignetteIntensity");

        let frame: number;
        const startTime = performance.now();

        const loop = () => {
            if (!gl) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;

            // Smooth mouse
            mousePos.current.x += (targetMousePos.current.x - mousePos.current.x) * 0.05;
            mousePos.current.y += (targetMousePos.current.y - mousePos.current.y) * 0.05;

            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.useProgram(program);

            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            gl.uniform1f(timeLoc, (performance.now() - startTime) * 0.001 * speed);
            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform2f(mouseLoc, mousePos.current.x, mousePos.current.y);
            gl.uniform3f(colorALoc, rgbA[0], rgbA[1], rgbA[2]);
            gl.uniform3f(colorBLoc, rgbB[0], rgbB[1], rgbB[2]);
            gl.uniform3f(colorCLoc, rgbC[0], rgbC[1], rgbC[2]);
            gl.uniform1f(intensityLoc, intensity);
            gl.uniform1f(scaleLoc, scale);
            gl.uniform1f(opacityLoc, opacity);
            gl.uniform1f(vignetteLoc, vignetteIntensity);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            frame = requestAnimationFrame(loop);
        };

        loop();
        return () => {
            cancelAnimationFrame(frame);
            gl.deleteProgram(program);
            gl.deleteBuffer(buffer);
        };
    }, [rgbA, rgbB, rgbC, speed, intensity, scale, opacity, vignetteIntensity]);

    return (
        <div className={`relative isolate w-full h-full overflow-hidden bg-black ${className}`}>
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full block" 
                style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none" }}
            />
            
            {/* Fine Grain Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            
            {/* High-end Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            
            {children && <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">{children}</div>}
        </div>
    );
};

export default CellularAutomataBackground;
