"use client";

import React, {
	useState,
	useRef,
	useEffect,
	MouseEvent as ReactMouseEvent,
} from "react";
import {
	motion,
	useMotionValue,
	useSpring,
	animate,
	useTransform,
	AnimatePresence,
} from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
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
	maxDecimals?: number;
	showMinMax?: boolean;
}

export const DiscreteSlider2: React.FC<DiscreteSliderProps> = ({
	min = 0,
	max = 100,
	step = 10,
	value: controlledValue,
	onChange,
	className,
	showTicks = true,
	showValue = true,
	label = "Value",
	maxDecimals,
	showMinMax = false,
}) => {
	const [internalValue, setInternalValue] = useState(controlledValue ?? min);
	const sliderRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const value = controlledValue ?? internalValue;

	// Generate real steps to map visuals perfectly
	const steps: number[] = [];
	const safeDecimals = maxDecimals ?? 4;
	for (let i = min; i <= max + 1e-9; i += step) {
		steps.push(Number(i.toFixed(safeDecimals)));
	}

	const initialPercentage = ((value - min) / (max - min)) * 100;
	const visualPercentage = useMotionValue(initialPercentage);

	const springPercentage = useSpring(visualPercentage, {
		stiffness: 400,
		damping: 40,
		mass: 0.5,
	});

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
		// Padding inside the track container to allow handle to reach ends comfortably
		const padding = 12;
		const availableWidth = rect.width - padding * 2;
		if (availableWidth <= 0) return;

		const position = clientX - rect.left - padding;
		const rawPercentage = Math.max(0, Math.min(1, position / availableWidth)) * 100;
		const rawValue = (rawPercentage / 100) * (max - min) + min;

		let closest = steps.reduce((prev, curr) =>
			Math.abs(curr - rawValue) < Math.abs(prev - rawValue) ? curr : prev,
		);

		if (maxDecimals !== undefined) {
			closest = Number(closest.toFixed(maxDecimals));
		}

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
				stiffness: 300,
				damping: 30,
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
			const finalPercentage = ((value - min) / (max - min)) * 100;
			animate(visualPercentage, finalPercentage, {
				type: "spring",
				stiffness: 300,
				damping: 30,
			});
			window.removeEventListener("mousemove", moveHandler);
			window.removeEventListener("mouseup", upHandler);
		};

		window.addEventListener("mousemove", moveHandler);
		window.addEventListener("mouseup", upHandler);
	};

	// Filter actual steps for visual ticks to prevent clutter
	let displaySteps = steps;
	const MAX_VISUAL_TICKS = 10;
	if (steps.length > MAX_VISUAL_TICKS) {
		const interval = Math.ceil(steps.length / MAX_VISUAL_TICKS);
		displaySteps = steps.filter((_, idx) => idx % interval === 0);
		if (displaySteps[displaySteps.length - 1] !== max) {
			displaySteps.push(max);
		}
	}

	const trackWidth = useTransform(springPercentage, (v) => `${v}%`);
	const handleLeft = useTransform(springPercentage, (v) => `${v}%`);
	const formattedValue = maxDecimals !== undefined ? value.toFixed(maxDecimals) : value;

	return (
		<div className={cn("w-full select-none font-sans", className)}>
			<div className="flex items-center gap-3 p-1.5 w-full bg-rb-neutral-3 rounded-full shadow-lg shadow-black/20 border border-rb-neutral-4/50 backdrop-blur-sm group">
				{/* Icon Circle */}
				<div className="relative flex items-center shrink-0">
					<div className="w-9 h-9 rounded-full border border-white/10 shadow-inner flex items-center justify-center bg-rb-neutral-4/30 text-rb-accent-1/60 group-hover:text-rb-accent-1 transition-colors">
						<SlidersHorizontal size={14} />
					</div>
				</div>

				{/* Label & Value */}
				<div className="flex flex-col min-w-[80px] max-w-[70px] shrink-0 cursor-default" title={label}>
					<span className="text-[8px] font-bold uppercase tracking-[0.15em] text-rb-accent-2/40 leading-none truncate">
						{label}
					</span>
					<div className="h-5 overflow-hidden">
						<AnimatePresence mode="wait">
							<motion.code
								key={formattedValue}
								initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
								animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
								exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
								transition={{ duration: 0.15, ease: "easeOut" }}
								className="text-md font-mono font-bold text-rb-accent-1 tracking-wide block"
							>
								{formattedValue}
							</motion.code>
						</AnimatePresence>
					</div>
				</div>



				{/* Slider Track Area */}
				<div
					ref={sliderRef}
					className="relative flex-1 h-9 flex items-center px-3 cursor-pointer"
					onMouseDown={onMouseDown}
				>
					{/* Base Track */}
					<div className="absolute inset-x-3 h-2 bg-rb-neutral-4/30 rounded-full overflow-hidden">
						{/* Active Track Fill */}
						<motion.div
							className="absolute inset-y-0 left-0 bg-rb-accent-1"
							style={{ width: trackWidth }}
						/>
					</div>

					{/* Ticks */}
					{showTicks && (
						<div className="absolute inset-x-3 h-1 pointer-events-none flex items-center">
							{displaySteps.map((s, i) => {
								const stepPercentage = ((s - min) / (max - min)) * 100;
								return (
									<div
										key={`tick-${i}`}
										className={cn(
											"absolute w-1 h-1 rounded-full -translate-x-1/2 transition-colors duration-200",
											s <= value ? "bg-rb-neutral-1/40" : "bg-white/10"
										)}
										style={{ left: `${stepPercentage}%` }}
									/>
								);
							})}
						</div>
					)}

					{/* Handle */}
					<motion.div
						className="absolute inset-x-3 h-full pointer-events-none flex items-center"
					>
						<motion.div
							className="relative w-1.5 h-5 bg-white rounded-full z-10 -translate-x-1/2"
							style={{ left: handleLeft }}
							animate={{
								scale: isDragging ? 1.2 : 1,
								height: isDragging ? 24 : 18,
							}}
							transition={{ type: "tween", stiffness: 100, damping: 10 }}
						/>
					</motion.div>
				</div>
			</div>

			{/* Min/Max indicators */}
			{showMinMax && (
				<div className="flex justify-between mt-2 px-6 text-[9px] font-bold text-rb-accent-2/20 uppercase tracking-[0.2em]">
					<span>{min}</span>
					<span>{max}</span>
				</div>
			)}
		</div>
	);
};

export default DiscreteSlider2;