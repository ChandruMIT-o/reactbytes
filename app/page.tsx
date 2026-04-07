"use client";
import React from "react";
import Image from "next/image";
import LeftSidebarMenu from "./components/sidebar/LeftSidebarMenu";
import ButtonGroup from "./components/buttongroup/ButtonGroup";
import LeftSidebarRefMenu from "./components/sidebar/LeftSidebarRefMenu";
import { GitHubStarButton } from "./components/buttons/GitHubStarsButton";
import ToggleSwitch from "./components/buttongroup/ToggleSwitch";
import SearchInput from "./components/buttons/SearchInput";
import HeaderText from "./components/textfields/HeaderText";
import ParagraphText from "./components/textfields/ParagraphText";

// Modularized Page Components
import { InstallationPage } from "./pages/InstallationPage/InstallationPage";
import { BlurTextPage } from "./pages/BlurTextPage/BlurTextPage";
import { MagneticDotMeshPage } from "./pages/MagneticDotMeshPage/MagneticDotMeshPage";
import { FallDownPage } from "./pages/FallDownPage/FallDownPage";
import { BlurInPage } from "./pages/BlurInPage/BlurInPage";
import { RevealUnderPage } from "./pages/RevealUnderPage/RevealUnderPage";
import VariableWeightTextPage from "./pages/VariableWeightTextPage/VariableWeightTextPage";

const generalItems = [
	{ id: "intro", label: "Introduction" },
	{ id: "install", label: "Installation" },
	{ id: "a11y", label: "Accessibility" },
	{ id: "mcp", label: "MCP" },
	{ id: "troubleshoot", label: "Troubleshooting" },
	{ id: "changelog", label: "Changelog" },
];

const textItems = [
	{ id: "blur-text", label: "Blur Text" },
	{ id: "fall-down", label: "Fall Down" },
	{ id: "blur-in", label: "Blur In" },
	{ id: "reveal-under", label: "Reveal Under" },
	{ id: "variable-weight", label: "Variable Weight" },
];

const backgroundItems = [{ id: "magnetic-dots", label: "Magnetic Dot Mesh" }];

export default function Home() {
	const [activeItem, setActiveItem] = React.useState("install");
	const [activeSection, setActiveSection] = React.useState<string>("");
	const scrollContainerRef = React.useRef<HTMLElement>(null);

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
	};

	const currentSections = pageSections[activeItem] || [];

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

	return (
		<div className="flex flex-col h-screen overflow-hidden font-sans bg-background text-foreground transition-colors duration-500">
			{/* Fixed Header */}
			<header className="flex items-center justify-between w-full px-8 py-4 border-b border-white/5 bg-background/80 backdrop-blur-md z-50 flex-shrink-0">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 group cursor-pointer">
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
						<div className="text-[16px] text-rb-accent-2 font-medium tracking-tight">
							React Bytes
						</div>
					</div>
					<ButtonGroup
						groupId="main-nav"
						items={[
							{ id: "components", label: "Components" },
							{ id: "docs", label: "Docs" },
							{ id: "icons", label: "Icons" },
						]}
					/>
				</div>
				<div className="flex items-center gap-2">
					<SearchInput />
					<ToggleSwitch />
					<GitHubStarButton starCount={134} username="ChandruMIT-o" />
				</div>
			</header>

			{/* Main Content Area with independent scrolling */}
			<div className="flex flex-1 overflow-hidden w-full max-w-[100vw] justify-between px-5 py-2">
				{/* Left Sidebar - Scrollable */}
				<aside className="h-full overflow-y-auto flex flex-col pt-4 pr-2 scrollbar-none hover:scrollbar-thin scrollbar-thumb-rb-neutral-4 scrollbar-track-transparent">
					<div className="flex flex-col gap-1 pb-20">
						<LeftSidebarMenu
							activeItem={activeItem}
							setActiveItem={setActiveItem}
							menuSubtitle="General"
							items={generalItems}
						/>
						<LeftSidebarMenu
							activeItem={activeItem}
							setActiveItem={setActiveItem}
							menuSubtitle="Text"
							items={textItems}
						/>
						<LeftSidebarMenu
							activeItem={activeItem}
							setActiveItem={setActiveItem}
							menuSubtitle="Background"
							items={backgroundItems}
						/>
					</div>
				</aside>

				{/* Center Content - Scrollable */}
				<main
					ref={scrollContainerRef}
					className="flex-1 h-full overflow-y-auto pl-20 pr-10 pt-6 scrollbar-none hover:scrollbar-thin scrollbar-thumb-rb-neutral-4 scrollbar-track-transparent scroll-smooth"
				>
					<div className="max-w-4xl mx-auto pb-40">
						{activeItem === "install" ? (
							<InstallationPage />
						) : activeItem === "blur-text" ? (
							<BlurTextPage />
						) : activeItem === "magnetic-dots" ? (
							<MagneticDotMeshPage />
						) : activeItem === "fall-down" ? (
							<FallDownPage />
						) : activeItem === "blur-in" ? (
							<BlurInPage />
						) : activeItem === "reveal-under" ? (
							<RevealUnderPage />
						) : activeItem === "variable-weight" ? (
							<VariableWeightTextPage />
						) : (
							<div className="flex flex-col gap-5">
								<HeaderText
									text={
										activeItem.charAt(0).toUpperCase() +
										activeItem.slice(1)
									}
									option={3}
								/>
								<ParagraphText
									text="Content for this section is coming soon."
									option={4}
								/>
							</div>
						)}
					</div>
				</main>

				{/* Right Sidebar - Scrollable */}
				<aside className="h-full overflow-y-auto pt-6 pl-4 scrollbar-none hover:scrollbar-thin scrollbar-thumb-rb-neutral-4 scrollbar-track-transparent">
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
