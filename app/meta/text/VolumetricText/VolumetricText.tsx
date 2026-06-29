"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// --- SHADERS ---

const VERTEX_SHADER = `
  void main() {
      gl_Position = vec4( position, 1.0 );
  }
`;

const getFragmentShader = (samples: number, octaves: number) => `
  uniform vec2 u_resolution;
  uniform float u_pxaspect;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform sampler2D u_noise;
  uniform sampler2D u_text500;
  uniform bool u_mousemoved;
  
  uniform bool u_addNoise;
  uniform float u_decay;
  uniform float u_exposure;
  uniform float u_lightStrength;
  uniform vec3 u_lightcolour;
  uniform vec3 u_falloffcolour;
  uniform vec3 u_bgcolour;
  uniform float u_falloff;
  uniform float u_density;
  uniform float u_weight;
  uniform float u_shapeScale;
  uniform bool u_invertShape;

  #define PI 3.141592653589793
  #define TAU 6.283185307179586

  const float seed = 43758.5453123;
  
  float starSDF(vec2 st, int V, float s) {
      float a = atan(st.y, st.x)/TAU;
      float seg = a * float(V);
      a = ((floor(seg) + 0.5)/float(V) + mix(s,-s,step(.5,fract(seg)))) * TAU;
      return abs(dot(vec2(cos(a),sin(a)), st));
  }
  
  float random2d(vec2 uv) {
    uv /= 256.;
    vec4 tex = texture2D(u_noise, uv);
    return mix(tex.x, tex.y, tex.a);
  }
  
  vec2 random2(vec2 st, float seed){
      st = vec2( dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)) );
      return -1.0 + 2.0*fract(sin(st)*seed);
  }
  
  float noise(vec2 st, float seed) {
    vec3 x = vec3(st, 1.);
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
    vec2 rg = texture2D(u_noise, (uv+0.5) / 256., 0.).yx - .5;
    return mix( rg.x, rg.y, f.z );
  }
  
  float fbm1(in vec2 _st, float seed) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < ${octaves}; ++i) {
        v += a * noise(_st, seed);
        _st = rot * _st * 2.0 + shift;
        a *= 0.4;
    }
    return v + .4;
  }
  
  float pattern(vec2 uv, float seed, float time, inout vec2 q, inout vec2 r) {
    q = vec2( fbm1( uv + vec2(0.0,0.0), seed ),
                   fbm1( uv + vec2(5.2,1.3), seed ) );
    r = vec2( fbm1( uv + 4.0*q + vec2(1.7 - time / 2.,9.2), seed ),
                   fbm1( uv + 4.0*q + vec2(8.3 - time / 2.,2.8), seed ) );
    return fbm1( uv + 4.0*r, seed );
  }
  
  float tri(vec2 uv) {
    uv = (uv * 2.-1.)*2.;
    return max(abs(uv.x) * 0.866025 + uv.y * 0.5, -uv.y * 0.5);
  }
  
  float smin(float a, float b, float k) {
      float res = exp(-k*a) + exp(-k*b);
      return -log(res)/k;
  }

  float shapes(vec2 uv) {
    uv += u_mouse * .1;
    float aspect = u_resolution.x / u_resolution.y;
    float scale = 1. / aspect * u_shapeScale;
    vec2 st = (uv) * scale + .5;
    
    // Check bounds so it stops repeating past the edges
    float val = 0.0;
    if(st.x >= 0.0 && st.x <= 1.0 && st.y >= 0.0 && st.y <= 1.0) {
      val = texture2D(u_text500, st, -1.).x;
    }
    
    return u_invertShape ? 1.0 - val : val;
  }
  
  float occlusion(vec2 uv, vec2 lightpos, float objects) {
    return (1. - smoothstep(0.0, u_lightStrength, length(lightpos - uv))) * (1. - objects);
  }
  
  vec4 mainRender(vec2 uv, inout vec4 fragcolour) {
    float scale = 4.;
    uv *= scale;
    
    float currentExposure = u_exposure + (sin(u_time) * .5 + 1.) * .05;

    vec2 _uv = uv;
    vec2 lightpos = u_mouse * scale;
    
    float obj = shapes(uv);
    float map = occlusion(uv, lightpos, obj);

    float _pattern = 0.;
    vec2 q = vec2(0.);
    vec2 r = vec2(0.);
    if(u_addNoise) {
      _pattern = pattern(_uv * 3. , seed, u_time, q, r) / 2.;
    }

    vec2 dtc = (_uv - lightpos) * (1. / float(${samples}) * u_density);
    float illumination_decay = 1.;
    vec3 basecolour = u_bgcolour;

    for(int i=0; i<${samples}; i++) {
      _uv -= dtc;
      if(u_addNoise) {
        uv += _pattern / 16.;
      }
      
      float movement = u_time * 20. * float(i + 1);
      float dither = random2d(uv * 512. + mod(vec2(movement*sin(u_time * .5), -movement), 1000.)) * 2.;

      float stepped_map = occlusion(uv, lightpos, shapes(_uv+dtc*dither));
      stepped_map *= illumination_decay * u_weight;
      illumination_decay *= u_decay;

      map += stepped_map;
    }

    float l = length(lightpos - uv);
    vec3 currentLightColour = mix(u_lightcolour, u_falloffcolour, l*u_falloff);
    vec3 colour = vec3(basecolour + map * currentExposure * currentLightColour);
    
    fragcolour = vec4(colour, 1.0);
    return fragcolour;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    mainRender(uv, gl_FragColor);
  }
`;

