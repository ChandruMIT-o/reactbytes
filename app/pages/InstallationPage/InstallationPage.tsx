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
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import FractalBackground from "@/app/meta/background/fractal/FractalBackground";

export const InstallationPage = () => {
	const [sliderValue, setSliderValue] = React.useState(30);
	const [isToggled, setIsToggled] = React.useState(false);

	return (
		<div className="flex flex-col gap-5">
			<div id="installation-title">
				<HeaderText text="Installation" option={3} />
			</div>
			<ParagraphText
				text="A premium collection of high-performance React components designed for modern web applications. Speed, style, and simplicity in every byte."
				option={4}
			/>

			<PreviewTab
				previewContent={
					// <div className="flex flex-col items-center gap-4">
					// 	<Image src="/logo.svg" alt="Logo" width={40} height={60} />
					// 	<div className="text-2xl text-rb-accent-2 font-bold">React Bytes</div>
					// </div>
					<section className="relative w-full h-screen overflow-hidden bg-black">

						<FractalBackground
							// Optional: Customize the morphing speed
							speed={0.15}

							// Optional: Pass normalized RGB values (0.0 to 1.0)
							// Let's use a premium dark violet/magenta theme
							colorStart={[0.05, 0.02, 0.08]}
							colorEnd={[0.3, 0.1, 0.4]}

							className="absolute inset-0"
						>
							{/* Anything placed inside here will automatically be centered 
                  and layered securely on top of the WebGL canvas.
                */}
							<div className="flex flex-col items-center justify-center text-center px-4">
								<h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-lg">
									The Future of Web Design
								</h1>
								<p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 drop-shadow">
									Experience mathematically perfect, GPU-accelerated backgrounds
									that won't compromise your website's performance.
								</p>
								<button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full backdrop-blur-md transition-all duration-300 font-medium">
									Get Started
								</button>
							</div>
						</FractalBackground>

					</section>
				}
				codeContent="npm install react-bytes"
			/>

			<div id="installation-tabs">
				<InstallationTabs />
			</div>

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

			<div id="api-reference" className="max-w-5xl mx-auto py-10 w-full">
				<HeaderText text="API Reference" option={4} />
				<PropsTable categories={componentDocsData} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>

			<div className="flex items-center gap-4 py-5">
				<span className="text-rb-accent-2 font-medium">Example Toggle:</span>
				<Toggle checked={isToggled} onChange={setIsToggled} />
			</div>
			<ColorPicker />
		</div>
	);
};

export default InstallationPage;
