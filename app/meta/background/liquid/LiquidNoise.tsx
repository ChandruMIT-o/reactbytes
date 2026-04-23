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
uniform vec3 uDarkNavy;
uniform float uGradientSize;
uniform float uGradientCount;
uniform float uColor1Weight;
uniform float uColor2Weight;

in vec2 vUv;

#define PI 3.14159265359

// Grain function for film grain effect
float grain(vec2 uv, float time) {
    vec2 grainUv = uv * uResolution * 0.5;
    float grainValue = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
    return grainValue * 2.0 - 1.0;
}

vec3 getGradientColor(vec2 uv, float time) {
    // Dynamic gradient size based on uniform
    float gradientRadius = uGradientSize;
    
    vec2 center1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
    vec2 center2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
    vec2 center3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
    vec2 center4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
    vec2 center5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
    vec2 center6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
    
    vec2 center7 = vec2(0.5 + sin(time * uSpeed * 0.55) * 0.38, 0.5 + cos(time * uSpeed * 0.48) * 0.42);
    vec2 center8 = vec2(0.5 + cos(time * uSpeed * 0.65) * 0.36, 0.5 + sin(time * uSpeed * 0.52) * 0.44);
    vec2 center9 = vec2(0.5 + sin(time * uSpeed * 0.42) * 0.41, 0.5 + cos(time * uSpeed * 0.58) * 0.39);
    vec2 center10 = vec2(0.5 + cos(time * uSpeed * 0.48) * 0.37, 0.5 + sin(time * uSpeed * 0.62) * 0.43);
    vec2 center11 = vec2(0.5 + sin(time * uSpeed * 0.68) * 0.33, 0.5 + cos(time * uSpeed * 0.44) * 0.46);
    vec2 center12 = vec2(0.5 + cos(time * uSpeed * 0.38) * 0.39, 0.5 + sin(time * uSpeed * 0.56) * 0.41);
    
    float dist1 = length(uv - center1);
    float dist2 = length(uv - center2);
    float dist3 = length(uv - center3);
    float dist4 = length(uv - center4);
    float dist5 = length(uv - center5);
    float dist6 = length(uv - center6);
    float dist7 = length(uv - center7);
    float dist8 = length(uv - center8);
    float dist9 = length(uv - center9);
    float dist10 = length(uv - center10);
    float dist11 = length(uv - center11);
    float dist12 = length(uv - center12);
    
    float influence1 = 1.0 - smoothstep(0.0, gradientRadius, dist1);
    float influence2 = 1.0 - smoothstep(0.0, gradientRadius, dist2);
    float influence3 = 1.0 - smoothstep(0.0, gradientRadius, dist3);
    float influence4 = 1.0 - smoothstep(0.0, gradientRadius, dist4);
    float influence5 = 1.0 - smoothstep(0.0, gradientRadius, dist5);
    float influence6 = 1.0 - smoothstep(0.0, gradientRadius, dist6);
    float influence7 = 1.0 - smoothstep(0.0, gradientRadius, dist7);
    float influence8 = 1.0 - smoothstep(0.0, gradientRadius, dist8);
    float influence9 = 1.0 - smoothstep(0.0, gradientRadius, dist9);
    float influence10 = 1.0 - smoothstep(0.0, gradientRadius, dist10);
    float influence11 = 1.0 - smoothstep(0.0, gradientRadius, dist11);
    float influence12 = 1.0 - smoothstep(0.0, gradientRadius, dist12);
    
    vec2 rotatedUv1 = uv - 0.5;
    float angle1 = time * uSpeed * 0.15;
    rotatedUv1 = vec2(
        rotatedUv1.x * cos(angle1) - rotatedUv1.y * sin(angle1),
        rotatedUv1.x * sin(angle1) + rotatedUv1.y * cos(angle1)
    ) + 0.5;
    
    vec2 rotatedUv2 = uv - 0.5;
    float angle2 = -time * uSpeed * 0.12;
    rotatedUv2 = vec2(
        rotatedUv2.x * cos(angle2) - rotatedUv2.y * sin(angle2),
        rotatedUv2.x * sin(angle2) + rotatedUv2.y * cos(angle2)
    ) + 0.5;
    
    float radialGradient1 = length(rotatedUv1 - 0.5);
    float radialGradient2 = length(rotatedUv2 - 0.5);
    float radialInfluence1 = 1.0 - smoothstep(0.0, 0.8, radialGradient1);
    float radialInfluence2 = 1.0 - smoothstep(0.0, 0.8, radialGradient2);
    
    vec3 color = vec3(0.0);
    color += uColor1 * influence1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
    color += uColor2 * influence2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
    color += uColor3 * influence3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
    color += uColor4 * influence4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
    color += uColor5 * influence5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
    color += uColor6 * influence6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;
    
    if (uGradientCount > 6.0) {
        color += uColor1 * influence7 * (0.55 + 0.45 * sin(time * uSpeed * 1.4)) * uColor1Weight;
        color += uColor2 * influence8 * (0.55 + 0.45 * cos(time * uSpeed * 1.5)) * uColor2Weight;
        color += uColor3 * influence9 * (0.55 + 0.45 * sin(time * uSpeed * 1.6)) * uColor1Weight;
        color += uColor4 * influence10 * (0.55 + 0.45 * cos(time * uSpeed * 1.7)) * uColor2Weight;
    }
    if (uGradientCount > 10.0) {
        color += uColor5 * influence11 * (0.55 + 0.45 * sin(time * uSpeed * 1.8)) * uColor1Weight;
        color += uColor6 * influence12 * (0.55 + 0.45 * cos(time * uSpeed * 1.9)) * uColor2Weight;
    }
    
    color += mix(uColor1, uColor3, radialInfluence1) * 0.45 * uColor1Weight;
    color += mix(uColor2, uColor4, radialInfluence2) * 0.4 * uColor2Weight;
    
    color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;
    
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luminance), color, 1.35);
    color = pow(color, vec3(0.92));
    
    float brightness1 = length(color);
    float mixFactor1 = max(brightness1 * 1.2, 0.15);
    color = mix(uDarkNavy, color, mixFactor1);
    
    float maxBrightness = 1.0;
    float brightness = length(color);
    if (brightness > maxBrightness) {
        color = color * (maxBrightness / brightness);
    }
    
    return color;
}

