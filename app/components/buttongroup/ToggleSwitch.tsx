import React, { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";



const ToggleSwitch = () => {
	const [isLight, setIsLight] = useState(false);
	const buttonRef = useRef<HTMLLabelElement>(null);


	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "light") {
			setIsLight(true);
			document.documentElement.classList.add("light");
			document.documentElement.setAttribute("data-theme", "light");
		}
	}, []);

	const performThemeChange = (newIsLight: boolean) => {
		if (newIsLight) {
			document.documentElement.classList.add("light");
			document.documentElement.setAttribute("data-theme", "light");
			localStorage.setItem("theme", "light");
		} else {
			document.documentElement.classList.remove("light");
			document.documentElement.removeAttribute("data-theme");
			localStorage.setItem("theme", "dark");
		}
	}

	const toggleTheme = (e?: React.MouseEvent | React.KeyboardEvent) => {
		const newIsLight = !isLight;

		let x = window.innerWidth / 2;
		let y = window.innerHeight / 2;

		if (e && "clientX" in e && e.clientX !== 0) {
			x = e.clientX;
			y = e.clientY;
		} else if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			x = rect.left + rect.width / 2;
			y = rect.top + rect.height / 2;
		}

		const endRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y)
		);

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		// Fallback for browsers that don't support the View Transitions API or if user prefers reduced motion
		if (!(document as any).startViewTransition || prefersReducedMotion) {
			setIsLight(newIsLight);
			performThemeChange(newIsLight);
			return;
		}

		const transition = (document as any).startViewTransition(() => {
			flushSync(() => {
				setIsLight(newIsLight);
				performThemeChange(newIsLight);
			});
		});

		transition.ready.then(() => {
			// Animate the new theme (incoming)
			document.documentElement.animate(
				{
					clipPath: [
						`circle(0px at ${x}px ${y}px)`,
						`circle(${endRadius}px at ${x}px ${y}px)`,
					],
					filter: ["blur(12px)", "blur(0px)"],
					opacity: [0.3, 1],
					transform: ["scale(0.98)", "scale(1)"],
					transformOrigin: `${x}px ${y}px`,
				},
				{
					duration: 500,
					easing: "cubic-bezier(0.4, 0, 0.2, 1)",
					pseudoElement: "::view-transition-new(root)",
				}
			);

			// Animate the old theme (outgoing)
			document.documentElement.animate(
				{
					filter: ["blur(0px)", "blur(12px)"],
					opacity: [1, 0.3],
					transform: ["scale(1)", "scale(1.02)"],
					transformOrigin: `${x}px ${y}px`,
				},
				{
					duration: 500,
					easing: "cubic-bezier(0.4, 0, 0.2, 1)",
					pseudoElement: "::view-transition-old(root)",
				}
			);


		});
	};


	return (
		<div className="flex items-center justify-center">
			<label
				ref={buttonRef}
				htmlFor="themeToggle"
				className="relative w-[38px] h-[38px] flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 bg-rb-neutral-3 text-rb-accent-2 hover:bg-rb-neutral-4 active:scale-95 group overflow-hidden"
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						toggleTheme(e);
					}
				}}
				tabIndex={0}
			>
				{/* Background layer for active state to support gradient transitions */}
				<div className="absolute inset-0 bg-rb-accent-2 opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-300" />
				
				<input
					type="checkbox"
					id="themeToggle"
					className="absolute opacity-0 w-0 h-0"
					checked={isLight}
					readOnly
				/>
				<div 
					className="absolute inset-0 z-20 cursor-pointer" 
					onClick={(e) => toggleTheme(e)}
				/>


				<svg
					viewBox="0 0 20 20"
					fill="currentColor"
					stroke="none"
					className="w-5 h-5 relative z-10 transition-all duration-500 transform rotate-[40deg] group-has-[:checked]:rotate-[90deg] group-has-[:checked]:text-rb-neutral-2 pointer-events-none"
				>
					<mask id="moon-mask">
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
						mask="url(#moon-mask)"
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
		</div>
	);
};

export default ToggleSwitch;
