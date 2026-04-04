"use client";
import { useState } from "react";
import { RefreshCcwDot, RefreshCw } from "lucide-react";

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
		<div className="w-full max-w-4xl font-sans">
			{/* Tabs Row Wrapper */}
			<div className="bg-rb-neutral-3 p-1.5 pb-0 rounded-t-[20px] flex gap-1.5 w-max">
				<button
					onClick={() => setActiveTab("cli")}
					className={`px-3 py-1.5 text-[16px] font-medium rounded-full transition-all duration-300 ${
						activeTab === "cli"
							? "bg-rb-accent-1 text-rb-neutral-2"
							: "text-rb-accent-2 hover:bg-rb-neutral-4"
					}`}
				>
					Preview
				</button>
				<button
					onClick={() => setActiveTab("manual")}
					className={`px-3 py-1.5 text-[16px] font-medium rounded-full transition-all duration-300 ${
						activeTab === "manual"
							? "bg-rb-accent-1 text-rb-neutral-2"
							: "text-rb-accent-2 hover:bg-rb-neutral-4"
					}`}
				>
					Code
				</button>
			</div>

			{/* Main Content Outer Wrapper (Acts as the thick grey border) */}
			<div className="bg-rb-neutral-3 p-1.5 rounded-[24px] rounded-tl-none w-full relative">
				{/* Actual Content Area */}
				<div className="bg-rb-neutral-1 rounded-[18px] w-full p-5 pr-14 text-rb-accent-2/60 font-mono text-[16px] border border-rb-neutral-4 min-h-[82px] flex flex-col justify-center">
					{activeTab === "cli" ? (
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-3">
								<span className="text-rb-accent-1 select-none">
									$
								</span>
								<span className="text-rb-accent-1">
									npm install your-package-name
								</span>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-2 font-sans">
							<p className="text-rb-accent-1">
								1. Download the latest release from GitHub.
							</p>
						</div>
					)}
				</div>

				{/* Copy Button */}
				<button
					onClick={handleCopy}
					className="absolute top-4 right-4 p-2.5 items-center justify-center rounded-full bg-rb-neutral-3 text-rb-accent-2/40 border border-rb-neutral-4 hover:text-rb-accent-2 hover:bg-rb-neutral-4 transition-all group"
					title="Copy to clipboard"
				>
					{copied ? (
						<RefreshCw size={14} className="text-emerald-500" />
					) : (
						<RefreshCcwDot
							size={14}
							className="group-hover:scale-110 transition-transform"
						/>
					)}
				</button>
			</div>
		</div>
	);
};

export default PreviewTab;
