"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { BubbleGradient } from "../../meta/background/gradient/BubbleGradient";
import { loaderProps, componentCode, creditsData } from "./BubbleGradientData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { DefaultTextInput } from "../../components/textinput/DefaultTextInput";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const blendModeOptions = [
	{
		id: "screen",
		label: "Screen",
		description: "Brightest and cleanest for dark surfaces.",
	},
	{
		id: "soft-light",
		label: "Soft Light",
		description: "Lower-contrast and moodier.",
	},
	{
		id: "hard-light",
		label: "Hard Light",
		description: "Sharper and more metallic.",
	},
	{
		id: "lighten",
		label: "Lighten",
		description: "Simple light-on-dark compositing.",
	},
];

const presets = [
	{
		id: "graphite",
		label: "Graphite Mist",
		config: {
			title: "NOIR BUBBLES",
			uppercase: true,
			backgroundStart: "#040507",
			backgroundEnd: "#171B21",
			bubbleColors: ["#F4F4F5", "#D5D9E0", "#9FA7B2", "#5D6670", "#242A31"],
			interactiveColor: "#FFFFFF",
			circleSize: 78,
			blurStrength: 42,
			gooBlur: 10,
			gooStrength: 18,
			bubbleOpacity: 0.82,
			interactiveOpacity: 0.72,
			interactiveRadius: 280,
			speedMultiplier: 1,
			blendMode: "screen",
			contrast: 118,
			brightness: 94,
			saturation: 72,
			noiseOpacity: 0.08,
			vignetteOpacity: 0.28,
		},
	},
	{
		id: "smoke",
		label: "Smoked Chrome",
		config: {
			title: "LIQUID STEEL",
			backgroundStart: "#07080B",
			backgroundEnd: "#20242B",
			bubbleColors: ["#F7F9FB", "#C8D0DB", "#8E97A2", "#4C545E", "#1B1F25"],
			interactiveColor: "#DCE6F2",
			circleSize: 84,
			blurStrength: 48,
			gooBlur: 12,
			gooStrength: 20,
			bubbleOpacity: 0.9,
			interactiveOpacity: 0.62,
			interactiveRadius: 320,
			speedMultiplier: 0.85,
			blendMode: "soft-light",
			contrast: 122,
			brightness: 88,
			saturation: 56,
			noiseOpacity: 0.12,
			vignetteOpacity: 0.34,
		},
	},
	{
		id: "ash",
		label: "Ash Bloom",
		config: {
			title: "SILENT DEPTH",
			backgroundStart: "#050608",
			backgroundEnd: "#12161C",
			bubbleColors: ["#EDEEF1", "#B8C0CB", "#767F8B", "#434A54", "#20242C"],
			interactiveColor: "#C9D3DE",
			circleSize: 72,
			blurStrength: 36,
			gooBlur: 9,
			gooStrength: 17,
			bubbleOpacity: 0.78,
			interactiveOpacity: 0.55,
			interactiveRadius: 250,
			speedMultiplier: 1.15,
			blendMode: "lighten",
			contrast: 112,
			brightness: 98,
			saturation: 64,
			noiseOpacity: 0.06,
			vignetteOpacity: 0.22,
		},
	},
];

const colorLabels = [
	"Bubble 01",
	"Bubble 02",
	"Bubble 03",
	"Bubble 04",
	"Bubble 05",
];

