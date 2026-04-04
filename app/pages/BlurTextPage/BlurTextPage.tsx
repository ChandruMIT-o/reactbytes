import React from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { BlurText } from "../../meta/text/BlurText/BlurText";
import { loaderProps, componentCode } from "./BlurTextData";

export const BlurTextPage = () => {
	return (
		<div className="flex flex-col gap-5">
			<HeaderText text="Blur Text" option={3} />
			<ParagraphText
				text="A smooth, stagger-animated text loader with dynamic blur effects. Fully customizable timing, blur intensity, and colors."
				option={4}
			/>
			
			<PreviewTab 
				previewContent={
					<div className="w-full h-[300px] relative overflow-hidden">
						<BlurText 
							isOverlay={false} 
							text="REACT BYTES" 
							textColorClass="text-rb-accent-2"
							textClassName="text-5xl font-bold tracking-[0.2em]"
						/>
					</div>
				}
				codeContent={componentCode}
			/>

			<InstallationTabs />
			
			<div className="pt-10">
				<HeaderText text="API Reference" option={4} />
				<PropsTable categories={loaderProps} />
			</div>
		</div>
	);
};

export default BlurTextPage;
