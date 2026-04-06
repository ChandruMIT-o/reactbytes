"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, LucideIcon } from "lucide-react";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	icon?: LucideIcon;
	onClear?: () => void;
	containerClassName?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
	(
		{
			label,
			error,
			icon: Icon,
			onClear,
			containerClassName = "",
			className = "",
			type = "text",
			...props
		},
		ref,
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const internalRef = useRef<HTMLInputElement>(null);
		const inputRef =
			(ref as React.RefObject<HTMLInputElement>) || internalRef;

		const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(true);
			props.onFocus?.(e);
		};

		const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(false);
			props.onBlur?.(e);
		};

		const handleClear = (e: React.MouseEvent) => {
			e.stopPropagation();
			if (onClear) {
				onClear();
			} else if (inputRef.current) {
				const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
					window.HTMLInputElement.prototype,
					"value",
				)?.set;
				nativeInputValueSetter?.call(inputRef.current, "");
				inputRef.current.dispatchEvent(
					new Event("input", { bubbles: true }),
				);
				inputRef.current.focus();
			}
		};

		const hasValue = props.value
			? String(props.value).length > 0
			: (inputRef.current?.value.length || 0) > 0;

		return (
			<div className={`w-full flex flex-col gap-2 ${containerClassName}`}>
				{label && (
					<label className="text-sm font-medium tracking-tight text-rb-accent-1/60 px-1">
						{label}
					</label>
				)}

				<div className="group relative">
					{/* Outer Wrapper - provides the thick border effect */}
					<div
						className={`bg-rb-neutral-3 p-1 rounded-[20px] transition-all duration-300 ${
							isFocused
								? "bg-rb-neutral-4/80"
								: error
									? "bg-red-500/10"
									: "hover:bg-rb-neutral-4/50"
						}`}
					>
						{/* Inner Input Area */}
						<div
							className={`bg-rb-neutral-1 rounded-[16px] border flex items-center px-4 py-3 gap-3 overflow-hidden transition-colors duration-300 ${
								error
									? "border-red-500/30"
									: isFocused
										? "border-rb-accent-1/20"
										: "border-rb-neutral-4"
							}`}
						>
							{Icon && (
								<Icon
									size={18}
									className={`shrink-0 transition-colors duration-300 ${
										isFocused
											? "text-rb-accent-1"
											: error
												? "text-red-500/60"
												: "text-rb-accent-1/40"
									}`}
								/>
							)}

							<input
								ref={inputRef}
								type={type}
								onFocus={handleFocus}
								onBlur={handleBlur}
								className={`bg-transparent border-none outline-none flex-1 min-w-0 text-[16px] text-rb-accent-1 placeholder:text-rb-accent-1/30 font-sans tracking-tight ${className}`}
								{...props}
							/>

							<div className="flex items-center gap-2 shrink-0">
								<AnimatePresence>
									{hasValue && !props.disabled && (
										<motion.button
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.8 }}
											onClick={handleClear}
											className="p-1 rounded-full hover:bg-rb-neutral-4 text-rb-accent-1/40 hover:text-rb-accent-1 transition-colors"
											type="button"
											tabIndex={-1}
										>
											<X size={14} />
										</motion.button>
									)}
								</AnimatePresence>

								{error && (
									<AlertCircle
										size={18}
										className="text-red-500/60"
									/>
								)}
							</div>
						</div>
					</div>
				</div>

				<AnimatePresence mode="wait">
					{error && (
						<motion.p
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="text-[13px] text-red-500/80 font-medium px-1"
						>
							{error}
						</motion.p>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

TextInput.displayName = "TextInput";

export default TextInput;
