"use client";

import React, { useEffect, useRef } from "react";

const VS_SRC = `#version 300 es
precision highp float;
const vec2 pos[4] = vec2[](
    vec2(-1.0, -1.0),
    vec2( 1.0, -1.0),
    vec2(-1.0,  1.0),
    vec2( 1.0,  1.0)
);
out vec2 vUv;
void main() {
    vUv = pos[gl_VertexID] * 0.5 + 0.5;
    gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
}`;

const FS_SRC = `#version 300 es
precision highp float;
out vec4 outColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform vec3 uColor6;
uniform float uSpeed;
uniform float uIntensity;
uniform sampler2D uTouchTexture;
uniform float uGrainIntensity;
uniform vec3 uBackgroundColor;
uniform float uGradientSize;
uniform float uGradientCount;
uniform float uColor1Weight;
uniform float uColor2Weight;

in vec2 vUv;

float grain(vec2 uv, float time) {
    vec2 grainUv = uv * uResolution * 0.5;
    return fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
}

float liquidWarp(vec2 p, float t, vec2 mouseDisplace, out vec2 q, out vec2 r) {
    vec2 coord = p * (uGradientSize * 0.9);
    
    q.x = sin(coord.x * 2.0 + coord.y * 1.5 + t * uSpeed * 0.4) * 0.5 + 0.5;
    q.y = cos(coord.x * 1.2 - coord.y * 2.2 + t * uSpeed * 0.3) * 0.5 + 0.5;

    vec2 pWarped = coord + q * 0.4 + mouseDisplace * 0.35;

    r.x = sin(pWarped.x * 2.5 + pWarped.y * 2.0 + t * uSpeed * 0.5 + 2.1) * 0.5 + 0.5;
    r.y = cos(pWarped.x * 1.5 - pWarped.y * 3.0 + t * uSpeed * 0.25 + 4.8) * 0.5 + 0.5;

    float f = sin(pWarped.x * 1.8 + r.y * 2.2) * cos(pWarped.y * 2.0 + r.x * 1.7);
    return f * 0.5 + 0.5;
}

void main() {
    vec2 uv = vUv;
    
    vec4 touchTex = texture(uTouchTexture, uv);
    vec2 mouseDisplace = -(touchTex.rg * 2.0 - 1.0) * touchTex.b;
    
    vec2 q, r;
    float fluidPattern = liquidWarp(uv * 2.2 - 1.1, uTime, mouseDisplace, q, r);
    
    vec3 colorMix = uBackgroundColor;
    
    // Distribute luxury silk folding logic matching design weights
    colorMix = mix(colorMix, uColor1 * uColor1Weight, clamp(fluidPattern * 1.3, 0.0, 1.0));
    colorMix = mix(colorMix, uColor2 * uColor2Weight, clamp(length(q) * 0.8, 0.0, 1.0));
    
    if (uGradientCount > 2.0) {
        colorMix = mix(colorMix, uColor3 * uColor1Weight, clamp(r.x * 0.7, 0.0, 1.0));
    }
    if (uGradientCount > 4.0) {
        colorMix = mix(colorMix, uColor4 * uColor2Weight, clamp(r.y * q.x * 1.2, 0.0, 1.0));
    }
    if (uGradientCount > 5.0) {
        colorMix = mix(colorMix, uColor5 * uColor1Weight, clamp(fluidPattern * r.x * 1.5, 0.0, 1.0));
        colorMix = mix(colorMix, uColor6 * uColor2Weight, clamp(length(q - r) * 0.5, 0.0, 1.0));
    }

    colorMix += uColor3 * (q.y * r.x) * 0.25 * uIntensity;
    colorMix += uColor1 * (fluidPattern * r.y) * 0.2 * uIntensity;

    float luminance = dot(colorMix, vec3(0.2126, 0.7152, 0.0722));
    colorMix = mix(vec3(luminance), colorMix, 1.2);
    
    float edgeMask = smoothstep(1.4, 0.2, length(vUv - 0.5));
    vec3 finalColor = mix(uBackgroundColor, colorMix, clamp(edgeMask * uIntensity, 0.0, 1.0));
    
    finalColor += grain(uv, uTime) * uGrainIntensity * 0.35;
    
    outColor = vec4(clamp(finalColor, vec3(0.0), vec3(1.0)), 1.0);
}`;

const hexToRgb = (hex: string): [number, number, number] => {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
};

