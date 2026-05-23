import React, { useEffect, useRef } from 'react';

// The data for the nested ellipses that form the spacetime cone.
// We extract these from the reference to animate them programmatically.
const ELLIPSES_DATA = [
    { cx: 686, cy: 319, rx: 959, ry: 713 },
    { cx: 686, cy: 308, rx: 880, ry: 670 },
    { cx: 686, cy: 296, rx: 812, ry: 629 },
    { cx: 686, cy: 284, rx: 751, ry: 584 },
    { cx: 686, cy: 269, rx: 692, ry: 540 },
    { cx: 686, cy: 256, rx: 632, ry: 499 },
    { cx: 686, cy: 257, rx: 574, ry: 455 },
    { cx: 686, cy: 256, rx: 520, ry: 412 },
    { cx: 686, cy: 264, rx: 470, ry: 369 },
    { cx: 686, cy: 277, rx: 418, ry: 331 },
    { cx: 686, cy: 294, rx: 365, ry: 292 },
    { cx: 686, cy: 318, rx: 318, ry: 253 },
    { cx: 686, cy: 345, rx: 272, ry: 223 },
    { cx: 686, cy: 377, rx: 234, ry: 190 },
    { cx: 686, cy: 403, rx: 195, ry: 164 },
    // Masked inner ellipses
    { cx: 686, cy: 428, rx: 165, ry: 135 },
    { cx: 686, cy: 464, rx: 141, ry: 114 },
    { cx: 686, cy: 493, rx: 114, ry: 93 },
    { cx: 686, cy: 527, rx: 96, ry: 78 },
    { cx: 686, cy: 554, rx: 80, ry: 63 },
    { cx: 686, cy: 571, rx: 58, ry: 40 },
    { cx: 686, cy: 588, rx: 35, ry: 24 }
];

// Complex path data defining the radial lines of the spacetime web
const PATH_DATA = "M629.32,789.5c0,0,17.38-212,34.28-227 M628.32,555.5c-28.18,7-91.82,204-95.82,237 M610.5,548.42 c-54-6.92-146.94,133.08-184.47,241.08 M599.66,542c-85.67-22.15-175.65,49.82-283.19,250.5 M599.91,542.39 C452.5,477.5,359.5,581.5,187.1,789.5 M594.23,539.62C394.5,430.5,264.5,567.5,39.25,792.5 M595.5,539.5c-211-165-461,30-585.95,132  M600.07,542.57C429.5,393.5,235.5,422.5,9.55,553.5 M601.91,543.19C418.5,357.5,220.5,371.5,9.55,455.51 M588.18,529.69 C448.5,366.5,233.5,307.5,9.5,369.5 M596.23,537.69C461.5,343.5,218.5,253.5,9.55,297.46 M607.66,546.69 C529.5,409.5,323.5,213.5,9.5,223.5 M610.5,547.5c-62-131-258-369-601-397 M611.5,549.5c-62-178-311-434-602-468.23 M618.44,552.5 c-62.06-167-250.94-465-599.94-545 M626.38,555.5c-57.88-189-209.88-424-425.42-548 M632.92,557.5c-20.42-93-120.42-360-331.53-550  M640.86,558.5c-27.36-163-159.36-424-266.31-551 M647.46,560.5c-12.96-82-55.96-291-211.53-553 M655.06,561.5 c-25.56-174-74.56-372-163.03-554 M661,562.5c-15.5-180-65.5-389-114.85-555 M671.54,563.5c0,0-30.04-367-77.3-556 M679.8,563.5 l-37.94-556 M731.98,789.5c0,0-13.38-213-30.28-228 M833.8,792.5c-4-33-51.3-224-99.82-236 M942.27,791.5 c-37.53-108-120.77-253-182.47-242.08 M1067.84,792.5C949.5,594.5,863.5,514.5,771.64,542 M1200.2,789.5 c-173.7-220-281.4-312-428.81-247.11 M1362.05,792.5c-225.25-225-385.25-362-584.99-252.88 M1401.75,681.5 c-163.25-143-419.95-303-621.95-145 M1403.75,562.5c-258.25-159-461.95-169-632.53-19.93 M1401.75,465.51 C1178.5,363.5,952.8,357.5,769.39,543.19 M1401.8,379.5c-255.3-86-478.36-18.62-618.68,150.19 M1400.75,299.46 C1165.5,242.5,909.8,344.5,778.07,532.69 M1401.8,223.5c-340.3-25-560,186-638.16,323.19 M1400.5,147.5 c-363,14-577.69,269-639.7,400 M1401.5,73.5c-319,25-584.7,297-640.7,476 M1352.8,7.5c-349,80-537.87,379-599.94,546 M1170.34,7.5 c-215.54,124-365.54,358-423.42,547 M1069.91,7.5c-211.11,190-309.11,455-329.53,548 M996.75,7.5c-106.95,127-234.95,386-262.31,549  M935.37,7.5c-155.57,262-206.49,492-209.53,551 M879.27,7.5c-88.47,182-137.47,379-163.03,553 M825.15,7.5 c-49.35,166-99.35,374-114.85,554 M777.07,7.5c-47.27,189-74.3,554-74.3,554 M729.44,7.5l-35.94,555 M685.44,7.5l1,554.89";