// --- TEXTURE CREATION HELPER ---

const createContentTexture = async (content: string, size: number): Promise<THREE.Texture> => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1024, 1024);

  const text = content.trim();

  // If the string is an SVG, draw it using an Image Blob
  if (text.startsWith("<svg") && text.endsWith("</svg>")) {
    return new Promise((resolve) => {
      const img = new Image();
      let svgStr = text;
      if (!svgStr.includes("xmlns=")) {
        svgStr = svgStr.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        const scaleFactor = size / 500;
        const maxDim = Math.max(img.width, img.height);
        const fitScale = maxDim > 0 ? (1024 / maxDim) * scaleFactor : 1;

        const w = img.width * fitScale;
        const h = img.height * fitScale;
        ctx.drawImage(img, 512 - w / 2, 512 - h / 2, w, h);
        URL.revokeObjectURL(url);

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearFilter;
        resolve(tex);
      };
      img.onerror = () => {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 100px sans-serif";
        ctx.fillText("SVG Error", 512, 512);
        resolve(new THREE.CanvasTexture(canvas));
      };
      img.src = url;
    });
  }

  // Fallback: draw as standard text
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Start with the requested font size
  let fontSize = size;
  ctx.font = "bold " + fontSize + "px system-ui, sans-serif";
  let textWidth = ctx.measureText(text).width;

  // If the text exceeds the maximum safe width, scale font size down to fit and prevent clipping
  const maxWidth = 900;
  if (textWidth > maxWidth) {
    fontSize = Math.floor(fontSize * (maxWidth / textWidth));
    ctx.font = "bold " + fontSize + "px system-ui, sans-serif";
  }

  ctx.fillText(text, 512, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearFilter;
  return tex;
};

// --- REACT COMPONENT ---

export interface VolumetricTextProps {
  /** The text content or SVG string to render */
  text?: string;
  /** Size of the text in the canvas texture (e.g. 300) */
  textSize?: number;
  /** Scale of the shape on screen (e.g. 0.3) */
  shapeScale?: number;
  /** Whether to invert the shape mask (default: true) */
  invertShape?: boolean;
  /** Whether to add noise to the volumetric rays (default: true) */
  addNoise?: boolean;
  /** Decay factor of the rays (default: 0.96) */
  decay?: number;
  /** Exposure intensity of the rays (default: 0.35) */
  exposure?: number;
  /** Strength of the light source (default: 3.5) */
  lightStrength?: number;
  /** Hex color for the light (default: '#ffff66') */
  lightColor?: string;
  /** Hex color for the falloff (default: '#00ccff') */
  falloffColor?: string;
  /** Hex color for the background (default: '#004040') */
  bgColor?: string;
  /** Falloff rate (default: 0.5) */
  falloff?: number;
  /** Density of sample steps (default: 0.98) */
  density?: number;
  /** Weight factor for sample steps (default: 0.25) */
  weight?: number;
  /** Number of sample steps (default: 12) */
  samples?: number;
  /** Octaves of the FBM noise (default: 1) */
  octaves?: number;
  /** Additional CSS class name for container */
  className?: string;
}

