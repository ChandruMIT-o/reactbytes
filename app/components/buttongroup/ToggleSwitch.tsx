import React from "react";

const ToggleSwitch = () => {
	return (
		<div className="flex items-center justify-center">
			<label
				htmlFor="themeToggle"
				className="relative w-[38px] h-[38px] flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 bg-[#181A1E] text-[#E6DFF1] hover:bg-[#25282e] active:scale-95 group overflow-hidden"
			>
				{/* Background layer for active state to support gradient transitions */}
				<div className="absolute inset-0 bg-gradient-to-tr from-[#F2EEE9] to-[#E5E0D8] opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-300" />
				
				<input
					type="checkbox"
					id="themeToggle"
					className="absolute opacity-0 w-0 h-0"
				/>
				<svg
					viewBox="0 0 20 20"
					fill="currentColor"
					stroke="none"
					className="w-5 h-5 relative z-10 transition-all duration-500 transform rotate-[40deg] group-has-[:checked]:rotate-[90deg] group-has-[:checked]:text-[#060010] pointer-events-none"
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
