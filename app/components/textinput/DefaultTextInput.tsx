"use client";

import React, { useState, useRef, useEffect } from "react";
import { Type, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextInputProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	label?: string;
	className?: string;
	disabled?: boolean;
	type?: "text" | "password" | "email" | "number";
}

export const DefaultTextInput: React.FC<TextInputProps> = ({
	value,
	onChange,
	placeholder = "Enter text...",
	label = "Input",
	className = "",
	disabled = false,
	type = "text",
}) => {
	const [internalValue, setInternalValue] = useState(value ?? "");
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const currentValue = value ?? internalValue;

	useEffect(() => {
		if (value !== undefined) {
			setInternalValue(value);
		}
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVal = e.target.value;
		setInternalValue(newVal);
		onChange?.(newVal);
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		setInternalValue("");
		onChange?.("");
		inputRef.current?.focus();
	};

	return (
		<div className={cn("w-full select-none font-sans", className)}>
			<div
				onClick={() => inputRef.current?.focus()}
				className={cn(
					"flex items-center gap-3 p-1.5 w-full bg-rb-neutral-3 rounded-full shadow-lg shadow-black/20 border transition-all duration-300 backdrop-blur-sm group",
					isFocused ? "border-rb-accent-1/50 ring-1 ring-rb-accent-1/20 shadow-xl shadow-rb-accent-1/5" : "border-rb-neutral-4/50",
					disabled ? "opacity-50 cursor-not-allowed" : "cursor-text active:scale-[0.98]"
				)}
			>
				{/* Icon Circle */}
				<div className="relative flex items-center shrink-0">
					<motion.div
						animate={{
							backgroundColor: isFocused ? "var(--rb-accent-1)" : "var(--rb-neutral-4)",
							color: isFocused ? "var(--rb-neutral-1)" : "rgba(255, 255, 255, 0.9)",
							scale: isFocused ? 1.05 : 1,
						}}
						className="w-9 h-9 rounded-full border border-white/10 shadow-inner flex items-center justify-center transition-colors duration-300"
					>
						<Type size={16} />
					</motion.div>
				</div>

				{/* Label & Input Area */}
				<div className="flex flex-col flex-1 min-w-0">
					<span className="text-[8px] font-bold uppercase tracking-[0.15em] text-rb-accent-2/40 leading-none">
						{label}
					</span>
					<input
						ref={inputRef}
						type={type}
						value={currentValue}
						onChange={handleChange}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						placeholder={placeholder}
						disabled={disabled}
						className="w-full bg-transparent border-none outline-none text-md font-sans font-medium text-rb-accent-1 tracking-wide placeholder:text-rb-accent-1/20"
					/>
				</div>

				{/* Action Area (Clear Button) */}
				<AnimatePresence>
					{currentValue && !disabled && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8, x: 10 }}
							animate={{ opacity: 1, scale: 1, x: 0 }}
							exit={{ opacity: 0, scale: 0.8, x: 10 }}
							className="flex items-center pr-2"
						>
							<button
								type="button"
								onClick={handleClear}
								className="p-1.5 rounded-full bg-rb-neutral-4/30 text-rb-accent-1/40 hover:text-rb-accent-1 hover:bg-rb-neutral-4/50 transition-all duration-300 active:scale-90"
							>
								<X size={14} strokeWidth={2.5} />
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default DefaultTextInput;
