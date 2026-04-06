"use client";
import React, { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PreviewTabProps {
	previewContent: React.ReactNode;
	codeContent: string;
	usageCode?: string;
	children?: React.ReactNode;
	header?: React.ReactNode;
	collapsible?: boolean;
	defaultExpanded?: boolean;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({
	previewContent,
	codeContent,
	usageCode,
	children,
	header,
	collapsible = false,
	defaultExpanded = true,
}) => {
	const [activeTab, setActiveTab] = useState<"preview" | "code" | "usage">(
		"preview",
	);
	const [copied, setCopied] = useState(false);
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	const handleCopy = () => {
		const textToCopy = activeTab === "usage" ? usageCode : codeContent;
		if (textToCopy) {
			navigator.clipboard.writeText(textToCopy);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
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
				{usageCode && (
					<button
						onClick={() => setActiveTab("usage")}
						className={`px-3 py-1.5 text-[16px] font-medium rounded-full transition-all duration-300 ${
							activeTab === "usage"
								? "bg-rb-accent-1 text-rb-neutral-2"
								: "text-rb-accent-2 hover:bg-rb-neutral-4"
						}`}
					>
						Usage
					</button>
				)}
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
					) : activeTab === "usage" ? (
						<div className="p-5 overflow-auto max-h-[600px]">
							<pre className="text-rb-accent-2/80 font-mono text-sm whitespace-pre-wrap">
								{usageCode}
							</pre>
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

				{children && (
					<div className="mt-1.5 px-3 py-3 bg-rb-neutral-1 rounded-[18px] border border-rb-neutral-4 flex flex-col gap-6">
						<div className="flex items-center justify-between gap-2 relative z-50">
							<div className="flex-1">{header}</div>
							{collapsible && (
								<button
									onClick={() => setIsExpanded(!isExpanded)}
									className="p-2.5 rounded-full bg-rb-neutral-3 hover:bg-rb-neutral-3 text-rb-accent-1/40 hover:text-rb-accent-1 transition-all duration-300"
									title={isExpanded ? "Collapse" : "Expand"}
								>
									{isExpanded ? (
										<ChevronUp size={18} />
									) : (
										<ChevronDown size={18} />
									)}
								</button>
							)}
						</div>

						<AnimatePresence initial={false}>
							{isExpanded && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{
										height: "auto",
										opacity: 1,
										transitionEnd: { overflow: "visible" },
									}}
									exit={{
										height: 0,
										opacity: 0,
										overflow: "hidden",
									}}
									transition={{
										duration: 0.3,
										ease: "easeInOut",
									}}
									className="overflow-hidden relative px-2 z-10"
								>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{children}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				)}
			</div>
		</div>
	);
};

export default PreviewTab;
