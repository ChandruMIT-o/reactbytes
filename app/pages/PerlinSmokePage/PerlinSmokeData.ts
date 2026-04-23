export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "baseColor",
				type: "string",
				defaultValue: "'#1e1e1e'",
				description: "Base color of the smoke effect (hex format).",
			},
			{
				name: "speed",
				type: "number",
				defaultValue: "0.08",
				description: "Speed at which the smoke evolves over time.",
			},
			{
				name: "turbulence",
				type: "number",
				defaultValue: "0.5",
				description: "Amount of noise and distortion applied to the smoke.",
			},
			{
				name: "milk",
				type: "number",
				defaultValue: "0.4",
				description: "How 'milky' or white the brighter parts of the smoke should be.",
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
		title: "Performance & Interaction Props",
		props: [
			{
				name: "eco",
				type: "boolean",
				defaultValue: "true",
				description: "Enables eco mode which dynamically changes resolution to save power.",
			},
			{
				name: "dprCeil",
				type: "number",
				defaultValue: "1.25",
				description: "Maximum device pixel ratio to allow for rendering.",
			},
			{
				name: "maxFPS",
				type: "number",
				defaultValue: "50",
				description: "Maximum frames per second cap.",
			},
			{
				name: "mouseInteraction",
				type: "number",
				defaultValue: "0.5",
				description: "Strength of the mouse pushing effect on the smoke.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useRef } from "react";

const VS_SRC = \\\`#version 300 es
precision highp float;
const vec2 pos[3] = vec2[](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
void main(){ gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0); }\\\`;

const FS_SRC = \\\`#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 u_res; uniform float u_time; uniform float u_turbulence; uniform float u_milk;
uniform float u_baseSpeed; uniform vec3 u_baseColor; uniform vec2 u_seed; uniform vec2 u_mouse;
uniform float u_mouseInteraction;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float sum = 0.0, amp = 0.5, freq = 1.0;
  for(int i=0;i<5;i++){ sum += amp * noise(p*freq); freq *= 2.0; amp *= 0.5; p += vec2(37.0,17.0);} 
  return sum;
}
vec2 domainWarp(vec2 p, float t){
  float n1 = fbm(p*1.7 + t*0.06); float n2 = fbm(p*1.1 - t*0.05);
  vec2 mouseOffset = vec2(0.0);
  if (u_mouseInteraction > 0.0) {
    vec2 centerToMouse = p - u_mouse; float dist = length(centerToMouse);
    mouseOffset = centerToMouse * exp(-dist * 2.0) * u_mouseInteraction;
  }
  vec2 warp = vec2(n1, n2) - 0.5 + mouseOffset;
  return p + warp * (0.6 + 1.4*u_turbulence);
}
vec3 palette(float t){
  t = clamp(t, 0.0, 1.0); vec3 base = u_baseColor;
  vec3 m1 = mix(base * 0.55, base, smoothstep(0.12, 0.55, t));
  vec3 m2 = mix(mix(base, vec3(0.78), 0.65), vec3(0.96, 0.99, 1.00), smoothstep(0.62, 0.98, t));
  return mix(m1, m2, smoothstep(0.50, 0.95, t));
}
void main(){
  vec2 res = u_res; float minr = min(res.x, res.y);
  vec2 uv = (gl_FragCoord.xy - 0.5*res)/minr;
  vec2 p = uv*1.6 + u_seed; vec2 pw = domainWarp(p, u_time);
  float field = mix(fbm(pw*1.2 + u_time*u_baseSpeed), fbm(pw*3.0 - u_time*u_baseSpeed*1.7), 0.35);
  float tf = smoothstep(0.2, 0.92, field);
  vec3 col = mix(palette(tf), vec3(0.96,0.99,1.0), smoothstep(0.55, 1.0, tf) * (0.02 + 0.98*u_milk));
  outColor = vec4(col, 1.0);
}\\\`;

const hexToRgb01 = (hex: string): [number, number, number] => {
  hex = String(hex || "").replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((ch) => ch + ch).join("");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return [Number.isNaN(r) ? 0.1 : r, Number.isNaN(g) ? 0.1 : g, Number.isNaN(b) ? 0.1 : b];
};

export interface PerlinSmokeProps {
    baseColor?: string; speed?: number; turbulence?: number; milk?: number;
    eco?: boolean; dprCeil?: number; scale?: number; maxFPS?: number;
    className?: string; mouseInteraction?: number; uppercase?: boolean;
    children?: React.ReactNode;
}

export const PerlinSmoke: React.FC<PerlinSmokeProps> = ({
    baseColor = "#1e1e1e", speed = 0.08, turbulence = 0.5, milk = 0.4,
    eco = true, dprCeil = 1.25, scale = 0.9, maxFPS = 50,
    mouseInteraction = 0.5, uppercase = false, className = "", children,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const gl = canvas.getContext("webgl2", { antialias: true, alpha: false }) as WebGL2RenderingContext;
        if (!gl) return;
        const compile = (type: number, src: string) => {
            const sh = gl.createShader(type)!; gl.shaderSource(sh, src); gl.compileShader(sh); return sh;
        };
        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS_SRC));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS_SRC));
        gl.linkProgram(prog); gl.useProgram(prog);

        const uniforms = {
            u_res: gl.getUniformLocation(prog, "u_res"), u_time: gl.getUniformLocation(prog, "u_time"),
            u_turbulence: gl.getUniformLocation(prog, "u_turbulence"), u_milk: gl.getUniformLocation(prog, "u_milk"),
            u_baseSpeed: gl.getUniformLocation(prog, "u_baseSpeed"), u_baseColor: gl.getUniformLocation(prog, "u_baseColor"),
            u_seed: gl.getUniformLocation(prog, "u_seed"), u_mouse: gl.getUniformLocation(prog, "u_mouse"),
            u_mouseInteraction: gl.getUniformLocation(prog, "u_mouseInteraction")
        };

        const seed = { x: (Math.random()*2-1)*5, y: (Math.random()*2-1)*5, t: Math.random()*1000 };
        const stateDRS = { scale };

        const applySize = () => {
            const dpr = Math.min(dprCeil, window.devicePixelRatio || 1) * stateDRS.scale;
            const w = Math.max(2, Math.floor(canvas.clientWidth * dpr));
            const h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
            if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
        };
        const resizeObserver = new ResizeObserver(applySize); resizeObserver.observe(canvas);
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect(); const minr = Math.min(rect.width, rect.height);
            mouseRef.current = { x: (e.clientX-rect.left-0.5*rect.width)/(minr||1)*1.6, y: (rect.height-(e.clientY-rect.top)-0.5*rect.height)/(minr||1)*1.6 };
        };
        canvas.addEventListener("mousemove", handleMouseMove);

        const t0 = performance.now(); let tPrev = t0, acc = 0, frames = 0, lastAdjust = t0, lastDraw = t0;
        const frame = () => {
            const now = performance.now();
            if (now - lastDraw < (1000 / maxFPS)) { animationFrameRef.current = requestAnimationFrame(frame); return; }
            lastDraw = now; const t = (now - t0) * 0.001 + seed.t; const dt = Math.max(0.001, (now - tPrev) * 0.001); tPrev = now;
            if (eco) {
                acc += (dt * 1000.0); frames++;
                if (now - lastAdjust > 250) {
                    const avg = acc / frames; const budget = 1000.0 / 60;
                    if (avg > budget * 1.12) { stateDRS.scale = Math.max(0.7, stateDRS.scale * 0.93); applySize(); }
                    else if (avg < budget * 0.85) { stateDRS.scale = Math.min(1.0, stateDRS.scale * 1.03); applySize(); }
                    acc = 0; frames = 0; lastAdjust = now;
                }
            } else { stateDRS.scale = scale; }

            gl.uniform2f(uniforms.u_res, canvas.width, canvas.height); gl.uniform1f(uniforms.u_time, t);
            gl.uniform1f(uniforms.u_turbulence, turbulence); gl.uniform1f(uniforms.u_milk, milk);
            gl.uniform1f(uniforms.u_baseSpeed, speed); const colorRgb = hexToRgb01(baseColor);
            gl.uniform3f(uniforms.u_baseColor, colorRgb[0], colorRgb[1], colorRgb[2]);
            gl.uniform2f(uniforms.u_seed, seed.x, seed.y); gl.uniform2f(uniforms.u_mouse, mouseRef.current.x, mouseRef.current.y);
            gl.uniform1f(uniforms.u_mouseInteraction, mouseInteraction); gl.drawArrays(gl.TRIANGLES, 0, 3);
            animationFrameRef.current = requestAnimationFrame(frame);
        };
        animationFrameRef.current = requestAnimationFrame(frame);
        return () => { cancelAnimationFrame(animationFrameRef.current); resizeObserver.disconnect(); canvas.removeEventListener("mousemove", handleMouseMove); };
    }, [baseColor, speed, turbulence, milk, eco, dprCeil, scale, maxFPS, mouseInteraction]);

    return (
        <div className=\\\`relative isolate w-full h-full overflow-hidden \\\${className}\\\`>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            {children && (
                <div className=\\\`absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none \\\${uppercase ? "uppercase" : ""}\\\`}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default PerlinSmoke;`;

export const creditsData = [
	{
		title: "Component Source",
		items: [
			{
				name: "React Bytes",
				role: "Collection",
				url: "https://reactbytes.dev",
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
