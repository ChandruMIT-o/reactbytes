"use client";
import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Play, Search, ArrowLeft, ArrowRight, Monitor, Tablet, Smartphone, MoveHorizontal, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { ComponentRegistry } from "../layout/ComponentRegistry";
import { DemoToggle } from "../buttongroup/DemoToggle";
import { DemoContent } from "../layout/DemoContents";
import { usePathname, useRouter } from "next/navigation";

interface FullPreviewTabProps {
    isOpen: boolean;
    onClose: () => void;
    previewContent: React.ReactNode;
    children?: React.ReactNode;
    header?: React.ReactNode;
    tabsAction?: React.ReactNode;
    onReplay?: () => void;
}

export const FullPreviewTab: React.FC<FullPreviewTabProps> = ({
    isOpen,
    onClose,
    previewContent,
    children,
    header,
    tabsAction,
    onReplay,
}) => {
    const [isPaneOpen, setIsPaneOpen] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "phone" | "custom">("desktop");
    const [customWidth, setCustomWidth] = useState<number>(800);
    const [isDragging, setIsDragging] = useState(false);
    const [showDemo, setShowDemo] = useState(false);

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
            const maxWidth = window.innerWidth - 60;
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

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Lock scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const registryEntries = Object.values(ComponentRegistry);
    const currentId = pathname.split("/").pop() || "intro";
    const currentIndex = registryEntries.findIndex(item => item.id === currentId);
    const currentItem = registryEntries[currentIndex];
    const componentConfig = currentItem?.config;
    const isBackground = componentConfig?.category === "background";
    const prevItem = currentIndex > 0 ? registryEntries[currentIndex - 1] : null;
    const nextItem = currentIndex < registryEntries.length - 1 && currentIndex !== -1 ? registryEntries[currentIndex + 1] : null;

    const currentCategory = currentItem
        ? (currentItem.category.charAt(0).toUpperCase() + currentItem.category.slice(1))
        : "Component";

    const paneWidth = isMobile ? "100vw" : 400;

    // Fixed default fallback to false to keep it off by default
    useEffect(() => {
        if (isBackground && componentConfig) {
            setShowDemo(componentConfig.showDemoByDefault ?? false);
        } else {
            setShowDemo(false);
        }
    }, [currentId, isBackground, componentConfig]);

    if (!mounted) return null;

    const handleNavigate = (id: string) => {
        const targetPath = id === "intro" ? "/?preview=true" : `/${id}?preview=true`;
        router.push(targetPath);
    };

    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, filter: "blur(20px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(20px)" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[10000] bg-rb-neutral-1 flex overflow-hidden font-sans text-rb-accent-1"
                >
                    {/* Main Preview Area */}
                    <div className="flex-1 relative flex flex-col h-full bg-[radial-gradient(circle_at_50%_50%,_var(--rb-neutral-2)_0%,_var(--rb-neutral-1)_100%)]">

                        {/* Top Header Controls */}
                        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-[1100]">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={onClose}
                                    className="p-3 rounded-full bg-rb-neutral-3/80 backdrop-blur-md text-rb-accent-2 border border-rb-neutral-4 hover:bg-rb-neutral-4 transition-all group shadow-xl"
                                    title="Exit Full Preview"
                                >
                                    <X size={20} className="group-hover:scale-110 transition-transform" />
                                </button>

                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-rb-accent-2/40 font-bold">{currentCategory}</span>
                                    <h2 className="text-base md:text-xl font-bold tracking-tight">{currentItem?.label || "Preview"}</h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex items-center gap-2">
                                    {/* DemoToggle removed from here to clean up header space */}

                                    {/* Device Switcher */}
                                    <div className="flex items-center gap-0.5 bg-rb-neutral-3/90 backdrop-blur-md p-1 rounded-full shrink-0 shadow-xl border border-rb-neutral-4">
                                        <button
                                            onClick={() => setPreviewMode("desktop")}
                                            className={`p-2 rounded-full transition-all duration-300 ${previewMode === "desktop"
                                                ? "bg-rb-accent-1 text-rb-neutral-2 font-bold"
                                                : "text-rb-accent-2/40 hover:text-rb-accent-2 hover:bg-white/5"
                                                }`}
                                            title="Desktop View"
                                        >
                                            <Monitor size={16} />
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode("tablet")}
                                            className={`p-2 rounded-full transition-all duration-300 ${previewMode === "tablet"
                                                ? "bg-rb-accent-1 text-rb-neutral-2 font-bold"
                                                : "text-rb-accent-2/40 hover:text-rb-accent-2 hover:bg-white/5"
                                                }`}
                                            title="Tablet View"
                                        >
                                            <Tablet size={16} />
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode("phone")}
                                            className={`p-2 rounded-full transition-all duration-300 ${previewMode === "phone"
                                                ? "bg-rb-accent-1 text-rb-neutral-2 font-bold"
                                                : "text-rb-accent-2/40 hover:text-rb-accent-2 hover:bg-white/5"
                                                }`}
                                            title="Mobile View"
                                        >
                                            <Smartphone size={16} />
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode("custom")}
                                            className={`p-2 rounded-full transition-all duration-300 ${previewMode === "custom"
                                                ? "bg-rb-accent-1 text-rb-neutral-2 font-bold"
                                                : "text-rb-accent-2/40 hover:text-rb-accent-2 hover:bg-white/5"
                                                }`}
                                            title="Custom View"
                                        >
                                            <MoveHorizontal size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Bookmark Action */}
                                {tabsAction && tabsAction}

                                <button
                                    className="hidden md:block p-3 rounded-full bg-rb-neutral-3/80 backdrop-blur-md text-rb-accent-2 border border-rb-neutral-4 hover:bg-rb-neutral-4 transition-all group shadow-xl"
                                    title="Search Components"
                                >
                                    <Search size={20} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Preview Content Container */}
                        <div
                            style={{ paddingBottom: isMobile && isPaneOpen ? "50vh" : "0px" }}
                            className={`flex-1 flex items-center justify-center overflow-hidden transition-all duration-500 ${previewMode !== "desktop" ? "bg-rb-neutral-2 canvas-grid w-full h-full" : "w-full h-full"}`}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={pathname + "-" + previewMode}
                                    initial={{ opacity: 0, filter: "blur(20px)", scale: 0.98 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                    exit={{ opacity: 0, filter: "blur(20px)", scale: 1.02 }}
                                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <div
                                        className={`relative flex items-center justify-center h-full ${isDragging ? "transition-none" : "transition-all duration-500 ease-in-out"}`}
                                        style={previewMode === "custom" ? { width: `${customWidth}px`, maxWidth: "100%" } : { width: "100%" }}
                                    >
                                        <div
                                            className={`w-full h-full flex items-center justify-center relative ${isDragging ? "transition-none" : "transition-all duration-500 ease-in-out"} ${previewMode === "desktop"
                                                ? "max-w-full"
                                                : previewMode === "tablet"
                                                    ? "max-w-[768px] bg-rb-neutral-1 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                                                    : previewMode === "phone"
                                                        ? "max-w-[375px] bg-rb-neutral-1 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                                                        : "bg-rb-neutral-1 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                                                }`}
                                        >
                                            {previewMode !== "desktop" && (
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-rb-accent-2/20 font-mono tracking-widest uppercase pointer-events-none select-none z-10">
                                                    {previewMode === "custom" ? `custom view (${customWidth}px)` : `${previewMode} view`}
                                                </div>
                                            )}
                                            <div className="w-full h-full flex items-center justify-center relative [&>div]:h-full [&>div]:w-full [&>div]:max-h-none [&>div]:max-w-none">
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
                                                    <div className="w-1.5 h-16 rounded-full bg-rb-accent-1/20 group-hover/handle:bg-rb-accent-1/60 group-active/handle:bg-rb-accent-1 transition-colors flex items-center justify-center shadow-lg border border-white/5">
                                                        <div className="w-0.5 h-8 bg-rb-neutral-2/40 rounded-full" />
                                                    </div>
                                                </div>
                                                {/* Right Handle */}
                                                <div
                                                    onMouseDown={(e) => handleResizeStart("right", e)}
                                                    onTouchStart={(e) => handleResizeStart("right", e)}
                                                    className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center group/handle z-50 translate-x-1/2"
                                                >
                                                    <div className="w-1.5 h-16 rounded-full bg-rb-accent-1/20 group-hover/handle:bg-rb-accent-1/60 group-active/handle:bg-rb-accent-1 transition-colors flex items-center justify-center shadow-lg border border-white/5">
                                                        <div className="w-0.5 h-8 bg-rb-neutral-2/40 rounded-full" />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Absolute positioning for the floating DemoToggle */}
                        {isBackground && (
                            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[1100]">
                                <DemoToggle checked={showDemo} onChange={setShowDemo} />
                            </div>
                        )}

                        {/* Bottom Navigation Controls */}
                        <div className="absolute bottom-6 left-0 right-0 px-6 flex items-center justify-between z-[1100]">
                            {/* Prev Button Container */}
                            <div className="w-[25%] flex justify-start">
                                {prevItem && (
                                    <button
                                        onClick={() => handleNavigate(prevItem.id)}
                                        className="flex items-center gap-2 px-3 md:px-6 py-3 rounded-full bg-rb-neutral-3/40 backdrop-blur-md text-rb-accent-2/60 hover:text-rb-accent-1 hover:bg-rb-neutral-3 transition-all group shadow-lg"
                                    >
                                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" />
                                        <span className="text-sm font-medium tracking-tight whitespace-nowrap hidden md:inline">{prevItem.label}</span>
                                    </button>
                                )}
                            </div>

                            {/* Center Controls (Header/Presets) */}
                            <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center pointer-events-auto">
                                {header && (
                                    <div className="in-full-preview min-w-max w-[350px]">
                                        {header}
                                    </div>
                                )}
                            </div>

                            {/* Next Button Container */}
                            <div className="w-[25%] flex justify-end">
                                {nextItem && (
                                    <button
                                        onClick={() => handleNavigate(nextItem.id)}
                                        className="flex items-center gap-2 px-3 md:px-6 py-3 rounded-full bg-rb-neutral-3/40 backdrop-blur-md text-rb-accent-2/60 hover:text-rb-accent-1 hover:bg-rb-neutral-3 transition-all group shadow-lg"
                                    >
                                        <span className="text-sm font-medium tracking-tight whitespace-nowrap hidden md:inline">{nextItem.label}</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Collapsible Pane for Props */}
                    {children && (
                        <motion.div
                            initial={false}
                            animate={{
                                width: isMobile ? "100%" : (isPaneOpen ? paneWidth : 0),
                                height: isMobile ? (isPaneOpen ? "50vh" : 0) : "100%"
                            }}
                            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                            className={`flex flex-col will-change-[width,height] overflow-visible
                                ${isMobile
                                    ? 'fixed bottom-0 left-0 right-0 z-[1200]'
                                    : 'relative h-full'
                                }`}
                        >
                            {/* The Toggle Button (Now perfectly unclipped because the parent layer is overflow-visible) */}
                            <motion.button
                                layout
                                onClick={() => setIsPaneOpen(!isPaneOpen)}
                                initial={false}
                                animate={{
                                    x: 0,
                                    rotate: 0,
                                    backgroundColor: isPaneOpen ? "var(--rb-neutral-3)" : "var(--rb-accent-1)"
                                }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                className={`absolute shadow-2xl z-[1300] transition-colors group p-2.5 rounded-full
                ${isMobile
                                        ? 'right-6 top-4 translate-y-0'
                                        : 'top-1/2 -translate-y-1/2 -left-5'
                                    } 
                ${!isPaneOpen && !isMobile
                                        ? 'text-rb-neutral-1 border-rb-accent-1'
                                        : 'text-rb-accent-2 hover:bg-rb-neutral-4'
                                    }`}
                                title={isPaneOpen ? "Collapse Pane" : "Expand Pane"}
                            >
                                <motion.div className="group-hover:scale-110 transition-transform">
                                    {isPaneOpen ? (isMobile ? <X size={18} /> : <ChevronRight size={18} />) : <ChevronLeft size={18} />}
                                </motion.div>
                            </motion.button>

                            {/* New Inner Styled Panel Box: Isolates panel text constraints and carries the panel theme safely */}
                            <div
                                className={`w-full h-full flex flex-col overflow-hidden border-rb-neutral-4 bg-rb-neutral-2/50 backdrop-blur-xl
                ${isMobile ? 'border-t' : 'border-l'}`}
                            >
                                <AnimatePresence>
                                    {isPaneOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 20 : 0, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 20 : 0, filter: "blur(10px)" }}
                                            transition={{ duration: 0.4, delay: isPaneOpen ? 0.1 : 0 }}
                                            className="h-full flex flex-col overflow-hidden w-full"
                                        >
                                            <div className="p-4 px-6 border-b border-rb-neutral-4 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <h3 className="text-xl font-medium text-rb-accent-1">Props</h3>
                                                </div>
                                                {onReplay && !isBackground && (
                                                    <button
                                                        onClick={onReplay}
                                                        className="p-2 rounded-full bg-rb-accent-1 text-rb-neutral-1 hover:scale-110 active:scale-95 transition-all shadow-lg group"
                                                        title="Replay Animation"
                                                    >
                                                        <Play size={14} fill="currentColor" className="ml-0.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-rb-neutral-4 hover:scrollbar-thumb-rb-accent-1/20 transition-colors">
                                                <div className="flex flex-col gap-4">
                                                    {children}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {/* Floating settings action button for mobile view */}
                    {isMobile && !isPaneOpen && (
                        <button
                            onClick={() => setIsPaneOpen(true)}
                            className="fixed bottom-6 right-6 z-[1300] p-4 rounded-full bg-rb-accent-1 text-rb-neutral-2 shadow-2xl border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                            title="Tune Props"
                        >
                            <Sliders size={20} />
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

// Canvas grid styles for FullPreviewTab
const styles = `
.canvas-grid {
    background-size: 20px 20px;
    background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}
`;
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
}

export default FullPreviewTab;