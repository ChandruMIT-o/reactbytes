"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { GlowCard } from "../../meta/buttons/GlowCard/GlowCard";
import { glowCardProps, componentCode } from "./GlowCardData";
import { Credits } from "../../components/buttongroup/Credits";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";
import { DefaultTextInput } from "../../components/textinput/DefaultTextInput";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";

const presets = [
	{
		id: "cosmic",
		label: "Cosmic (Default)",
		config: {
			animationSpeed: 4,
			glowBlur: 6,
			glowOpacity: 1,
			glowScale: 1.5,
			borderWidth: 3,
			borderRadius: "2rem",
			baseColor: "hsl(260deg 100% 3%)",
			uppercase: true,
			title: "Glow Card",
		},
	},
	{
		id: "nuclear",
		label: "Nuclear (Fast)",
		config: {
			animationSpeed: 1,
			glowBlur: 10,
			glowOpacity: 1,
			glowScale: 2.5,
			borderWidth: 5,
			borderRadius: "1rem",
			baseColor: "hsl(120deg 100% 5%)",
		},
	},
	{
		id: "cyber",
		label: "Cyber (Sharp)",
		config: {
			animationSpeed: 2,
			glowBlur: 2,
			glowOpacity: 0.8,
			glowScale: 1.2,
			borderWidth: 1,
			borderRadius: "0.5rem",
			baseColor: "hsl(200deg 100% 2%)",
		},
	},
	{
		id: "soft",
		label: "Soft (Ghost)",
		config: {
			animationSpeed: 8,
			glowBlur: 15,
			glowOpacity: 0.5,
			glowScale: 3,
			borderWidth: 2,
			borderRadius: "3rem",
			baseColor: "hsl(280deg 40% 10%)",
		},
	},
	{
		id: "ethereal",
		label: "Ethereal (Lush)",
		config: {
			animationSpeed: 6,
			glowBlur: 8,
			glowOpacity: 0.9,
			glowScale: 2,
			borderWidth: 4,
			borderRadius: "2.5rem",
			baseColor: "hsl(320deg 80% 4%)",
		},
	},
];

export const GlowCardPage = () => {
	const defaultPreset = presets[0];

	const [currentPreset, setCurrentPreset] = useState(defaultPreset.id);
	const [animationSpeed, setAnimationSpeed] = useState(defaultPreset.config.animationSpeed);
	const [glowBlur, setGlowBlur] = useState(defaultPreset.config.glowBlur);
	const [glowOpacity, setGlowOpacity] = useState(defaultPreset.config.glowOpacity);
	const [glowScale, setGlowScale] = useState(defaultPreset.config.glowScale);
	const [borderWidth, setBorderWidth] = useState(defaultPreset.config.borderWidth);
	const [borderRadius, setBorderRadius] = useState(defaultPreset.config.borderRadius);
	const [baseColor, setBaseColor] = useState(defaultPreset.config.baseColor);
	const [uppercase, setUppercase] = useState(defaultPreset.config.uppercase);
	const [title, setTitle] = useState(defaultPreset.config.title);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (!preset) return;
		setCurrentPreset(presetId);
		setAnimationSpeed(preset.config.animationSpeed);
		setGlowBlur(preset.config.glowBlur);
		setGlowOpacity(preset.config.glowOpacity);
		setGlowScale(preset.config.glowScale);
		setBorderWidth(preset.config.borderWidth);
		setBorderRadius(preset.config.borderRadius);
		setBaseColor(preset.config.baseColor);
		setUppercase(preset.config.uppercase ?? false);
		setTitle(preset.config.title ?? "Glow Card");
	};

	const handleReset = () => applyPreset(defaultPreset.id);

	const usageCode = `<GlowCard 
  animationSpeed={${animationSpeed}}
  glowBlur={${glowBlur}}
  glowOpacity={${glowOpacity}}
  glowScale={${glowScale}}
  borderWidth={${borderWidth}}
  borderRadius="${borderRadius}"
  baseColor="${baseColor}"
  uppercase={${uppercase}}
>
  <div className="flex flex-col items-center">
    <span className="text-2xl font-bold bg-white/10 px-3 py-1 rounded tracking-widest uppercase">
      ${title}
    </span>
  </div>
</GlowCard>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="glow-card-title">
				<HeaderText text="Glowing Shadows" option={3} />
			</div>
			<ParagraphText
				text="A highly configurable button component using CSS Houdini. This version uses children for maximum flexibility and provides full control over the physics-based lighting engine."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div
							className="w-full min-h-[500px] flex items-center justify-center p-8 rounded-[32px] border border-white/5 relative overflow-hidden transition-colors duration-700 ease-in-out"
							style={{ backgroundColor: baseColor }}
						>
							<div className="w-full max-w-[600px] flex justify-center relative z-10 transition-transform duration-500">
								<GlowCard
									animationSpeed={animationSpeed}
									glowBlur={glowBlur}
									glowOpacity={glowOpacity}
									glowScale={glowScale}
									borderWidth={borderWidth}
									borderRadius={borderRadius}
									baseColor={baseColor}
									uppercase={uppercase}
								>
									<div className="flex flex-col items-center pointer-events-none">
										<div className="flex items-center gap-3">
											<span className="px-2 py-0.5 bg-white text-black text-[10px] font-black rounded uppercase tracking-tighter">Premium</span>
											<span className="text-white text-lg font-black tracking-widest uppercase">{title}</span>
										</div>
										<p className="text-white/30 text-[10px] mt-2 uppercase tracking-[0.3em] font-medium leading-none">Houdini Engine v1.0</p>
									</div>
								</GlowCard>
							</div>
						</div>
					}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between ">
							<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase tracking-[0.1em]">Glow Parameters</h3>
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
						label="Card Text"
						value={title}
						onChange={setTitle}
						placeholder="Enter text..."
					/>

					<ToggleComponent
						label="Uppercase Mode"
						checked={uppercase}
						onChange={setUppercase}
					/>

					<DiscreteSlider2
						label="Orbit Speed"
						min={0.5}
						max={10.0}
						step={0.5}
						value={animationSpeed}
						onChange={setAnimationSpeed}
						maxDecimals={1}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Shadow Blur"
						min={0}
						max={30}
						step={1}
						value={glowBlur}
						onChange={setGlowBlur}
						maxDecimals={0}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Bloom Opacity"
						min={0.0}
						max={1.0}
						step={0.1}
						value={glowOpacity}
						onChange={setGlowOpacity}
						maxDecimals={1}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Bloom Scale"
						min={1.0}
						max={5.0}
						step={0.2}
						value={glowScale}
						onChange={setGlowScale}
						maxDecimals={1}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Border Width"
						min={1}
						max={10}
						step={1}
						value={borderWidth}
						onChange={setBorderWidth}
						maxDecimals={0}
						showTicks={true}
					/>

					<ColorPicker
						label="Base Color"
						value={baseColor}
						onChange={setBaseColor}
						compact={true}
					/>
				</PreviewTab>
			</div>

			<div id="installation-tabs">
				<InstallationTabs />
			</div>

			<div id="api-reference" className="flex flex-col gap-5">
				<HeaderText text="API Reference" option={6} />
				<PropsTable categories={glowCardProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				{/* <Credits data={creditsData} /> */}
			</div>
		</div>
	);
};

export default GlowCardPage;
