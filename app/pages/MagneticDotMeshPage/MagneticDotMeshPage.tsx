"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { MagneticDotMesh } from "../../meta/background/dotted/MagneticDotMesh";
import { loaderProps, componentCode, creditsData } from "./MagneticDotMeshData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
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
		},
	},
];

export const MagneticDotMeshPage = () => {
	const [gap, setGap] = useState(DEFAULT_GAP);
	const [repelRadius, setRepelRadius] = useState(DEFAULT_REPEL_RADIUS);
	const [repelForce, setRepelForce] = useState(DEFAULT_REPEL_FORCE);
	const [lineDist, setLineDist] = useState(DEFAULT_LINE_DIST);
	const [currentPreset, setCurrentPreset] = useState("default");

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setGap(preset.config.gap);
			setRepelRadius(preset.config.repelRadius);
			setRepelForce(preset.config.repelForce);
			setLineDist(preset.config.lineDist);
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
/>`;

	return (
		<div className="flex flex-col gap-5">
			<HeaderText text="Magnetic Dot Mesh" option={3} />
			<ParagraphText
				text="An interactive, high-performance background component using Canvas. Dots repel from the mouse and form interconnected mesh lines based on proximity. Supports click-triggered shockwaves."
				option={4}
			/>

			<PreviewTab
				previewContent={
					<div className="w-full h-[500px] border border-rb-neutral-4 rounded-3xl overflow-hidden shadow-2xl shadow-rb-accent-1/5 bg-rb-neutral-2">
						<MagneticDotMesh
							gap={gap}
							repelRadius={repelRadius}
							repelForce={repelForce}
							lineDist={lineDist}
						/>
					</div>
				}
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
				<DiscreteSlider
					label="Grid Gap"
					min={20}
					max={120}
					step={2}
					value={gap}
					onChange={setGap}
					showTicks={false}
				/>

				<DiscreteSlider
					label="Repel Radius"
					min={50}
					max={400}
					step={10}
					value={repelRadius}
					onChange={setRepelRadius}
					showTicks={false}
				/>

				<DiscreteSlider
					label="Repel Force"
					min={1}
					max={50}
					step={1}
					value={repelForce}
					onChange={setRepelForce}
					showTicks={false}
				/>

				<DiscreteSlider
					label="Line Connection Distance"
					min={10}
					max={200}
					step={5}
					value={lineDist}
					onChange={setLineDist}
					showTicks={false}
				/>
			</PreviewTab>

			<InstallationTabs />

			<div className="flex flex-col gap-5">
				<HeaderText text="API Reference" option={6} />
				<PropsTable categories={loaderProps} />
			</div>

			<div className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default MagneticDotMeshPage;
