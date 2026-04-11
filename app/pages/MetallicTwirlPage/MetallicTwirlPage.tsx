"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { MetallicTwirl } from "../../meta/background/metallic/MetallicTwirl";
import { loaderProps, creditsData } from "./MetallicTwirlData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
	{
		id: "classic",
		label: "Classic Metallic",
		config: {
			title: "METALLIC",
			speed: 0.2,
			zoom: 15.0,
			symmetry: 18.0,
			amplitude: 1.9,
		},
	},
	{
		id: "copper",
		label: "Copper Coils",
		config: {
			title: "COILS",
			speed: 0.1,
			zoom: 20.0,
			symmetry: 24.0,
			amplitude: 3.5,
		},
	},
	{
		id: "hyperspace",
		label: "Hyperspace Rift",
		config: {
			title: "RIFT",
			speed: 1.0,
			zoom: 5.0,
			symmetry: 4.0,
			amplitude: 1.0,
		},
	},
	{
		id: "mandala",
		label: "Chrome Mandala",
		config: {
			title: "MANDALA",
			speed: 0.05,
			zoom: 30.0,
			symmetry: 36.0,
			amplitude: 2.2,
		},
	},
	{
		id: "liquid-prism",
		label: "Liquid Prism",
		config: {
			title: "PRISM",
			speed: 0.4,
			zoom: 10.0,
			symmetry: 8.0,
			amplitude: 0.8,
		},
	},
];

export const MetallicTwirlPage = () => {
	const [config, setConfig] = useState(presets[0].config);
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setConfig(preset.config);
			setKey((prev) => prev + 1);
		}
	};

	const updateConfig = (key: string, value: any) => {
		setConfig((prev) => ({ ...prev, [key]: value }));
	};

	const usageCode = `<MetallicTwirl
  speed={${config.speed}}
  zoom={${config.zoom}}
  symmetry={${config.symmetry}}
  amplitude={${config.amplitude}}
>
  <div className="flex flex-col items-center gap-3 text-center px-6">
    <div className="text-[clamp(1.5rem,5vw,3.5rem)] font-bold tracking-[0.2em] text-white">
      ${config.title}
    </div>
  </div>
</MetallicTwirl>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="metallic-twirl-title">
				<HeaderText text="Metallic Twirl" option={3} />
			</div>
			<ParagraphText
				text="A smooth kaleidoscopic WebGL background that produces mesmerizing fractal arrays. By customizing the zoom, temporal flow, and symmetry axes, you can construct vivid displays from intricate mandalas to liquid hyperspace rifts."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div 
							onClick={() => setKey(prev => prev + 1)}
							className="w-full h-[600px] relative overflow-hidden flex items-center justify-center bg-black border border-white/5 rounded-xl cursor-pointer group active:scale-[0.99] transition-transform"
						>
							<MetallicTwirl
								key={key}
								speed={config.speed}
                                zoom={config.zoom}
                                symmetry={config.symmetry}
                                amplitude={config.amplitude}
							>
                                <div className="flex flex-col items-center gap-3 text-center px-6">
                                    <div className="text-[clamp(1.5rem,5vw,3.5rem)] font-bold tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                                        {config.title}
                                    </div>
                                    <div className="max-w-lg text-white/80 text-xs md:text-sm tracking-widest uppercase bg-black/40 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/20 shadow-lg">
                                        Twisted Dimensions
                                    </div>
                                </div>
                            </MetallicTwirl>
							<div className="absolute top-4 left-4 text-[10px] text-white/20 uppercase tracking-widest font-bold pointer-events-none group-hover:text-white/40 transition-colors z-20">
								Click Render to Reset
							</div>
						</div>
					}
					onReplay={() => setKey((prev) => prev + 1)}
					usageCode={usageCode}
					codeContent={""}
					collapsible={true}
					header={
						<div className="flex items-center justify-between border-b border-rb-neutral-4/50">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Props
								</h3>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-[180px]">
									<DefaultComboBox
										options={presets}
										value={presets.find(p => p.config.symmetry === config.symmetry && p.config.zoom === config.zoom)?.id || ""}
										onChange={applyPreset}
									/>
								</div>
							</div>
						</div>
					}
				>
					<TextInput
						label="Center Text"
						value={config.title}
						onChange={(e) => updateConfig("title", e.target.value)}
						placeholder="Enter text..."
					/>

					<DiscreteSlider
						label="Speed"
						min={0.01}
						max={2.0}
						step={0.01}
						value={config.speed}
						onChange={(val) => updateConfig("speed", val)}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Zoom Scale"
						min={1.0}
						max={40.0}
						step={1.0}
						value={config.zoom}
						onChange={(val) => updateConfig("zoom", val)}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Symmetry"
						min={2.0}
						max={50.0}
						step={1.0}
						value={config.symmetry}
						onChange={(val) => updateConfig("symmetry", val)}
						maxDecimals={0}
						showTicks={false}
					/>

                    <DiscreteSlider
						label="Amplitude"
						min={0.1}
						max={5.0}
						step={0.1}
						value={config.amplitude}
						onChange={(val) => updateConfig("amplitude", val)}
						maxDecimals={1}
						showTicks={false}
					/>
				</PreviewTab>
			</div>

			<div id="installation-tabs">
				<InstallationTabs />
			</div>

			<div id="api-reference" className="flex flex-col gap-5">
				<HeaderText text="API Reference" option={6} />
				<PropsTable categories={loaderProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default MetallicTwirlPage;
