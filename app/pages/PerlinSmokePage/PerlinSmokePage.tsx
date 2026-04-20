"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { PerlinSmoke } from "../../meta/background/gradient/PerlinSmoke";
import { loaderProps, creditsData } from "./PerlinSmokeData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
	{
		id: "balanced",
		label: "Balanced",
		config: {
			baseColor: "#1e1e1e",
			speed: 0.08,
			turbulence: 0.5,
			milk: 0.4,
			eco: true,
			maxFPS: 50,
			mouseInteraction: 0.5,
		},
	},
	{
		id: "high",
		label: "High Performance",
		config: {
			baseColor: "#321e46",
			speed: 0.12,
			turbulence: 0.7,
			milk: 0.5,
			eco: false,
			maxFPS: 60,
			mouseInteraction: 0.8,
		},
	},
	{
		id: "eco",
		label: "Eco Friendly",
		config: {
			baseColor: "#000000",
			speed: 0.04,
			turbulence: 0.3,
			milk: 0.2,
			eco: true,
			maxFPS: 45,
			mouseInteraction: 0.3,
		},
	},
];

export const PerlinSmokePage = () => {
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

	const usageCode = `<PerlinSmoke
  baseColor="${config.baseColor}"
  speed={${config.speed}}
  turbulence={${config.turbulence}}
  milk={${config.milk}}
  eco={${config.eco}}
  maxFPS={${config.maxFPS}}
  mouseInteraction={${config.mouseInteraction}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="perlin-smoke-title">
				<HeaderText text="Perlin Smoke" option={3} />
			</div>
			<ParagraphText
				text="A smooth, flowing WebGL background that uses domain warping and fractional brownian motion to simulate shifting smoke. It includes performance auto-scaling via an eco mode, and reacts dynamically to mouse movement."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div
							onClick={() => setKey(prev => prev + 1)}
							className="w-full h-[600px] relative overflow-hidden flex items-center justify-center bg-black border border-white/5 rounded-xl cursor-pointer group active:scale-[0.99] transition-transform"
						>
							<PerlinSmoke
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
					codeContent={"" /* To be populated with raw component string if needed */}
					collapsible={true}
					header={
						<div className="flex items-center justify-between border-b border-rb-neutral-4/50">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Props
								</h3>
							</div>
							<DefaultComboBox
								options={presets}
								value={presets.find(p => p.config.baseColor === config.baseColor && p.config.speed === config.speed)?.id || ""}
								onChange={applyPreset}
								dynamicWidth={true}
							/>
							<div className="flex items-center gap-3">

							</div>
						</div>
					}
				>
					<div className="flex flex-wrap gap-4 mb-4">
						<ColorPicker
							label="Base Color"
							value={config.baseColor}
							onChange={(val) => updateConfig("baseColor", val)}
							compact={true}
						/>
					</div>

					<DiscreteSlider
						label="Speed"
						min={0}
						max={0.2}
						step={0.01}
						value={config.speed}
						onChange={(val) => updateConfig("speed", val)}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Turbulence"
						min={0}
						max={1}
						step={0.01}
						value={config.turbulence}
						onChange={(val) => updateConfig("turbulence", val)}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Milkiness"
						min={0}
						max={1}
						step={0.01}
						value={config.milk}
						onChange={(val) => updateConfig("milk", val)}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Mouse Interaction"
						min={0}
						max={2}
						step={0.1}
						value={config.mouseInteraction}
						onChange={(val) => updateConfig("mouseInteraction", val)}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Max FPS"
						min={30}
						max={120}
						step={1}
						value={config.maxFPS}
						onChange={(val) => updateConfig("maxFPS", val)}
						maxDecimals={0}
						showTicks={false}
					/>

					<div className="flex items-center gap-3 mt-4 ml-4">
						<label className="text-sm text-rb-accent-1 font-medium">Eco Mode</label>
						<input
							type="checkbox"
							checked={config.eco}
							onChange={(e) => updateConfig("eco", e.target.checked)}
							className="accent-rb-accent-1 h-4 w-4"
						/>
					</div>
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

export default PerlinSmokePage;
