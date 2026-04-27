"use client";
import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Play, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { allNavItems, navItems } from "@/app/meta/navigation";
import { usePathname, useRouter } from "next/navigation";

interface FullPreviewTabProps {
    isOpen: boolean;
    onClose: () => void;
    previewContent: React.ReactNode;
    children?: React.ReactNode;
    header?: React.ReactNode;
    onReplay?: () => void;
}

export const FullPreviewTab: React.FC<FullPreviewTabProps> = ({
    isOpen,
    onClose,
    previewContent,
    children,
    header,
    onReplay,
}) => {
    const [isPaneOpen, setIsPaneOpen] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

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

    if (!mounted) return null;

    const currentId = pathname.split("/").pop() || "intro";
    const currentIndex = allNavItems.findIndex(item => item.id === currentId);
    const currentItem = allNavItems[currentIndex];
    const prevItem = currentIndex > 0 ? allNavItems[currentIndex - 1] : null;
    const nextItem = currentIndex < allNavItems.length - 1 ? allNavItems[currentIndex + 1] : null;

    // Find current category
    const currentCategory = navItems.find(cat =>
        cat.items.some(item => item.id === currentId)
    )?.category || "Component";

    const paneWidth = isMobile ? "100vw" : 400;

    const handleNavigate = (id: string) => {
        router.push(`/${id}?preview=true`);
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
                                    <h2 className="text-xl font-bold tracking-tight">{currentItem?.label || "Preview"}</h2>
                                </div>
                            </div>

                            <button
                                className="p-3 rounded-full bg-rb-neutral-3/80 backdrop-blur-md text-rb-accent-2 border border-rb-neutral-4 hover:bg-rb-neutral-4 transition-all group shadow-xl"
                                title="Search Components"
                            >
                                <Search size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Preview Content Container - Forced to fill space with transition */}
                        <div className="flex-1 flex items-center justify-center overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={pathname}
                                    initial={{ opacity: 0, filter: "blur(20px)", scale: 0.98 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                    exit={{ opacity: 0, filter: "blur(20px)", scale: 1.02 }}
                                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                    className="w-full h-full flex items-center justify-center [&>div]:h-full [&>div]:w-full [&>div]:max-h-none [&>div]:max-w-none"
                                >
                                    {previewContent}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Bottom Navigation Controls */}
                        <div className="absolute bottom-6 left-0 right-0 px-6 flex items-center justify-between z-[1100]">
                            {/* Prev Button Container */}
                            <div className="w-[25%] flex justify-start">
                                {prevItem && (
                                    <button
                                        onClick={() => handleNavigate(prevItem.id)}
                                        className="flex items-center gap-3 px-6 py-3 rounded-full bg-rb-neutral-3/40 backdrop-blur-md text-rb-accent-2/60 hover:text-rb-accent-1 hover:bg-rb-neutral-3 transition-all group shadow-lg"
                                    >
                                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-sm font-medium tracking-tight whitespace-nowrap">{prevItem.label}</span>
                                    </button>
                                )}
                            </div>

                            {/* Center Controls (Header/Presets) - Fixed squish */}
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
                                        className="flex items-center gap-3 px-6 py-3 rounded-full bg-rb-neutral-3/40 backdrop-blur-md text-rb-accent-2/60 hover:text-rb-accent-1 hover:bg-rb-neutral-3 transition-all group shadow-lg"
                                    >
                                        <span className="text-sm font-medium tracking-tight whitespace-nowrap">{nextItem.label}</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Collapsible Pane for Props */}
                    {children && (
                        <motion.div
                            initial={false}
                            animate={{
                                width: isPaneOpen ? paneWidth : 0
                            }}
                            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                            className={`relative border-l border-rb-neutral-4 bg-rb-neutral-2/50 backdrop-blur-xl h-full flex flex-col will-change-[width] ${isMobile ? 'fixed inset-0 z-[1200]' : ''}`}
                        >
                            <motion.button
                                layout
                                onClick={() => setIsPaneOpen(!isPaneOpen)}
                                initial={false}
                                animate={{
                                    x: isPaneOpen ? 0 : (isMobile ? 0 : -28),
                                    rotate: isPaneOpen ? 0 : 0,
                                    backgroundColor: isPaneOpen ? "var(--rb-neutral-3)" : "var(--rb-accent-1)"
                                }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                className={`absolute top-1/2 -translate-y-1/2 p-2.5 rounded-full shadow-2xl z-[1300] transition-colors group ${isMobile ? 'right-6 top-6 translate-y-0' : '-left-5'} ${!isPaneOpen && !isMobile ? 'text-rb-neutral-1 border-rb-accent-1' : 'text-rb-accent-2 hover:bg-rb-neutral-4'}`}
                                title={isPaneOpen ? "Collapse Pane" : "Expand Pane"}
                            >
                                <motion.div
                                    animate={{ rotate: isPaneOpen ? 0 : 0 }}
                                    className="group-hover:scale-110 transition-transform"
                                >
                                    {isPaneOpen ? (isMobile ? <X size={18} /> : <ChevronRight size={18} />) : <ChevronLeft size={18} />}
                                </motion.div>
                            </motion.button>

                            <AnimatePresence>
                                {isPaneOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                        transition={{ duration: 0.4, delay: isPaneOpen ? 0.1 : 0 }}
                                        className={`h-full flex flex-col overflow-hidden ${isMobile ? 'w-full' : 'w-full'}`}
                                    >
                                        <div className="p-4 px-6 border-b border-rb-neutral-4 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <h3 className="text-xl font-medium text-rb-accent-1">Props</h3>
                                            </div>
                                            {onReplay && (
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
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default FullPreviewTab;
