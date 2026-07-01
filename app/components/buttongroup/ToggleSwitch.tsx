import React, { useState, useEffect, useRef, useId } from "react";
import { flushSync } from "react-dom";
import { Lock } from "lucide-react";

interface ToggleSwitchProps {
	tooltipPosition?: "top" | "bottom";
}

const ToggleSwitch = ({ tooltipPosition = "bottom" }: ToggleSwitchProps) => {
	const [isLight, setIsLight] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const buttonRef = useRef<HTMLLabelElement>(null);
	const id = useId();
	const inputId = `theme-toggle-${id}`;
	const maskId = `moon-mask-${id}`;

	useEffect(() => {
		// Force dark theme as light theme is locked / coming soon
		document.documentElement.classList.remove("light");
		document.documentElement.removeAttribute("data-theme");
		localStorage.setItem("theme", "dark");

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const showTooltipHandler = (e?: React.MouseEvent | React.KeyboardEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		setShowTooltip(true);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setShowTooltip(false);
		}, 2000);
	};

	return (
		<div className="relative flex items-center justify-center group/toggle">
			<label
				ref={buttonRef}
				htmlFor={inputId}
				className="relative w-[38px] h-[38px] flex items-center justify-center rounded-full cursor-not-allowed transition-all duration-300 bg-rb-neutral-3 text-rb-accent-2/50 hover:bg-rb-neutral-4 active:scale-95 group overflow-hidden"
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						showTooltipHandler(e);
					}
				}}
				tabIndex={0}
			>
				{/* Background layer for active state to support gradient transitions */}
				<div className="absolute inset-0 bg-rb-accent-2 opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-300" />

				<input
					type="checkbox"
					id={inputId}
					className="absolute opacity-0 w-0 h-0"
					checked={isLight}
					readOnly
					disabled
				/>
				<div
					className="absolute inset-0 z-20 cursor-not-allowed"
					onClick={(e) => showTooltipHandler(e)}
				/>

				<svg
					viewBox="0 0 20 20"
					fill="currentColor"
					stroke="none"
					className="w-5 h-5 relative z-10 transition-all duration-500 transform rotate-[40deg] group-has-[:checked]:rotate-[90deg] group-has-[:checked]:text-rb-neutral-2 pointer-events-none"
				>
					<mask id={maskId}>
						<rect x={0} y={0} width={20} height={20} fill="white" />
						<circle
							cx={11}
							cy={3}
							r={8}
							fill="black"
							className="transition-transform duration-500 origin-center group-has-[:checked]:translate-x-4 group-has-[:checked]:translate-y-[-3px]"
						/>
					</mask>
					<circle
						className="transition-transform duration-500 origin-center scale-100 group-has-[:checked]:scale-[0.55]"
						cx={10}
						cy={10}
						r={8}
						mask={`url(#${maskId})`}
					/>
					<g>
						<circle
							className="origin-center scale-0 group-has-[:checked]:scale-100 transition-transform duration-300"
							cx={18}
							cy={10}
							r="1.5"
						/>
						<circle
							className="origin-center scale-0 group-has-[:checked]:scale-100 transition-transform duration-300 delay-[50ms]"
							cx={14}
							cy="16.928"
							r="1.5"
						/>
						<circle
							className="origin-center scale-0 group-has-[:checked]:scale-100 transition-transform duration-300 delay-[100ms]"
							cx={6}
							cy="16.928"
							r="1.5"
						/>
						<circle
							className="origin-center scale-0 group-has-[:checked]:scale-100 transition-transform duration-300 delay-[170ms]"
							cx={2}
							cy={10}
							r="1.5"
						/>
						<circle
							className="origin-center scale-0 group-has-[:checked]:scale-100 transition-transform duration-300 delay-[250ms]"
							cx={6}
							cy="3.1718"
							r="1.5"
						/>
						<circle
							className="origin-center scale-0 group-has-[:checked]:scale-100 transition-transform duration-300 delay-[290ms]"
							cx={14}
							cy="3.1718"
							r="1.5"
						/>
					</g>
				</svg>
			</label>

			{/* Tooltip */}
			<div
				className={`absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap bg-rb-neutral-2/95 border border-white/10 text-[11px] text-rb-accent-2 px-2.5 py-1.5 rounded-md shadow-xl flex items-center gap-1.5 transition-all duration-300 ${tooltipPosition === "top"
						? `bottom-[calc(100%+8px)] ${showTooltip
							? "opacity-100 translate-y-0 scale-100"
							: "opacity-0 -translate-y-1 scale-95 pointer-events-none md:group-hover/toggle:opacity-100 md:group-hover/toggle:translate-y-0 md:group-hover/toggle:scale-100"
						}`
						: `top-[calc(100%+8px)] ${showTooltip
							? "opacity-100 translate-y-0 scale-100"
							: "opacity-0 translate-y-1 scale-95 pointer-events-none md:group-hover/toggle:opacity-100 md:group-hover/toggle:translate-y-0 md:group-hover/toggle:scale-100"
						}`
					}`}
			>
				<Lock size={12} className="text-rb-accent-1" />
				<span>Light theme will be available soon!</span>
			</div>
		</div>
	);
};
export default ToggleSwitch;
