"use client";
import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LeftSidebarMenu from "../sidebar/LeftSidebarMenu";
import ButtonGroup from "../buttongroup/ButtonGroup";
import LeftSidebarRefMenu from "../sidebar/LeftSidebarRefMenu";
import { GitHubStarButton } from "../buttons/GitHubStarsButton";
import ToggleSwitch from "../buttongroup/ToggleSwitch";
import SearchInput from "../buttons/SearchInput";
import { Menu, X } from "lucide-react";

const generalItems = [
	{ id: "intro", label: "Introduction" },
	{ id: "install", label: "Installation" },
	{ id: "changelog", label: "Changelog" },
];

const textItems = [
	{ id: "blur-text", label: "Blur Text" },
	{ id: "fall-down", label: "Fall Down" },
	{ id: "blur-in", label: "Blur In" },
	{ id: "reveal-under", label: "Reveal Under" },
	{ id: "variable-weight", label: "Variable Weight" },
	{ id: "wave-text", label: "Proximity Ripple" },
	{ id: "focal-blur", label: "Focal Blur" },
	{ id: "magnetic-text", label: "Magnetic Repel" },
	{ id: "shatter-text", label: "Cinematic Shatter" },
];

const backgroundItems = [
	{ id: "magnetic-dots", label: "Magnetic Dot Mesh" },
	{ id: "bubble-gradient", label: "Bubble Gradient" },
	{ id: "fractal-background", label: "Fractal Background" },
	{ id: "cellular-automata", label: "Cellular Automata" },
];

const pageSections: Record<string, { id: string; label: string }[]> = {
	install: [
		{ id: "installation-title", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"blur-text": [
		{ id: "blur-text-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"magnetic-dots": [
		{ id: "magnetic-dots-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"bubble-gradient": [
		{ id: "bubble-gradient-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"fall-down": [
		{ id: "fall-down-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"blur-in": [
		{ id: "blur-in-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"reveal-under": [
		{ id: "reveal-under-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"variable-weight": [
		{ id: "variable-weight-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"wave-text": [
		{ id: "wave-text-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"focal-blur": [
		{ id: "focal-blur-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"magnetic-text": [
		{ id: "magnetic-text-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"shatter-text": [
		{ id: "shatter-text-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"fractal-background": [
		{ id: "fractal-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
	"cellular-automata": [
		{ id: "cellular-title", label: "Preview" },
		{ id: "installation-tabs", label: "Installation" },
		{ id: "api-reference", label: "API Reference" },
		{ id: "credits", label: "Credits" },
	],
};


export default function AppShell({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();

	// Extract activeItem from pathname if it's not and-redirect
	const activeItem = pathname === "/" ? "install" : pathname.slice(1);
	
	const [activeSection, setActiveSection] = React.useState<string>("");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
			{/* Fixed Header */}
			<header className="flex items-center justify-between w-full px-5 md:px-8 py-4 border-b border-white/5 bg-background/80 backdrop-blur-md z-50 flex-shrink-0">
				<div className="flex items-center gap-2 md:gap-4">
					<button
						type="button"
						className="md:hidden p-3 -ml-2 text-rb-accent-2/60 hover:text-rb-accent-1 hover:bg-white/5 rounded-md transition-colors relative z-[60]"
						onClick={(e) => {
							e.stopPropagation();
							setIsMobileMenuOpen(!isMobileMenuOpen);
						}}
					>
						<Menu size={24} />
					</button>
					<div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/")}>
						<div className="relative">
							<div className="absolute inset-0 bg-rb-accent-1/20 blur-lg rounded-full group-hover:bg-rb-accent-1/40 transition-colors" />
							<Image
								src="/logo.svg"
								alt="Logo"
								width={19}
								height={30}
								className="relative z-10"
							/>
						</div>
						<div className="hidden md:block text-[16px] text-rb-accent-2 font-medium tracking-tight">
							React Bytes
						</div>
					</div>
					<div className="hidden md:flex ml-2">
						<ButtonGroup
							groupId="main-nav"
							items={[
								{ id: "components", label: "Components" },
								{ id: "docs", label: "Docs" },
								{ id: "icons", label: "Icons" },
							]}
						/>
					</div>
				</div>
				<div className="flex items-center gap-2 flex-1 md:flex-none justify-end md:justify-start">
					<div className="w-full max-w-[160px] md:max-w-none">
						<SearchInput />
					</div>
					<div className="hidden md:flex items-center gap-2">
						<ToggleSwitch />
						<GitHubStarButton starCount={134} username="ChandruMIT-o" />
					</div>
				</div>
			</header>

			{/* Main Content Area with independent scrolling */}
			<div className="flex flex-1 overflow-hidden w-full max-w-[100vw] justify-between md:px-5 md:py-2 relative">
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

				{/* Left Sidebar - Scrollable */}
				<aside 
					className={`fixed inset-y-0 left-0 z-[70] w-[280px] max-w-[85vw] bg-rb-neutral-2 border-r border-white/5 md:bg-transparent md:border-none md:relative md:w-auto h-full overflow-y-auto flex flex-col pt-4 scrollbar-none hover:scrollbar-thin scrollbar-thumb-rb-neutral-4 scrollbar-track-transparent transform transition-transform duration-300 ease-in-out ${
						isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
					}`}
				>
					<div className="flex flex-col gap-1 pb-20 px-4 md:px-0 mt-4 md:mt-0">
						<div className="flex md:hidden items-center justify-between mb-6 pb-4 border-b border-white/5">
							<span className="text-rb-accent-2 font-medium text-lg">Menu</span>
							<button 
								type="button"
								onClick={() => setIsMobileMenuOpen(false)}
								className="p-1.5 text-rb-accent-2/60 hover:text-rb-accent-1 hover:bg-white/5 rounded-md transition-colors"
							>
								<X size={20} />
							</button>
						</div>

						{/* Mobile Header Actions */}
						<div className="flex flex-col md:hidden gap-4 mb-6 pb-4 border-b border-white/5">
							<ButtonGroup
								groupId="mobile-main-nav"
								items={[
									{ id: "components", label: "Components" },
									{ id: "docs", label: "Docs" },
									{ id: "icons", label: "Icons" },
								]}
							/>
							<div className="flex items-center gap-3">
								<ToggleSwitch />
								<GitHubStarButton starCount={134} username="ChandruMIT-o" />
							</div>
						</div>

						<LeftSidebarMenu
							activeItem={activeItem}
							setActiveItem={handleSetActiveItem}
							menuSubtitle="General"
							items={generalItems}
						/>
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
					</div>
				</aside>

				{/* Center Content - Scrollable */}
				<main
					ref={scrollContainerRef}
					className="flex-1 h-full w-full overflow-y-auto px-4 md:pl-20 md:pr-10 pt-6 scrollbar-none hover:scrollbar-thin scrollbar-thumb-rb-neutral-4 scrollbar-track-transparent scroll-smooth"
				>
					<div className="max-w-4xl mx-auto pb-40">
						{children}
					</div>
				</main>

				{/* Right Sidebar - Scrollable */}
				<aside className="hidden md:block h-full overflow-y-auto pt-6 pl-4 scrollbar-none hover:scrollbar-thin scrollbar-thumb-rb-neutral-4 scrollbar-track-transparent">
					<LeftSidebarRefMenu
						items={currentSections}
						activeId={activeSection}
						onItemClick={scrollToSection}
					/>
				</aside>
			</div>
		</div>
	);
}
