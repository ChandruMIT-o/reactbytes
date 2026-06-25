"use client";
import React, { useState, useEffect } from "react";
import { Copy, Check, ChevronDown, ChevronUp, Play, Maximize2, Monitor, Tablet, Smartphone, MoveHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { usePreview } from "../context/PreviewContext";
import { DemoToggle } from "../buttongroup/DemoToggle";
import { DemoContent } from "../layout/DemoContents";
import { ComponentRegistry } from "../layout/ComponentRegistry";
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
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const { setIsOpen, setData, isOpen: isGlobalOpen } = usePreview();

	const [copied, setCopied] = useState(false);
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(searchParams.get("preview") === "true");
	const [showDemo, setShowDemo] = useState(false);
	const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "phone" | "custom">("desktop");
	const [customWidth, setCustomWidth] = useState<number>(800);
	const [isDragging, setIsDragging] = useState(false);
	const currentId = pathname.split("/").pop() || "";
	const currentItem = Object.values(ComponentRegistry).find((item) => item.id === currentId);
	const componentConfig = currentItem?.config;
	const isBackground = componentConfig?.category === "background";

	const handleResizeStart = (
		direction: "left" | "right",
		e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
	) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);

		const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
		const startWidth = customWidth;

		const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
			const currentX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
			const deltaX = currentX - startX;
			const factor = direction === "right" ? 2 : -2;
			const nextWidth = startWidth + deltaX * factor;

			const minWidth = 320;
			const maxWidth = 1152; // Matching max-w-6xl (1152px)
			setCustomWidth(Math.max(minWidth, Math.min(maxWidth, nextWidth)));
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleMouseMove);
			document.removeEventListener("touchend", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("touchmove", handleMouseMove, { passive: false });
		document.addEventListener("touchend", handleMouseUp);
	};

	// Update global data whenever it changes
	useEffect(() => {
		setData({
			previewContent,
			children,
			header,
			onReplay
		});
	}, [previewContent, children, header, onReplay, setData]);

	// Keep state in sync with URL
	useEffect(() => {
		const isPreview = searchParams.get("preview") === "true";
		setIsFullPreviewOpen(isPreview);
	}, [searchParams]);

	useEffect(() => {
		if (isBackground && componentConfig) {
			setShowDemo(componentConfig.showDemoByDefault ?? true);
		} else {
			setShowDemo(false);
		}
	}, [currentId, isBackground, componentConfig]);

	const handleOpenFullPreview = () => {
		setIsOpen(true);
		const params = new URLSearchParams(searchParams.toString());
		params.set("preview", "true");
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const handleCloseFullPreview = () => {
		setIsOpen(false);
		const params = new URLSearchParams(searchParams.toString());
		params.delete("preview");
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

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
		<div className="w-full max-w-6xl font-sans">
			{/* Tabs & Actions Row Wrapper */}
			<div className="flex items-center justify-between w-full gap-4 bg-transparent">
				{/* Tabs Container */}
				<div className="bg-rb-neutral-3 p-1.5 pb-0 rounded-t-[20px] flex gap-1.5 overflow-x-auto scrollbar-none">
					{tabs.map((tab) => (
						<motion.button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as any)}
							className="relative px-3 py-1.5 text-[16px] font-medium rounded-full outline-none transition-colors duration-300 shrink-0"
							style={{
								color: activeTab === tab.id ? "var(--rb-neutral-2)" : "var(--rb-accent-2)",
							}}
							whileHover="hover"
						>
							<span className="relative z-[1]">{tab.label}</span>

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

				{/* Header Actions (Switcher / Expand / Copy) */}
				<div className="flex items-center gap-1 pr-1.5 shrink-0">
					{activeTab === "preview" ? (
						<>
							<div className="hidden md:flex items-center gap-2">
								{isBackground && (
									<DemoToggle checked={showDemo} onChange={setShowDemo} />
								)}
								<div className="flex items-center gap-0.5 bg-rb-neutral-3/90 backdrop-blur-md p-1 rounded-full shrink-0">
									<button
										onClick={() => setPreviewMode("desktop")}
										className={`p-2 rounded-full transition-all duration-300 ${previewMode === "desktop"
											? "bg-rb-accent-1 text-rb-neutral-2 font-bold"
											: "text-rb-accent-2/40 hover:text-rb-accent-2 hover:bg-white/5"
										}`}
										title="Desktop View"
									>
										<Monitor size={14} />
									</button>
									<button
										onClick={() => setPreviewMode("tablet")}
										className={`p-2 rounded-full transition-all duration-300 ${previewMode === "tablet"
											? "bg-rb-accent-1 text-rb-neutral-2 font-bold"
											: "text-rb-accent-2/40 hover:text-rb-accent-2 hover:bg-white/5"
										}`}
										title="Tablet View"
									>
										<Tablet size={14} />
									</button>
									<button
										onClick={() => setPreviewMode("phone")}
										className={`p-2 rounded-full transition-all duration-300 ${previewMode === "phone"
											? "bg-rb-accent-1 text-rb-neutral-2 font-bold"
											: "text-rb-accent-2/40 hover:text-rb-accent-2 hover:bg-white/5"
										}`}
										title="Mobile View"
									>
										<Smartphone size={14} />
									</button>
									<button
										onClick={() => setPreviewMode("custom")}
										className={`p-2 rounded-full transition-all duration-300 ${previewMode === "custom"
											? "bg-rb-accent-1 text-rb-neutral-2 font-bold"
											: "text-rb-accent-2/40 hover:text-rb-accent-2 hover:bg-white/5"
										}`}
										title="Custom View"
									>
										<MoveHorizontal size={14} />
									</button>
								</div>
							</div>

							<div className="flex items-center gap-1">
								{!isBackground && onReplay && (
									<button
										onClick={onReplay}
										className="p-2.5 flex items-center justify-center rounded-full bg-rb-neutral-3 text-rb-accent-2/40 border border-rb-neutral-4 hover:text-rb-accent-2 hover:bg-rb-neutral-4 transition-all group"
										title="Replay Animation"
									>
										<Play size={14} className="group-hover:scale-110 transition-transform" />
									</button>
								)}

								<button
									onClick={handleOpenFullPreview}
									className="p-2.5 flex items-center justify-center rounded-full bg-rb-neutral-3 text-rb-accent-2/40 border border-rb-neutral-4 hover:text-rb-accent-2 hover:bg-rb-neutral-4 transition-all group"
									title="Expand Preview"
								>
									<Maximize2
										size={14}
										className="group-hover:scale-110 transition-transform"
									/>
								</button>
							</div>
						</>
					) : (
						<button
							onClick={handleCopy}
							className="p-2.5 flex items-center justify-center rounded-full bg-rb-neutral-3 text-rb-accent-2/40 border border-rb-neutral-4 hover:text-rb-accent-2 hover:bg-rb-neutral-4 transition-all group"
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
					)}
				</div>
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
							className={`w-full h-full min-h-[400px] transition-all duration-500 ${isFullPreviewOpen ? 'blur-xl' : 'blur-0'}`}
						>
							{activeTab === "preview" ? (
								<>
									<div className={`w-full h-full min-h-[400px] flex items-center justify-center transition-all duration-500 ${previewMode !== "desktop" ? "bg-rb-neutral-2 canvas-grid" : ""
										}`}>
										<div
											className={`relative flex items-center justify-center ${isDragging ? "transition-none" : "transition-all duration-500 ease-in-out"}`}
											style={previewMode === "custom" ? { width: `${customWidth}px`, maxWidth: "100%" } : { width: "100%" }}
										>
											<div
												className={`w-full h-full min-h-[360px] flex items-center justify-center relative ${isDragging ? "transition-none" : "transition-all duration-500 ease-in-out"} ${previewMode === "desktop"
													? "max-w-full"
													: previewMode === "tablet"
														? "max-w-[768px] bg-rb-neutral-1 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
														: previewMode === "phone"
															? "max-w-[375px] bg-rb-neutral-1 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
															: "bg-rb-neutral-1 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
													}`}
											>
												{previewMode !== "desktop" && (
													<div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-rb-accent-2/20 font-mono tracking-widest uppercase pointer-events-none select-none z-10">
														{previewMode === "custom" ? `custom view (${customWidth}px)` : `${previewMode} view`}
													</div>
												)}
												<div className="w-full h-full flex items-center justify-center relative">
													{previewContent}
													{isBackground && showDemo && (
														<div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
															<DemoContent variant={componentConfig?.demoVariant || "hero"} />
														</div>
													)}
												</div>
											</div>

											{previewMode === "custom" && (
												<>
													{/* Left Handle */}
													<div
														onMouseDown={(e) => handleResizeStart("left", e)}
														onTouchStart={(e) => handleResizeStart("left", e)}
														className="absolute left-0 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center group/handle z-50 -translate-x-1/2"
													>
														<div className="w-1.5 h-12 rounded-full bg-rb-accent-1/20 group-hover/handle:bg-rb-accent-1/60 group-active/handle:bg-rb-accent-1 transition-colors flex items-center justify-center shadow-lg border border-white/5">
															<div className="w-0.5 h-6 bg-rb-neutral-2/40 rounded-full" />
														</div>
													</div>
													{/* Right Handle */}
													<div
														onMouseDown={(e) => handleResizeStart("right", e)}
														onTouchStart={(e) => handleResizeStart("right", e)}
														className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center group/handle z-50 translate-x-1/2"
													>
														<div className="w-1.5 h-12 rounded-full bg-rb-accent-1/20 group-hover/handle:bg-rb-accent-1/60 group-active/handle:bg-rb-accent-1 transition-colors flex items-center justify-center shadow-lg border border-white/5">
															<div className="w-0.5 h-6 bg-rb-neutral-2/40 rounded-full" />
														</div>
													</div>
												</>
											)}
										</div>
									</div>
									{onReplay && !isBackground && (
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
						.canvas-grid {
							background-size: 20px 20px;
							background-image: 
								linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
								linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
						}
					`}</style>
				</div>


				{children && (
					<div className="mt-1.5 px-3 py-3 bg-rb-neutral-1 rounded-[18px] border border-rb-neutral-4 flex flex-col gap-3">
						<div className="flex items-center justify-between gap-2 relative z-50">
							<div className="flex-1 preview-tab-header">
								{header}
							</div>
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
									className="overflow-hidden relative px-2 z-[1]"
								>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 pb-3">
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
