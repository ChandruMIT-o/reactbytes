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
	const steps: number[] = [];
	for (let i = min; i <= max; i += step) {
		let s = i;
		if (maxDecimals !== undefined) {
			s = Number(s.toFixed(maxDecimals));
		}
		steps.push(s);
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
		const position = clientX - rect.left;
		const rawPercentage =
			Math.max(0, Math.min(1, position / rect.width)) * 100;
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

	let displaySteps = steps;
	if (steps.length > 20) {
		displaySteps = [];
		const tickCount = 10;
		for (let i = 0; i <= tickCount; i++) {
			displaySteps.push(min + i * ((max - min) / tickCount));
		}
	}

	const clipPath = useTransform(springPercentage, (v: number) => `inset(0% ${100 - v}% 0% 0%)`);
	const visualPosition = useTransform(springPercentage, (v: number) => `${v}%`);

	return (
		<div className={cn("w-full py-2 select-none font-sans", className)}>
			<div
				ref={sliderRef}
				className="relative w-full h-12 flex items-center bg-rb-neutral-1 border-7 border-rb-neutral-3 rounded-[16px] overflow-hidden cursor-pointer group"
				onMouseDown={onMouseDown}
			>
				{/* Ticks */}
				{showTicks && (
					<div className="absolute inset-0 flex justify-between items-center pointer-events-none px-4">
						{displaySteps.map((s, i) => (
							<div
								key={i}
								className="w-0.5 h-1.5 bg-rb-accent-3 rounded-full"
							/>
						))}
					</div>
				)}

				{/* Base Text Layer */}
				<div className="absolute inset-0 pointer-events-none z-10 flex items-center">
					<span className="absolute left-4 text-sm font-medium text-rb-accent-2/60 transition-colors group-hover:text-rb-accent-1/80">
						{label}
					</span>
					{showValue && (
						<span className="absolute right-4 text-[15px] font-medium text-rb-accent-2/60 tabular-nums tracking-tight">
							{maxDecimals !== undefined
								? value.toFixed(maxDecimals)
								: value}
						</span>
					)}
				</div>

				{/* Foreground Layer (Clip-path with accent background) */}
				<motion.div
					className="absolute inset-0 z-20 pointer-events-none bg-rb-accent-3"
					style={{ clipPath }}
				>
					<div className="absolute inset-0 pointer-events-none flex items-center">
						<span className="absolute left-4 text-sm font-medium text-rb-neutral-1">
							{label}
						</span>
						{showValue && (
							<span className="absolute right-4 text-[15px] font-bold text-rb-neutral-1 tabular-nums tracking-tight">
								{maxDecimals !== undefined
									? value.toFixed(maxDecimals)
									: value}
							</span>
						)}
					</div>
				</motion.div>

				{/* Handle layer */}
				<motion.div
					className="absolute top-0 bottom-0 left-0 z-30 pointer-events-none"
					style={{ width: visualPosition }}
				>
					<motion.div
						className="absolute right-3 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-rb-neutral-1 rounded-full shadow-sm"
						animate={{
							scale: isDragging ? 1.2 : 1,
							backgroundColor: isDragging
								? "var(--rb-neutral-2)"
								: "var(--rb-neutral-1)",
						}}
					/>
				</motion.div>
			</div>
			{/* Min/Max indicators */}
			{showMinMax && (
				<div className="flex justify-between mt-2 px-1 text-[10px] font-bold text-rb-accent-2/30 uppercase tracking-[0.2em]">
					<span>{min}</span>
					<span>{max}</span>
				</div>
			)}
		</div>
	);
};

export default DiscreteSlider2;
