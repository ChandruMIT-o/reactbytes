"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { MagneticDotMesh } from "../../meta/background/dotted/MagneticDotMesh";
import { loaderProps, componentCode, creditsData } from "./MagneticDotMeshData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_GAP = 48;
const DEFAULT_REPEL_RADIUS = 140;
const DEFAULT_REPEL_FORCE = 14;
const DEFAULT_LINE_DIST = 70;

const presets = [
	{
		id: "default",
		label: "Default Mesh",
		config: {
			gap: 48,
			repelRadius: 140,
			repelForce: 14,
			lineDist: 70,
			color1: "#7c5cff",
			color2: "#2ee6a6",
		},
	},
	{
		id: "dense",
		label: "Dense Network",
		config: {
			gap: 25,
			repelRadius: 100,
			repelForce: 8,
			lineDist: 45,
			color1: "#3b82f6",
			color2: "#60a5fa",
		},
	},
	{
		id: "loose",
		label: "Loose Connections",
		config: {
			gap: 80,
			repelRadius: 250,
			repelForce: 30,
			lineDist: 150,
			color1: "#ec4899",
			color2: "#8b5cf6",
		},
	},
];

export const MagneticDotMeshPage = () => {
	const [gap, setGap] = useState(DEFAULT_GAP);
	const [repelRadius, setRepelRadius] = useState(DEFAULT_REPEL_RADIUS);
	const [repelForce, setRepelForce] = useState(DEFAULT_REPEL_FORCE);
	const [lineDist, setLineDist] = useState(DEFAULT_LINE_DIST);
	const [color1, setColor1] = useState("#7c5cff");
	const [color2, setColor2] = useState("#2ee6a6");
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setGap(preset.config.gap);
			setRepelRadius(preset.config.repelRadius);
			setRepelForce(preset.config.repelForce);
			setLineDist(preset.config.lineDist);
			setColor1(preset.config.color1);
			setColor2(preset.config.color2);
			setKey((prev) => prev + 1);
		}
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<MagneticDotMesh
  gap={${gap}}
  repelRadius={${repelRadius}}
  repelForce={${repelForce}}
  lineDist={${lineDist}}
  color1="${color1}"
  color2="${color2}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="magnetic-dots-title">
				<HeaderText text="Magnetic Dot Mesh" option={3} />
			</div>
			<ParagraphText
				text="An interactive, high-performance background component using Canvas. Dots repel from the mouse and form interconnected mesh lines based on proximity. Supports click-triggered shockwaves."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[500px] border border-rb-neutral-4 rounded-3xl overflow-hidden shadow-2xl shadow-rb-accent-1/5 bg-rb-neutral-2">
							<MagneticDotMesh
								key={key}
								gap={gap}
								repelRadius={repelRadius}
								repelForce={repelForce}
								lineDist={lineDist}
								color1={color1}
								color2={color2}
							/>
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
					<DiscreteSlider2
						label="Grid Gap"
						min={20}
						max={120}
						step={2}
						value={gap}
						onChange={(val) => {
							setGap(val);
							setKey((prev) => prev + 1);
						}}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Repel Radius"
						min={50}
						max={400}
						step={10}
						value={repelRadius}
						onChange={(val) => {
							setRepelRadius(val);
							setKey((prev) => prev + 1);
						}}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Repel Force"
						min={1}
						max={50}
						step={1}
						value={repelForce}
						onChange={(val) => {
							setRepelForce(val);
							setKey((prev) => prev + 1);
						}}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Line Connection Distance"
						min={10}
						max={200}
						step={5}
						value={lineDist}
						onChange={(val) => {
							setLineDist(val);
							setKey((prev) => prev + 1);
						}}
						showTicks={true}
					/>

					<ColorPicker
						label="Base Color"
						value={color1}
						onChange={(val) => {
							setColor1(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<ColorPicker
						label="Accent Color"
						value={color2}
						onChange={(val) => {
							setColor2(val);
							setKey((prev) => prev + 1);
						}}
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

export default MagneticDotMeshPage;
