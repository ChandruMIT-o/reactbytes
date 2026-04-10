"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import FractalBackground from "../../meta/background/fractal/FractalBackground";
import { fractalProps, componentCode, creditsData } from "./FractalBackgroundData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { Credits } from "../../components/buttongroup/Credits";
import Toggle from "../../components/buttongroup/Toggle";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";


const presets = [
	{
		id: "deep-sea",
		label: "Deep Sea",
		config: {
			title: "OCEANIC DEPTH",
			colorStart: "#050815",
			colorEnd: "#204080",
			speed: 0.15,
			zoom: 2.8,
			intensity: 1.0,
			morphRange: 0.1,
			enableParallax: true,
		},
	},
	{
		id: "nebula",
		label: "Cosmic Nebula",
		config: {
			title: "SPACE HORIZON",
			colorStart: "#0A0215",
			colorEnd: "#802060",
			speed: 0.1,
			zoom: 2.5,
			intensity: 1.2,
			morphRange: 0.15,
			enableParallax: true,
		},
	},
	{
		id: "emerald",
		label: "Emerald Light",
		config: {
			title: "CRYSTAL BIOME",
			colorStart: "#021208",
			colorEnd: "#208040",
			speed: 0.08,
			zoom: 3.2,
			intensity: 0.9,
			morphRange: 0.05,
			enableParallax: false,
		},
	},
	{
		id: "supernova",
		label: "Supernova",
		config: {
			title: "CORE COLLAPSE",
			colorStart: "#150802",
			colorEnd: "#CC6633",
			speed: 0.3,
			zoom: 1.8,
			intensity: 1.5,
			morphRange: 0.2,
			enableParallax: true,
		},
	},
    {
		id: "neon-cyber",
		label: "Neon Cyber",
		config: {
			title: "CYBERPUNK CITY",
			colorStart: "#1A0033",
			colorEnd: "#FF00FF",
			speed: 0.2,
			zoom: 3.5,
			intensity: 1.3,
			morphRange: 0.12,
			enableParallax: true,
		},
	},
    {
		id: "frozen-glace",
		label: "Frozen Glace",
		config: {
			title: "ARCTIC CHILL",
			colorStart: "#001A33",
			colorEnd: "#99FFFF",
			speed: 0.05,
			zoom: 4.5,
			intensity: 0.8,
			morphRange: 0.02,
			enableParallax: true,
		},
	},
    {
		id: "blood-moon",
		label: "Blood Moon",
		config: {
			title: "LUNAR ECLIPSE",
			colorStart: "#1A0000",
			colorEnd: "#FF3300",
			speed: 0.25,
			zoom: 2.2,
			intensity: 1.4,
			morphRange: 0.18,
			enableParallax: true,
		},
	},
    {
		id: "golden-artifact",
		label: "Golden Artifact",
		config: {
			title: "ANCIENT GOLD",
			colorStart: "#261A00",
			colorEnd: "#FFD700",
			speed: 0.1,
			zoom: 3.0,
			intensity: 1.1,
			morphRange: 0.08,
			enableParallax: true,
		},
	},
    {
		id: "phantom-grey",
		label: "Phantom Grey",
		config: {
			title: "GHOST DIMENSION",
			colorStart: "#0D0D0D",
			colorEnd: "#CCCCCC",
			speed: 0.03,
			zoom: 2.8,
			intensity: 0.7,
			morphRange: 0.01,
			enableParallax: false,
		},
	},
];

