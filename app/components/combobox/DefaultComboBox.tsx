"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Check, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboBoxOption {
	id: string;
	label: string;
	description?: string;
}

interface ComboBoxProps {
	options: ComboBoxOption[];
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	label?: string;
	maxWidth?: string;
	dynamicWidth?: boolean;
}

export const ComboBox: React.FC<ComboBoxProps> = ({
	options,
	placeholder = "Select...",
	value,
	onChange,
	className = "",
	label = "Select",
	maxWidth = "300px",
	dynamicWidth = false,
}) => {
	const [selectedIdState, setSelectedIdState] = useState(value ?? options[0]?.id);
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeIndex, setActiveIndex] = useState(-1);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const selectedId = value ?? selectedIdState;
	const selectedOption = useMemo(
		() => options.find((opt) => opt.id === selectedId) || options[0],
		[options, selectedId],
	);

	const filteredOptions = useMemo(() => {
		if (!searchTerm) return options;
		return options.filter((opt) =>
			opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [options, searchTerm]);

	useEffect(() => {
		setActiveIndex(-1);
	}, [searchTerm, isOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (option: ComboBoxOption) => {
		if (value === undefined) {
			setSelectedIdState(option.id);
		}
		onChange?.(option.id);
		setSearchTerm("");
		setIsOpen(false);
		inputRef.current?.blur();
	};

	const handlePrev = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!options.length) return;
		const currentIndex = options.findIndex((opt) => opt.id === selectedId);
		const newIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
		const nextId = options[newIndex].id;

		if (value === undefined) {
			setSelectedIdState(nextId);
		}
		onChange?.(nextId);
	};

	const handleNext = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!options.length) return;
		const currentIndex = options.findIndex((opt) => opt.id === selectedId);
		const newIndex =
			currentIndex === -1 || currentIndex >= options.length - 1
				? 0
				: currentIndex + 1;
		const nextId = options[newIndex].id;

		if (value === undefined) {
			setSelectedIdState(nextId);
		}
		onChange?.(nextId);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isOpen) {
			if (e.key === "ArrowDown" || e.key === "Enter") {
				setIsOpen(true);
			}
			return;
		}

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setActiveIndex((prev) =>
					prev < filteredOptions.length - 1 ? prev + 1 : prev,
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
				break;
			case "Enter":
				e.preventDefault();
				if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
					handleSelect(filteredOptions[activeIndex]);
				}
				break;
			case "Escape":
				setIsOpen(false);
				inputRef.current?.blur();
				break;
		}
	};

	useEffect(() => {
		if (activeIndex >= 0 && listRef.current) {
			const activeElement = listRef.current.children[
				activeIndex
			] as HTMLElement;
			if (activeElement) {
				activeElement.scrollIntoView({
					block: "nearest",
					behavior: "smooth",
				});
			}
		}
	}, [activeIndex]);

	const isPresets = label?.toLowerCase() === "presets";

	return (
		<div
			ref={containerRef}
			style={{ maxWidth: dynamicWidth ? maxWidth : undefined }}
			className={cn("w-full select-none font-sans relative", className)}
		>
			{isPresets ? (
				<div
					onClick={() => !isOpen && setIsOpen(true)}
					className={cn(
						"flex items-center gap-3 p-1.5 w-full bg-rb-neutral-3 rounded-lg shadow-lg shadow-black/20 border border-rb-neutral-4/50 backdrop-blur-sm group transition-all duration-300",
						!isOpen && "cursor-pointer active:scale-[0.98]"
					)}
				>
					{/* Icon Box */}
					<div className="relative flex items-center shrink-0">
						<div
							className={cn(
								"w-9 h-9 flex items-center justify-center transition-colors duration-300 rounded-md border border-white/10 shadow-inner",
								isOpen ? "bg-rb-accent-1 text-rb-neutral-1" : "bg-rb-neutral-4/30 text-rb-accent-1/60 group-hover:text-rb-accent-1"
							)}
						>
							<Settings2 size={14} />
						</div>
					</div>

					{/* Label & Search Input */}
					<div className="flex flex-col flex-1 min-w-0" onClick={() => inputRef.current?.focus()}>
						<span className="text-[9px] font-bold uppercase tracking-[0.15em] text-rb-font-secondary leading-none">
							{label}
						</span>
						<div className="relative h-5">
							<AnimatePresence mode="wait">
								{isOpen ? (
									<motion.input
										key="search-input-presets"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										ref={inputRef}
										type="text"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										onKeyDown={handleKeyDown}
										placeholder={placeholder}
										autoFocus
										className="absolute inset-0 w-full bg-transparent border-none outline-none text-sm font-sans font-bold text-rb-accent-1 tracking-wide placeholder:text-rb-accent-1/30"
									/>
								) : (
									<motion.div
										key={selectedOption?.id || "empty-presets"}
										initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
										animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
										exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
										transition={{ duration: 0.2 }}
										className="absolute inset-0 text-sm font-sans font-medium text-rb-accent-1 tracking-wide truncate"
									>
										{selectedOption?.label || placeholder}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
					
					{/* Divider */}
					<div className="w-[1px] h-5 bg-rb-neutral-4/50 shrink-0" />

					{/* Navigation Buttons */}
					<div className="flex items-center gap-1 shrink-0 pr-1">
						<motion.button
							type="button"
							onClick={handlePrev}
							whileHover="hover"
							className={cn(
								"p-1.5 px-2 transition-all duration-300 rounded-l-md rounded-r-none border border-rb-accent-1/10",
								isOpen
									? "bg-white/10 text-white border-white/20"
									: "bg-rb-accent-1/5 text-rb-accent-1/60 hover:text-rb-accent-1 hover:bg-rb-accent-1/10"
							)}
						>
							<motion.div variants={{ hover: { x: -1 } }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
								<ChevronLeft size={16} strokeWidth={2.5} />
							</motion.div>
						</motion.button>
						<motion.button
							type="button"
							onClick={handleNext}
							whileHover="hover"
							className={cn(
								"p-1.5 px-2 transition-all duration-300 rounded-r-md border border-rb-accent-1/10",
								isOpen
									? "bg-white/10 text-white border-white/20"
									: "bg-rb-accent-1/5 text-rb-accent-1/60 hover:text-rb-accent-1 hover:bg-rb-accent-1/10"
							)}
						>
							<motion.div variants={{ hover: { x: 1 } }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
								<ChevronRight size={16} strokeWidth={2.5} />
							</motion.div>
						</motion.button>
					</div>
				</div>
			) : (
				<div
					onClick={() => !isOpen && setIsOpen(true)}
					className={cn(
						"flex items-center gap-3 p-1.5 w-full bg-rb-neutral-3 rounded-full shadow-lg shadow-black/20 border border-rb-neutral-4/50 backdrop-blur-sm group transition-all duration-300",
						!isOpen && "cursor-pointer active:scale-[0.98]"
					)}
				>
					{/* Search Icon Circle */}
					<div className="relative flex items-center shrink-0">
						<div className={cn(
							"w-9 h-9 rounded-full border border-white/10 shadow-inner flex items-center justify-center transition-colors duration-300",
							isOpen ? "bg-rb-accent-1 text-rb-neutral-1" : "bg-rb-neutral-4/30 text-rb-accent-1/60 group-hover:text-rb-accent-1"
						)}>
							<Search size={14} />
						</div>
					</div>

					{/* Label & Search Input */}
					<div className="flex flex-col flex-1 min-w-0" onClick={() => inputRef.current?.focus()}>
						<span className="text-[8px] font-bold uppercase tracking-[0.15em] text-rb-accent-2/40 leading-none">
							{label}
						</span>
						<div className="relative h-5">
							<AnimatePresence mode="wait">
								{isOpen ? (
									<motion.input
										key="search-input"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										ref={inputRef}
										type="text"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										onKeyDown={handleKeyDown}
										placeholder={placeholder}
										autoFocus
										className="absolute inset-0 w-full bg-transparent border-none outline-none text-md font-sans font-bold text-rb-accent-1 tracking-wide placeholder:text-rb-accent-1/20"
									/>
								) : (
									<motion.div
										key={selectedOption?.id || "empty"}
										initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
										animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
										exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
										transition={{ duration: 0.2 }}
										className="absolute inset-0 text-md font-sans font-medium text-rb-accent-1 tracking-wide truncate"
									>
										{selectedOption?.label || placeholder}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>

					{/* Divider */}
					<div className="w-[1px] h-5 bg-rb-neutral-4/50 shrink-0" />

					{/* Navigation Buttons */}
					<div className="flex items-center gap-1 shrink-0 pr-1">
						<motion.button
							type="button"
							onClick={handlePrev}
							whileHover="hover"
							className={cn(
								"p-1.5 px-2 transition-all duration-300 rounded-l-[14px] rounded-r-[0px] border border-rb-accent-1/10",
								isOpen
									? "bg-white/10 text-white border-white/20"
									: "bg-rb-accent-1/5 text-rb-accent-1/60 hover:text-rb-accent-1 hover:bg-rb-accent-1/10"
							)}
						>
							<motion.div variants={{ hover: { x: -1 } }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
								<ChevronLeft size={16} strokeWidth={2.5} />
							</motion.div>
						</motion.button>
						<motion.button
							type="button"
							onClick={handleNext}
							whileHover="hover"
							className={cn(
								"p-1.5 px-2 backdrop-blur-sm transition-all duration-300 rounded-r-[14px] border border-rb-accent-1/10",
								isOpen
									? "bg-white/10 text-white border-white/20"
									: "bg-rb-accent-1/5 text-rb-accent-1/60 hover:text-rb-accent-1 hover:bg-rb-accent-1/10"
							)}
						>
							<motion.div variants={{ hover: { x: 1 } }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
								<ChevronRight size={16} strokeWidth={2.5} />
							</motion.div>
						</motion.button>
					</div>
				</div>
			)}

			{/* Dropdown Menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.98 }}
						animate={{ opacity: 1, y: 5, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.98 }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
						className={cn(
							"absolute top-full left-0 right-0 mt-2 p-1.5 border backdrop-blur-md shadow-2xl z-[2000] bg-rb-neutral-3 border-rb-neutral-4/50",
							isPresets ? "rounded-xl" : "rounded-[24px]"
						)}
					>
						<div
							ref={listRef}
							className={cn(
								"bg-rb-neutral-1 border border-rb-neutral-4 max-h-[280px] overflow-y-auto no-scrollbar py-1",
								isPresets ? "rounded-lg" : "rounded-[18px]"
							)}
						>
							{filteredOptions.length > 0 ? (
								filteredOptions.map((option, index) => {
									const isSelected = selectedId === option.id;
									const isActive = activeIndex === index;

									return (
										<div
											key={option.id}
											onClick={() => handleSelect(option)}
											onMouseEnter={() => setActiveIndex(index)}
											className={cn(
												"relative px-4 py-3 cursor-pointer transition-all duration-200",
												isPresets ? "rounded-md mx-1" : "",
												isActive ? (isPresets ? "bg-rb-neutral-3" : "bg-rb-neutral-3") : ""
											)}
										>
											<div className="flex items-center justify-between gap-4">
												<div className="flex flex-col gap-0.5">
													<span className={cn(
														"text-[15px] font-medium tracking-tight",
														isSelected ? "text-rb-accent-1" : "text-rb-accent-1/80"
													)}>
														{option.label}
													</span>
													{option.description && (
														<span className="text-[12px] text-rb-accent-1/40">
															{option.description}
														</span>
													)}
												</div>
												{isSelected && (
													<motion.div
														layoutId="combo-selected-indicator"
														className="bg-rb-accent-3/20 p-1 rounded-full"
													>
														<Check size={14} className="text-rb-accent-1" />
													</motion.div>
												)}
											</div>
										</div>
									);
								})
							) : (
								<div className="px-4 py-8 text-center text-rb-accent-1/30 flex flex-col items-center gap-2">
									<Search size={24} className="opacity-20" />
									<span className="text-sm font-medium">No results found</span>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<style jsx global>{`
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
		</div>
	);
};

export default ComboBox;
