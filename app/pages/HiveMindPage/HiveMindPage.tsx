"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { HiveMind } from "../../meta/background/flowfield/HiveMind";
import { loaderProps, componentCode, creditsData } from "./HiveMindData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
	{
		id: "default",
		label: "Classic Hive",
		config: {
			count: 3000,
			noiseScale: 650,
			noiseSpeed: 0.005,
			velocity: 5,
			opacity: 0.05,
			radius: 2,
			color1: "#4b97a2",
			color2: "#e94b3c",
			backgroundColor: "#000000",
		},
	},
	{
		id: "electric",
		label: "Electric Storm",
		config: {
			count: 5000,
			noiseScale: 200,
			noiseSpeed: 0.02,
			velocity: 10,
			opacity: 0.1,
			radius: 1,
			color1: "#00f2ff",
			color2: "#7000ff",
			backgroundColor: "#050010",
		},
	},
	{
		id: "ghost",
		label: "Ghostly Flow",
		config: {
			count: 2000,
			noiseScale: 1200,
			noiseSpeed: 0.001,
			velocity: 3,
			opacity: 0.02,
			radius: 3,
			color1: "#ffffff",
			color2: "#999999",
			backgroundColor: "#111111",
		},
	},
];

export const HiveMindPage = () => {
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

	const usageCode = `<HiveMind
  count={${config.count}}
  noiseScale={${config.noiseScale}}
  noiseSpeed={${config.noiseSpeed}}
  velocity={${config.velocity}}
  opacity={${config.opacity}}
  radius={${config.radius}}
  color1="${config.color1}"
  color2="${config.color2}"
  backgroundColor="${config.backgroundColor}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="hive-mind-title">
				<HeaderText text="Hive Mind" option={3} />
			</div>
			<ParagraphText
				text="A Perlin flow field simulation where thousands of particles dance across a digital dreamscape. Guided by the unseen hand of noise, they trace paths of synchronized chaos. Click the preview to reset the simulation."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div 
							onClick={() => setKey(prev => prev + 1)}
							className="w-full h-[600px] relative overflow-hidden flex items-center justify-center bg-black border border-white/5 rounded-xl cursor-pointer group active:scale-[0.99] transition-transform"
						>
							<HiveMind
								key={key}
								{...config}
								className="absolute inset-0"
							/>
							<div className="absolute top-4 left-4 text-[10px] text-white/20 uppercase tracking-widest font-bold pointer-events-none group-hover:text-white/40 transition-colors">
								Click Background to Reset
							</div>
						</div>
					}
					onReplay={() => setKey((prev) => prev + 1)}
					usageCode={usageCode}
					codeContent={componentCode}
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
										value={presets.find(p => p.config.color1 === config.color1 && p.config.noiseScale === config.noiseScale)?.id || ""}
										onChange={applyPreset}
									/>
								</div>
							</div>
						</div>
					}
				>
					<div className="flex flex-wrap gap-4 mb-8">
						<ColorPicker
							label="Color 1"
							value={config.color1}
							onChange={(val) => updateConfig("color1", val)}
							compact={true}
						/>
						<ColorPicker
							label="Color 2"
							value={config.color2}
							onChange={(val) => updateConfig("color2", val)}
							compact={true}
						/>
						<ColorPicker
							label="Background"
							value={config.backgroundColor}
							onChange={(val) => updateConfig("backgroundColor", val)}
							compact={true}
						/>
					</div>


					<DiscreteSlider
						label="Particle Count"
						min={100}
						max={15000}
						step={100}
						value={config.count}
						onChange={(val) => updateConfig("count", val)}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Noise Scale"
						min={10}
						max={3000}
						step={10}
						value={config.noiseScale}
						onChange={(val) => updateConfig("noiseScale", val)}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Noise Speed"
						min={0}
						max={0.1}
						step={0.001}
						value={config.noiseSpeed}
						onChange={(val) => updateConfig("noiseSpeed", val)}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Velocity"
						min={0.1}
						max={30}
						step={0.1}
						value={config.velocity}
						onChange={(val) => updateConfig("velocity", val)}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Tail Intensity"
						min={0.001}
						max={0.5}
						step={0.001}
						value={config.opacity}
						onChange={(val) => updateConfig("opacity", val)}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Particle Radius"
						min={0.1}
						max={15}
						step={0.1}
						value={config.radius}
						onChange={(val) => updateConfig("radius", val)}
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

export default HiveMindPage;