void main() {
    vec2 uv = vUv;
    
    vec4 touchTex = texture(uTouchTexture, uv);
    float vx = -(touchTex.r * 2.0 - 1.0);
    float vy = -(touchTex.g * 2.0 - 1.0);
    float intensity = touchTex.b;
    uv.x += vx * 0.8 * intensity;
    uv.y += vy * 0.8 * intensity;
    
    vec2 center = vec2(0.5);
    float dist = length(uv - center);
    float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * intensity;
    float wave = sin(dist * 15.0 - uTime * 2.0) * 0.03 * intensity;
    uv += vec2(ripple + wave);
    
    vec3 color = getGradientColor(uv, uTime);
    
    float grainValue = grain(uv, uTime);
    color += grainValue * uGrainIntensity;
    
    float timeShift = uTime * 0.5;
    color.r += sin(timeShift) * 0.02;
    color.g += cos(timeShift * 1.4) * 0.02;
    color.b += sin(timeShift * 1.2) * 0.02;
    
    float brightness2 = length(color);
    float mixFactor2 = max(brightness2 * 1.2, 0.15);
    color = mix(uDarkNavy, color, mixFactor2);
    
    color = clamp(color, vec3(0.0), vec3(1.0));
    
    float maxBrightness = 1.0;
    float brightness = length(color);
    if (brightness > maxBrightness) {
        color = color * (maxBrightness / brightness);
    }
    
    outColor = vec4(color, 1.0);
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
    size: number;
    width: number;
    height: number;
    maxAge: number;
    radius: number;
    speed: number;
    trail: any[];
    last: any;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor() {
        this.size = 64;
        this.width = this.height = this.size;
        this.maxAge = 64;
        this.radius = 0.25 * this.size;
        this.speed = 1 / this.maxAge;
        this.trail = [];
        this.last = null;
        
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    update() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const speed = this.speed;
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const point = this.trail[i];
            const f = point.force * speed * (1 - point.age / this.maxAge);
            point.x += point.vx * f;
            point.y += point.vy * f;
            point.age++;
            if (point.age > this.maxAge) {
                this.trail.splice(i, 1);
            } else {
                this.drawPoint(point);
            }
        }
    }

    addTouch(point: { x: number; y: number }) {
        let force = 0;
        let vx = 0;
        let vy = 0;
        const last = this.last;
        if (last) {
            const dx = point.x - last.x;
            const dy = point.y - last.y;
            if (dx !== 0 || dy !== 0) {
                const dd = dx * dx + dy * dy;
                const d = Math.sqrt(dd);
                vx = dx / d;
                vy = dy / d;
                force = Math.min(dd * 20000, 2.0);
            }
        }
        this.last = { x: point.x, y: point.y };
        this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
    }

    drawPoint(point: any) {
        const pos = {
            x: point.x * this.width,
            y: point.y * this.height
        };

        let intensity = 1;
        if (point.age < this.maxAge * 0.3) {
            intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
        } else {
            const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
            intensity = -t * (t - 2);
        }
        intensity *= point.force;

        const radius = this.radius;
        const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
        const offset = this.size * 5;
        this.ctx.shadowOffsetX = offset;
        this.ctx.shadowOffsetY = offset;
        this.ctx.shadowBlur = radius * 1;
        this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,0,0,1)";
        this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

