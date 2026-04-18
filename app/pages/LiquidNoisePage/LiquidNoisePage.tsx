"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { LiquidNoise } from "../../meta/background/liquid/LiquidNoise";
import { loaderProps, creditsData } from "./LiquidNoiseData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
	{
		id: "scheme1",
		label: "Scheme 1 (Orange & Navy)",
		config: {
			title: "LIQUID GRADIENT",
			colors: ["#f15a22", "#0a0e27", "#f15a22", "#0a0e27", "#f15a22", "#0a0e27"],
			speed: 1.5,
			intensity: 1.8,
			grainIntensity: 0.08,
			gradientSize: 0.45,
			gradientCount: 12.0,
			color1Weight: 0.5,
			color2Weight: 1.8,
			darkNavy: "#0a0e27"
		},
	},
	{
		id: "scheme2",
		label: "Scheme 2 (Turquoise & Coral)",
		config: {
			title: "TROPICAL SHORES",
			colors: ["#ff6c50", "#40e0d0", "#ff6c50", "#40e0d0", "#ff6c50", "#40e0d0"],
			speed: 1.2,
			intensity: 1.8,
			grainIntensity: 0.08,
			gradientSize: 1.0,
			gradientCount: 6.0,
			color1Weight: 1.0,
			color2Weight: 1.0,
			darkNavy: "#0a0e27"
		},
	},
	{
		id: "scheme3",
		label: "Scheme 3 (Triple Blend)",
		config: {
			title: "TROPICAL NEON",
			colors: ["#f15a22", "#0a0e27", "#40e0d0", "#f15a22", "#0a0e27", "#40e0d0"],
			speed: 1.2,
			intensity: 1.8,
			grainIntensity: 0.08,
			gradientSize: 1.0,
			gradientCount: 6.0,
			color1Weight: 1.0,
			color2Weight: 1.0,
			darkNavy: "#0a0e27"
		},
	},
	{
		id: "scheme4",
		label: "Scheme 4 (Desert Mirage)",
		config: {
			title: "DESERT MIRAGE",
			colors: ["#f26633", "#2d6b6d", "#d1af9c", "#f26633", "#2d6b6d", "#d1af9c"],
			speed: 1.2,
			intensity: 1.8,
			grainIntensity: 0.08,
			gradientSize: 1.0,
			gradientCount: 6.0,
			color1Weight: 1.0,
			color2Weight: 1.0,
			darkNavy: "#ffffff"
		},
	},
	{
		id: "scheme5",
		label: "Scheme 5 (Teal Darkness)",
		config: {
			title: "TEAL DARKNESS",
			colors: ["#f15a22", "#004238", "#f15a22", "#000000", "#f15a22", "#000000"],
			speed: 1.5,
			intensity: 1.8,
			grainIntensity: 0.08,
			gradientSize: 0.45,
			gradientCount: 12.0,
			color1Weight: 0.5,
			color2Weight: 1.8,
			darkNavy: "#0a0e27"
		},
	},
];

export const LiquidNoisePage = () => {
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

	const usageCode = `<LiquidNoise
  colors={${JSON.stringify(config.colors)}}
  speed={${config.speed}}
  intensity={${config.intensity}}
  grainIntensity={${config.grainIntensity}}
  gradientSize={${config.gradientSize}}
  gradientCount={${config.gradientCount}}
  color1Weight={${config.color1Weight}}
  color2Weight={${config.color2Weight}}
  darkNavy="${config.darkNavy}"
>
  <div className="flex flex-col items-center gap-3 text-center px-6">
    <div className="text-[clamp(1.5rem,5vw,3.5rem)] font-bold tracking-[0.2em] text-white">
      ${config.title}
    </div>
  </div>
</LiquidNoise>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="liquid-noise-title">
				<HeaderText text="Liquid Noise" option={3} />
			</div>
			<ParagraphText
				text="A smooth interactive liquid gradient that merges colors and distorts based on mouse or touch interaction. Uses pure WebGL fractional brownian motion and 2D physics integration to simulate fluid dynamics."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div
							onClick={() => setKey(prev => prev + 1)}
							className="w-full h-[600px] relative overflow-hidden flex items-center justify-center bg-black border border-white/5 rounded-xl cursor-pointer group active:scale-[0.99] transition-transform"
						>
							<LiquidNoise
								key={key}
								colors={config.colors}
								speed={config.speed}
								intensity={config.intensity}
								grainIntensity={config.grainIntensity}
								gradientSize={config.gradientSize}
								gradientCount={config.gradientCount}
								color1Weight={config.color1Weight}
								color2Weight={config.color2Weight}
								darkNavy={config.darkNavy}
							>
								<div className="flex flex-col items-center gap-3 text-center px-6" style={{ pointerEvents: 'none' }}>
									<div className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold tracking-tighter text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] mix-blend-overlay">
										{config.title}
									</div>
								</div>
							</LiquidNoise>
							<div className="absolute top-4 left-4 text-[10px] text-white/50 uppercase tracking-widest font-bold pointer-events-none transition-colors z-20 mix-blend-overlay">
								Hover & Interact!
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
								<DefaultComboBox
									options={presets}
									value={presets.find(p => JSON.stringify(p.config.colors) === JSON.stringify(config.colors) && p.config.darkNavy === config.darkNavy)?.id || ""}
									onChange={applyPreset}
									dynamicWidth={true}
								/>
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
						min={0.1}
						max={3.0}
						step={0.1}
						value={config.speed}
						onChange={(val) => updateConfig("speed", val)}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Intensity"
						min={0.5}
						max={4.0}
						step={0.1}
						value={config.intensity}
						onChange={(val) => updateConfig("intensity", val)}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Grain Amount"
						min={0.0}
						max={0.3}
						step={0.01}
						value={config.grainIntensity}
						onChange={(val) => updateConfig("grainIntensity", val)}
						maxDecimals={2}
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

export default LiquidNoisePage;
