"use client";
import React from "react";
import Image from "next/image";
import LeftSidebarMenu from "./components/sidebar/LeftSidebarMenu";
import ButtonGroup from "./components/buttongroup/ButtonGroup";
import LeftSidebarRefMenu from "./components/sidebar/LeftSidebarRefMenu";
import { GitHubStarButton } from "./components/buttons/GitHubStarsButton";
import ToggleSwitch from "./components/buttongroup/ToggleSwitch";
import SearchInput from "./components/buttons/SearchInput";
import InstallationTabs from "./components/tabsection/InstallationTabs";
import PreviewTab from "./components/tabsection/PreviewTab";
import HeaderText from "./components/textfields/HeaderText";
import ParagraphText from "./components/textfields/ParagraphText";
import { PropsTable } from "./components/table/PropsTable";
import { Credits } from "./components/buttongroup/Credits";
import Toggle from "./components/buttongroup/Toggle";
import DiscreteSlider from "./components/slider/DiscreteSlider";

export default function Home() {
	const [isToggled, setIsToggled] = React.useState(false);
	const [sliderValue, setSliderValue] = React.useState(30);

	return (
		<div className="flex flex-col flex-1 items-center justify-start font-sans dark:bg-background h-full">
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
				<LeftSidebarMenu />
				<div className="w-full h-full flex flex-col gap-5 p-10 pl-30">
					<HeaderText text="Installation" option={3} />
					<ParagraphText
						text="A premium collection of high-performance React components designed for modern web applications. Speed, style, and simplicity in every byte."
						option={4}
					/>
					<PreviewTab />
					<InstallationTabs />

					<div className="max-w-md w-full pt-10">
						<DiscreteSlider 
							label="Experience Level"
							min={0}
							max={100}
							step={20}
							value={sliderValue}
							onChange={setSliderValue}
						/>
					</div>

					<DocsPage />
					<SettingsPage />
					<Toggle checked={isToggled} onChange={setIsToggled} />
				</div>

				<LeftSidebarRefMenu />
			</div>
		</div>
	);
}

export const DocsPage = () => {
	const componentDocsData = [
		{
			title: "Primary Props",
			props: [
				{
					name: "variant",
					type: "string",
					defaultValue: "'default'",
					description: "Defines the visual style of the component.",
				},
				{
					name: "onAction",
					type: "event",
					required: true,
					description:
						"Callback fired when the user interacts with the primary element.",
				},
			],
		},
		{
			title: "Secondary Props",
			props: [
				{
					name: "isDisabled",
					type: "boolean",
					defaultValue: "false",
					description:
						"If true, prevents user interaction and applies muted styles.",
				},
				{
					name: "className",
					type: "string",
					description:
						"Optional CSS classes to override default styling.",
				},
			],
		},
	];

	return (
		<div className="max-w-5xl mx-auto">
			<PropsTable categories={componentDocsData} />
		</div>
	);
};

export const SettingsPage = () => {
	const creditsData = [
		{
			title: "Core Team",
			items: [
				{
					name: "Jane Doe",
					role: "Lead Engineer",
					url: "https://github.com",
				},
				{ name: "John Smith", role: "Product Designer" },
			],
		},
		{
			title: "Open Source Libraries",
			items: [
				{
					name: "React",
					role: "UI Framework",
					url: "https://react.dev",
				},
				{
					name: "Tailwind CSS",
					role: "Styling",
					url: "https://tailwindcss.com",
				},
				{
					name: "Lucide",
					role: "Iconography",
					url: "https://lucide.dev",
				},
				{
					name: "Framer Motion",
					role: "Animations",
					url: "https://framer.com/motion",
				},
			],
		},
		{
			title: "Special Thanks",
			items: [{ name: "Coffee", role: "Fueling late night commits" }],
		},
	];

	return (
		<div className="w-full max-w-5xl mx-auto py-20">
			<Credits data={creditsData} />
		</div>
	);
};