class TouchTexture {
    size: number; width: number; height: number; maxAge: number; radius: number; speed: number; trail: any[]; last: any; canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D;
    constructor() {
        this.size = 128; this.width = this.height = this.size; this.maxAge = 80; this.radius = 0.18 * this.size; this.speed = 1 / this.maxAge; this.trail = []; this.last = null;
        this.canvas = document.createElement("canvas"); this.canvas.width = this.width; this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
        this.ctx.fillStyle = "black"; this.ctx.fillRect(0, 0, this.width, this.height);
    }
    update() {
        this.ctx.fillStyle = "black"; this.ctx.fillRect(0, 0, this.width, this.height);
        const speed = this.speed;
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const point = this.trail[i];
            const f = point.force * speed * (1 - point.age / this.maxAge);
            point.x += point.vx * f; point.y += point.vy * f; point.age++;
            if (point.age > this.maxAge) { this.trail.splice(i, 1); } else { this.drawPoint(point); }
        }
    }
    addTouch(point: { x: number; y: number }) {
        let force = 0; let vx = 0; let vy = 0; const last = this.last;
        if (last) {
            const dx = point.x - last.x; const dy = point.y - last.y;
            if (dx !== 0 || dy !== 0) {
                const dd = dx * dx + dy * dy; const d = Math.sqrt(dd);
                vx = dx / d; vy = dy / d; force = Math.min(dd * 12000, 1.2);
            }
        }
        this.last = { x: point.x, y: point.y };
        this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
    }
    drawPoint(point: any) {
        const pos = { x: point.x * this.width, y: point.y * this.height };
        let intensity = 1.0;
        if (point.age < this.maxAge * 0.25) {
            intensity = Math.sin((point.age / (this.maxAge * 0.25)) * (Math.PI / 2));
        } else {
            const t = 1 - (point.age - this.maxAge * 0.25) / (this.maxAge * 0.75);
            intensity = t * t * (3 - 2 * t);
        }
        intensity *= point.force;
        const radius = this.radius;
        const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
        const offset = this.size * 4;
        this.ctx.shadowOffsetX = offset; this.ctx.shadowOffsetY = offset; this.ctx.shadowBlur = radius * 1.5; this.ctx.shadowColor = `rgba(${color},${0.18 * intensity})`;
        this.ctx.beginPath(); this.ctx.fillStyle = "rgba(255,0,0,1)"; this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2); this.ctx.fill();
    }
}