export interface LiquidNoiseProps {
    colors?: string[];
    speed?: number;
    intensity?: number;
    grainIntensity?: number;
    gradientSize?: number;
    gradientCount?: number;
    color1Weight?: number;
    color2Weight?: number;
    darkNavy?: string;
    /** Whether to force overlay text to uppercase */
    uppercase?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export const LiquidNoise: React.FC<LiquidNoiseProps> = ({
    colors = ["#f15a22", "#0a0e27", "#40e0d0", "#f15a22", "#0a0e27", "#40e0d0"],
    speed = 1.2,
    intensity = 1.8,
    grainIntensity = 0.08,
    gradientSize = 1.0,
    gradientCount = 6.0,
    color1Weight = 1.0,
    color2Weight = 1.0,
    darkNavy = "#0a0e27",
    uppercase = false,
    className = "",
    children,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGL2RenderingContext | null>(null);
    const animationFrameRef = useRef<number>(0);
    const touchTextureRef = useRef<TouchTexture | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl2", { antialias: true, alpha: false }) as WebGL2RenderingContext;
        if (!gl) {
            console.error("WebGL2 is not supported by your browser.");
            return;
        }
        glRef.current = gl;

        const compileShader = (type: number, source: string) => {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
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

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Error linking program:", gl.getProgramInfoLog(program));
            return;
        }

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
            uDarkNavy: gl.getUniformLocation(program, "uDarkNavy"),
            uGradientSize: gl.getUniformLocation(program, "uGradientSize"),
            uGradientCount: gl.getUniformLocation(program, "uGradientCount"),
            uColor1Weight: gl.getUniformLocation(program, "uColor1Weight"),
            uColor2Weight: gl.getUniformLocation(program, "uColor2Weight"),
        };

        const touchTextureObj = new TouchTexture();
        touchTextureRef.current = touchTextureObj;
        
        const glTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const resize = () => {
            const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.floor(canvas.clientWidth * devicePixelRatio);
            const h = Math.floor(canvas.clientHeight * devicePixelRatio);
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
        };

        const resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(canvas);
        resize();

        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            let clientX, clientY;
            if ("touches" in e) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            const rect = canvas.getBoundingClientRect();
            touchTextureObj.addTouch({
                x: (clientX - rect.left) / rect.width,
                y: (clientY - rect.top) / rect.height
            });
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("touchmove", handleMouseMove);

        const t0 = performance.now();

        const render = () => {
            const time = (performance.now() - t0) * 0.001;
            
            touchTextureObj.update();
            gl.bindTexture(gl.TEXTURE_2D, glTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, touchTextureObj.canvas);

            gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
            gl.uniform1f(uniforms.uTime, time);
            gl.uniform1f(uniforms.uSpeed, speed);
            gl.uniform1f(uniforms.uIntensity, intensity);
            gl.uniform1f(uniforms.uGrainIntensity, grainIntensity);
            gl.uniform1f(uniforms.uGradientSize, gradientSize);
            gl.uniform1f(uniforms.uGradientCount, gradientCount);
            gl.uniform1f(uniforms.uColor1Weight, color1Weight);
            gl.uniform1f(uniforms.uColor2Weight, color2Weight);
            
            const darkRgb = hexToRgb(darkNavy);
            gl.uniform3f(uniforms.uDarkNavy, darkRgb[0], darkRgb[1], darkRgb[2]);

            const normalizedColors = (colors.length >= 6 ? colors : [...colors, ...colors, ...colors, ...colors, ...colors, ...colors]).slice(0, 6).map(hexToRgb);

            gl.uniform3f(uniforms.uColor1, normalizedColors[0][0], normalizedColors[0][1], normalizedColors[0][2]);
            gl.uniform3f(uniforms.uColor2, normalizedColors[1][0], normalizedColors[1][1], normalizedColors[1][2]);
            gl.uniform3f(uniforms.uColor3, normalizedColors[2][0], normalizedColors[2][1], normalizedColors[2][2]);
            gl.uniform3f(uniforms.uColor4, normalizedColors[3][0], normalizedColors[3][1], normalizedColors[3][2]);
            gl.uniform3f(uniforms.uColor5, normalizedColors[4][0], normalizedColors[4][1], normalizedColors[4][2]);
            gl.uniform3f(uniforms.uColor6, normalizedColors[5][0], normalizedColors[5][1], normalizedColors[5][2]);
            
            gl.uniform1i(uniforms.uTouchTexture, 0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            animationFrameRef.current = requestAnimationFrame(render);
        };

        animationFrameRef.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            resizeObserver.disconnect();
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("touchmove", handleMouseMove);
            if (gl) {
                gl.deleteProgram(program);
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
                gl.deleteTexture(glTexture);
            }
        };
    }, [colors, speed, intensity, grainIntensity, gradientSize, gradientCount, color1Weight, color2Weight, darkNavy]);

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
