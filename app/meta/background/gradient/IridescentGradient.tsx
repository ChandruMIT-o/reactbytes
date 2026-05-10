import React, { useState } from 'react';

interface IridescentGradientProps {
    /**
     * The title text to display in the center.
     */
    title?: string;
    /**
     * The text for the switch label.
     */
    switchText?: string;
    /**
     * The color of the stripes (hex or CSS color).
     */
    stripeColor?: string;
    /**
     * The background color (hex or CSS color).
     */
    bgColor?: string;
    /**
     * Whether the dark mode is active (controlled).
     */
    checked?: boolean;
    /**
     * Callback when the switch is toggled.
     */
    onCheckedChange?: (checked: boolean) => void;
    /**
     * Whether the dark mode is initially active (uncontrolled).
     */
    initialChecked?: boolean;
    /**
     * Optional className for the container.
     */
    className?: string;
}

export default function IridescentGradient({
    title = "An awesome title",
    switchText = "switch bg",
    stripeColor = "#fff",
    bgColor,
    checked,
    onCheckedChange,
    initialChecked = false,
    className = ""
}: IridescentGradientProps) {
    const [internalChecked, setInternalChecked] = useState(initialChecked);
    
    const isSwitched = checked !== undefined ? checked : internalChecked;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = e.target.checked;
        if (checked === undefined) {
            setInternalChecked(newChecked);
        }
        onCheckedChange?.(newChecked);
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

        /* Houdini custom property for blinking animation */
        @property --blink-opacity {
          syntax: "<number>";
          inherits: false;
          initial-value: 1;
        }

        @keyframes blink-animation {
          0%, 100% {
            opacity: var(--blink-opacity, 1);
          }
          50% {
            opacity: 0;
          }
        }

        @keyframes smoothBg {
          from {
            background-position: 50% 50%, 50% 50%;
          }
          to {
            background-position: 350% 50%, 350% 50%;
          }
        }

        @keyframes animSwitch {
          50% {
            transform: scale(1.2);
            font-weight: 900;
          }
        }

        /* Base Variables */
        .custom-wrapper {
          font-family: 'Inter', sans-serif;
          --stripe-color: ${stripeColor};
          --bg: ${bgColor || (isSwitched ? '#000' : '#fff')};
          --maincolor: var(--bg);
        }

        .custom-wrapper.is-checked {
          --stripe-color: #fff; /* White stripes on black background for dark mode */
        }

        /* Hero Background Styling & Masking */
        .hero-bg {
          --stripes: repeating-linear-gradient(
            90deg,
            var(--stripe-color) 0%,
            var(--stripe-color) 7%,
            transparent 10%,
            transparent 12%,
            var(--stripe-color) 16%
          );
          --rainbow: repeating-linear-gradient(
            90deg,
            #00d1ff 10%,
            #ee00ff 15%,
            #00ff8e 20%,
            #ffc700 25%,
            #00d1ff 30%
          );
          background-image: var(--stripes), var(--rainbow);
          background-size: 300%, 200%;
          background-position: 50% 50%, 50% 50%;
          filter: blur(20px) ${isSwitched ? 'saturate(200%) brightness(0.8)' : 'invert(100%)'};
          mask-image: radial-gradient(ellipse at 50% 0%, black 20%, transparent 80%);
          opacity: ${isSwitched ? '0.7' : '1'};
        }

        .hero-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: var(--stripes), var(--rainbow);
          background-size: 200%, 100%;
          animation: smoothBg 60s linear infinite;
          background-attachment: fixed;
          mix-blend-mode: difference;
        }

        /* Content Filters */
        .content-layer {
          gap: 4.5%;
          mix-blend-mode: difference;
          -webkit-mix-blend-mode: difference;
          filter: invert(1);
        }

        /* Text Scaling & Effects */
        .h1-scalingSize {
          font-size: calc(1rem + 5vw);
          position: relative;
          color: white;
        }

        .h1-scalingSize::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: white;
          text-shadow: 0 0 1px #ffffff;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-color: white;
          -webkit-mask: linear-gradient(#000 0 0) luminance;
          mask: linear-gradient(#000 0 0) luminance, alpha;
          backdrop-filter: blur(15px) brightness(1.5);
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
          display: flex;
          margin: auto;
          z-index: 1;
          pointer-events: none;
        }

        /* Switch Animations */
        .switch-label {
          cursor: pointer;
          transition: 0.15s linear(0 0%, 0.16 16.85%, 0.32 31.73%, 1 100%);
          will-change: transform, font-weight;
          color: rgba(255, 255, 255, 0.5);
        }

        .switch-label:where(:hover, :active, :focus-within) {
          transition: 0.3s ease;
          animation: animSwitch 0.2s alternate;
          color: white;
        }

        .switch-label:where(:hover, :active, :focus-within) .icon {
          animation-play-state: paused;
        }

        .icon {
          width: 1lh;
          height: 1lh;
          aspect-ratio: 1 / 1;
          border-radius: 9999px;
          --blink-opacity: 1;
          animation: blink-animation 2s ease-in-out infinite running;
          border-color: currentColor;
        }
      `}} />

            <section className={`custom-wrapper relative w-full h-full min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${isSwitched ? 'is-checked' : ''} ${className}`}>
                {/* Background Layer */}
                <div className="hero-bg relative w-full h-full min-h-screen flex items-center justify-center" />

                {/* Interactive Content Layer */}
                <div className="content-layer absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center">
                    <h1 className="h1-scalingSize font-bold tracking-tight m-0" data-text={title}>
                        {title}
                    </h1>

                    <input
                        type="checkbox"
                        id="switch"
                        className="appearance-none opacity-0 absolute w-0 h-0"
                        checked={isSwitched}
                        onChange={handleChange}
                        aria-label="Toggle Background"
                    />
                    <label htmlFor="switch" className="switch-label p-2 flex items-center justify-center mt-4">
                        <span className="flex items-center gap-2 select-none">
                            <span className="icon flex items-center justify-center px-[0.35rem] py-[0.25em] border border-dashed leading-none">
                                →
                            </span>
                            {switchText}
                        </span>
                    </label>
                </div>
            </section>
        </>
    );
}


