"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface SuperstructureProps {
  /** Mesh gradient start color (Hex) */
  startColor?: string;
  /** Mesh gradient end color (Hex) */
  endColor?: string;
  /** Clear background color of WebGL canvas (Hex) */
  bgColor?: string;
  /** Radius of the superstructure mesh */
  radius?: number;
  /** Detail level of the geometry lattice */
  detail?: number;
  /** Opacity of the wireframe mesh lines */
  opacity?: number;
  /** Speed of the wave displacement animation */
  speed?: number;
  /** Toggle user drag interaction camera orbiting */
  enableControls?: boolean;
  /** Toggle auto rotation of the camera */
  autoRotate?: boolean;
  /** Custom CSS class names */
  className?: string;
  /** Overlay children elements */
  children?: React.ReactNode;
}

export const Superstructure: React.FC<SuperstructureProps> = ({
  startColor = "#ff00ff",
  endColor = "#8080ff",
  bgColor = "#010c05",
  radius = 900,
  detail = 20,
  opacity = 0.25,
  speed = 1.0,
  enableControls = true,
  autoRotate = false,
  className = "",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep uniforms in refs to update in real-time without recreating the scene
  const uniformsRef = useRef({
    time: { value: 0 },
    startColor: { value: new THREE.Color(startColor) },
    endColor: { value: new THREE.Color(endColor) },
  });

  // Sync color values when props change
  useEffect(() => {
    uniformsRef.current.startColor.value.set(startColor);
    uniformsRef.current.endColor.value.set(endColor);
  }, [startColor, endColor]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      2500
    );
    camera.position.set(-1.25, 2, 5).setLength(14);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(new THREE.Color(bgColor));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2.8, 0);
    controls.enableDamping = true;
    controls.enabled = enableControls;

    // --- Mesh Generation ---
    const sstructG = new THREE.IcosahedronGeometry(radius, detail);
    const ssCenters: number[] = [];
    const ssPhase: number[] = [];
    const ssPos = sstructG.attributes.position;
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const v3 = new THREE.Vector3();

    for (let i = 0; i < ssPos.count / 3; i++) {
      vA.fromBufferAttribute(ssPos, i * 3 + 0);
      vB.fromBufferAttribute(ssPos, i * 3 + 1);
      vC.fromBufferAttribute(ssPos, i * 3 + 2);
      v3.addVectors(vA, vB).add(vC).divideScalar(3);
      ssCenters.push(v3.x, v3.y, v3.z, v3.x, v3.y, v3.z, v3.x, v3.y, v3.z);

      const rnd = Math.random();
      ssPhase.push(rnd, rnd, rnd);
    }

    sstructG.setAttribute(
      "centers",
      new THREE.Float32BufferAttribute(ssCenters, 3)
    );
    sstructG.setAttribute("phase", new THREE.Float32BufferAttribute(ssPhase, 1));

    const sstructM = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xffffff,
      transparent: true,
      opacity: opacity,
    });

    sstructM.onBeforeCompile = (shader) => {
      shader.uniforms.time = uniformsRef.current.time;
      shader.uniforms.startColor = uniformsRef.current.startColor;
      shader.uniforms.endColor = uniformsRef.current.endColor;

      shader.vertexShader = `
        uniform float time;
        attribute vec3 centers;
        attribute float phase;
        varying float vHVal;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
          float t = time;
          vec3 dir = position - centers;
          float dirLen = length(dir);
          float hVal = 0.6 + pow(sin((centers.y * 0.05 + phase) * PI2 - t), 1.) * 0.4;
          vHVal = hVal;
          transformed = centers + normalize(dir) * dirLen * hVal;
        `
      );

      shader.fragmentShader = `
        uniform vec3 startColor;
        uniform vec3 endColor;
        varying float vHVal;
        ${shader.fragmentShader}
      `.replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `
        vec3 col = mix(startColor, endColor, vHVal);
        vec4 diffuseColor = vec4( col, opacity );`
      );
    };

    const sstruct = new THREE.Mesh(sstructG, sstructM);
    scene.add(sstruct);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const tick = () => {
      const elapsed = clock.getElapsedTime();
      uniformsRef.current.time.value = elapsed * speed;

      controls.enabled = enableControls;
      if (autoRotate) {
        // Slowly rotate camera around target
        const timeVal = elapsed * 0.05;
        const dist = camera.position.distanceTo(controls.target);
        camera.position.x = controls.target.x + Math.sin(timeVal) * dist;
        camera.position.z = controls.target.z + Math.cos(timeVal) * dist;
      }

      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      sstructG.dispose();
      sstructM.dispose();
      controls.dispose();
    };
  }, [radius, detail, opacity, bgColor, enableControls, autoRotate, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-black ${className}`}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full block z-0" />
      {children && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

export default Superstructure;
