"use client";
import React from "react";

interface ToggleProps {
	/** Whether the toggle is on or off */
	checked?: boolean;
	/** Callback fired when state changes */
	onChange?: (checked: boolean) => void;
	/** Whether the toggle is disabled */
	disabled?: boolean;
	/** HTML id attribute */
	id?: string;
	/** HTML name attribute */
	name?: string;
	/** Additional CSS classes */
	className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
	checked,
	onChange,
	disabled = false,
	id,
	name,
	className = "",
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(e.target.checked);
		}
	};

	return (
		<label
			className={`group relative inline-flex items-center w-[3.5em] h-[2em] transition-opacity duration-300 ${
				disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
			} ${className}`}
		>
			<input
				id={id}
				name={name}
				type="checkbox"
				className="sr-only peer"
				checked={checked}
				onChange={handleChange}
				disabled={disabled}
			/>

			{/* Background Slider */}
			<div className="absolute inset-0 bg-rb-neutral-4 peer-checked:bg-rb-accent-2 rounded-full transition-colors duration-300 ease-in-out"></div>

			{/* Toggle Knob */}
			<div
				className="absolute left-[0.25em] w-[1.5em] h-[1.5em] bg-rb-accent-1 rounded-full transition-all duration-300 ease-in-out shadow-[10px_0_40px_rgba(0,0,0,0.1)] 
        peer-checked:bg-rb-neutral-2 
        peer-checked:translate-x-[1.5em] 
        peer-checked:shadow-[-10px_0_40px_rgba(0,0,0,0.2)] 
        group-active:w-[3em] 
        peer-checked:group-active:translate-x-0"
			></div>
		</label>
	);
};

export default Toggle;
