export const loaderProps = [
  {
    title: "Accretion Disk Physics Props",
    props: [
      {
        name: "morph",
        type: "number",
        defaultValue: "0.1",
        description: "Accretion disk turbulence/wave morph intensity based on procedural 3D noise.",
      },
      {
        name: "compress",
        type: "number",
        defaultValue: "1.0",
        description: "Accretion disk coordinate compression multiplier, pulling/pushing disk particles relative to event horizon.",
      },
      {
        name: "intensity",
        type: "number",
        defaultValue: "1.0",
        description: "Radiation glow luminosity/brightness of the gravitational lensing halo and disk streaks.",
      },
      {
        name: "orbitScale",
        type: "number",
        defaultValue: "1.0",
        description: "Rotational orbit speed scaling factor for accretion disk streamers.",
      },
      {
        name: "rotateSpeed",
        type: "number",
        defaultValue: "0.4",
        description: "Auto-rotation speed of the viewport coordinate system around the singularity core.",
      },
    ],
  },
  {
    title: "Camera & Styling Props",
    props: [
      {
        name: "colorBase",
        type: "[number, number, number]",
        defaultValue: "[0.0, 0.95, 1.0]",
        description: "Base color vector (normalized [R, G, B]) used to tint the gravitational lens and emission jets.",
      },
      {
        name: "camDist",
        type: "number",
        defaultValue: "80",
        description: "Radial orbit distance of the viewport camera from the center Schwarzschild singularity.",
      },
      {
        name: "camPhi",
        type: "number",
        defaultValue: "1.2",
        description: "Vertical latitude inclination angle (in radians) of the orbital camera.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "''",
        description: "Additional CSS class names to apply to the root wrapper element.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Relative foreground content rendered on top of the 3D space backdrop.",
      },
    ],
  },
];

export const creditsData = [
  {
    title: "3D Graphics & Physics",
    items: [
      {
        name: "Three.js",
        role: "3D Render Pipeline",
        url: "https://threejs.org",
      },
      {
        name: "Schwarzschild Metric",
        role: "Physics Inspiration",
        url: "https://en.wikipedia.org/wiki/Schwarzschild_metric",
      },
    ],
  },
  {
    title: "Development Team",
    items: [
      {
        name: "React Bytes",
        role: "Attribution and Licensing",
        url: "https://reactbytes.dev",
      },
    ],
  },
];

