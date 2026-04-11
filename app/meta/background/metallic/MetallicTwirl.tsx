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
void main() {
    gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
}`;

const FS_SRC = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_zoom;
uniform float u_symmetry;
uniform float u_amplitude;

const float pi = 3.1415926;

vec3 palette3(float t, float factor) {
    vec3 a = vec3(0.5) + 0.3 * sin(vec3(0.1, 0.3, 0.5) * factor);
    vec3 b = vec3(0.5) + 0.3 * cos(vec3(0.2, 0.4, 0.6) * factor);
    vec3 c = vec3(1.0) + 0.5 * sin(vec3(0.3, 0.7, 0.9) * factor);
    vec3 d = vec3(0.25, 0.4, 0.55) + 0.2 * cos(vec3(0.5, 0.6, 0.7) * factor);
    return a + b * cos(6.28318 * (c * t + d));
}

vec2 rotate(vec2 pos, float angle) {
    float cosAngle = cos(angle);
    float sinAngle = sin(angle);
    mat2 rotationMatrix = mat2(cosAngle, -sinAngle, sinAngle, cosAngle);
    return rotationMatrix * pos;
}

float oscillate(float time, float minVal, float maxVal) {
    float sineWave = sin(time);
    float normalizedSine = (sineWave + 1.0) / 2.0;
    return mix(minVal, maxVal, normalizedSine);
}

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
               u.y);
}

void main() {
    vec2 uv = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;
    
    uv = rotate(uv, u_time * 0.03 * u_speed);
    uv *= u_zoom;
    
    float t = u_time * u_speed;
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float N = u_symmetry;
    a = abs(mod(a, (pi * 2.0) / N) - pi / N);
    uv = vec2(cos(a), sin(a)) * r;
    uv *= noise(uv + u_time * oscillate(u_time * 0.01, 0.01, 0.1)) * 0.05;

    float v = 5.0 + 0.5 * sin(5.0 * uv.x + 10.0 * uv.y + t * 3.0) * (0.5 + 0.2 * sin(0.5 * r - t * 5.0));

    vec3 col = 0.5 + 0.5 * cos(pi * 2.0 * (vec3(0.9, 0.2, 0.1) * v + vec3(0.0, 0.2, 0.35)));
    
    outColor = vec4(palette3(-length(col) * u_amplitude, length(col) * 0.2), 1.0);
}`;

export interface MetallicTwirlProps {
    /** The speed of the animation. Default is 0.2 */
    speed?: number;
    /** The zoom level. Default is 15.0 */
    zoom?: number;
    /** The number of symmetrical folds. Default is 18.0 */
    symmetry?: number;
    /** Output color amplitude (color intensity). Default is 1.9 */
    amplitude?: number;
    /** Additional CSS classes for the container */
    className?: string;
    /** Optional children to render over the background */
    children?: React.ReactNode;
}

export const MetallicTwirl: React.FC<MetallicTwirlProps> = ({
    speed = 0.2,
    zoom = 15.0,
    symmetry = 18.0,
    amplitude = 1.9,
    className = "",
    children,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGL2RenderingContext | null>(null);
    const animationFrameRef = useRef<number>(0);

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
            u_resolution: gl.getUniformLocation(program, "u_resolution"),
            u_time: gl.getUniformLocation(program, "u_time"),
            u_speed: gl.getUniformLocation(program, "u_speed"),
            u_zoom: gl.getUniformLocation(program, "u_zoom"),
            u_symmetry: gl.getUniformLocation(program, "u_symmetry"),
            u_amplitude: gl.getUniformLocation(program, "u_amplitude"),
        };

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

        const t0 = performance.now();

        const render = () => {
            const time = (performance.now() - t0) * 0.001;

            gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
            gl.uniform1f(uniforms.u_time, time);
            gl.uniform1f(uniforms.u_speed, speed);
            gl.uniform1f(uniforms.u_zoom, zoom);
            gl.uniform1f(uniforms.u_symmetry, symmetry);
            gl.uniform1f(uniforms.u_amplitude, amplitude);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            animationFrameRef.current = requestAnimationFrame(render);
        };

        animationFrameRef.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            resizeObserver.disconnect();
            if (gl) {
                gl.deleteProgram(program);
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
            }
        };
    }, [speed, zoom, symmetry, amplitude]);

    return (
        <div className={`relative overflow-hidden w-full h-full ${className}`}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                {children}
            </div>
        </div>
    );
};

export default MetallicTwirl;