export interface SpaceTimeProps {
    /** Speed of the infinite loop in milliseconds */
    loopDuration?: number;
    /** Stroke color of the spacetime web */
    strokeColor?: string;
    /** Background color of the container */
    bgColor?: string;
    /** Thickness of the grid lines in pixels */
    strokeWidth?: number;
    /** Parallax intensity of 3D hover effect */
    parallaxAmount?: number;
    /** Intensity of the time-reverse click warp effect */
    warpStrength?: number;
    /** Scale of the wobble filter distortion */
    distortionScale?: number;
    /** Glow intensity (0 to 1) */
    glowIntensity?: number;
    /** Whether the cyberpunk noise filter overlay is enabled */
    noiseEnabled?: boolean;
    /** Additional CSS classes for the root container */
    className?: string;
    /** Optional children to overlay on top of the background */
    children?: React.ReactNode;
}

export const SpaceTime: React.FC<SpaceTimeProps> = ({
    loopDuration = 1200,
    strokeColor = '#00e5ff',
    bgColor = '#020205',
    strokeWidth = 4,
    parallaxAmount = 0.04,
    warpStrength = -8,
    distortionScale = 7,
    glowIntensity = 0.4,
    noiseEnabled = true,
    className = "",
    children,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ellipseRefs = useRef<(SVGEllipseElement | null)[]>([]);
    const turbulenceRef1 = useRef<SVGFETurbulenceElement>(null);
    const turbulenceRef2 = useRef<SVGFETurbulenceElement>(null);
    const mainGroupRef = useRef<SVGGElement>(null);

    // Keep dynamic properties in a ref for the continuous animation tick
    const propsRef = useRef({
        loopDuration,
        strokeColor,
        bgColor,
        strokeWidth,
        parallaxAmount,
        warpStrength,
        distortionScale,
        glowIntensity,
        noiseEnabled,
    });

    useEffect(() => {
        propsRef.current = {
            loopDuration,
            strokeColor,
            bgColor,
            strokeWidth,
            parallaxAmount,
            warpStrength,
            distortionScale,
            glowIntensity,
            noiseEnabled,
        };
    }, [
        loopDuration,
        strokeColor,
        bgColor,
        strokeWidth,
        parallaxAmount,
        warpStrength,
        distortionScale,
        glowIntensity,
        noiseEnabled,
    ]);

    // Animation state variables
    const animationVars = useRef({
        elapsedTime: 0,
        lastTime: Date.now(),
        speedOffset: 0,
        lastTurbulenceUpdate: 0,
        targetMouseX: 0,
        targetMouseY: 0,
        currentMouseX: 0,
        currentMouseY: 0,
    });

    useEffect(() => {
        let reqId: number;

        const tick = () => {
            const now = Date.now();
            const vars = animationVars.current;
            const currentProps = propsRef.current;
            const deltaTime = now - vars.lastTime;
            vars.lastTime = now;

            // 1. Calculate time progression with dynamic speed (for click effect)
            vars.speedOffset *= 0.92;
            const currentSpeed = 1 + vars.speedOffset;

            vars.elapsedTime += deltaTime * currentSpeed;

            // Ensure positive modulo for clean looping even when reversing time, using configured duration
            const duration = currentProps.loopDuration;
            const progress = ((vars.elapsedTime % duration) + duration) % duration / duration;

            // 2. Interpolate Ellipses
            ellipseRefs.current.forEach((el, i) => {
                if (!el) return;
                const current = ELLIPSES_DATA[i];
                const next = ELLIPSES_DATA[i + 1] || current;

                const cx = current.cx + (next.cx - current.cx) * progress;
                const cy = current.cy + (next.cy - current.cy) * progress;
                const rx = current.rx + (next.rx - current.rx) * progress;
                const ry = current.ry + (next.ry - current.ry) * progress;

                el.setAttribute('cx', cx.toString());
                el.setAttribute('cy', cy.toString());
                el.setAttribute('rx', rx.toString());
                el.setAttribute('ry', ry.toString());
            });

            // 3. Update Turbulence Filter (flicker effect)
            if (now - vars.lastTurbulenceUpdate > 250) {
                const seed = Math.floor(Math.random() * 100).toString();
                if (turbulenceRef1.current) turbulenceRef1.current.setAttribute('seed', seed);
                if (turbulenceRef2.current) turbulenceRef2.current.setAttribute('seed', seed);
                vars.lastTurbulenceUpdate = now;
            }

            // 4. Parallax Mouse Smoothing
            vars.currentMouseX += (vars.targetMouseX - vars.currentMouseX) * 0.08;
            vars.currentMouseY += (vars.targetMouseY - vars.currentMouseY) * 0.08;

            if (mainGroupRef.current) {
                mainGroupRef.current.style.transform = `
          translate3d(${vars.currentMouseX}px, ${vars.currentMouseY}px, 0)
          rotateX(${-vars.currentMouseY}deg)
          rotateY(${vars.currentMouseX}deg)
        `;
                mainGroupRef.current.style.transformOrigin = 'center center';
            }

            reqId = requestAnimationFrame(tick);
        };

        reqId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(reqId);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Use configured parallax intensity
        const x = (clientX - innerWidth / 2) * propsRef.current.parallaxAmount;
        const y = (clientY - innerHeight / 2) * propsRef.current.parallaxAmount;

        animationVars.current.targetMouseX = x;
        animationVars.current.targetMouseY = y;
    };

    const handleClick = () => {
        // Apply the configured warp strength
        animationVars.current.speedOffset = propsRef.current.warpStrength;
    };

    // Create safe hex-alpha color string for dropshadows
    const alphaHex = Math.floor(glowIntensity * 255).toString(16).padStart(2, '0');

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden cursor-crosshair flex items-center justify-center selection:bg-transparent ${className}`}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            style={{ perspective: '1000px', backgroundColor: bgColor }}
        >
            {/* Background ambient glow matching the active stroke color */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center, ${strokeColor}${alphaHex} 0%, transparent 60%)`
                }}
            />

            {/* Main Spacetime SVG */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1408 800"
                className="w-full h-full object-cover min-w-[1200px]"
                preserveAspectRatio="xMidYMid slice"
                style={{ filter: `drop-shadow(0px 0px 8px ${strokeColor}${alphaHex})` }}
            >
                <defs>
                    <mask id="m1" fill="#fff">
                        <ellipse cx="686" cy="403" rx="195" ry="164" />
                    </mask>

                    <mask id="m2" fill="#fff">
                        <rect id="frame" width="1390" height="780" x="9" y="9" />
                    </mask>

                    <filter id="f1">
                        <feTurbulence ref={turbulenceRef1} baseFrequency="0.6" seed="1" />
                        <feDisplacementMap in="SourceGraphic" scale={distortionScale} />
                    </filter>

                    <filter id="f2">
                        <feTurbulence ref={turbulenceRef2} baseFrequency="0.5" seed="1" />
                        <feDisplacementMap in="SourceGraphic" scale={distortionScale * 0.4} />
                    </filter>
                </defs>

                <g
                    ref={mainGroupRef}
                    className="cone"
                    style={{ willChange: 'transform' }}
                    mask="url(#m2)"
                    filter={noiseEnabled ? "url(#f1)" : "none"}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    opacity="0.85"
                >
                    {/* Render the outer unmasked ellipses */}
                    {ELLIPSES_DATA.slice(0, 15).map((data, i) => (
                        <ellipse key={`outer-${i}`} ref={(el) => { ellipseRefs.current[i] = el; }} {...data} />
                    ))}

                    {/* Render the masked inner ellipses */}
                    <g className="masked" mask="url(#m1)">
                        {ELLIPSES_DATA.slice(15).map((data, i) => (
                            <ellipse key={`inner-${i}`} ref={(el) => { ellipseRefs.current[i + 15] = el; }} {...data} />
                        ))}
                    </g>

                    {/* The radiating lines */}
                    <path strokeWidth={Math.max(1, strokeWidth - 1)} strokeLinecap="round" d={PATH_DATA} />
                </g>

                {/* The framing boundary */}
                <use href="#frame" fill="none" stroke={strokeColor} strokeWidth={Math.max(1, strokeWidth - 2)} opacity="0.3" filter={noiseEnabled ? "url(#f2)" : "none"} />
            </svg>

            {/* Cyberpunk noise overlay */}
            {noiseEnabled && (
                <div
                    className="absolute inset-0 pointer-events-none mix-blend-screen"
                    style={{
                        opacity: Math.max(0.02, glowIntensity * 0.1),
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />
            )}

            {/* Foreground content overlay */}
            {children && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none">
                    <div className="pointer-events-auto">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpaceTime;