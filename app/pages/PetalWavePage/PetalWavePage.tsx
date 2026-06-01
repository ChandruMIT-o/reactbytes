"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import PetalWave from "../../meta/background/wave/PetalWave/PetalWave";
import { loaderProps, componentCode, creditsData } from "./PetalWaveData";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

// Premium dynamic presets with perfectly SWAPPED start/end colors
const presets = [
	{
		id: "crimson-ocean",
		label: "Crimson Ocean (Swapped)",
		config: {
			colorStart: "#ef4444", // Swapped (originally end)
			colorEnd: "#18181b",   // Swapped (originally start)
			speed: 1.0,
			shape: "petal" as const,
			staggerFrom: "center" as const,
			staggerAmount: 6,
			staggerEase: "sine.in",
			ease: "expo",
		},
	},
	{
		id: "electric-lime",
		label: "Electric Lime (Swapped)",
		config: {
			colorStart: "#22c55e", // Swapped (originally end)
			colorEnd: "#09090b",   // Swapped (originally start)
			speed: 1.2,
			shape: "star" as const,
			staggerFrom: "edges" as const,
			staggerAmount: 4.5,
			staggerEase: "power1.out",
			ease: "power3.inOut",
		},
	},
	{
		id: "sunset-horizon",
		label: "Sunset Horizon (Swapped)",
		config: {
			colorStart: "#f97316", // Swapped (originally end)
			colorEnd: "#1e1b4b",   // Swapped (originally start)
			speed: 0.8,
			shape: "diamond" as const,
			staggerFrom: "start" as const,
			staggerAmount: 8,
			staggerEase: "sine.inOut",
			ease: "sine.inOut",
		},
	},
	{
		id: "cyberpunk",
		label: "Cyberpunk Glow (Swapped)",
		config: {
			colorStart: "#a855f7", // Swapped (originally end)
			colorEnd: "#172554",   // Swapped (originally start)
			speed: 1.5,
			shape: "ribbon" as const,
			staggerFrom: "random" as const,
			staggerAmount: 5,
			staggerEase: "sine.in",
			ease: "bounce.out",
		},
	},
];

const shapeOptions = [
	{ id: "petal", label: "Petal Lattice" },
	{ id: "star", label: "Star Spikes" },
	{ id: "diamond", label: "Diamond Grid" },
	{ id: "ribbon", label: "Ribbon Wave" },
];

const directionOptions = [
	{ id: "center", label: "Center (Outward)" },
	{ id: "start", label: "Top-Left (Forward)" },
	{ id: "end", label: "Bottom-Right (Backward)" },
	{ id: "edges", label: "Edges (Inward)" },
	{ id: "random", label: "Random (Sparkle)" },
];

const staggerEaseOptions = [
	{ id: "sine.in", label: "Sine In" },
	{ id: "sine.out", label: "Sine Out" },
	{ id: "sine.inOut", label: "Sine In-Out" },
	{ id: "power1.in", label: "Power 1 In" },
	{ id: "power1.out", label: "Power 1 Out" },
];

const easeOptions = [
	{ id: "expo", label: "Expo (Sharp)" },
	{ id: "power3.inOut", label: "Smooth Cubic" },
	{ id: "sine.inOut", label: "Continuous Sine" },
	{ id: "bounce.out", label: "Bouncy Elastic" },
];

