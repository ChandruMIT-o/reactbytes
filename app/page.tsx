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

export default function Home() {
	const [activeItem, setActiveItem] = React.useState("install");

	return (
		<div className="flex flex-col flex-1 items-center justify-start font-sans bg-background h-full">
			<div className="flex items-center justify-between w-full max-w-[100vw] p-5">
				<div className="flex items-center gap-2">
					<Image src="/logo.svg" alt="Logo" width={19} height={30} />
					<div className="text-[16px] text-rb-accent-2 font-medium tracking-tight">
						React Bytes
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
			</div>

			<div className="flex items-start w-full max-w-[100vw] justify-between gap-5 px-5">
				<LeftSidebarMenu
					activeItem={activeItem}
					setActiveItem={setActiveItem}
				/>

				<div className="w-full h-full flex flex-col gap-5 p-10 pl-30">
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

				<LeftSidebarRefMenu />
			</div>
		</div>
	);
}
