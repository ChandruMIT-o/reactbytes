"use client";

import React, { useEffect, useRef } from "react";

const VS_SRC = `#version 300 es
precision highp float;
const vec2 pos[3] = vec2[](
  vec2(-1.0,-1.0),
  vec2(3.0,-1.0),
  vec2(-1.0,3.0)
);
void main(){
  gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
}`;

const FS_SRC = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2  u_res;
uniform float u_time;
uniform float u_turbulence;
uniform float u_milk;
uniform float u_baseSpeed;
uniform vec3  u_baseColor;
uniform vec2  u_seed;
uniform vec2  u_mouse;
uniform float u_mouseInteraction;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float sum = 0.0, amp = 0.5, freq = 1.0;
  for(int i=0;i<5;i++){ sum += amp * noise(p*freq); freq *= 2.0; amp *= 0.5; p += vec2(37.0,17.0);} 
  return sum;
}
vec2 domainWarp(vec2 p, float t){
  float n1 = fbm(p*1.7 + t*0.06);
  float n2 = fbm(p*1.1 - t*0.05);

  vec2 mouseOffset = vec2(0.0);
  if (u_mouseInteraction > 0.0) {
    vec2 centerToMouse = p - u_mouse;
    float dist = length(centerToMouse);
    mouseOffset = centerToMouse * exp(-dist * 2.0) * u_mouseInteraction;
  }

  vec2 warp = vec2(n1, n2) - 0.5 + mouseOffset;
  return p + warp * (0.6 + 1.4*u_turbulence);
}
vec3 palette(float t){
  t = clamp(t, 0.0, 1.0);
  vec3 base  = u_baseColor;
  vec3 deep  = base * 0.55;
  vec3 mid   = base;
  vec3 light = mix(base, vec3(0.78), 0.65);
  vec3 milk  = vec3(0.96, 0.99, 1.00);
  vec3 m1 = mix(deep,  mid,  smoothstep(0.12, 0.55, t));
  vec3 m2 = mix(light, milk, smoothstep(0.62, 0.98, t));
  return mix(m1, m2, smoothstep(0.50, 0.95, t));
}
void main(){
  vec2 res = u_res; float minr = min(res.x, res.y);
  vec2 uv = (gl_FragCoord.xy - 0.5*res)/minr;

  float speed = u_baseSpeed;
  vec2 p  = uv*1.6 + u_seed;
  vec2 pw = domainWarp(p, u_time);
  float f1 = fbm(pw*1.2 + u_time*speed);
  float f2 = fbm(pw*3.0 - u_time*speed*1.7);
  float field = mix(f1, f2, 0.35);

  float tf = smoothstep(0.2, 0.92, field);
  vec3 col = palette(tf);
  float whiteBoost = smoothstep(0.55, 1.0, tf) * (0.02 + 0.98*u_milk);
  col = mix(col, vec3(0.96,0.99,1.0), whiteBoost);

  outColor = vec4(col, 1.0);
}`;

const hexToRgb01 = (hex: string): [number, number, number] => {
  hex = String(hex || "").replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((ch) => ch + ch).join("");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return [0.1176, 0.1176, 0.1176];
  return [r, g, b];
};

const rand01 = () => {
    try {
      if (window.crypto && window.crypto.getRandomValues) {
        const a = new Uint32Array(1);
        window.crypto.getRandomValues(a);
        return a[0] / 0xFFFFFFFF;
      }
    } catch {}
    return Math.random();
  };

export interface PerlinSmokeProps {
    /** The base color as a hex string */
    baseColor?: string;
    /** Speed of the animation */
    speed?: number;
    /** Amount of turbulence in the noise */
    turbulence?: number;
    /** Amount of white mixing */
    milk?: number;
    /** Enable eco mode to dynamically adjust resolution */
    eco?: boolean;
    /** Maximum device pixel ratio */
    dprCeil?: number;
    /** Manual scale when not in eco mode */
    scale?: number;
    /** Maximum frames per second */
    maxFPS?: number;
    /** Additional CSS classes */
    className?: string;
    /** Mouse interaction strength */
    mouseInteraction?: number;
}

export const PerlinSmoke: React.FC<PerlinSmokeProps> = ({
    baseColor = "#1e1e1e",
    speed = 0.08,
    turbulence = 0.5,
    milk = 0.4,
    eco = true,
    dprCeil = 1.25,
    scale = 0.9,
    maxFPS = 50,
    mouseInteraction = 0.5,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(0);
    const glRef = useRef<WebGL2RenderingContext | null>(null);

    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl2", { antialias: true, alpha: false, powerPreference: "low-power" }) as WebGL2RenderingContext;
        if (!gl) {
            console.error("WebGL2 not available.");
            return;
        }
        glRef.current = gl;

        const compile = (type: number, src: string) => {
            const sh = gl.createShader(type)!; 
            gl.shaderSource(sh, src); 
            gl.compileShader(sh);
            if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { 
                const info = gl.getShaderInfoLog(sh); 
                gl.deleteShader(sh); 
                throw new Error(info || "Unknown error"); 
            }
            return sh;
        };

        const vs = compile(gl.VERTEX_SHADER, VS_SRC);
        const fs = compile(gl.FRAGMENT_SHADER, FS_SRC);
        const prog = gl.createProgram()!; 
        gl.attachShader(prog, vs); 
        gl.attachShader(prog, fs); 
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { 
            throw new Error(gl.getProgramInfoLog(prog) || "Unknown error"); 
        }
        gl.useProgram(prog);

        const uniforms = {
            u_res: gl.getUniformLocation(prog, "u_res"),
            u_time: gl.getUniformLocation(prog, "u_time"),
            u_turbulence: gl.getUniformLocation(prog, "u_turbulence"),
            u_milk: gl.getUniformLocation(prog, "u_milk"),
            u_baseSpeed: gl.getUniformLocation(prog, "u_baseSpeed"),
            u_baseColor: gl.getUniformLocation(prog, "u_baseColor"),
            u_seed: gl.getUniformLocation(prog, "u_seed"),
            u_mouse: gl.getUniformLocation(prog, "u_mouse"),
            u_mouseInteraction: gl.getUniformLocation(prog, "u_mouseInteraction")
        };

        const seed = {
            x: (rand01() * 2 - 1) * 5.0,
            y: (rand01() * 2 - 1) * 5.0,
            t: rand01() * 1000.0
        };

        const stateDRS = { scale };

        const applySize = () => {
            const baseDPR = Math.min(dprCeil, window.devicePixelRatio || 1);
            const dpr = baseDPR * stateDRS.scale;
            const w = Math.max(2, Math.floor(canvas.clientWidth * dpr));
            const h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w; 
                canvas.height = h; 
                gl.viewport(0, 0, w, h);
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            applySize();
        });
        resizeObserver.observe(canvas);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const minr = Math.min(w, h);
            const x = e.clientX - rect.left;
            const y = canvas.height / window.devicePixelRatio - (e.clientY - rect.top); // Adjust for canvas Y direction, rough approximation
            mouseRef.current = {
                x: (e.clientX - rect.left - 0.5 * w) / (minr || 1) * 1.6,
                y: (rect.height - (e.clientY - rect.top) - 0.5 * h) / (minr || 1) * 1.6 // Invert Y
            };
        };
        canvas.addEventListener("mousemove", handleMouseMove);
        
        const handleMouseLeave = () => {
             // Slowly decay mouse if needed, but for now we'll just let it stay where it was
        };
        canvas.addEventListener("mouseleave", handleMouseLeave);

        const t0 = performance.now();
        let tPrev = t0, acc = 0, frames = 0, lastAdjust = t0, lastDraw = t0;

        const frame = () => {
            const now = performance.now();
            if (now - lastDraw < (1000 / maxFPS)) { 
                animationFrameRef.current = requestAnimationFrame(frame); 
                return; 
            }
            lastDraw = now;

            const t = (now - t0) * 0.001 + seed.t;
            const dt = Math.max(0.001, (now - tPrev) * 0.001);
            tPrev = now;

            if (eco) {
                acc += (dt * 1000.0); frames++;
                if (now - lastAdjust > 250) { // 0.25s adjust every
                    const avg = acc / frames;
                    const budget = 1000.0 / 60; // target 60 internally for budget
                    if (avg > budget * 1.12) { 
                        stateDRS.scale = Math.max(0.7, stateDRS.scale * 0.93); 
                        applySize(); 
                    }
                    else if (avg < budget * 0.85) { 
                        stateDRS.scale = Math.min(1.0, stateDRS.scale * 1.03); 
                        applySize(); 
                    }
                    acc = 0; frames = 0; lastAdjust = now;
                }
            } else {
                stateDRS.scale = scale;
            }

            const w = canvas.width;
            const h = canvas.height;

            gl.uniform2f(uniforms.u_res, w, h);
            gl.uniform1f(uniforms.u_time, t);
            gl.uniform1f(uniforms.u_turbulence, turbulence);
            gl.uniform1f(uniforms.u_milk, milk);
            gl.uniform1f(uniforms.u_baseSpeed, speed);
            const colorRgb = hexToRgb01(baseColor);
            gl.uniform3f(uniforms.u_baseColor, colorRgb[0], colorRgb[1], colorRgb[2]);
            gl.uniform2f(uniforms.u_seed, seed.x, seed.y);
            gl.uniform2f(uniforms.u_mouse, mouseRef.current.x, mouseRef.current.y);
            gl.uniform1f(uniforms.u_mouseInteraction, mouseInteraction);

            gl.drawArrays(gl.TRIANGLES, 0, 3);
            
            animationFrameRef.current = requestAnimationFrame(frame);
        };

        animationFrameRef.current = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            resizeObserver.disconnect();
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            if (gl) {
                gl.deleteProgram(prog);
                gl.deleteShader(vs);
                gl.deleteShader(fs);
            }
        };
    }, [baseColor, speed, turbulence, milk, eco, dprCeil, scale, maxFPS, mouseInteraction]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full block ${className}`}
        />
    );
};

export default PerlinSmoke;
