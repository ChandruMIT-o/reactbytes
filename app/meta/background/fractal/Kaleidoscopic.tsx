import React, { useEffect, useRef } from 'react';

export interface KaleidoscopicProps {
    className?: string;
    iterations?: number;
    timeMultiplier?: number;
    rotationSpeed?: number;
    scale?: number;
    colorA?: [number, number, number];
    colorB?: [number, number, number];
    colorC?: [number, number, number];
    colorD?: [number, number, number];
    glowIntensity?: number;
    glowPower?: number;
    waveFrequency?: number;
    waveAmplitude?: number;
    vignetteStart?: number;
    vignetteEnd?: number;
}

const getFragmentShaderSource = (iterations: number) => `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

uniform float u_timeMultiplier;
uniform float u_rotationSpeed;
uniform float u_scale;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_colorC;
uniform vec3 u_colorD;
uniform float u_glowIntensity;
uniform float u_glowPower;
uniform float u_waveFreq;
uniform float u_waveAmp;
uniform float u_vignetteStart;
uniform float u_vignetteEnd;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 uv0 = uv; 
    vec3 finalColor = vec3(0.0);
    
    float t = u_time * u_rotationSpeed;
    mat2 rot = mat2(cos(t), -sin(t), sin(t), cos(t));
    uv *= rot;
    uv0 *= rot;

    for (float i = 0.0; i < ${iterations.toFixed(1)}; i++) {
        uv = fract(uv * u_scale) - 0.5;
        float d = length(uv) * exp(-length(uv0));
        
        vec3 col = palette(length(uv0) + i*.4 + u_time * 0.2 * u_timeMultiplier, 
                           u_colorA, u_colorB, u_colorC, u_colorD);

        d = sin(d * u_waveFreq + u_time * u_timeMultiplier) / u_waveAmp;
        d = abs(d);
        d = pow(u_glowIntensity / d, u_glowPower);
        
        finalColor += col * d;
    }
    
    float vignette = 1.0 - smoothstep(u_vignetteStart, u_vignetteEnd, length(uv0));
    finalColor *= vignette;

    finalColor = finalColor / (finalColor + vec3(1.0));
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const Kaleidoscopic: React.FC<KaleidoscopicProps> = (props) => {
    const { className = '' } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const propsRef = useRef(props);

    propsRef.current = props;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        const compileShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, getFragmentShaderSource(props.iterations ?? 4.0));

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);

        const vertices = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1
        ]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        const locs = {
            resolution: gl.getUniformLocation(program, 'u_resolution'),
            time: gl.getUniformLocation(program, 'u_time'),
            timeMultiplier: gl.getUniformLocation(program, 'u_timeMultiplier'),
            rotationSpeed: gl.getUniformLocation(program, 'u_rotationSpeed'),
            scale: gl.getUniformLocation(program, 'u_scale'),
            colorA: gl.getUniformLocation(program, 'u_colorA'),
            colorB: gl.getUniformLocation(program, 'u_colorB'),
            colorC: gl.getUniformLocation(program, 'u_colorC'),
            colorD: gl.getUniformLocation(program, 'u_colorD'),
            glowIntensity: gl.getUniformLocation(program, 'u_glowIntensity'),
            glowPower: gl.getUniformLocation(program, 'u_glowPower'),
            waveFreq: gl.getUniformLocation(program, 'u_waveFreq'),
            waveAmp: gl.getUniformLocation(program, 'u_waveAmp'),
            vignetteStart: gl.getUniformLocation(program, 'u_vignetteStart'),
            vignetteEnd: gl.getUniformLocation(program, 'u_vignetteEnd'),
        };

        // --- Updated Resize Logic ---
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            // Get sizing directly from the canvas bounding client rect
            const width = Math.floor(canvas.clientWidth * dpr);
            const height = Math.floor(canvas.clientHeight * dpr);

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }
            // Always ensure uniform matches current drawing buffer size
            gl.uniform2f(locs.resolution, canvas.width, canvas.height);
        };

        // Track container modifications via ResizeObserver
        const resizeObserver = new ResizeObserver(() => {
            resize();
        });
        resizeObserver.observe(canvas);

        // Initial manual call to set dimensions right away
        resize();

        // --- Render Loop ---
        let animationFrameId: number;
        const startTime = Date.now();

        const render = () => {
            const p = propsRef.current;
            const currentTime = (Date.now() - startTime) * 0.001;

            gl.uniform1f(locs.time, currentTime);
            gl.uniform1f(locs.timeMultiplier, p.timeMultiplier ?? 1.0);
            gl.uniform1f(locs.rotationSpeed, p.rotationSpeed ?? 0.05);
            gl.uniform1f(locs.scale, p.scale ?? 1.3);
            gl.uniform3fv(locs.colorA, p.colorA || [0.5, 0.5, 0.5]);
            gl.uniform3fv(locs.colorB, p.colorB || [0.5, 0.5, 0.5]);
            gl.uniform3fv(locs.colorC, p.colorC || [1.0, 1.0, 1.0]);
            gl.uniform3fv(locs.colorD, p.colorD || [0.263, 0.416, 0.557]);
            gl.uniform1f(locs.glowIntensity, p.glowIntensity ?? 0.012);
            gl.uniform1f(locs.glowPower, p.glowPower ?? 1.2);
            gl.uniform1f(locs.waveFreq, p.waveFrequency ?? 8.0);
            gl.uniform1f(locs.waveAmp, p.waveAmplitude ?? 8.0);
            gl.uniform1f(locs.vignetteStart, p.vignetteStart ?? 0.5);
            gl.uniform1f(locs.vignetteEnd, p.vignetteEnd ?? 3.0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        // --- Cleanup ---
        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(buffer);
        };
    }, [props.iterations]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full block ${className}`}
            style={{ backgroundColor: '#000' }}
        />
    );
};

export default Kaleidoscopic;