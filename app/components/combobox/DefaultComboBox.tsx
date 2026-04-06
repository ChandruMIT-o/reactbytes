"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Check } from "lucide-react";

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
}

export const ComboBox: React.FC<ComboBoxProps> = ({
	options,
	placeholder = "Select an option...",
	value,
	onChange,
	className = "",
	label,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeIndex, setActiveIndex] = useState(-1);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const selectedOption = useMemo(
		() => options.find((opt) => opt.id === value) || options[0],
		[options, value],
	);

	const filteredOptions = useMemo(() => {
		if (!searchTerm) return options;
		return options.filter((opt) =>
			opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [options, searchTerm]);

	// Initialize active index when filtering or opening
	useEffect(() => {
		setActiveIndex(-1);
	}, [searchTerm, isOpen]);

	// Handle clicking outside to close
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
		onChange?.(option.id);
		setSearchTerm("");
		setIsOpen(false);
		inputRef.current?.blur();
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

	// Scroll active item into view
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

	return (
		<div
			ref={containerRef}
			className={`relative w-full flex flex-col gap-2 ${isOpen ? "z-[2000]" : "z-0"} ${className}`}
		>
			{label && (
				<label className="text-sm font-medium tracking-tight text-rb-accent-1/60 px-1">
					{label}
				</label>
			)}

			<div className="group relative">
				<div
					onClick={() => !isOpen && setIsOpen(true)}
					className={`relative flex items-center gap-3 px-4 py-[9px] rounded-full transition-all duration-300 cursor-pointer border border-transparent ${
						isOpen
							? "bg-rb-accent-3 text-rb-neutral-2 shadow-[0_0_20px_rgba(192,222,221,0.3)]"
							: "bg-rb-neutral-3 text-rb-accent-2 hover:bg-rb-neutral-4 hover:border-rb-neutral-4/50"
					}`}
				>
					<Search
						size={16}
						className={`shrink-0 transition-colors duration-300 ${
							isOpen ? "text-rb-neutral-2" : "text-rb-accent-1/30"
						}`}
					/>

					<input
						ref={inputRef}
						type="text"
						value={
							isOpen ? searchTerm : selectedOption?.label || ""
						}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							if (!isOpen) setIsOpen(true);
						}}
						onFocus={() => setIsOpen(true)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						className={`bg-transparent border-none outline-none flex-1 min-w-0 text-[16px] font-medium font-sans tracking-tight placeholder:text-current/30 ${
							isOpen ? "text-rb-neutral-2" : "text-rb-accent-2"
						}`}
					/>

					<div
						className={`transition-transform duration-300 shrink-0 ${
							isOpen ? "rotate-180" : ""
						}`}
					>
						<ChevronDown
							size={16}
							className={
								isOpen
									? "text-rb-neutral-1"
									: "text-rb-accent-1/40"
							}
						/>
					</div>
				</div>

				{/* Dropdown Menu */}
				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 8, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							transition={{
								type: "spring",
								bounce: 0.35,
								duration: 0.4,
							}}
							className="absolute top-full left-0 right-0 z-[1999] bg-rb-neutral-3 p-1.5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-rb-neutral-4/30"
						>
							<div className="relative group/list">
								{/* Scroll Indicators / Fades */}
								<div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-rb-neutral-1 to-transparent z-10 pointer-events-none rounded-t-[18px] opacity-0 group-hover/list:opacity-100 transition-opacity duration-300" />
								<div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-rb-neutral-1 to-transparent z-10 pointer-events-none rounded-b-[18px] opacity-100 transition-opacity duration-300" />

								<div
									ref={listRef}
									className="bg-rb-neutral-1 rounded-[18px] border border-rb-neutral-4 max-h-[280px] overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth py-2"
								>
									{filteredOptions.length > 0 ? (
										filteredOptions.map((option, index) => {
											const isSelected =
												value === option.id;
											const isActive =
												activeIndex === index;

											return (
												<div
													key={option.id}
													onClick={() =>
														handleSelect(option)
													}
													onMouseEnter={() =>
														setActiveIndex(index)
													}
													className={`relative px-4 py-3 cursor-pointer transition-all duration-200 group/item ${
														isActive
															? "bg-rb-neutral-3"
															: ""
													}`}
												>
													<div className="flex items-center justify-between gap-4">
														<div className="flex flex-col gap-0.5">
															<span
																className={`text-[15px] font-medium tracking-tight ${
																	isSelected
																		? "text-rb-accent-1"
																		: "text-rb-accent-1/80"
																}`}
															>
																{option.label}
															</span>
															{option.description && (
																<span className="text-[12px] text-rb-accent-1/40">
																	{
																		option.description
																	}
																</span>
															)}
														</div>
														{isSelected && (
															<motion.div
																layoutId="selected-indicator"
																className="bg-rb-accent-3/20 p-1 rounded-full"
															>
																<Check
																	size={14}
																	className="text-rb-accent-1"
																/>
															</motion.div>
														)}
													</div>
												</div>
											);
										})
									) : (
										<div className="px-4 py-8 text-center text-rb-accent-1/30 flex flex-col items-center gap-2">
											<Search
												size={24}
												className="opacity-20"
											/>
											<span className="text-sm font-medium">
												No results found for "
												{searchTerm}"
											</span>
										</div>
									)}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<style jsx global>{`
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.no-scrollbar {
					-ms-overflow-style: none; /* IE and Edge */
					scrollbar-width: none; /* Firefox */
				}
			`}</style>
		</div>
	);
};

export default ComboBox;
