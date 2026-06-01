import React, { useEffect, useRef } from 'react';

export interface RippleProps {
    zoom?: number;
    speed?: number;
    threadsFreq?: number;
    colorBase?: [number, number, number];
    brightness?: number;
    mouseInfluence?: number;
    clickToSpike?: boolean;
    className?: string;
    children?: React.ReactNode;
}

// GLSL Vertex Shader Source
const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// GLSL Fragment Shader Source
const FRAGMENT_SHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  
  // Custom interactive parameters
  uniform float u_zoom;
  uniform float u_speed;
  uniform float u_threads_freq;
  uniform vec3 u_color_base;
  uniform float u_brightness;
  uniform float u_mouse_influence;

  float threadGrid(vec2 p, float freq) {
    float r = length(p);
    float a = atan(p.y, p.x);
    float aBent = a * 1.2;
    float grid = abs(fract(aBent / 6.28318 * freq) - 0.5) * 1.5;
    float width = 0.9 - 0.5 * r;
    float line = smoothstep(width, 1.0, grid);
    line *= smoothstep(4.0, 2.0, r);
    return line;
  }

  void main() {
    // Normalize coordinates from -1.0 to 1.0, adjusting for aspect ratio
    vec2 st = gl_FragCoord.xy / u_resolution.xy * 2.0 - 1.0;
    st.x *= u_resolution.x / u_resolution.y;

    // Track mouse influence (normalized)
    vec2 m = u_mouse / u_resolution * 2.0 - 1.0;
    m.x *= u_resolution.x / u_resolution.y;
    
    // Invert Y coordinate for WebGL viewport alignment
    m.y = -m.y; 

    float distToMouse = length(st - m);
    float mouseForce = smoothstep(1.8, 0.0, distToMouse) * u_mouse_influence;

    float t = u_time * u_speed;
    
    // Zoom control - lower value means visually larger waves
    st *= u_zoom;

    // subtle rotation based on time & mouse distortion
    float rotAngle = t * 0.06 + mouseForce * 0.25;
    mat2 rot = mat2(cos(rotAngle), -sin(rotAngle), sin(rotAngle), cos(rotAngle));
    st = rot * st;

    // Dynamic wave distortion relative to mouse position
    if (u_mouse_influence > 0.0) {
      vec2 dir = st - m;
      float dist = length(dir);
      st += (dir / (dist + 0.1)) * mouseForce * 0.45;
    }

    float angle = atan(st.y, st.x);
    float phase = t * 1.5;
    
    // Standard ripple calculation
    float ripple = sin(phase * 4.0 + angle * 2.0) * 0.5 + 0.5;
    ripple += sin(length(st) * 4.5 - t * 4.0);

    // Apply thread grid overlay
    float threads = threadGrid(st, u_threads_freq);

    // High fidelity color synthesis based on customized base tinting
    vec3 baseWave = vec3(ripple * 0.2 * (threads * (ripple * 10.0)) * 0.2) * 3.0;
    vec3 finalColor = baseWave * u_color_base * u_brightness;

    // Elegant outer vignette to enrich contrast
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    vignette = clamp(pow(16.0 * vignette, 0.3), 0.0, 1.0);
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const Ripple: React.FC<RippleProps> = ({
    zoom = 1.5,
    speed = 0.25,
    threadsFreq = 28.0,
    colorBase = [0.15, 0.45, 1.0],
    brightness = 1.8,
    mouseInfluence = 0.8,
    clickToSpike = true,
    className = "",
    children
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Mouse coords ref for performance
    const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);

    // Track active mouse influence for click spike
    const activeMouseInfluenceRef = useRef(mouseInfluence);
    const isSpikingRef = useRef(false);

    // Keep active influence in sync when prop changes
    useEffect(() => {
        if (!isSpikingRef.current) {
            activeMouseInfluenceRef.current = mouseInfluence;
        }
    }, [mouseInfluence]);

    // Update dynamic values in refs for instant GL rendering loops
    const uniformsRef = useRef({
        zoom,
        speed,
        threadsFreq,
        brightness,
        colorBase
    });

    useEffect(() => {
        uniformsRef.current = {
            zoom,
            speed,
            threadsFreq,
            brightness,
            colorBase
        };
    }, [zoom, speed, threadsFreq, brightness, colorBase]);

    // WebGL Pipeline Setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }
        glRef.current = gl;

        // Compile Helper
        const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
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

        // Program Builder Helper
        const createProgram = (
            gl: WebGLRenderingContext,
            vShader: WebGLShader,
            fShader: WebGLShader
        ): WebGLProgram | null => {
            const program = gl.createProgram();
            if (!program) return null;
            gl.attachShader(program, vShader);
            gl.attachShader(program, fShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Program linking failed:', gl.getProgramInfoLog(program));
                return null;
            }
            return program;
        };

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        if (!vertexShader || !fragmentShader) return;

        const program = createProgram(gl, vertexShader, fragmentShader);
        if (!program) return;
        programRef.current = program;

        // Quad Vertices Configuration
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, 1.0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Initial Resize setup
        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(rect.height * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        resizeCanvas();
        
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Set interactive initial mouse coordinate values at the screen center
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { x: rect.width / 2, y: rect.height / 2 };

        // Get Uniform Locations
        const locations = {
            resolution: gl.getUniformLocation(program, 'u_resolution'),
            mouse: gl.getUniformLocation(program, 'u_mouse'),
            time: gl.getUniformLocation(program, 'u_time'),
            zoom: gl.getUniformLocation(program, 'u_zoom'),
            speed: gl.getUniformLocation(program, 'u_speed'),
            threadsFreq: gl.getUniformLocation(program, 'u_threads_freq'),
            colorBase: gl.getUniformLocation(program, 'u_color_base'),
            brightness: gl.getUniformLocation(program, 'u_brightness'),
            mouseInfluence: gl.getUniformLocation(program, 'u_mouse_influence')
        };

        // WebGL Frame Render Sequence
        const render = (timeMs: number) => {
            gl.useProgram(program);

            // Bind basic properties
            gl.uniform2f(locations.resolution, canvas.width, canvas.height);
            gl.uniform2f(locations.mouse, mouseRef.current.x, mouseRef.current.y);
            gl.uniform1f(locations.time, timeMs * 0.001);

            // Bind customizable dynamic parameters
            const current = uniformsRef.current;
            gl.uniform1f(locations.zoom, current.zoom);
            gl.uniform1f(locations.speed, current.speed);
            gl.uniform1f(locations.threadsFreq, current.threadsFreq);
            gl.uniform3f(locations.colorBase, current.colorBase[0], current.colorBase[1], current.colorBase[2]);
            gl.uniform1f(locations.brightness, current.brightness);
            gl.uniform1f(locations.mouseInfluence, activeMouseInfluenceRef.current);

            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            animationFrameIdRef.current = requestAnimationFrame(render);
        };

        animationFrameIdRef.current = requestAnimationFrame(render);

        // Clean up
        return () => {
            resizeObserver.disconnect();
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, []);

    // Tracking Mouse Movement
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    // Tracking Touch Movement for responsive mobile screens
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!canvasRef.current || e.touches.length === 0) return;
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current = {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    };

    // Triggering visual feedback on Canvas Click: drops a temporarily heavy distortion 
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (!clickToSpike) return;
        isSpikingRef.current = true;
        activeMouseInfluenceRef.current = 1.8; // Spike the ripple
        setTimeout(() => {
            isSpikingRef.current = false;
            activeMouseInfluenceRef.current = mouseInfluence;
        }, 450);
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden bg-black select-none ${className}`}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {/* Background Interactive WebGL Canvas */}
            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="absolute inset-0 w-full h-full cursor-crosshair block z-0"
            />

            {/* Decorative Interactive Subtle Scanline / Ambient Grid overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-[1]" />

            {/* Content Container */}
            <div className="relative w-full h-full z-10">
                {children}
            </div>
        </div>
    );
};

export default Ripple;