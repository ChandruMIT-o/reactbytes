"use client";

import React, {
	useState,
	useRef,
	useEffect,
	MouseEvent as ReactMouseEvent,
} from "react";
import {
	motion,
	AnimatePresence,
	useMotionValue,
	useSpring,
	animate,
	useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface DiscreteSliderProps {
	min?: number;
	max?: number;
	step?: number;
	value?: number;
	onChange?: (value: number) => void;
	className?: string;
	showTicks?: boolean;
	showValue?: boolean;
	label?: string;
}

export const DiscreteSlider: React.FC<DiscreteSliderProps> = ({
	min = 0,
	max = 100,
	step = 10,
	value: controlledValue,
	onChange,
	className,
	showTicks = true,
	showValue = true,
	label = "Value",
}) => {
	const [internalValue, setInternalValue] = useState(controlledValue ?? min);
	const sliderRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const value = controlledValue ?? internalValue;
	const steps: number[] = [];
	for (let i = min; i <= max; i += step) {
		steps.push(i);
	}

	const initialPercentage = ((value - min) / (max - min)) * 100;
	const visualPercentage = useMotionValue(initialPercentage);

	// Create a spring for the percentage to make thumb movement feel smooth
	// but responsive. During drag we'll update it directly.
	const springPercentage = useSpring(visualPercentage, {
		stiffness: 400,
		damping: 40,
		mass: 0.5,
	});

	// Sync visual percentage when value changes externally
	useEffect(() => {
		if (!isDragging) {
			animate(visualPercentage, ((value - min) / (max - min)) * 100, {
				type: "spring",
				stiffness: 400,
				damping: 40,
			});
		}
	}, [value, min, max, isDragging, visualPercentage]);

	const handleUpdate = (clientX: number, finalize = false) => {
		if (!sliderRef.current) return;

		const rect = sliderRef.current.getBoundingClientRect();
		const position = clientX - rect.left;
		const rawPercentage =
			Math.max(0, Math.min(1, position / rect.width)) * 100;
		const rawValue = (rawPercentage / 100) * (max - min) + min;

		// Find closest discrete step for value logic
		const closest = steps.reduce((prev, curr) =>
			Math.abs(curr - rawValue) < Math.abs(prev - rawValue) ? curr : prev,
		);

		// Update visual percentage freely during drag
		visualPercentage.set(rawPercentage);

		if (closest !== value) {
			if (controlledValue === undefined) {
				setInternalValue(closest);
			}
			onChange?.(closest);
		}

		if (finalize) {
			const finalPercentage = ((closest - min) / (max - min)) * 100;
			animate(visualPercentage, finalPercentage, {
				type: "spring",
				stiffness: 250,
				damping: 25,
			});
		}
	};

	const onMouseDown = (e: ReactMouseEvent) => {
		setIsDragging(true);
		handleUpdate(e.clientX);

		const moveHandler = (moveEvent: MouseEvent) => {
			handleUpdate(moveEvent.clientX);
		};

		const upHandler = () => {
			setIsDragging(false);
			// The last update was likely on mousemove, but we can call it once more to finalize snap
			// We don't have the last clientX here easily, but the visualPercentage is already set.
			// Let's just snap visualPercentage to value's step.
			const finalPercentage = ((value - min) / (max - min)) * 100;
			animate(visualPercentage, finalPercentage, {
				type: "spring",
				stiffness: 250,
				damping: 25,
			});

			window.removeEventListener("mousemove", moveHandler);
			window.removeEventListener("mouseup", upHandler);
		};

		window.addEventListener("mousemove", moveHandler);
		window.addEventListener("mouseup", upHandler);
	};

	const visualPosition = useTransform(springPercentage, (v) => `${v}%`);

	return (
		<div className={cn("w-full py-4 select-none", className)}>
			{/* Label / Value Display */}
			<div className="flex justify-between items-end mb-1.5 px-1">
				<span className="text-xs font-bold text-rb-accent-2/40 uppercase tracking-[0.2em] leading-none mb-0.5">
					{label}
				</span>
				{showValue && (
					<motion.span
						key={value}
						initial={{ opacity: 0, y: 3 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-[18px] font-medium text-rb-accent-1 tabular-nums leading-none tracking-tight"
					>
						{value}
					</motion.span>
				)}
			</div>

			<div
				ref={sliderRef}
				className="relative h-[24px] w-full flex items-center group cursor-pointer"
				onMouseDown={onMouseDown}
			>
				{/* Background Track Container */}
				<div className="relative h-2.5 w-full bg-rb-neutral-4 rounded-full">
					{/* Active Fill Track */}
					<motion.div
						className="absolute inset-y-0 left-0 bg-gradient-to-r from-rb-accent-1 to-rb-accent-2 rounded-full"
						style={{ width: visualPosition }}
					/>
				</div>

				{/* Ticks Container */}
				{showTicks && (
					<div className="absolute inset-x-0 h-1 flex justify-between items-center pointer-events-none px-[2px]">
						{steps.map((s) => {
							const isActive = s <= value;
							return (
								<motion.div
									key={s}
									animate={{
										backgroundColor: isActive
											? "var(--rb-neutral-1)"
											: "var(--rb-accent-3)",
										opacity: isActive ? 1 : 0.5,
									}}
									className="w-1 h-1 rounded-full z-10 transition-colors"
								/>
							);
						})}
					</div>
				)}

				{/* Thumb (Slider Handle) */}
				<motion.div
					className="absolute w-5 h-5 rounded-full bg-rb-accent-2 shadow-[0_2px_10px_rgba(0,0,0,0.4)] flex items-center justify-center z-20"
					style={{
						left: visualPosition,
						x: "-50%",
					}}
					animate={{
						scale: isDragging ? 1.2 : 1,
					}}
					transition={{ type: "spring", stiffness: 250, damping: 25 }}
					whileHover={{
						boxShadow: "0 4px 15px rgba(242,238,233,0.15)",
						scale: 1.1,
					}}
				>
					{/* Inner Eye */}
					<div className="w-2 h-2 bg-rb-neutral-2 rounded-full" />
				</motion.div>
			</div>

			{/* Min/Max indicators */}
			<div className="flex justify-between mt-2.5 px-1 text-xs font-bold text-rb-accent-2/20 uppercase tracking-[0.2em]">
				<span>{min}</span>
				<span>{max}</span>
			</div>
		</div>
	);
};

export default DiscreteSlider;
