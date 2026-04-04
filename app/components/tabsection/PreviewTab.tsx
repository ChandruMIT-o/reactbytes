"use client";
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface PreviewTabProps {
	previewContent: React.ReactNode;
	codeContent: string;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({ previewContent, codeContent }) => {
	const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(codeContent);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-4xl font-sans">
			{/* Tabs Row Wrapper */}
			<div className="bg-rb-neutral-3 p-1.5 pb-0 rounded-t-[20px] flex gap-1.5 w-max">
				<button
					onClick={() => setActiveTab("preview")}
					className={`px-3 py-1.5 text-[16px] font-medium rounded-full transition-all duration-300 ${
						activeTab === "preview"
							? "bg-rb-accent-1 text-rb-neutral-2"
							: "text-rb-accent-2 hover:bg-rb-neutral-4"
					}`}
				>
					Preview
				</button>
				<button
					onClick={() => setActiveTab("code")}
					className={`px-3 py-1.5 text-[16px] font-medium rounded-full transition-all duration-300 ${
						activeTab === "code"
							? "bg-rb-accent-1 text-rb-neutral-2"
							: "text-rb-accent-2 hover:bg-rb-neutral-4"
					}`}
				>
					Code
				</button>
			</div>

			{/* Main Content Outer Wrapper */}
			<div className="bg-rb-neutral-3 p-1.5 rounded-[24px] rounded-tl-none w-full relative">
				{/* Actual Content Area */}
				<div className="bg-rb-neutral-1 rounded-[18px] w-full min-h-[400px] border border-rb-neutral-4 overflow-hidden">
					{activeTab === "preview" ? (
						<div className="w-full h-full min-h-[400px] flex items-center justify-center p-5">
							{previewContent}
						</div>
					) : (
						<div className="p-5 overflow-auto max-h-[600px]">
							<pre className="text-rb-accent-2/80 font-mono text-sm whitespace-pre-wrap">
								{codeContent}
							</pre>
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
						<Check size={14} className="text-emerald-500" />
					) : (
						<Copy
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
