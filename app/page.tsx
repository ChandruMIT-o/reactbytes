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

export default function Home() {
	return (
		<div className="flex flex-col flex-1 items-center justify-start font-sans dark:bg-background h-full">
			<div className="flex items-center justify-between w-full max-w-[100vw] p-5">
				<div className="flex items-center gap-2">
					<Image src="/logo.svg" alt="Logo" width={19} height={30} />
					<div className="text-[16px] text-[#E6DFF1] font-medium tracking-tight">
						React Bytes
					</div>
					<ButtonGroup />
				</div>
				<div className="flex items-center gap-2">
					<SearchInput />
					<ToggleSwitch />

					<GitHubStarButton starCount={134} username="ChandruMIT-o" />
				</div>
			</div>
			<div className="flex items-start w-full max-w-[100vw] justify-between gap-5 px-5">
				<LeftSidebarMenu />
				<div className="w-full h-full flex flex-col gap-1 p-10 pl-30">
					<HeaderText text="Installation" option={3} />
					<ParagraphText
						text="A premium collection of high-performance React components designed for modern web applications. Speed, style, and simplicity in every byte."
						option={4}
					/>
					<InstallationTabs />
					<PreviewTab />
				</div>
				<LeftSidebarRefMenu />
			</div>
		</div>
	);
}
