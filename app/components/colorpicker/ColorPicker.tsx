"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Palette } from "lucide-react";
import CustomColorPicker from "./CustomColorPicker";

const colorPresets = [
	"#EF4444", "#F97316", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6",
	"#EAB308", "#84CC16", "#22C55E", "#14B8A6", "#06B6D4", "#0EA5E9",
	"#6366F1", "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "#64748B",
];

export interface ColorPickerProps {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	className?: string;
	label?: string;
	presets?: string[];
	compact?: boolean;
}

const normalizeHex = (value: string) => {
	const normalized = value.trim();
	return normalized.startsWith("#")
		? normalized.toUpperCase()
		: `#${normalized.toUpperCase()}`;
};

export default function ColorPicker({
	value,
	defaultValue = colorPresets[0],
	onChange,
	className = "",
	label = "Color",
	presets = colorPresets,
	compact = false,
}: ColorPickerProps) {
	const [selectedColorState, setSelectedColorState] = useState(
		normalizeHex(defaultValue),
	);
	const [openType, setOpenType] = useState<"presets" | "custom" | null>(null);
	const [isEditingHex, setIsEditingHex] = useState(false);
	const [hexInput, setHexInput] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const selectedColor = normalizeHex(value ?? selectedColorState);

	const palette = useMemo(
		() => Array.from(new Set(presets.map(normalizeHex))),
		[presets],
	);

	useEffect(() => {
		setHexInput(selectedColor);
	}, [selectedColor]);

	useEffect(() => {
		if (isEditingHex && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditingHex]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setOpenType(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelectColor = (nextColor: string) => {
		const normalized = normalizeHex(nextColor);
		if (value === undefined) {
			setSelectedColorState(normalized);
		}
		onChange?.(normalized);
		if (openType === "presets") setOpenType(null);
	};

	const toggleOpen = (type: "presets" | "custom") => {
		setOpenType(openType === type ? null : type);
		setIsEditingHex(false);
	};

	const handleHexSubmit = () => {
		const formatted = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
		if (/^#([0-9A-F]{3}){1,2}$/i.test(formatted)) {
			handleSelectColor(formatted);
		} else {
			setHexInput(selectedColor);
		}
		setIsEditingHex(false);
	};

	return (
		<div className={`w-full font-sans relative ${className}`} ref={dropdownRef}>
			<div className="flex items-center gap-3 p-1.5 w-full bg-rb-neutral-3 rounded-full shadow-lg shadow-black/20 border border-rb-neutral-4/50 backdrop-blur-sm group">
				{/* Swatch - Triggers Custom Picker */}
				<div className="relative flex items-center shrink-0">
					<motion.div
						className="w-9 h-9 rounded-full border border-white/10 shadow-inner flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform relative"
						animate={{ backgroundColor: selectedColor }}
						onClick={() => toggleOpen("custom")}
						transition={{ duration: 0.2 }}
					>
						<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-white"
							>
								<path d="M12 5v14M5 12h14" />
							</svg>
						</div>
					</motion.div>
				</div>

				{/* Label & Hex */}
				<div className="flex flex-col min-w-[65px] flex-1">
					<span className="text-[8px] font-bold uppercase tracking-[0.15em] text-rb-accent-2/40 leading-none mb-0.5">
						{label}
					</span>
					<div className="h-5 overflow-hidden flex items-center">
						<AnimatePresence mode="wait">
							{isEditingHex ? (
								<motion.input
									key="hex-input"
									ref={inputRef}
									initial={{ opacity: 0, y: 3 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -3 }}
									className="bg-transparent border-none outline-none text-md font-mono font-bold text-rb-accent-1 tracking-wide w-full p-0"
									value={hexInput}
									onChange={(e) => setHexInput(e.target.value)}
									onBlur={handleHexSubmit}
									onKeyDown={(e) => e.key === "Enter" && handleHexSubmit()}
								/>
							) : (
								<motion.code
									key={selectedColor}
									initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
									animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
									exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
									transition={{ duration: 0.2, ease: "easeOut" }}
									className="text-md font-mono font-medium text-rb-accent-1 tracking-wide block cursor-text"
									onClick={() => setIsEditingHex(true)}
								>
									{selectedColor}
								</motion.code>
							)}
						</AnimatePresence>
					</div>
				</div>

				{/* Divider */}
				<div className="w-[1px] h-5 bg-rb-neutral-4/50 shrink-0" />

				{/* Presets Trigger */}
				<button
					type="button"
					onClick={() => toggleOpen("presets")}
					className={`flex items-center gap-1.5 px-2 py-2 cursor-pointer rounded-full transition-all duration-300 mr-1 ${openType === "presets"
						? "bg-rb-accent-1 text-rb-neutral-1"
						: "bg-rb-neutral-4/30 text-rb-accent-1/60 hover:text-rb-accent-1 hover:bg-rb-neutral-4/50"
						}`}
				>
					<Palette size={14} />
					<motion.div
						animate={{ rotate: openType === "presets" ? 180 : 0 }}
						transition={{ type: "spring", stiffness: 200, damping: 20 }}
					>
						<ChevronDown size={14} />
					</motion.div>
				</button>
			</div>

			{/* Dropdown Menus */}
			<AnimatePresence mode="wait">
				{openType === "custom" && (
					<motion.div
						key="custom-dropdown"
						initial={{ opacity: 0, y: 10, scale: 0.98 }}
						animate={{ opacity: 1, y: 5, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.98 }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
						className="absolute top-full left-0 right-0 mt-2 p-5 bg-rb-neutral-3 border border-rb-neutral-4/50 backdrop-blur-md rounded-3xl shadow-2xl z-[100] flex flex-col gap-3"
					>
						<span className="text-[10px] font-bold uppercase tracking-widest text-rb-accent-1/30">Custom Picker</span>
						<CustomColorPicker color={selectedColor} onChange={handleSelectColor} />
					</motion.div>
				)}

				{openType === "presets" && (
					<motion.div
						key="presets-dropdown"
						initial={{ opacity: 0, y: 10, scale: 0.98 }}
						animate={{ opacity: 1, y: 5, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.98 }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
						className="absolute top-full left-0 right-0 mt-2 p-5 bg-rb-neutral-3 border border-rb-neutral-4/50 backdrop-blur-md rounded-3xl shadow-2xl z-[100] flex flex-col gap-3"
					>
						<span className="text-[10px] font-bold uppercase tracking-widest text-rb-accent-1/30">Presets</span>
						<div className="flex flex-wrap gap-2.5 justify-center">
							{palette.map((color) => {
								const isActive = selectedColor === color;
								return (
									<motion.button
										key={color}
										type="button"
										onClick={() => handleSelectColor(color)}
										className="relative w-8 h-8 flex items-center justify-center rounded-full outline-none group/preset"
										whileHover={{ scale: 1.15 }}
										whileTap={{ scale: 0.9 }}
									>
										{isActive && (
											<motion.div
												layoutId="dropdown-active-pill"
												className="absolute -inset-1.5 bg-rb-accent-1 rounded-full z-0 shadow-sm"
											/>
										)}
										<div
											className="relative z-10 w-full h-full rounded-full border border-white/10"
											style={{ backgroundColor: color }}
										/>
									</motion.button>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}



