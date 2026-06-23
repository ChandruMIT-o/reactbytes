"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LeftSidebarMenu from "../sidebar/LeftSidebarMenu";
import ButtonGroup from "../buttongroup/ButtonGroup";
import LeftSidebarRefMenu from "../sidebar/LeftSidebarRefMenu";
import { GitHubStarButton } from "../buttons/GitHubStarsButton";
import ToggleSwitch from "../buttongroup/ToggleSwitch";
import SearchInput from "../buttons/SearchInput";
import { Menu, X, ArrowLeft, ArrowRight } from "lucide-react";
import FullPreviewTab from "../tabsection/FullPreviewTab";
import { usePreview } from "../context/PreviewContext";
import HeaderChaosBackground from "./HeaderChaosBackground";
import { ComponentRegistry } from "./ComponentRegistry";
import LogoMorphLoading from "./LogoMorphLoading";
import BallWaveLoader from "./BallWaveLoader";

import {
	generalItems,
	textItems,
	backgroundItems,
	carouselItems,
	miscellaneousItems,
	pageSections,
	mainNavItems,
	cursorItems
} from "./AppShellData";

const INTRO_PLAYED_KEY = "rb-intro-played";

export default function AppShell({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();

	if (pathname === "/landing") {
		return <>{children}</>;
	}

	// Only show the intro animation once per browser session
	const [showLoading, setShowLoading] = React.useState(() => {
		if (typeof window !== "undefined") {
			return !sessionStorage.getItem(INTRO_PLAYED_KEY);
		}
		return false;
	});

	const handleIntroComplete = React.useCallback(() => {
		if (typeof window !== "undefined") {
			sessionStorage.setItem(INTRO_PLAYED_KEY, "1");
		}
		setShowLoading(false);
	}, []);

	const activeItem = pathname === "/" ? "intro" : pathname.slice(1);
	const { isOpen, setIsOpen, data } = usePreview();

	const registryEntries = React.useMemo(() => Object.values(ComponentRegistry), []);
	const currentIndex = React.useMemo(() => registryEntries.findIndex(item => item.id === activeItem), [activeItem, registryEntries]);
	const prevItem = currentIndex > 0 ? registryEntries[currentIndex - 1] : null;
	const nextItem = currentIndex < registryEntries.length - 1 && currentIndex !== -1 ? registryEntries[currentIndex + 1] : null;

	const handleNavigate = (id: string) => {
		const targetPath = id === "intro" ? "/" : `/${id}`;
		router.push(targetPath);
	};

	const [activeSection, setActiveSection] = React.useState<string>("");
	const [activeMainNav, setActiveMainNav] = React.useState<string>("components");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
	const [isHeaderHovered, setIsHeaderHovered] = React.useState(false);
	const [isHeaderPressed, setIsHeaderPressed] = React.useState(false);

	const scrollContainerRef = React.useRef<HTMLElement>(null);
	// Close mobile menu when active item changes
	React.useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [activeItem]);

	const currentSections = React.useMemo(
		() => pageSections[activeItem] || [],
		[activeItem],
	);

	React.useEffect(() => {
		const observerOptions = {
			root: scrollContainerRef.current,
			rootMargin: "-10% 0px -80% 0px",
			threshold: 0,
		};

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveSection(entry.target.id);
				}
			});
		};

		const observer = new IntersectionObserver(
			observerCallback,
			observerOptions,
		);

		const sections = currentSections.map((s) =>
			document.getElementById(s.id),
		);
		sections.forEach((section) => {
			if (section) observer.observe(section);
		});

		return () => observer.disconnect();
	}, [activeItem, currentSections]);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element && scrollContainerRef.current) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const handleSetActiveItem = (id: string) => {
		router.push(`/${id}`);
	};

	return (
		<div className="flex flex-col h-[100dvh] overflow-hidden font-sans bg-background text-foreground transition-colors duration-500">
			{showLoading && (
				<LogoMorphLoading onComplete={handleIntroComplete} />
			)}
			{/* Fixed Header */}
			<header
				onMouseEnter={() => setIsHeaderHovered(true)}
				onMouseLeave={() => {
					setIsHeaderHovered(false);
					setIsHeaderPressed(false);
				}}
				onMouseDown={() => setIsHeaderPressed(true)}
				onMouseUp={() => setIsHeaderPressed(false)}
				className="relative flex items-center justify-between w-full px-4 md:px-8 py-3 md:py-4 border-b border-white/5 bg-background/80 backdrop-blur-md z-50 flex-shrink-0 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform duration-200 select-none"
			>
				<HeaderChaosBackground isHovered={isHeaderHovered} isPressed={isHeaderPressed} />
				<div className="relative z-10 flex items-center justify-between w-full pointer-events-none">
					<div className="flex items-center gap-1 sm:gap-2 md:gap-4 pointer-events-auto">
						<button
							type="button"
							className="md:hidden p-2 -ml-2 text-rb-accent-2/60 hover:text-rb-accent-1 hover:bg-white/5 rounded-md transition-colors relative z-[60]"
							onClick={(e) => {
								e.stopPropagation();
								setIsMobileMenuOpen(!isMobileMenuOpen);
							}}
						>
							<Menu size={20} />
						</button>
						<div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/")}>
							<div className="relative">
								<div className="absolute inset-0 bg-rb-accent-1/20 blur-lg rounded-full group-hover:bg-rb-accent-1/40 transition-colors" />
								<Image
									src="/logo.svg"
									alt="Logo"
									width={17}
									height={28}
									className="relative z-10"
									style={{ width: "auto", height: "auto" }}
								/>
							</div>
							<div className="hidden md:block text-[16px] text-rb-accent-2 font-medium tracking-tight">
								React Bytes
							</div>
						</div>
						<div className="hidden md:flex ml-2">
							<ButtonGroup
								groupId="main-nav"
								items={mainNavItems}
								initialActive={activeMainNav}
								onChange={setActiveMainNav}
							/>
						</div>
					</div>
					<div className="flex items-center gap-2 flex-shrink-0 pointer-events-auto">
						<SearchInput />
						<div className="hidden md:flex items-center gap-2">
							<ToggleSwitch />
							<GitHubStarButton starCount={134} username="ChandruMIT-o" />
						</div>
					</div>
				</div>
			</header>

			{/* Main Content Area with independent scrolling */}
			<div className="flex flex-1 overflow-hidden w-full max-w-[100vw] justify-between md:px-2 md:py-3 relative">
				{/* Mobile Backdrop */}
				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileMenuOpen(false)}
							className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
						/>
					)}
				</AnimatePresence>

				{/* Left Sidebar */}
				<aside
					className={`fixed inset-y-0 left-0 z-[70] w-[280px] max-w-[90vw] bg-rb-neutral-2 border-r border-white/5 md:bg-transparent md:border-none md:relative md:w-auto h-full flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
						}`}
				>
					{/* Fixed Mobile Header */}
					<div className="flex md:hidden items-center justify-between pt-6 px-[18px] border-b border-white/5 bg-rb-neutral-2 flex-shrink-0">
						<div className="flex items-center gap-3">
							<div className="w-[6px] h-6 bg-rb-accent-1 rounded-full shrink-0" />
							<span className="text-rb-accent-2 font-semibold text-lg tracking-tight ml-2">Navigation</span>
						</div>
						<button
							type="button"
							onClick={() => setIsMobileMenuOpen(false)}
							className="p-1.5 text-rb-accent-2/60 hover:text-rb-accent-1 hover:bg-white/5 rounded-md transition-colors"
						>
							<X size={20} />
						</button>
					</div>

					{/* Scrollable Content Wrapper */}
					<div className="flex-1 overflow-y-auto scrollbar-none hover:scrollbar-thin scrollbar-thumb-rb-neutral-4 scrollbar-track-transparent">
						<div className="flex flex-col gap-1 pb-5 px-0 md:px-0">
							{/* Mobile Top Actions (ButtonGroup) */}
							<div className="flex md:hidden px-[18px] py-6 border-b border-white/5 bg-rb-neutral-2/50">
								<ButtonGroup
									groupId="mobile-main-nav"
									items={mainNavItems}
									initialActive={activeMainNav}
									onChange={setActiveMainNav}
								/>
							</div>

							<LeftSidebarMenu
								activeItem={activeItem}
								setActiveItem={handleSetActiveItem}
								menuSubtitle="General"
								items={generalItems}
							/>
							{activeMainNav === "components" && (
								<>
									<LeftSidebarMenu
										activeItem={activeItem}
										setActiveItem={handleSetActiveItem}
										menuSubtitle="Text"
										items={textItems}
									/>
									<LeftSidebarMenu
										activeItem={activeItem}
										setActiveItem={handleSetActiveItem}
										menuSubtitle="Background"
										items={backgroundItems}
									/>
									<LeftSidebarMenu
										activeItem={activeItem}
										setActiveItem={handleSetActiveItem}
										menuSubtitle="Carousels"
										items={carouselItems}
									/>
									<LeftSidebarMenu
										activeItem={activeItem}
										setActiveItem={handleSetActiveItem}
										menuSubtitle="Miscellaneous"
										items={miscellaneousItems}
									/>
								</>
							)}
							{activeMainNav === "cursors" && (
								<LeftSidebarMenu
									activeItem={activeItem}
									setActiveItem={handleSetActiveItem}
									menuSubtitle="Cursors"
									items={cursorItems}
								/>
							)}
						</div>
					</div>

					{/* Fixed Mobile Footer */}
					<div className="md:hidden flex items-center justify-between px-[18px] py-4 border-t border-white/5 bg-rb-neutral-2 flex-shrink-0">
						<GitHubStarButton starCount={134} username="ChandruMIT-o" />
						<div className="flex items-center gap-2">
							<div className="w-px h-4 bg-white/10" />
							<ToggleSwitch />
						</div>
					</div>
				</aside>

				{/* Center Content - Scrollable */}
				<main
					ref={scrollContainerRef}
					className="flex-1 h-full w-full relative overflow-y-auto px-4 md:pl-10 md:pr-5 pt-6 scrollbar-none hover:scrollbar-thin scrollbar-thumb-rb-neutral-4 scrollbar-track-transparent scroll-smooth"
				>
					<div className="max-w-5xl mx-auto pb-40">
						<Suspense fallback={<BallWaveLoader />}>
							{children}
						</Suspense>
						{currentIndex !== -1 && (prevItem || nextItem) && (
							<div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between w-full">
								<div className="flex-1 flex justify-start">
									{prevItem && (
										<button
											onClick={() => handleNavigate(prevItem.id)}
											className="flex items-center gap-3 px-6 py-3 rounded-full bg-rb-neutral-3 text-rb-accent-2 hover:text-rb-accent-1 hover:bg-rb-neutral-4 hover:border-rb-accent-1/20 transition-all group shadow-lg cursor-pointer select-none"
										>
											<ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
											<span className="text-sm font-medium tracking-tight whitespace-nowrap">{prevItem.label}</span>
										</button>
									)}
								</div>
								<div className="flex-1 flex justify-end">
									{nextItem && (
										<button
											onClick={() => handleNavigate(nextItem.id)}
											className="flex items-center gap-3 px-6 py-3 rounded-full bg-rb-neutral-3 text-rb-accent-2 hover:text-rb-accent-1 hover:bg-rb-neutral-4 hover:border-rb-accent-1/20 transition-all group shadow-lg cursor-pointer select-none"
										>
											<span className="text-sm font-medium tracking-tight whitespace-nowrap">{nextItem.label}</span>
											<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
										</button>
									)}
								</div>
							</div>
						)}
					</div>
				</main>

				{/* Right Sidebar - Scrollable */}
				<aside className="hidden md:block h-full overflow-y-auto pt-6 pl-1 scrollbar-none hover:scrollbar-thin scrollbar-thumb-rb-neutral-4 scrollbar-track-transparent">
					<LeftSidebarRefMenu
						items={currentSections}
						activeId={activeSection}
						onItemClick={scrollToSection}
					/>
				</aside>
			</div>

			<FullPreviewTab
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
					const params = new URLSearchParams(window.location.search);
					params.delete("preview");
					router.replace(`${pathname}${params.toString() ? "?" + params.toString() : ""}`, { scroll: false });
				}}
				previewContent={data?.previewContent}
				children={data?.children}
				header={data?.header}
				onReplay={data?.onReplay}
			/>
		</div>
	);
}