export const FractalBackgroundPage = () => {
	const defaultPreset = presets[0];

    const [currentPreset, setCurrentPreset] = useState(defaultPreset.id);
	const [title, setTitle] = useState(defaultPreset.config.title);
	const [colorStart, setColorStart] = useState(defaultPreset.config.colorStart);
	const [colorEnd, setColorEnd] = useState(defaultPreset.config.colorEnd);
	const [speed, setSpeed] = useState(defaultPreset.config.speed);
	const [zoom, setZoom] = useState(defaultPreset.config.zoom);
	const [intensity, setIntensity] = useState(defaultPreset.config.intensity);
	const [morphRange, setMorphRange] = useState(defaultPreset.config.morphRange);
	const [enableParallax, setEnableParallax] = useState(defaultPreset.config.enableParallax);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (!preset) return;
        setCurrentPreset(presetId);
		setTitle(preset.config.title);
		setColorStart(preset.config.colorStart);
		setColorEnd(preset.config.colorEnd);
		setSpeed(preset.config.speed);
		setZoom(preset.config.zoom);
		setIntensity(preset.config.intensity);
		setMorphRange(preset.config.morphRange);
		setEnableParallax(preset.config.enableParallax);
	};

	const handleReset = () => applyPreset(defaultPreset.id);

	const usageCode = `<FractalBackground
  colorStart="${colorStart}"
  colorEnd="${colorEnd}"
  speed={${speed}}
  zoom={${zoom}}
  intensity={${intensity}}
  morphRange={${morphRange}}
  enableParallax={${enableParallax}}
>
  <h1 className="text-white font-bold">{title}</h1>
</FractalBackground>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="fractal-title">
				<HeaderText text="Fractal Background" option={3} />
			</div>
			<ParagraphText
				text="A high-performance WebGL Julia Set fractal background. GPU-accelerated morphing, smooth interactive parallax, and cinematic post-processing effects."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[560px] rounded-[28px] overflow-hidden border border-white/10 bg-black shadow-2xl relative">
							<FractalBackground
								colorStart={colorStart}
								colorEnd={colorEnd}
								speed={speed}
								zoom={zoom}
								intensity={intensity}
								morphRange={morphRange}
								enableParallax={enableParallax}
							>
								<div className="flex flex-col items-center gap-3 text-center px-6">
									<div className="text-[clamp(2rem,6vw,4rem)] font-bold tracking-tight text-white">
										{title}
									</div>
									<div className="max-w-lg text-white/70 text-sm md:text-base">
										Mathematical precision meets cinematic aesthetics. Fully controllable via GPU shaders.
									</div>
								</div>
							</FractalBackground>
						</div>
					}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between border-b border-rb-neutral-4/50">
							<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">Props</h3>
							<div className="flex items-center gap-3">
                                <div className="w-[190px]">
                                    <DefaultComboBox
                                        options={presets}
                                        value={currentPreset}
                                        onChange={applyPreset}
                                    />
                                </div>
								<button 
                                    onClick={handleReset} 
                                    className="group p-2.5 rounded-full bg-rb-neutral-3 text-rb-accent-1/40 border border-rb-neutral-4 hover:text-rb-accent-3 transition-all duration-300"
                                    title="Reset to Defaults"
                                >
									<RotateCcw 
                                        size={16} 
                                        className="group-hover:rotate-[-90deg] transition-transform duration-500"
                                    />
								</button>
							</div>
						</div>
					}
				>
					<TextInput
						label="Hero Text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Enter text..."
					/>

					<DiscreteSlider
						label="Zoom"
						min={1.0}
						max={5.0}
						step={0.1}
						value={zoom}
						onChange={setZoom}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Animation Speed"
						min={0}
						max={1.0}
						step={0.01}
						value={speed}
						onChange={setSpeed}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Morph Intensity"
						min={0}
						max={0.5}
						step={0.01}
						value={morphRange}
						onChange={setMorphRange}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Brightness"
						min={0.5}
						max={2.0}
						step={0.1}
						value={intensity}
						onChange={setIntensity}
						maxDecimals={2}
						showTicks={false}
					/>

					<div className="flex items-center justify-between py-2 border-b border-rb-neutral-4/30">
						<span className="text-rb-accent-1/70 text-sm font-medium">Enable Parallax</span>
						<Toggle checked={enableParallax} onChange={setEnableParallax} />
					</div>

					<ColorPicker
						label="Base Color"
						value={colorStart}
						onChange={setColorStart}
						compact={true}
						presets={["#050815", "#0A0215", "#021208", "#150802", "#1A0033", "#001A33", "#1A0000", "#261A00", "#0D0D0D"]}
					/>

					<ColorPicker
						label="Glow Color"
						value={colorEnd}
						onChange={setColorEnd}
						compact={true}
						presets={["#204080", "#802060", "#208040", "#CC6633", "#FF00FF", "#99FFFF", "#FF3300", "#FFD700", "#CCCCCC"]}
					/>
				</PreviewTab>
			</div>

			<div id="installation-tabs">
				<InstallationTabs />
			</div>

			<div id="api-reference" className="flex flex-col gap-5">
				<HeaderText text="API Reference" option={6} />
				<PropsTable categories={fractalProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default FractalBackgroundPage;