export const componentCode = `import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface SingularityProps {
  morph?: number;
  compress?: number;
  intensity?: number;
  orbitScale?: number;
  rotateSpeed?: number;
  colorBase?: [number, number, number];
  camDist?: number;
  camPhi?: number;
  className?: string;
  children?: React.ReactNode;
}

// Procedural Simplex-style 3D noise for accretion warping in GPU
const NOISE_CHUNK = \\\`
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }
\\\`;

export const Singularity: React.FC<SingularityProps> = ({
  morph = 0.1,
  compress = 1.0,
  intensity = 1.0,
  orbitScale = 1.0,
  rotateSpeed = 0.4,
  colorBase = [0.0, 0.95, 1.0],
  camDist = 80,
  camPhi = 1.2,
  className = "",
  children
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References for live rendering loops (Lerping values dynamically for cinematic inertia)
  const renderValsRef = useRef({
    morph,
    compress,
    intensity,
    orbitScale,
    rotateSpeed,
    colorBase,
    camDist,
    camPhi
  });

  // Keep target uniforms synced to states for rendering frame sweeps
  useEffect(() => {
    renderValsRef.current = {
      morph,
      compress,
      intensity,
      orbitScale,
      rotateSpeed,
      colorBase,
      camDist,
      camPhi
    };
  }, [morph, compress, intensity, orbitScale, rotateSpeed, colorBase, camDist, camPhi]);

  // Setup Three.js Pipeline inside Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Create scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, rect.width / rect.height, 0.1, 1000);

    // Initial camera position spherical metrics
    const spherical = {
      radius: camDist,
      theta: 0.6, // horizontal angle
      phi: camPhi    // vertical angle
    };

    // Interpolated running metrics for smooth animations
    const currentPhysics = {
      morph: morph,
      compress: compress,
      intensity: intensity,
      orbitScale: orbitScale,
      rotateSpeed: rotateSpeed,
      colorBase: [...colorBase] as [number, number, number],
      radius: camDist,
      phi: camPhi
    };

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      powerPreference: "high-performance",
      alpha: false
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    // Schwarzschild Central Event Horizon Sphere
    const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bhGeo = new THREE.SphereGeometry(4.0, 64, 64);
    const eventHorizon = new THREE.Mesh(bhGeo, bhMat);
    scene.add(eventHorizon);

    // Gravitational Aura / Lensing Glow shader mesh
    const auraMat = new THREE.ShaderMaterial({
      uniforms: { 
        uTime: { value: 0 }, 
        uIntensity: { value: 1.0 },
        uColorBase: { value: new THREE.Color(colorBase[0], colorBase[1], colorBase[2]) }
      },
      vertexShader: \\\`
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vView = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      \\\`,
      fragmentShader: \\\`
        uniform float uIntensity;
        uniform vec3 uColorBase;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 4.0);
          gl_FragColor = vec4(uColorBase * rim * uIntensity * 5.0, 1.0);
        }
      \\\`,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const auraMesh = new THREE.Mesh(new THREE.SphereGeometry(4.25, 64, 64), auraMat);
    scene.add(auraMesh);

    // Dynamic Accretion Disk Instanced Streamers
    const instanceCount = 5000;
    const streakGeo = new THREE.CylinderGeometry(0.01, 0.12, 2.2, 3);
    streakGeo.rotateX(Math.PI / 2);

    const diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0.1 },
        uCompression: { value: 1.0 },
        uIntensity: { value: 1.0 },
        uOrbitScale: { value: 1.0 },
        uColorBase: { value: new THREE.Color(colorBase[0], colorBase[1], colorBase[2]) }
      },
      vertexShader: \\\`
        \\\${NOISE_CHUNK}
        uniform float uTime;
        uniform float uMorph;
        uniform float uCompression;
        uniform float uIntensity;
        uniform float uOrbitScale;
        uniform vec3 uColorBase;
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float rOriginal = length(instPos.xz);
          float r = rOriginal * uCompression;
          float initialAngle = atan(instPos.z, instPos.x);
          float orbitalVelocity = (1.5 / sqrt(rOriginal)) * uOrbitScale;
          float currentAngle = initialAngle + (uTime * orbitalVelocity);
          
          vec3 morphedWorldPos = vec3(cos(currentAngle) * r, instPos.y, sin(currentAngle) * r);
          float noise = snoise(vec3(morphedWorldPos.x * 0.08, morphedWorldPos.z * 0.08, uTime * 0.3));
          morphedWorldPos.y += noise * uMorph * 4.0;
          
          vec3 viewDir = normalize(cameraPosition - morphedWorldPos);
          vec3 orbitDir = normalize(vec3(-sin(currentAngle), 0.0, cos(currentAngle)));
          float doppler = dot(orbitDir, viewDir);
          
          vec3 hot = vec3(1.0, 0.95, 0.9);
          vec3 warm = vec3(1.0, 0.45, 0.1);
          vec3 cool = vec3(0.1, 0.35, 1.0);
          
          // Warp color dynamically with gravity distance
          vec3 color = mix(cool, warm, smoothstep(45.0, 12.0, r));
          color = mix(color, hot, smoothstep(10.0, 4.0, r));
          
          // Blend customized lensing accent tint
          vColor = color * uColorBase * (1.3 + doppler * 0.7) * uIntensity;
          vOpacity = (smoothstep(3.8, 5.5, r) * (1.0 - smoothstep(38.0, 48.0, r))) * 0.8;
          
          float deltaAngle = currentAngle - initialAngle;
          float c = cos(deltaAngle);
          float s = sin(deltaAngle);
          mat3 rotY = mat3(
             c, 0, s,
             0, 1, 0,
            -s, 0, c
          );
          
          vec3 localPos = (instanceMatrix * vec4(position, 0.0)).xyz;
          vec3 rotatedLocalPos = rotY * localPos;
          gl_Position = projectionMatrix * viewMatrix * vec4(morphedWorldPos + rotatedLocalPos, 1.0);
        }
      \\\`,
      fragmentShader: \\\`
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          gl_FragColor = vec4(vColor, vOpacity);
        }
      \\\`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const instancedDisk = new THREE.InstancedMesh(streakGeo, diskMaterial, instanceCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < instanceCount; i++) {
      const r = 5.0 + Math.pow(Math.random(), 1.3) * 40.0;
      const angle = Math.random() * Math.PI * 2;
      dummy.position.set(
        Math.cos(angle) * r, 
        (Math.random() - 0.5) * (8.0 / r), 
        Math.sin(angle) * r
      );
      dummy.lookAt(
        dummy.position.x + Math.sin(angle), 
        dummy.position.y, 
        dummy.position.z - Math.cos(angle)
      );
      dummy.updateMatrix();
      instancedDisk.setMatrixAt(i, dummy.matrix);
    }
    scene.add(instancedDisk);

    // Responsive container resize update handler using ResizeObserver
    const resizeHandler = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeHandler();
    });
    resizeObserver.observe(containerRef.current);

    // Interactive Drag Spherical Orbit logic inside the background component
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      
      spherical.theta -= deltaX * 0.005;
      // Clamp vertical inclination so camera never flips upside down
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - deltaY * 0.005));
      
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    // Wheel zooming capability
    const handleWheel = (e: WheelEvent) => {
      spherical.radius = Math.max(25, Math.min(180, spherical.radius + e.deltaY * 0.08));
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    
    // Add touch listeners for responsive mobile usage
    canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    canvas.addEventListener('wheel', handleWheel, { passive: true });

    // Render loop helper (lerping variables dynamically for organic transitions)
    const clock = new THREE.Clock();
    
    const animate = () => {
      const time = clock.getElapsedTime();
      const current = renderValsRef.current;

      // Smooth state interpolation (lerping)
      const lerpFactor = 0.04;
      currentPhysics.morph += (current.morph - currentPhysics.morph) * lerpFactor;
      currentPhysics.compress += (current.compress - currentPhysics.compress) * lerpFactor;
      currentPhysics.intensity += (current.intensity - currentPhysics.intensity) * lerpFactor;
      currentPhysics.orbitScale += (current.orbitScale - currentPhysics.orbitScale) * lerpFactor;
      currentPhysics.rotateSpeed += (current.rotateSpeed - currentPhysics.rotateSpeed) * lerpFactor;
      
      currentPhysics.colorBase[0] += (current.colorBase[0] - currentPhysics.colorBase[0]) * lerpFactor;
      currentPhysics.colorBase[1] += (current.colorBase[1] - currentPhysics.colorBase[1]) * lerpFactor;
      currentPhysics.colorBase[2] += (current.colorBase[2] - currentPhysics.colorBase[2]) * lerpFactor;

      spherical.radius += (current.camDist - spherical.radius) * lerpFactor;
      spherical.phi += (current.camPhi - spherical.phi) * lerpFactor;

      // Auto rotation over time when not actively interacting
      if (!isDragging) {
        spherical.theta += currentPhysics.rotateSpeed * 0.004;
      }

      // Convert spherical polar coordinates to cartesian coordinates
      const x = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      const y = spherical.radius * Math.cos(spherical.phi);
      const z = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);

      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);

      // Inject uniforms directly
      diskMaterial.uniforms.uTime.value = time;
      diskMaterial.uniforms.uMorph.value = currentPhysics.morph;
      diskMaterial.uniforms.uCompression.value = currentPhysics.compress;
      diskMaterial.uniforms.uIntensity.value = currentPhysics.intensity;
      diskMaterial.uniforms.uOrbitScale.value = currentPhysics.orbitScale;
      diskMaterial.uniforms.uColorBase.value.setRGB(
        currentPhysics.colorBase[0], 
        currentPhysics.colorBase[1], 
        currentPhysics.colorBase[2]
      );

      auraMat.uniforms.uTime.value = time;
      auraMat.uniforms.uIntensity.value = currentPhysics.intensity;
      auraMat.uniforms.uColorBase.value.setRGB(
        currentPhysics.colorBase[0], 
        currentPhysics.colorBase[1], 
        currentPhysics.colorBase[2]
      );

      // Gentle internal structural spin
      instancedDisk.rotation.y += 0.0004;

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    const requestRef = { current: requestAnimationFrame(animate) };

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      canvas.removeEventListener('wheel', handleWheel);
      
      cancelAnimationFrame(requestRef.current);
      renderer.dispose();
      bhGeo.dispose();
      bhMat.dispose();
      streakGeo.dispose();
      diskMaterial.dispose();
      auraMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={\`relative overflow-hidden bg-[#010103] select-none \\\${className}\`}
    >
      {/* 3D Singularity Render Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing block z-0"
      />

      {/* Futuristic Grid & Ambient Space-dust Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_transparent_35%,_#000000_150%)] z-[1]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] z-[2]" />

      {/* Content Container */}
      <div className="relative w-full h-full z-10">
        \\\${children}
      </div>
    </div>
  );
};

export default Singularity;`;