export const BubbleGradientPage = () => {
	const defaultPreset = presets[0];

	const [currentPreset, setCurrentPreset] = useState(defaultPreset.id);
	const [title, setTitle] = useState(defaultPreset.config.title);
	const [uppercase, setUppercase] = useState(defaultPreset.config.uppercase ?? true);
	const [backgroundStart, setBackgroundStart] = useState(
		defaultPreset.config.backgroundStart,
	);
	const [backgroundEnd, setBackgroundEnd] = useState(
		defaultPreset.config.backgroundEnd,
	);
	const [bubbleColors, setBubbleColors] = useState(
		defaultPreset.config.bubbleColors,
	);
	const [interactiveColor, setInteractiveColor] = useState(
		defaultPreset.config.interactiveColor,
	);
	const [circleSize, setCircleSize] = useState(defaultPreset.config.circleSize);
	const [blurStrength, setBlurStrength] = useState(
		defaultPreset.config.blurStrength,
	);
	const [gooBlur, setGooBlur] = useState(defaultPreset.config.gooBlur);
	const [gooStrength, setGooStrength] = useState(
		defaultPreset.config.gooStrength,
	);
	const [bubbleOpacity, setBubbleOpacity] = useState(
		defaultPreset.config.bubbleOpacity,
	);
	const [interactiveOpacity, setInteractiveOpacity] = useState(
		defaultPreset.config.interactiveOpacity,
	);
	const [interactiveRadius, setInteractiveRadius] = useState(
		defaultPreset.config.interactiveRadius,
	);
	const [speedMultiplier, setSpeedMultiplier] = useState(
		defaultPreset.config.speedMultiplier,
	);
	const [blendMode, setBlendMode] = useState(defaultPreset.config.blendMode);
	const [contrast, setContrast] = useState(defaultPreset.config.contrast);
	const [brightness, setBrightness] = useState(defaultPreset.config.brightness);
	const [saturation, setSaturation] = useState(defaultPreset.config.saturation);
	const [noiseOpacity, setNoiseOpacity] = useState(
		defaultPreset.config.noiseOpacity,
	);
	const [vignetteOpacity, setVignetteOpacity] = useState(
		defaultPreset.config.vignetteOpacity,
	);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((item) => item.id === presetId);
		if (!preset) return;

		setCurrentPreset(presetId);
		setTitle(preset.config.title);
		setUppercase(preset.config.uppercase ?? true);
		setBackgroundStart(preset.config.backgroundStart);
		setBackgroundEnd(preset.config.backgroundEnd);
		setBubbleColors(preset.config.bubbleColors);
		setInteractiveColor(preset.config.interactiveColor);
		setCircleSize(preset.config.circleSize);
		setBlurStrength(preset.config.blurStrength);
		setGooBlur(preset.config.gooBlur);
		setGooStrength(preset.config.gooStrength);
		setBubbleOpacity(preset.config.bubbleOpacity);
		setInteractiveOpacity(preset.config.interactiveOpacity);
		setInteractiveRadius(preset.config.interactiveRadius);
		setSpeedMultiplier(preset.config.speedMultiplier);
		setBlendMode(preset.config.blendMode);
		setContrast(preset.config.contrast);
		setBrightness(preset.config.brightness);
		setSaturation(preset.config.saturation);
		setNoiseOpacity(preset.config.noiseOpacity);
		setVignetteOpacity(preset.config.vignetteOpacity);
	};

	const handleReset = () => {
		applyPreset(defaultPreset.id);
	};

	const updateBubbleColor = (index: number, value: string) => {
		setBubbleColors((previous) =>
			previous.map((color, colorIndex) =>
				colorIndex === index ? value : color,
			),
		);
	};

	const usageCode = `<BubbleGradient
  backgroundStart="${backgroundStart}"
  backgroundEnd="${backgroundEnd}"
  bubbleColors={[${bubbleColors.map((color) => `"${color}"`).join(", ")}]}
  interactiveColor="${interactiveColor}"
  circleSize={${circleSize}}
  blurStrength={${blurStrength}}
  gooBlur={${gooBlur}}
  gooStrength={${gooStrength}}
  bubbleOpacity={${bubbleOpacity.toFixed(2)}}
  interactiveOpacity={${interactiveOpacity.toFixed(2)}}
  interactiveRadius={${interactiveRadius}}
  speedMultiplier={${speedMultiplier.toFixed(2)}}
  blendMode="${blendMode}"
  contrast={${contrast}}
  brightness={${brightness}}
  saturation={${saturation}}
  noiseOpacity={${noiseOpacity.toFixed(2)}}
  vignetteOpacity={${vignetteOpacity.toFixed(2)}}
  uppercase={${uppercase}}
>
  <div className="text-center">
    <h2>${title}</h2>
  </div>
</BubbleGradient>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="bubble-gradient-title">
				<HeaderText text="Bubble Gradient" option={3} />
			</div>
			<ParagraphText
				text="A gooey, grayscale bubble background built for dark interfaces. Tune the palette, filter response, motion speed, texture, and cursor glow without losing the moody monochrome direction."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[560px] rounded-[28px] overflow-hidden border border-white/8 bg-[#040507] shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
							<BubbleGradient
								backgroundStart={backgroundStart}
								backgroundEnd={backgroundEnd}
								bubbleColors={bubbleColors}
								interactiveColor={interactiveColor}
								circleSize={circleSize}
								blurStrength={blurStrength}
								gooBlur={gooBlur}
								gooStrength={gooStrength}
								bubbleOpacity={bubbleOpacity}
								interactiveOpacity={interactiveOpacity}
								interactiveRadius={interactiveRadius}
								speedMultiplier={speedMultiplier}
								blendMode={blendMode as React.CSSProperties["mixBlendMode"]}
								contrast={contrast}
								brightness={brightness}
								saturation={saturation}
								noiseOpacity={noiseOpacity}
								vignetteOpacity={vignetteOpacity}
							>
								<div className="flex flex-col items-center gap-3 text-center px-6">
									<div className="text-[11px] uppercase tracking-[0.45em] text-white/50">
										Dark Theme Background
									</div>
									<div className="text-[clamp(2.8rem,8vw,5.5rem)] font-semibold tracking-[0.18em] text-white/90 drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
										{uppercase ? title.toUpperCase() : title}
									</div>
									<div className="max-w-xl text-sm md:text-base text-white/60 tracking-[0.04em]">
										Subtle greys. Soft motion. Enough control to push it colder,
										heavier, brighter, or more metallic.
									</div>
								</div>
							</BubbleGradient>
						</div>
					}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between ">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Props
								</h3>
							</div>
							<DefaultComboBox
								options={presets}
								value={currentPreset}
								onChange={applyPreset}
								dynamicWidth={true}
							/>
							<div className="flex items-center gap-3">

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
					<DefaultTextInput
						label="Overlay Title"
						value={title}
						onChange={(val) => setTitle(val)}
						placeholder="Enter hero text..."
					/>

					<ToggleComponent
						label="Uppercase Title"
						checked={uppercase}
						onChange={(val) => setUppercase(val)}
					/>

					<DefaultComboBox
						label="Blend Mode"
						options={blendModeOptions}
						value={blendMode}
						onChange={(val) => setBlendMode(val)}
						dynamicWidth={true}
					/>

					<DiscreteSlider2
						label="Bubble Size"
						min={48}
						max={110}
						step={2}
						value={circleSize}
						onChange={(val) => setCircleSize(val)}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Motion Speed"
						min={0.5}
						max={1.8}
						step={0.05}
						value={speedMultiplier}
						onChange={(val) => setSpeedMultiplier(val)}
						maxDecimals={2}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Blur Strength"
						min={10}
						max={80}
						step={2}
						value={blurStrength}
						onChange={(val) => setBlurStrength(val)}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Goo Blur"
						min={4}
						max={20}
						step={1}
						value={gooBlur}
						onChange={(val) => setGooBlur(val)}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Goo Strength"
						min={8}
						max={28}
						step={1}
						value={gooStrength}
						onChange={(val) => setGooStrength(val)}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Bubble Opacity"
						min={0.3}
						max={1}
						step={0.05}
						value={bubbleOpacity}
						onChange={(val) => setBubbleOpacity(val)}
						maxDecimals={2}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Cursor Glow"
						min={0.1}
						max={1}
						step={0.05}
						value={interactiveOpacity}
						onChange={(val) => setInteractiveOpacity(val)}
						maxDecimals={2}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Interactive Radius"
						min={120}
						max={420}
						step={10}
						value={interactiveRadius}
						onChange={(val) => setInteractiveRadius(val)}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Contrast"
						min={80}
						max={150}
						step={2}
						value={contrast}
						onChange={(val) => setContrast(val)}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Brightness"
						min={70}
						max={120}
						step={2}
						value={brightness}
						onChange={(val) => setBrightness(val)}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Saturation"
						min={0}
						max={140}
						step={5}
						value={saturation}
						onChange={(val) => setSaturation(val)}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Texture"
						min={0}
						max={0.2}
						step={0.01}
						value={noiseOpacity}
						onChange={(val) => setNoiseOpacity(val)}
						maxDecimals={2}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Vignette"
						min={0}
						max={0.5}
						step={0.01}
						value={vignetteOpacity}
						onChange={(val) => setVignetteOpacity(val)}
						maxDecimals={2}
						showTicks={true}
					/>

					<ColorPicker
						label="Background Start"
						value={backgroundStart}
						onChange={setBackgroundStart}
						compact={true}
						presets={["#040507", "#050608", "#0A0D12", "#11161E", "#161B23", "#1F2630"]}
					/>

					<ColorPicker
						label="Background End"
						value={backgroundEnd}
						onChange={setBackgroundEnd}
						compact={true}
						presets={["#12161C", "#171B21", "#1F252C", "#252D36", "#2D3640", "#394451"]}
					/>

					{bubbleColors.map((color, index) => (
						<ColorPicker
							key={colorLabels[index]}
							label={colorLabels[index]}
							value={color}
							onChange={(value) => updateBubbleColor(index, value)}
							compact={true}
							presets={[
								"#FFFFFF",
								"#F6F7F8",
								"#D5D9E0",
								"#B4BBC5",
								"#8B939E",
								"#6A737E",
								"#4B545F",
								"#2A3038",
							]}
						/>
					))}

					<ColorPicker
						label="Interactive Glow"
						value={interactiveColor}
						onChange={setInteractiveColor}
						compact={true}
						presets={["#FFFFFF", "#E7EDF5", "#D6DCE5", "#BBC6D1", "#95A0AD", "#6E7781"]}
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

export default BubbleGradientPage;
