export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "colors",
				type: "string[]",
				defaultValue: "['#f15a22', '#0a0e27', '#40e0d0', '#f15a22', '#0a0e27', '#40e0d0']",
				description: "Array of 6 hex colors that define the main gradient shades.",
			},
			{
				name: "speed",
				type: "number",
				defaultValue: "1.2",
				description: "Speed of the swirling background animation.",
			},
			{
				name: "intensity",
				type: "number",
				defaultValue: "1.8",
				description: "Intensity of the color bleeding and brightness.",
			},
			{
				name: "darkNavy",
				type: "string",
				defaultValue: "'#0a0e27'",
				description: "Base/background color tone replacing absolute darkness.",
			},
			{
				name: "uppercase",
				type: "boolean",
				defaultValue: "false",
				description: "Whether to force overlay text to uppercase.",
			},
		],
	},
    {
		title: "Advanced Props",
		props: [
            {
				name: "grainIntensity",
				type: "number",
				defaultValue: "0.08",
				description: "Amount of film grain overlaid across the gradients.",
			},
            {
				name: "gradientSize",
				type: "number",
				defaultValue: "1.0",
				description: "Radius modifier for the circular color blobs.",
			},
            {
				name: "gradientCount",
				type: "number",
				defaultValue: "6.0",
				description: "Amount of gradient blobs interacting (max 12).",
			},
            {
				name: "color1Weight",
				type: "number",
				defaultValue: "1.0",
				description: "Weighting bias applied to alternating bright colors.",
			},
            {
				name: "color2Weight",
				type: "number",
				defaultValue: "1.0",
				description: "Weighting bias applied to alternating dark colors.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useRef } from "react";

const VS_SRC = \\\`#version 300 es
precision highp float;
const vec2 pos[4] = vec2[](vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0), vec2( 1.0,  1.0));
out vec2 vUv;
void main() { vUv = pos[gl_VertexID] * 0.5 + 0.5; gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0); }\\\`;

const FS_SRC = \\\`#version 300 es
precision highp float;
out vec4 outColor;
uniform float uTime; uniform vec2 uResolution;
uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3; uniform vec3 uColor4; uniform vec3 uColor5; uniform vec3 uColor6;
uniform float uSpeed; uniform float uIntensity; uniform sampler2D uTouchTexture; uniform float uGrainIntensity;
uniform vec3 uDarkNavy; uniform float uGradientSize; uniform float uGradientCount;
uniform float uColor1Weight; uniform float uColor2Weight;
in vec2 vUv;

float grain(vec2 uv, float time) {
    vec2 grainUv = uv * uResolution * 0.5;
    return (fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453)) * 2.0 - 1.0;
}

vec3 getGradientColor(vec2 uv, float time) {
    float r = uGradientSize;
    vec2 c[12];
    c[0] = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
    c[1] = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
    c[2] = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
    c[3] = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
    c[4] = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
    c[5] = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
    c[6] = vec2(0.5 + sin(time * uSpeed * 0.55) * 0.38, 0.5 + cos(time * uSpeed * 0.48) * 0.42);
    c[7] = vec2(0.5 + cos(time * uSpeed * 0.65) * 0.36, 0.5 + sin(time * uSpeed * 0.52) * 0.44);
    c[8] = vec2(0.5 + sin(time * uSpeed * 0.42) * 0.41, 0.5 + cos(time * uSpeed * 0.58) * 0.39);
    c[9] = vec2(0.5 + cos(time * uSpeed * 0.48) * 0.37, 0.5 + sin(time * uSpeed * 0.62) * 0.43);
    c[10] = vec2(0.5 + sin(time * uSpeed * 0.68) * 0.33, 0.5 + cos(time * uSpeed * 0.44) * 0.46);
    c[11] = vec2(0.5 + cos(time * uSpeed * 0.38) * 0.39, 0.5 + sin(time * uSpeed * 0.56) * 0.41);
    
    vec3 col = vec3(0.0);
    float weights[2] = float[](uColor1Weight, uColor2Weight);
    vec3 uCols[6] = vec3[](uColor1, uColor2, uColor3, uColor4, uColor5, uColor6);

    for(int i=0; i<12; i++) {
        if(float(i) >= uGradientCount) break;
        float dist = length(uv - c[i]);
        float influence = 1.0 - smoothstep(0.0, r, dist);
        col += uCols[i % 6] * influence * (0.55 + 0.45 * sin(time * uSpeed * (0.8 + 0.1 * float(i)))) * weights[i % 2];
    }
    
    col = clamp(col, vec3(0.0), vec3(1.0)) * uIntensity;
    return mix(uDarkNavy, col, max(length(col) * 1.2, 0.15));
}

void main() {
    vec2 uv = vUv;
    vec4 touchTex = texture(uTouchTexture, uv);
    uv -= (touchTex.rg * 2.0 - 1.0) * 0.8 * touchTex.b;
    
    float dist = length(uv - 0.5);
    uv += vec2(sin(dist * 20.0 - uTime * 3.0) + sin(dist * 15.0 - uTime * 2.0)) * 0.03 * touchTex.b;
    
    vec3 color = getGradientColor(uv, uTime);
    color += grain(uv, uTime) * uGrainIntensity;
    outColor = vec4(clamp(color, vec3(0.0), vec3(1.0)), 1.0);
}\\\`;

const hexToRgb = (hex: string): [number, number, number] => {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
};

class TouchTexture {
    size = 64; width = 64; height = 64; maxAge = 64; radius = 16; speed = 1/64;
    trail: any[] = []; last: any = null; canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.createElement("canvas"); this.canvas.width = this.width; this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
        this.ctx.fillStyle = "black"; this.ctx.fillRect(0, 0, this.width, this.height);
    }
    update() {
        this.ctx.fillStyle = "black"; this.ctx.fillRect(0, 0, this.width, this.height);
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const p = this.trail[i]; const f = p.force * this.speed * (1 - p.age / this.maxAge);
            p.x += p.vx * f; p.y += p.vy * f; p.age++;
            if (p.age > this.maxAge) this.trail.splice(i, 1); else this.drawPoint(p);
        }
    }
    addTouch(point: { x: number; y: number }) {
        let force = 0, vx = 0, vy = 0;
        if (this.last) {
            const dx = point.x - this.last.x, dy = point.y - this.last.y;
            if (dx !== 0 || dy !== 0) { const dd = dx*dx + dy*dy; const d = Math.sqrt(dd); vx = dx/d; vy = dy/d; force = Math.min(dd * 20000, 2.0); }
        }
        this.last = { x: point.x, y: point.y };
        this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
    }
    drawPoint(p: any) {
        let intensity = p.age < 19.2 ? Math.sin((p.age/19.2)*(Math.PI/2)) : - (1-(p.age-19.2)/44.8) * ((1-(p.age-19.2)/44.8)-2);
        intensity *= p.force; const offset = 320;
        this.ctx.shadowOffsetX = this.ctx.shadowOffsetY = offset; this.ctx.shadowBlur = 16;
        this.ctx.shadowColor = \\\`rgba(\\\${((p.vx+1)/2)*255}, \\\${((p.vy+1)/2)*255}, \\\${intensity*255}, \\\${0.2*intensity})\\\`;
        this.ctx.beginPath(); this.ctx.fillStyle = "rgba(255,0,0,1)"; this.ctx.arc(p.x*64-offset, p.y*64-offset, 16, 0, Math.PI*2); this.ctx.fill();
    }
}

export interface LiquidNoiseProps {
    colors?: string[]; speed?: number; intensity?: number; grainIntensity?: number;
    gradientSize?: number; gradientCount?: number; color1Weight?: number;
    color2Weight?: number; darkNavy?: string; uppercase?: boolean;
    className?: string; children?: React.ReactNode;
}

export const LiquidNoise: React.FC<LiquidNoiseProps> = ({
    colors = ["#f15a22", "#0a0e27", "#40e0d0", "#f15a22", "#0a0e27", "#40e0d0"],
    speed = 1.2, intensity = 1.8, grainIntensity = 0.08, gradientSize = 1.0,
    gradientCount = 6.0, color1Weight = 1.0, color2Weight = 1.0, darkNavy = "#0a0e27",
    uppercase = false, className = "", children,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(0);
    const touchTextureRef = useRef<TouchTexture | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const gl = canvas.getContext("webgl2", { antialias: true, alpha: false }) as WebGL2RenderingContext;
        if (!gl) return;
        const compile = (type: number, src: string) => {
            const sh = gl.createShader(type)!; gl.shaderSource(sh, src); gl.compileShader(sh); return sh;
        };
        const prog = gl.createProgram()!; gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS_SRC));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS_SRC)); gl.linkProgram(prog); gl.useProgram(prog);

        const uniforms = {
            uTime: gl.getUniformLocation(prog, "uTime"), uResolution: gl.getUniformLocation(prog, "uResolution"),
            uColor1: gl.getUniformLocation(prog, "uColor1"), uColor2: gl.getUniformLocation(prog, "uColor2"),
            uColor3: gl.getUniformLocation(prog, "uColor3"), uColor4: gl.getUniformLocation(prog, "uColor4"),
            uColor5: gl.getUniformLocation(prog, "uColor5"), uColor6: gl.getUniformLocation(prog, "uColor6"),
            uSpeed: gl.getUniformLocation(prog, "uSpeed"), uIntensity: gl.getUniformLocation(prog, "uIntensity"),
            uTouchTexture: gl.getUniformLocation(prog, "uTouchTexture"), uGrainIntensity: gl.getUniformLocation(prog, "uGrainIntensity"),
            uDarkNavy: gl.getUniformLocation(prog, "uDarkNavy"), uGradientSize: gl.getUniformLocation(prog, "uGradientSize"),
            uGradientCount: gl.getUniformLocation(prog, "uGradientCount"),
            uColor1Weight: gl.getUniformLocation(prog, "uColor1Weight"), uColor2Weight: gl.getUniformLocation(prog, "uColor2Weight"),
        };

        const touchTextureObj = new TouchTexture(); touchTextureRef.current = touchTextureObj;
        const glTexture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(canvas.clientWidth * dpr); canvas.height = Math.floor(canvas.clientHeight * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas); resize();

        const handleMove = (e: any) => {
            const p = e.touches ? e.touches[0] : e; const rect = canvas.getBoundingClientRect();
            touchTextureObj.addTouch({ x: (p.clientX - rect.left) / rect.width, y: (p.clientY - rect.top) / rect.height });
        };
        canvas.addEventListener("mousemove", handleMove); canvas.addEventListener("touchmove", handleMove);

        const t0 = performance.now();
        const render = () => {
            const time = (performance.now() - t0) * 0.001; touchTextureObj.update();
            gl.bindTexture(gl.TEXTURE_2D, glTexture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, touchTextureObj.canvas);
            gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height); gl.uniform1f(uniforms.uTime, time);
            gl.uniform1f(uniforms.uSpeed, speed); gl.uniform1f(uniforms.uIntensity, intensity);
            gl.uniform1f(uniforms.uGrainIntensity, grainIntensity); gl.uniform1f(uniforms.uGradientSize, gradientSize);
            gl.uniform1f(uniforms.uGradientCount, gradientCount); gl.uniform1f(uniforms.uColor1Weight, color1Weight);
            gl.uniform1f(uniforms.uColor2Weight, color2Weight); const darkRgb = hexToRgb(darkNavy);
            gl.uniform3f(uniforms.uDarkNavy, darkRgb[0], darkRgb[1], darkRgb[2]);
            const cols = colors.slice(0, 6).map(hexToRgb);
            gl.uniform3f(uniforms.uColor1, cols[0][0], cols[0][1], cols[0][2]); gl.uniform3f(uniforms.uColor2, cols[1][0], cols[1][1], cols[1][2]);
            gl.uniform3f(uniforms.uColor3, cols[2][0], cols[2][1], cols[2][2]); gl.uniform3f(uniforms.uColor4, cols[3][0], cols[3][1], cols[3][2]);
            gl.uniform3f(uniforms.uColor5, cols[4][0], cols[4][1], cols[4][2]); gl.uniform3f(uniforms.uColor6, cols[5][0], cols[5][1], cols[5][2]);
            gl.uniform1i(uniforms.uTouchTexture, 0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationFrameRef.current = requestAnimationFrame(render);
        };
        animationFrameRef.current = requestAnimationFrame(render);
        return () => { cancelAnimationFrame(animationFrameRef.current); resizeObserver.disconnect(); canvas.removeEventListener("mousemove", handleMove); canvas.removeEventListener("touchmove", handleMove); };
    }, [colors, speed, intensity, grainIntensity, gradientSize, gradientCount, color1Weight, color2Weight, darkNavy]);

    return (
        <div className=\\\`relative overflow-hidden w-full h-full \\\${className}\\\`>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block touch-none" />
            <div className=\\\`absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none \\\${uppercase ? "uppercase" : ""}\\\`}>
                {children}
            </div>
        </div>
    );
};

export default LiquidNoise;`;

export const creditsData = [
	{
		title: "Component Origin",
		items: [
			{
				name: "React Bytes",
				role: "Implementation",
				url: "https://reactbytes.dev",
			},
            {
				name: "Made By Beings",
				role: "Concept",
				url: "https://madebybeings.com",
			},
		],
	},
	{
		title: "Technologies",
		items: [
			{
				name: "WebGL 2",
				role: "Graphics API",
				url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API",
			},
		],
	},
];
