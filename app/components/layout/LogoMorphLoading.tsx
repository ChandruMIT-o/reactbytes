"use client";

import { useEffect, useRef, useState } from 'react';
import { createTimeline, Timeline } from 'animejs';
import RevealUnder from '../../meta/text/TextEnter/RevealUnder';

// Target SVG paths of the brand logo parts
const LOGO_TOP_PATH = "M19 0C19 2.49497 18.5084 4.96544 17.5537 7.27051C16.5989 9.57569 15.1989 11.6703 13.4346 13.4346C11.6703 15.1989 9.57569 16.5989 7.27051 17.5537C4.96544 18.5084 2.49497 19 0 19V6.91504C0.325311 6.96963 0.659174 7 1 7C4.31371 7 7 4.31371 7 1C7 0.659174 6.96963 0.325311 6.91504 0H19Z";
const LOGO_BOTTOM_PATH = "M19 30C19 28.5555 18.7155 27.1251 18.1627 25.7905C17.6099 24.4559 16.7996 23.2433 15.7782 22.2218C14.7567 21.2004 13.5441 20.3901 12.2095 19.8373C10.8749 19.2845 9.44454 19 8 19L8 30H19Z";

interface Point {
  x: number;
  y: number;
}

// Returns a standard SVG circle path string
function getCirclePath(cx: number, cy: number, r: number): string {
  if (r <= 0) return "";
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
}

// Samples points safely (Client-side only)
function samplePathPoints(pathData: string, numPoints: number = 120): Point[] {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  const path = document.createElementNS(svgNS, "path");

  svg.style.position = "absolute";
  svg.style.width = "0";
  svg.style.height = "0";
  path.setAttribute("d", pathData);
  svg.appendChild(path);
  document.body.appendChild(svg);

  const points: Point[] = [];
  try {
    const length = path.getTotalLength();
    for (let i = 0; i < numPoints; i++) {
      const pt = path.getPointAtLength((i / numPoints) * length);
      points.push({ x: pt.x, y: pt.y });
    }
  } catch (e) {
    for (let i = 0; i < numPoints; i++) points.push({ x: 9.5, y: 15 });
  } finally {
    document.body.removeChild(svg);
  }
  return points;
}

export interface LogoMorphLoadingProps {
  onComplete: () => void;
}

export default function LogoMorphLoading({ onComplete }: LogoMorphLoadingProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // DOM Refs
  const bigPathRef = useRef<SVGPathElement>(null);
  const smallPathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Animation instance refs for cleanup
  const timelineRef = useRef<Timeline | null>(null);

  // The mathematical source of truth for the vectors
  const pointsRef = useRef({
    bigStart: [] as Point[],
    bigEnd: [] as Point[],
    smallStart: [] as Point[],
    smallEnd: [] as Point[],
  });

  // The proxy object Anime.js will animate
  const animStateRef = useRef({ bigScale: 0, smallY: -20, roll: 0, morph: 0 });

  useEffect(() => {
    // Flag that component has safely loaded on the client browser
    setIsMounted(true);

    // 1. Sample all points securely on mount
    pointsRef.current = {
      bigStart: samplePathPoints(getCirclePath(9.5, 15, 6)),
      smallStart: samplePathPoints(getCirclePath(9.5, 24.5, 3.5)),
      bigEnd: samplePathPoints(LOGO_TOP_PATH),
      smallEnd: samplePathPoints(LOGO_BOTTOM_PATH),
    };

    setIsReady(true);

    // 2. The High-Performance Render Loop (Vertex Math)
    const renderFrame = () => {
      const state = animStateRef.current;
      const pts = pointsRef.current;
      if (!pts.bigStart.length) return;

      // Pipeline for Top Path (Big Circle)
      const bigPts = pts.bigStart.map((pt, i) => {
        let x = 9.5 + (pt.x - 9.5) * state.bigScale;
        let y = 15 + (pt.y - 15) * state.bigScale;

        x += (pts.bigEnd[i].x - x) * state.morph;
        y += (pts.bigEnd[i].y - y) * state.morph;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(3)} ${y.toFixed(3)}`;
      });
      if (bigPathRef.current) bigPathRef.current.setAttribute('d', bigPts.join(' ') + ' Z');

      // Pipeline for Bottom Path (Small Circle)
      let cx = 9.5;
      let cy = state.smallY;

      // Calculate roll trajectory
      if (state.roll > 0) {
        const angle = -Math.PI / 2 + Math.PI * state.roll;
        cx = 9.5 + 9.5 * Math.cos(angle);
        cy = 15 + 9.5 * Math.sin(angle);
      }

      const smallPts = pts.smallStart.map((pt, i) => {
        let x = cx + (pt.x - 9.5);
        let y = cy + (pt.y - 24.5);

        x += (pts.smallEnd[i].x - x) * state.morph;
        y += (pts.smallEnd[i].y - y) * state.morph;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(3)} ${y.toFixed(3)}`;
      });
      if (smallPathRef.current) smallPathRef.current.setAttribute('d', smallPts.join(' ') + ' Z');
    };

    // 3. Build the Anime.js Timeline
    const buildTimeline = () => {
      const tl = createTimeline({
        autoplay: true,
        onComplete: () => {
          // Fade out the overlay and finish loading
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 700); // Matches transition duration
          }, 400);
        }
      });

      timelineRef.current = tl;

      tl.add(animStateRef.current, {
        bigScale: 1,
        duration: 1200,
        ease: 'outElastic(1, 0.6)', // Snappy pop-in
        onUpdate: renderFrame
      })
        .add(animStateRef.current, {
          smallY: 5.5,
          duration: 1100,
          ease: 'outBounce', // Physical gravity bounce on impact
          onUpdate: renderFrame
        }, '-=1000')
        .add(animStateRef.current, {
          roll: 1,
          duration: 1000,
          ease: 'inOutQuart', // Butter-smooth sweep
          onUpdate: renderFrame
        }, '-=150')
        .add(animStateRef.current, {
          morph: 1,
          duration: 1400,
          ease: 'outElastic(1, 0.75)', // The liquid overshoot snap
          onUpdate: renderFrame
        }, '-=100');
    };

    // Slight delay guarantees React has mounted the SVG paths before anime hooks them
    const timer = setTimeout(buildTimeline, 50);

    return () => {
      clearTimeout(timer);
      if (timelineRef.current) timelineRef.current.pause();
    };
  }, [onComplete]);

  // Critical fix: Returns nothing on Server-side render pass to keep DOM clean.
  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-[#060010] select-none overflow-hidden z-[9999] transition-all duration-700 ease-in-out ${isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'
        }`}
    >
      <div className="relative flex flex-col items-center justify-center w-70 h-70">
        {/* SVG Container: Fade in once points are sampled */}
        <svg
          ref={svgRef}
          viewBox="0 0 19 30"
          className={`w-24 h-auto relative z-10 overflow-visible transition-opacity duration-700 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <path ref={bigPathRef} fill="#F2EEE9" />
          <path ref={smallPathRef} fill="#D4C9E8" />
        </svg>
      </div>

      <div className="absolute bottom-50 w-full flex items-center justify-center pointer-events-none">
        <RevealUnder
          firstWord="React"
          secondWord="Bytes"
          uppercase={true}
          textClassName="font-sans font-bold text-4xl tracking-[0.2em] translate-x-[0.1em]"
          color="#f1f5f9"
          delay={2.2}
          duration={1.2}
        />
      </div>
    </div>
  );
}