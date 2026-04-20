"use client";
import React, { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp, Play, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-tomorrow.css";

interface PreviewTabProps {
	previewContent: React.ReactNode;
	codeContent: string;
	usageCode?: string;
	children?: React.ReactNode;
	header?: React.ReactNode;
	collapsible?: boolean;
	defaultExpanded?: boolean;
	onReplay?: () => void;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({
	previewContent,
	codeContent,
	usageCode,
	children,
	header,
	collapsible = false,
	defaultExpanded = true,
	onReplay,
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

	const springConfig = {
		type: "spring",
		stiffness: 260,
		damping: 30,
	} as const;

	const tabs = [
		{ id: "preview", label: "Preview" },
		...(usageCode ? [{ id: "usage", label: "Usage" }] : []),
		{ id: "code", label: "Code" },
	] as const;

	return (
		<div className="w-full max-w-4xl font-sans">
			{/* Tabs Row Wrapper */}
			<div className="bg-rb-neutral-3 p-1.5 pb-0 rounded-t-[20px] flex gap-1.5 w-max max-w-full overflow-x-auto scrollbar-none">
				{tabs.map((tab) => (
					<motion.button
						key={tab.id}
						onClick={() => setActiveTab(tab.id as any)}
						className="relative px-3 py-1.5 text-[16px] font-medium rounded-full outline-none transition-colors duration-300"
						style={{
							color: activeTab === tab.id ? "var(--rb-neutral-2)" : "var(--rb-accent-2)",
						}}
						whileHover="hover"
					>
						<span className="relative z-10">{tab.label}</span>

						{activeTab === tab.id && (
							<motion.div
								layoutId="preview-active-pill"
								className="absolute inset-0 bg-rb-accent-1 rounded-full z-0"
								transition={springConfig}
							/>
						)}

						{activeTab !== tab.id && (
							<motion.div
								className="absolute inset-0 rounded-full z-0"
								variants={{
									hover: { backgroundColor: "var(--rb-neutral-4)" },
								}}
								transition={{ duration: 0.2 }}
							/>
						)}
					</motion.button>
				))}
			</div>

			{/* Main Content Outer Wrapper */}
			<div className="bg-rb-neutral-3 p-1.5 rounded-[24px] rounded-tl-none w-full relative">
				{/* Actual Content Area */}
				<div className="bg-rb-neutral-1 rounded-[18px] w-full min-h-[400px] border border-rb-neutral-4 overflow-hidden relative">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab}
							initial={{
								opacity: 0,
								y: 12,
								filter: "blur(12px)",
								scale: 0.99
							}}
							animate={{
								opacity: 1,
								y: 0,
								filter: "blur(0px)",
								scale: 1
							}}
							exit={{
								opacity: 0,
								y: -12,
								filter: "blur(12px)",
								scale: 0.99
							}}
							transition={{
								duration: 0.35,
								ease: [0.19, 1, 0.22, 1] // Ease out expo
							}}
							className="w-full h-full min-h-[400px]"
						>
							{activeTab === "preview" ? (
								<>
									<div className="w-full h-full min-h-[400px] flex items-center justify-center">
										{previewContent}
									</div>
									{onReplay && (
										<button
											onClick={onReplay}
											className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-rb-neutral-3 text-rb-accent-2 border border-rb-neutral-4 hover:text-rb-accent-1 hover:bg-rb-neutral-4 rounded-full transition-all duration-300 text-sm font-medium z-10 group"
											title="Replay Animation"
										>
											<Play
												size={14}
												className="group-hover:scale-110 transition-transform"
												fill="currentColor"
											/>
											<span>Replay</span>
										</button>
									)}
								</>
							) : activeTab === "usage" ? (
								<div className="p-5 overflow-auto max-h-[600px] edit-container">
									<Editor
										value={usageCode || ""}
										onValueChange={() => { }}
										highlight={(code) => Prism.highlight(code, Prism.languages.tsx, 'tsx')}
										padding={0}
										textareaClassName="focus:outline-none"
										className="text-rb-accent-2 font-mono text-md editor-styles"
										style={{
											fontFamily: 'inherit',
											backgroundColor: 'transparent'
										}}
									/>
								</div>
							) : (
								<div className="p-5 overflow-auto max-h-[600px] edit-container">
									<Editor
										value={codeContent || ""}
										onValueChange={() => { }}
										highlight={(code) => Prism.highlight(code, Prism.languages.tsx, 'tsx')}
										padding={0}
										textareaClassName="focus:outline-none"
										className="text-rb-accent-2 font-mono text-md editor-styles"
										style={{
											fontFamily: 'inherit',
											backgroundColor: 'transparent'
										}}
									/>
								</div>
							)}
						</motion.div>
					</AnimatePresence>

					<style jsx global>{`
						.editor-styles textarea {
							outline: none !important;
						}
						.editor-styles pre {
							white-space: pre-wrap !important;
							word-break: break-word !important;
						}
					`}</style>
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
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
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