export const VolumetricText: React.FC<VolumetricTextProps> = ({
  text = "All hail Rameez",
  textSize = 300,
  shapeScale = 0.3,
  invertShape = true,
  addNoise = true,
  decay = 0.96,
  exposure = 0.35,
  lightStrength = 3.5,
  lightColor = "#ffff66",
  falloffColor = "#00ccff",
  bgColor = "#004040",
  falloff = 0.5,
  density = 0.98,
  weight = 0.25,
  samples = 12,
  octaves = 1,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Use refs to feed data cleanly into the animation loop without stale closures
  const propsRef = useRef({
    addNoise,
    decay,
    exposure,
    lightStrength,
    lightColor,
    falloffColor,
    bgColor,
    falloff,
    density,
    weight,
    shapeScale,
    invertShape,
  });

  // Sync React state to Mutable Ref for the Animation Loop
  useEffect(() => {
    propsRef.current = {
      addNoise,
      decay,
      exposure,
      lightStrength,
      lightColor,
      falloffColor,
      bgColor,
      falloff,
      density,
      weight,
      shapeScale,
      invertShape,
    };
  }, [
    addNoise,
    decay,
    exposure,
    lightStrength,
    lightColor,
    falloffColor,
    bgColor,
    falloff,
    density,
    weight,
    shapeScale,
    invertShape,
  ]);

  const uniformsRef = useRef({
    u_time: { value: 1.0 },
    u_resolution: { value: new THREE.Vector2() },
    u_pxaspect: { value: 1.0 },
    u_noise: { value: null as THREE.Texture | null },
    u_text500: { value: null as THREE.Texture | null },
    u_mouse: { value: new THREE.Vector2(-0.1, -0.1) },
    u_mousemoved: { value: false },
    u_addNoise: { value: addNoise },
    u_decay: { value: decay },
    u_exposure: { value: exposure },
    u_lightStrength: { value: lightStrength },
    u_lightcolour: { value: new THREE.Color(lightColor) },
    u_falloffcolour: { value: new THREE.Color(falloffColor) },
    u_bgcolour: { value: new THREE.Color(bgColor) },
    u_falloff: { value: falloff },
    u_density: { value: density },
    u_weight: { value: weight },
    u_shapeScale: { value: shapeScale },
    u_invertShape: { value: invertShape },
  });

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Main Scene Bootstrapping
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // Dummy texture to prevent WebGL warnings before text/SVG generates
    const dummyCanvas = document.createElement("canvas");
    dummyCanvas.width = 1;
    dummyCanvas.height = 1;
    uniformsRef.current.u_text500.value = new THREE.CanvasTexture(dummyCanvas);

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth || 1, container.clientHeight || 1);
    container.appendChild(renderer.domElement);

    // MESH
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: uniformsRef.current,
      vertexShader: VERTEX_SHADER,
      fragmentShader: getFragmentShader(samples, octaves),
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // TEXTURE LOADING
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    let noiseTexture: THREE.Texture | null = null;
    loader.load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png", (noiseTex) => {
      noiseTex.wrapS = THREE.RepeatWrapping;
      noiseTex.wrapT = THREE.RepeatWrapping;
      noiseTex.minFilter = THREE.LinearFilter;
      uniformsRef.current.u_noise.value = noiseTex;
      noiseTexture = noiseTex;
    });

    // EVENT LISTENERS
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height);
      uniformsRef.current.u_resolution.value.set(width, height);
      uniformsRef.current.u_pxaspect.value = window.devicePixelRatio || 1;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const ratio = rect.height / rect.width;
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width / ratio;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height * -1;

      uniformsRef.current.u_mouse.value.set(x, y);
      uniformsRef.current.u_mousemoved.value = true;
    };
    container.addEventListener("pointermove", handlePointerMove);

    // ANIMATION LOOP
    let animationFrameId: number;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);

      // Dynamic Resizing Check
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      const res = uniformsRef.current.u_resolution.value;
      if (width !== res.x || height !== res.y) {
        renderer.setSize(width, height);
        res.set(width, height);
        uniformsRef.current.u_pxaspect.value = window.devicePixelRatio || 1;
      }

      const currentProps = propsRef.current;
      const uniforms = uniformsRef.current;

      uniforms.u_time.value = time * 0.0005;
      uniforms.u_addNoise.value = currentProps.addNoise;
      uniforms.u_decay.value = currentProps.decay;
      uniforms.u_exposure.value = currentProps.exposure;
      uniforms.u_lightStrength.value = currentProps.lightStrength;
      uniforms.u_lightcolour.value.set(currentProps.lightColor);
      uniforms.u_falloffcolour.value.set(currentProps.falloffColor);
      uniforms.u_bgcolour.value.set(currentProps.bgColor);
      uniforms.u_falloff.value = currentProps.falloff;
      uniforms.u_density.value = currentProps.density;
      uniforms.u_weight.value = currentProps.weight;
      uniforms.u_shapeScale.value = currentProps.shapeScale;
      uniforms.u_invertShape.value = currentProps.invertShape;

      renderer.render(scene, camera);
    };
    renderLoop(lastTime);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", handlePointerMove);
      renderer.dispose();
      geometry.dispose();
      if (materialRef.current) materialRef.current.dispose();
      if (uniformsRef.current.u_text500.value) uniformsRef.current.u_text500.value.dispose();
      if (noiseTexture) noiseTexture.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  // Handle Content changes (Text or SVG)
  useEffect(() => {
    let active = true;
    createContentTexture(text, textSize).then((tex) => {
      if (!active) {
        tex.dispose();
        return;
      }
      const oldTex = uniformsRef.current.u_text500.value;
      uniformsRef.current.u_text500.value = tex;
      if (oldTex) oldTex.dispose();
    });

    return () => {
      active = false;
    };
  }, [text, textSize]);

  // Handle Shader Material Recompilation (only needed when constants change)
  useEffect(() => {
    if (!materialRef.current || !meshRef.current) return;

    const newMaterial = new THREE.ShaderMaterial({
      uniforms: uniformsRef.current,
      vertexShader: VERTEX_SHADER,
      fragmentShader: getFragmentShader(samples, octaves),
    });

    meshRef.current.material = newMaterial;
    materialRef.current.dispose();
    materialRef.current = newMaterial;
  }, [samples, octaves]);

  return (
    <div
      ref={mountRef}
      className={`relative touch-none ${className}`}
    />
  );
};

export default VolumetricText;
