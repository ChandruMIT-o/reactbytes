"use client";
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export const PreviewTab = () => {
	const [activeTab, setActiveTab] = useState<"cli" | "manual">("cli");
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		const text =
			activeTab === "cli"
				? "npm install your-package-name"
				: "Download latest release from GitHub";
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="bg-[#181A1E] p-1.5 rounded-[24px] w-full relative">
			{/* Actual Content Area */}
			<div className="bg-black rounded-[18px] w-full p-5 pr-14 text-[#E6DFF1]/60 font-mono text-[16px] border border-[#1D1C21] min-h-[82px] flex flex-col justify-center">
				{activeTab === "cli" ? (
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-3">
							<span className="text-[#F2EEE9] select-none">
								$
							</span>
							<span className="text-[#F2EEE9]">
								npm install your-package-name
							</span>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-2 font-sans">
						<p className="text-[#F2EEE9]">
							1. Download the latest release from GitHub.
						</p>
					</div>
				)}
			</div>

			{/* Copy Button */}
			<button
				onClick={handleCopy}
				className="absolute top-4 right-4 p-2.5 items-center justify-center rounded-full bg-[#181A1E] text-[#E6DFF1]/40 border border-[#1D1C21] hover:text-[#E6DFF1] hover:bg-[#1f2126] transition-all group"
				title="Copy to clipboard"
			>
				{copied ? (
					<Check size={14} className="text-emerald-500" />
				) : (
					<Copy
						size={14}
						className="group-hover:scale-110 transition-transform"
					/>
				)}
			</button>
		</div>
	);
};

export default PreviewTab;