export interface LiquidNoiseProps {
    colors?: string[];
    backgroundColor?: string;
    speed?: number;
    intensity?: number;
    grainIntensity?: number;
    gradientSize?: number;
    gradientCount?: number;
    color1Weight?: number;
    color2Weight?: number;
    uppercase?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export const LiquidNoise: React.FC<LiquidNoiseProps> = ({
    colors = ["#312e81", "#5b21b6", "#9d174d", "#1e3a8a", "#115e59", "#4338ca"],
    backgroundColor = "#030712",
    speed = 0.45,
    intensity = 1.2,
    grainIntensity = 0.03,
    gradientSize = 1.1,
    gradientCount = 6.0,
    color1Weight = 1.0,
    color2Weight = 1.0,
    uppercase = false,
    className = "",
    children,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(0);

    const propsRef = useRef({
        colors, backgroundColor, speed, intensity, grainIntensity,
        gradientSize, gradientCount, color1Weight, color2Weight
    });

    // CRITICAL FIX: No dependency array. Updates seamlessly on every playground adjustment
    useEffect(() => {
        propsRef.current = {
            colors, backgroundColor, speed, intensity, grainIntensity,
            gradientSize, gradientCount, color1Weight, color2Weight
        };
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl2", { antialias: true, alpha: false }) as WebGL2RenderingContext;
        if (!gl) return;

        const compileShader = (type: number, source: string) => {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(gl.VERTEX_SHADER, VS_SRC);
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FS_SRC);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram()!;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const uniforms = {
            uTime: gl.getUniformLocation(program, "uTime"),
            uResolution: gl.getUniformLocation(program, "uResolution"),
            uColor1: gl.getUniformLocation(program, "uColor1"),
            uColor2: gl.getUniformLocation(program, "uColor2"),
            uColor3: gl.getUniformLocation(program, "uColor3"),
            uColor4: gl.getUniformLocation(program, "uColor4"),
            uColor5: gl.getUniformLocation(program, "uColor5"),
            uColor6: gl.getUniformLocation(program, "uColor6"),
            uSpeed: gl.getUniformLocation(program, "uSpeed"),
            uIntensity: gl.getUniformLocation(program, "uIntensity"),
            uTouchTexture: gl.getUniformLocation(program, "uTouchTexture"),
            uGrainIntensity: gl.getUniformLocation(program, "uGrainIntensity"),
            uBackgroundColor: gl.getUniformLocation(program, "uBackgroundColor"),
            uGradientSize: gl.getUniformLocation(program, "uGradientSize"),
            uGradientCount: gl.getUniformLocation(program, "uGradientCount"),
            uColor1Weight: gl.getUniformLocation(program, "uColor1Weight"),
            uColor2Weight: gl.getUniformLocation(program, "uColor2Weight"),
        };

        const touchTextureObj = new TouchTexture();
        const glTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.floor(canvas.clientWidth * dpr);
            const h = Math.floor(canvas.clientHeight * dpr);
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w; canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
        };

        const resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(canvas);
        resize();

        const handleMove = (e: MouseEvent | TouchEvent) => {
            let clientX, clientY;
            if ("touches" in e) {
                if (e.touches.length === 0) return;
                clientX = e.touches[0].clientX; clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX; clientY = e.clientY;
            }
            const rect = canvas.getBoundingClientRect();
            touchTextureObj.addTouch({
                x: (clientX - rect.left) / rect.width,
                y: (clientY - rect.top) / rect.height
            });
        };

        canvas.addEventListener("mousemove", handleMove, { passive: true });
        canvas.addEventListener("touchmove", handleMove, { passive: true });

        const startTime = performance.now();

        const render = () => {
            const elapsed = (performance.now() - startTime) * 0.001;
            const current = propsRef.current;

            touchTextureObj.update();
            gl.bindTexture(gl.TEXTURE_2D, glTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, touchTextureObj.canvas);

            gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
            gl.uniform1f(uniforms.uTime, elapsed);
            gl.uniform1f(uniforms.uSpeed, current.speed);
            gl.uniform1f(uniforms.uIntensity, current.intensity);
            gl.uniform1f(uniforms.uGrainIntensity, current.grainIntensity);
            gl.uniform1f(uniforms.uGradientSize, current.gradientSize);
            gl.uniform1f(uniforms.uGradientCount, current.gradientCount);
            gl.uniform1f(uniforms.uColor1Weight, current.color1Weight);
            gl.uniform1f(uniforms.uColor2Weight, current.color2Weight);

            const bgRgb = hexToRgb(current.backgroundColor);
            gl.uniform3f(uniforms.uBackgroundColor, bgRgb[0], bgRgb[1], bgRgb[2]);

            const filledColors = [...current.colors];
            while (filledColors.length < 6) {
                filledColors.push(current.colors[filledColors.length % current.colors.length] || "#000000");
            }
            const parsedColors = filledColors.slice(0, 6).map(hexToRgb);

            gl.uniform3f(uniforms.uColor1, parsedColors[0][0], parsedColors[0][1], parsedColors[0][2]);
            gl.uniform3f(uniforms.uColor2, parsedColors[1][0], parsedColors[1][1], parsedColors[1][2]);
            gl.uniform3f(uniforms.uColor3, parsedColors[2][0], parsedColors[2][1], parsedColors[2][2]);
            gl.uniform3f(uniforms.uColor4, parsedColors[3][0], parsedColors[3][1], parsedColors[3][2]);
            gl.uniform3f(uniforms.uColor5, parsedColors[4][0], parsedColors[4][1], parsedColors[4][2]);
            gl.uniform3f(uniforms.uColor6, parsedColors[5][0], parsedColors[5][1], parsedColors[5][2]);

            gl.uniform1i(uniforms.uTouchTexture, 0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationFrameRef.current = requestAnimationFrame(render);
        };

        animationFrameRef.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            resizeObserver.disconnect();
            canvas.removeEventListener("mousemove", handleMove);
            canvas.removeEventListener("touchmove", handleMove);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteTexture(glTexture);
        };
    }, []);

    return (
        <div className={`relative overflow-hidden w-full h-full ${className}`}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block touch-none" />
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none ${uppercase ? "uppercase" : ""}`}>
                {children}
            </div>
        </div>
    );
};

export default LiquidNoise;