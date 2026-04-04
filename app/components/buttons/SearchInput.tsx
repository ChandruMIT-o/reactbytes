import React from "react";
import { Search } from "lucide-react";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/** Optional override for the container class */
	containerClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
	className = "",
	containerClassName = "",
	...props
}) => {
	return (
		<div
			className={`flex items-center w-fit px-3 py-[7px] rounded-full bg-rb-neutral-3 transition-all focus-within:ring-2 focus-within:ring-transparent ${containerClassName}`}
		>
			{/* Magnifying Glass Icon */}
			<Search
				className="w-4 h-4 text-rb-accent-2 shrink-0"
				strokeWidth={2.5}
			/>

			{/* Actual Input Field */}
			<input
				type="text"
				placeholder="Search"
				className={`flex-1 w-28 bg-transparent border-none outline-none text-rb-accent-2 placeholder:text-rb-accent-2/40 ml-2 text-[16px] font-medium tracking-tight ${className}`}
				{...props}
			/>

			{/* Command Palette Shortcut (⌘ K) */}
			<div
				className="flex items-center gap-1 text-rb-accent-2/20 shrink-0 font-medium text-[13px] ml-2"
				aria-hidden="true"
			>
				<kbd className="font-sans">⌘</kbd>
				<kbd className="font-sans">K</kbd>
			</div>
		</div>
	);
};

export default SearchInput;
