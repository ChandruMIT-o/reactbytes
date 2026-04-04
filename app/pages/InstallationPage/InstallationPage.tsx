import React from "react";
import Image from "next/image";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import DiscreteSlider from "../../components/slider/DiscreteSlider";
import { PropsTable } from "../../components/table/PropsTable";
import { Credits } from "../../components/buttongroup/Credits";
import Toggle from "../../components/buttongroup/Toggle";
import { componentDocsData, creditsData } from "./InstallationData";

export const InstallationPage = () => {
	const [sliderValue, setSliderValue] = React.useState(30);
	const [isToggled, setIsToggled] = React.useState(false);

	return (
		<div className="flex flex-col gap-5">
			<HeaderText text="Installation" option={3} />
			<ParagraphText
				text="A premium collection of high-performance React components designed for modern web applications. Speed, style, and simplicity in every byte."
				option={4}
			/>
			
			<PreviewTab 
				previewContent={
					<div className="flex flex-col items-center gap-4">
						<Image src="/logo.svg" alt="Logo" width={40} height={60} />
						<div className="text-2xl text-rb-accent-2 font-bold">React Bytes</div>
					</div>
				}
				codeContent="npm install react-bytes"
			/>

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

			<div className="max-w-5xl mx-auto py-10 w-full">
				<HeaderText text="API Reference" option={4} />
				<PropsTable categories={componentDocsData} />
			</div>

			<div className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>

			<div className="flex items-center gap-4 py-5">
				<span className="text-rb-accent-2 font-medium">Example Toggle:</span>
				<Toggle checked={isToggled} onChange={setIsToggled} />
			</div>
		</div>
	);
};

export default InstallationPage;
