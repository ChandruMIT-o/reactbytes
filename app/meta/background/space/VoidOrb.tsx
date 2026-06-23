"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';

declare global {
    interface Window {
        THREE: any;
    }
}

export interface VoidOrbProps {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fractalScale?: number;
    fractalX?: number;
    fractalY?: number;
    lightCount?: number;
    lightIntensity?: number;
    lightSpeed?: number;
    grainStrength?: number;
    grainSize?: number;
    animationSpeed?: number;
    autoRotate?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export default function VoidOrb({
    primaryColor = '#ffffff',
    secondaryColor = '#7c7c7c',
    accentColor = '#000000',
    fractalScale = 0.35,
    fractalX = 0.0,
    fractalY = 0.0,
    lightCount = 1,
    lightIntensity = 1.2,
    lightSpeed = 0.8,
    grainStrength = 0.16,
    grainSize = 3.5,
    animationSpeed = 0.015,
    autoRotate = true,
    className = '',
    children,
}: VoidOrbProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shaderMaterialRef = useRef<any>(null);
    const mouseRef = useRef<any>(null);
    const smoothedMouseRef = useRef<any>(null);

    const [threeLoaded, setThreeLoaded] = useState(false);

    // Dynamic THREE.js script injection
    useEffect(() => {
        if (window.THREE) {
            setThreeLoaded(true);
            return;
        }

        const existingScript = document.querySelector('script[src*="three.min.js"]');
        if (existingScript) {
            const handleLoad = () => setThreeLoaded(true);
            existingScript.addEventListener('load', handleLoad);
            return () => {
                existingScript.removeEventListener('load', handleLoad);
            };
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.async = true;
        script.onload = () => setThreeLoaded(true);
        document.head.appendChild(script);
    }, []);

    // Sync interactive props directly with WebGL uniform values in real-time
    useEffect(() => {
        if (shaderMaterialRef.current && window.THREE) {
            const uniforms = shaderMaterialRef.current.uniforms;

            // OPTIMIZATION: Mutate colors in place using Three's native hex string parser.
            // Zero object creation / Zero GC thrashing.
            uniforms.primaryColor.value.set(primaryColor);
            uniforms.secondaryColor.value.set(secondaryColor);
            uniforms.accentColor.value.set(accentColor);

            uniforms.fractalScale.value = fractalScale;
            uniforms.fractalOffset.value.set(fractalX, fractalY);
            uniforms.lightCount.value = Math.floor(lightCount);
            uniforms.lightIntensity.value = lightIntensity;
            uniforms.lightSpeed.value = lightSpeed;
            uniforms.grainStrength.value = grainStrength;
            uniforms.grainSize.value = grainSize;
            uniforms.animationSpeed.value = animationSpeed;
            uniforms.autoRotate.value = autoRotate ? 1.0 : 0.0;
        }
    }, [
        primaryColor,
        secondaryColor,
        accentColor,
        fractalScale,
        fractalX,
        fractalY,
        lightCount,
        lightIntensity,
        lightSpeed,
        grainStrength,
        grainSize,
        animationSpeed,
        autoRotate
    ]);

    // Handle localized Three.js lifecycle sequence
    useEffect(() => {
        if (!threeLoaded || !canvasRef.current || !containerRef.current) return;

        const THREE = window.THREE;
        if (!THREE) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: false,
        });

        const handleResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            if (shaderMaterialRef.current) {
                shaderMaterialRef.current.uniforms.iResolution.value.set(width, height);
            }
        };

        handleResize();

        const mouse = new THREE.Vector2(container.clientWidth / 2, container.clientHeight / 2);
        const smoothedMouse = new THREE.Vector2(container.clientWidth / 2, container.clientHeight / 2);
        mouseRef.current = mouse;
        smoothedMouseRef.current = smoothedMouse;

        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                iResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
                iTime: { value: 0.0 },
                smoothedMouse: { value: new THREE.Vector2(container.clientWidth / 2, container.clientHeight / 2) },
                mouseDown: { value: 0.0 },
                primaryColor: { value: new THREE.Color(primaryColor) },
                secondaryColor: { value: new THREE.Color(secondaryColor) },
                accentColor: { value: new THREE.Color(accentColor) },
                fractalScale: { value: fractalScale },
                fractalOffset: { value: new THREE.Vector2(fractalX, fractalY) },
                lightCount: { value: Math.floor(lightCount) },
                lightIntensity: { value: lightIntensity },
                lightSpeed: { value: lightSpeed },
                grainStrength: { value: grainStrength },
                grainSize: { value: grainSize },
                animationSpeed: { value: animationSpeed },
                autoRotate: { value: autoRotate ? 1.0 : 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform vec2 iResolution;
                uniform float iTime;
                uniform vec3 primaryColor;
                uniform vec3 secondaryColor;
                uniform vec3 accentColor;
                uniform vec2 smoothedMouse;
                uniform float mouseDown;
                uniform float fractalScale;
                uniform vec2 fractalOffset;
                uniform int lightCount;
                uniform float lightIntensity;
                uniform float lightSpeed;
                uniform float grainStrength;
                uniform float grainSize;
                uniform float animationSpeed;
                uniform float autoRotate;

                #define PI 3.14159265359

                float hash(vec2 p) {
                  p = fract(p * vec2(123.34, 456.21));
                  p += dot(p, p + 45.32);
                  return fract(p.x * p.y);
                }

                float hash(float n) {
                  return fract(sin(n) * 43758.5453);
                }

                mat2 rot(float a) {
                  float s = sin(a);
                  float c = cos(a);
                  return mat2(c, -s, s, c);
                }

                float orbShape(vec2 uv, float time) {
                  uv = (uv * 2.0 - 1.0);
                  uv.x *= iResolution.x / iResolution.y;
                  
                  if (autoRotate > 0.5) {
                    uv *= rot(time * animationSpeed * 2.0);
                  }

                  uv *= fractalScale;
                  uv += fractalOffset;
                  
                  float d = length(uv);
                  float pulse = 0.5 + 0.1 * sin(time * animationSpeed * 2.0);
                  float shape = smoothstep(pulse, pulse - 0.1, d);
                  float innerGlow = smoothstep(pulse * 0.8, 0.0, d) * 0.5;
                  
                  float angle = atan(uv.y, uv.x);
                  float swirl = 0.15 * sin(angle * 8.0 + time * 3.0 * animationSpeed) * smoothstep(pulse, 0.0, d);
                  
                  return shape + innerGlow + swirl;
                }

                // OPTIMIZATION: Passed down precalculated lightStep to keep it out of the per-pixel calculation loop
                vec3 getLightPosition(int index, float time, float lightStep) {
                  float angle = float(index) * lightStep + time * lightSpeed;
                  float radius = 1.5;
                  float height = sin(time * lightSpeed * 0.5 + float(index)) * 0.5;
                  return vec3(radius * cos(angle), height, radius * sin(angle));
                }

                float calculateLight(vec2 uv, float time) {
                  vec3 pos = vec3(uv.x, uv.y, 0.0);
                  float totalLight = 0.0;
                  
                  // OPTIMIZATION: Calculated loop-invariant scalar outside loop block
                  float lightStep = (2.0 * PI) / max(float(lightCount), 1.0);
                  
                  for (int i = 0; i < 10; i++) {
                    if (i >= lightCount) break;
                    vec3 lightPos = getLightPosition(i, time, lightStep);
                    float dist = length(pos - lightPos);
                    totalLight += lightIntensity / (1.0 + dist * dist * 2.0);
                  }
                  
                  vec2 mousePos = smoothedMouse / iResolution.xy;
                  mousePos = (mousePos * 2.0 - 1.0);
                  mousePos.x *= iResolution.x / iResolution.y;
                  
                  float mouseDist = length(uv - mousePos);
                  float clickLightMultiplier = (mouseDown > 0.5) ? 4.0 : 2.0;
                  totalLight += lightIntensity * clickLightMultiplier / (1.0 + mouseDist * mouseDist * 4.0);
                  
                  return totalLight;
                }

                void main() {
                  vec2 uv = gl_FragCoord.xy / iResolution.xy;
                  vec2 centeredUV = (uv * 2.0 - 1.0);
                  centeredUV.x *= iResolution.x / iResolution.y;
                  
                  float shape = orbShape(uv, iTime);
                  float light = calculateLight(centeredUV, iTime);
                  
                  float orbMask = clamp(shape, 0.0, 1.0);
                  vec3 baseColor = mix(primaryColor, secondaryColor, orbMask);
                  
                  // OPTIMIZATION: Replaced mathematical pow(shape, 3.0) with faster algebraic multiplication
                  float highlight = clamp((shape * shape * shape) * 0.7, 0.0, 1.0);
                  baseColor = mix(baseColor, accentColor, highlight);
                  baseColor = mix(accentColor, baseColor, orbMask);
                  
                  baseColor *= light * (shape + 0.2);
                  
                  vec2 uvRandom = vUv;
                  uvRandom.y *= hash(vec2(uvRandom.y, iTime * 0.01));
                  float noise = hash(uvRandom * grainSize + iTime * 0.1) * grainStrength;
                  baseColor += noise - grainStrength * 0.5;
                  
                  float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
                  vignette = clamp(pow(16.0 * vignette, 0.35), 0.0, 1.0);
                  baseColor *= vignette;

                  gl_FragColor = vec4(clamp(baseColor, 0.0, 1.0), 1.0);
                }
            `
        });

        shaderMaterialRef.current = shaderMaterial;

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
        scene.add(plane);

        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(container);

        let animationFrameId: number;
        const startTime = performance.now();

        const animate = () => {
            const elapsedSeconds = (performance.now() - startTime) * 0.001;
            shaderMaterial.uniforms.iTime.value = elapsedSeconds;

            smoothedMouse.lerp(mouse, 0.08);
            shaderMaterial.uniforms.smoothedMouse.value.copy(smoothedMouse);

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            renderer.dispose();
            plane.geometry.dispose();
            shaderMaterial.dispose();
        };
    }, [threeLoaded]);

    // OPTIMIZATION: Memoized pointer listeners via useCallback
    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!canvasRef.current || !mouseRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = rect.height - (e.clientY - rect.top);
        mouseRef.current.set(mouseX, mouseY);
    }, []);

    const handlePointerDown = useCallback(() => {
        if (shaderMaterialRef.current) {
            shaderMaterialRef.current.uniforms.mouseDown.value = 1.0;
        }
    }, []);

    const handlePointerUp = useCallback(() => {
        if (shaderMaterialRef.current) {
            shaderMaterialRef.current.uniforms.mouseDown.value = 0.0;
        }
    }, []);

    return (
        <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className={`relative w-full h-full overflow-hidden select-none bg-black ${className}`}
        >
            {/* OPTIMIZATION: Decreased numOctaves from 4 to 2 to minimize critical rendering path layout paint cycles */}
            <svg className="absolute w-0 h-0 pointer-events-none">
                <filter id="noise-generator-voidorb">
                    <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="2" stitchTiles="stitch" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.45 0" />
                </filter>
            </svg>
            <div
                className="absolute inset-0 pointer-events-none z-[1] bg-transparent opacity-[0.13]"
                style={{ filter: 'url(#noise-generator-voidorb)', mixBlendMode: 'overlay' }}
            />

            {!threeLoaded && (
                <div className="absolute inset-0 bg-neutral-950/90 flex flex-col justify-center items-center z-10 transition-opacity duration-300">
                    <div className="w-10 h-10 border-2 border-white/5 border-t-white/80 rounded-full animate-spin mb-4" />
                    <p className="font-mono text-[9px] uppercase text-neutral-400 tracking-widest animate-pulse">
                        Configuring WebGL Canvas...
                    </p>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full block z-0"
            />

            {children && (
                <div className="relative w-full h-full z-[2] pointer-events-auto">
                    {children}
                </div>
            )}
        </div>
    );
}