"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// Helper functions for color conversion
const hexToRgb = (hex: string) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return { r, g, b };
};

const rgbToHsv = ({ r, g, b }: { r: number; g: number; b: number }) => {
	const rAbs = r / 255;
	const gAbs = g / 255;
	const bAbs = b / 255;
	const v = Math.max(rAbs, gAbs, bAbs);
	const diff = v - Math.min(rAbs, gAbs, bAbs);
	const diffc = (c: number) => (v - c) / 6 / diff + 1 / 2;
	let h = 0;
	let s = 0;

	if (diff !== 0) {
		s = diff / v;
		if (rAbs === v) h = diffc(bAbs) - diffc(gAbs);
		else if (gAbs === v) h = 1 / 3 + diffc(rAbs) - diffc(bAbs);
		else if (bAbs === v) h = 2 / 3 + diffc(gAbs) - diffc(rAbs);
		if (h < 0) h += 1;
		else if (h > 1) h -= 1;
	}
	return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToRgb = (h: number, s: number, v: number) => {
	s /= 100;
	v /= 100;
	const i = Math.floor(h / 60);
	const f = h / 60 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);
	const mod = i % 6;
	const r = [v, q, p, p, t, v][mod];
	const g = [t, v, v, q, p, p][mod];
	const b = [p, p, t, v, v, q][mod];
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255),
	};
};

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) => {
	const toHex = (c: number) => c.toString(16).padStart(2, "0").toUpperCase();
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

interface CustomColorPickerProps {
	color: string;
	onChange: (hex: string) => void;
}

export default function CustomColorPicker({
	color,
	onChange,
}: CustomColorPickerProps) {
	const [hsv, setHsv] = useState(() => rgbToHsv(hexToRgb(color)));
	const saturationValueRef = useRef<HTMLDivElement>(null);
	const hueRef = useRef<HTMLDivElement>(null);

	// Sync local state with prop
	useEffect(() => {
		const newHsv = rgbToHsv(hexToRgb(color));
		// Only update if it's significantly different to avoid feedback loops
		if (rgbToHex(hsvToRgb(newHsv.h, newHsv.s, newHsv.v)) !== color) {
			setHsv(newHsv);
		}
	}, [color]);

	const updateColor = useCallback((newHsv: { h: number; s: number; v: number }) => {
		setHsv(newHsv);
		onChange(rgbToHex(hsvToRgb(newHsv.h, newHsv.s, newHsv.v)));
	}, [onChange]);

	const handleSaturationValueChange = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
		if (!saturationValueRef.current) return;
		const rect = saturationValueRef.current.getBoundingClientRect();
		const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
		const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

		const s = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
		const v = Math.min(100, Math.max(0, 100 - ((clientY - rect.top) / rect.height) * 100));
		updateColor({ ...hsv, s, v });
	};

	const handleHueChange = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
		if (!hueRef.current) return;
		const rect = hueRef.current.getBoundingClientRect();
		const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
		const h = Math.min(360, Math.max(0, ((clientX - rect.left) / rect.width) * 360));
		updateColor({ ...hsv, h });
	};

	// Interaction helpers
	const setupInteraction = (handler: (e: MouseEvent | TouchEvent) => void) => {
		const onMove = (e: MouseEvent | TouchEvent) => {
			e.preventDefault();
			handler(e);
		};
		const onUp = () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
			window.removeEventListener("touchmove", onMove);
			window.removeEventListener("touchend", onUp);
		};
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		window.addEventListener("touchmove", onMove, { passive: false });
		window.addEventListener("touchend", onUp);
	};

	return (
		<div className="flex flex-col gap-4 w-full relative z-50">
			{/* Saturation & Value Area */}
			<div
				ref={saturationValueRef}
				className="relative w-full aspect-square rounded-xl cursor-crosshair overflow-hidden border border-rb-neutral-1"
				style={{
					backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
					backgroundImage: `
            linear-gradient(to right, #fff, transparent),
            linear-gradient(to top, #000, transparent)
          `,
				}}
				onMouseDown={(e) => {
					handleSaturationValueChange(e);
					setupInteraction(handleSaturationValueChange);
				}}
				onTouchStart={(e) => {
					handleSaturationValueChange(e);
					setupInteraction(handleSaturationValueChange);
				}}
			>
				<motion.div
					className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-lg pointer-events-none"
					animate={{
						left: `${hsv.s}%`,
						top: `${100 - hsv.v}%`,
					}}
					transition={{ type: "spring", stiffness: 500, damping: 30 }}
				/>
			</div>

			{/* Hue Slider */}
			<div className="flex flex-col gap-2">
				<div
					ref={hueRef}
					className="relative h-4 w-full rounded-full cursor-pointer border border-white/10"
					style={{
						background: "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
					}}
					onMouseDown={(e) => {
						handleHueChange(e);
						setupInteraction(handleHueChange);
					}}
					onTouchStart={(e) => {
						handleHueChange(e);
						setupInteraction(handleHueChange);
					}}
				>
					<motion.div
						className="absolute top-1/2 -mt-3 w-6 h-6 -ml-3 rounded-full border-2 border-white shadow-lg bg-white pointer-events-none"
						animate={{
							left: `${(hsv.h / 360) * 100}%`,
						}}
						style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
						transition={{ type: "keyframes", stiffness: 500, damping: 30 }}
					/>
				</div>
			</div>

			{/* Color Preview & Inputs */}
			<div className="flex items-center gap-3 mt-1">
				<div
					className="w-10 h-10 rounded-lg border border-white/10 shadow-inner"
					style={{ backgroundColor: color }}
				/>
				<div className="flex-1 flex flex-col">
					<span className="text-[10px] font-bold uppercase tracking-wider text-rb-accent-2/50">Hex Code</span>
					<input
						type="text"
						value={color}
						onChange={(e) => {
							const val = e.target.value;
							if (/^#[0-9A-F]{6}$/i.test(val)) {
								onChange(val.toUpperCase());
							}
						}}
						className="bg-rb-neutral-4/30 border border-rb-neutral-4/50 rounded-md px-2 py-1 text-sm font-mono text-rb-accent-1 outline-none focus:border-rb-accent-1/50 transition-colors"
					/>
				</div>
			</div>
		</div>
	);
}