export const PetalWavePage = () => {
	const [colorStart, setColorStart] = useState(presets[0].config.colorStart);
	const [colorEnd, setColorEnd] = useState(presets[0].config.colorEnd);
	const [speed, setSpeed] = useState(presets[0].config.speed);
	const [shape, setShape] = useState<any>(presets[0].config.shape);
	const [staggerFrom, setStaggerFrom] = useState<any>(presets[0].config.staggerFrom);
	const [staggerAmount, setStaggerAmount] = useState(presets[0].config.staggerAmount);
	const [staggerEase, setStaggerEase] = useState(presets[0].config.staggerEase);
	const [ease, setEase] = useState(presets[0].config.ease);

	const [currentPreset, setCurrentPreset] = useState("crimson-ocean");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setColorStart(preset.config.colorStart);
			setColorEnd(preset.config.colorEnd);
			setSpeed(preset.config.speed);
			setShape(preset.config.shape);
			setStaggerFrom(preset.config.staggerFrom);
			setStaggerAmount(preset.config.staggerAmount);
			setStaggerEase(preset.config.staggerEase);
			setEase(preset.config.ease);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("crimson-ocean");
	};

	const usageCode = `<PetalWave
  colorStart="${colorStart}"
  colorEnd="${colorEnd}"
  speed={${speed}}
  shape="${shape}"
  staggerFrom="${staggerFrom}"
  staggerAmount={${staggerAmount}}
  staggerEase="${staggerEase}"
  ease="${ease}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="petal-wave-title">
				<HeaderText text="Petal Wave" option={3} />
			</div>
			<ParagraphText
				text="A highly optimized background grid consisting of 2,500 organic path elements that animate continuously using high-performance GSAP staggering. Fully customized to support dynamic geometry shapes, wave directionality origins, distribution staggering rates, and morphing easing presets."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] rounded-2xl relative overflow-hidden bg-black">
							<PetalWave
								key={key}
								colorStart={colorStart}
								colorEnd={colorEnd}
								speed={speed}
								shape={shape}
								staggerFrom={staggerFrom}
								staggerAmount={staggerAmount}
								staggerEase={staggerEase}
								ease={ease}
								className="w-full h-full"
							>
								<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-10 select-none">
									<h2 className="text-white text-3xl font-extrabold tracking-widest uppercase text-center font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
										Petal Wave
									</h2>
									<p className="text-white/40 text-xs font-mono tracking-widest mt-2 uppercase text-center">
										Recyclable GSAP Morphing Canvas
									</p>
								</div>
							</PetalWave>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Controls
								</h3>
							</div>
							<DefaultComboBox
								label="Presets"
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
					<ColorPicker
						label="Base Path Color"
						value={colorStart}
						onChange={(val) => {
							setColorStart(val);
							setCurrentPreset("custom");
						}}
					/>

					<ColorPicker
						label="Staggered Wave Color"
						value={colorEnd}
						onChange={(val) => {
							setColorEnd(val);
							setCurrentPreset("custom");
						}}
					/>

					<DefaultComboBox
						label="Geometry Shape"
						options={shapeOptions}
						value={shape}
						onChange={(val) => {
							setShape(val);
							setCurrentPreset("custom");
						}}
						dynamicWidth={true}
					/>

					<DefaultComboBox
						label="Wave Origin (Stagger From)"
						options={directionOptions}
						value={staggerFrom}
						onChange={(val) => {
							setStaggerFrom(val);
							setCurrentPreset("custom");
						}}
						dynamicWidth={true}
					/>

					<DefaultComboBox
						label="Wave Distribution Easing"
						options={staggerEaseOptions}
						value={staggerEase}
						onChange={(val) => {
							setStaggerEase(val);
							setCurrentPreset("custom");
						}}
						dynamicWidth={true}
					/>

					<DefaultComboBox
						label="Morph Transition Easing"
						options={easeOptions}
						value={ease}
						onChange={(val) => {
							setEase(val);
							setCurrentPreset("custom");
						}}
						dynamicWidth={true}
					/>

					<DiscreteSlider2
						label="Animation Loop Speed"
						min={0.1}
						max={3.0}
						step={0.1}
						value={speed}
						onChange={(val) => {
							setSpeed(val);
							setCurrentPreset("custom");
						}}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Wave Ripple Duration (Stagger)"
						min={1.0}
						max={15.0}
						step={0.5}
						value={staggerAmount}
						onChange={(val) => {
							setStaggerAmount(val);
							setCurrentPreset("custom");
						}}
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

export default PetalWavePage;
