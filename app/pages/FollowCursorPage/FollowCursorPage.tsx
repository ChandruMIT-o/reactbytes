"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ArrowCursor } from "../../meta/cursor/ArrowCursor";
import { loaderProps, componentCode } from "./FollowCursorData";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import { RotateCcw, Plus, Search, Trash2, Settings, Share2, Heart, MessageSquare } from "lucide-react";

export const FollowCursorPage = () => {
	const [color, setColor] = useState("#F2F5F8");
	const [size, setSize] = useState(20);
	const [key, setKey] = useState(0);

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		setColor("#F2F5F8");
		setSize(20);
		setKey((prev) => prev + 1);
	};

	const usageCode = `<ArrowCursor
  color="${color}"
  size={${size}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			{/* Global Cursor for this page */}
			<ArrowCursor key={key} color={color} size={size} />

			<div id="follow-cursor-title">
				<HeaderText text="Follow Cursor" option={3} />
			</div>
			<ParagraphText
				text="A smooth, high-performance cursor following animation. This component replaces the default system cursor with a custom SVG arrow that follows the mouse movement with physics-based smoothing."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full min-h-[500px] relative overflow-hidden flex flex-col items-center justify-center p-10 bg-rb-neutral-2 rounded-2xl border border-white/5 gap-10">
							<div className="text-center mb-8">
								<h4 className="text-rb-accent-1 font-bold text-lg mb-2">Interactive Playground</h4>
								<p className="text-rb-accent-2/60 text-sm">Hover over these elements to test the custom cursor's precision and feel.</p>
							</div>

							{/* Row 1: Standard Buttons */}
							<div className="flex flex-wrap items-center justify-center gap-4">
								<button className="px-5 py-2.5 bg-rb-accent-1 text-rb-neutral-2 font-bold rounded-lg hover:opacity-80 transition-all active:scale-95">
									Primary Action
								</button>
								<button className="px-5 py-2.5 bg-rb-neutral-3 text-rb-accent-1 font-bold rounded-lg border border-rb-neutral-4 hover:bg-rb-neutral-4 transition-all active:scale-95">
									Secondary
								</button>
								<button className="p-2.5 bg-rb-neutral-3 text-rb-accent-1 rounded-full border border-rb-neutral-4 hover:bg-rb-accent-1 hover:text-rb-neutral-2 transition-all active:scale-95">
									<Plus size={20} />
								</button>
							</div>

							{/* Row 2: Icon Grid */}
							<div className="grid grid-cols-4 gap-6 p-6 bg-rb-neutral-3/30 rounded-2xl border border-white/5">
								{[Search, Trash2, Settings, Share2, Heart, MessageSquare].map((Icon, i) => (
									<div 
										key={i}
										className="p-4 bg-rb-neutral-3 hover:bg-rb-accent-1 hover:text-rb-neutral-2 text-rb-accent-1 rounded-xl transition-all cursor-none group"
									>
										<Icon size={24} className="group-hover:scale-110 transition-transform" />
									</div>
								))}
							</div>

							{/* Row 3: Cards */}
							<div className="flex flex-wrap items-center justify-center gap-6 w-full max-w-2xl">
								{[1, 2].map((i) => (
									<div 
										key={i}
										className="flex-1 min-w-[200px] p-6 bg-rb-neutral-3 rounded-2xl border border-rb-neutral-4 hover:border-rb-accent-1/50 transition-all"
									>
										<div className="w-10 h-10 bg-rb-accent-1/20 rounded-lg mb-4 flex items-center justify-center">
											<div className="w-4 h-4 bg-rb-accent-1 rounded-full" />
										</div>
										<h5 className="text-rb-accent-1 font-bold mb-2">Feature {i}</h5>
										<p className="text-rb-accent-2/40 text-xs">Test how the cursor glides over card boundaries.</p>
									</div>
								))}
							</div>
						</div>
					}
					onReplay={handleReplay}
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
						label="Cursor Color"
						value={color}
						onChange={setColor}
					/>

					<DiscreteSlider2
						label="Cursor Size"
						min={12}
						max={64}
						step={1}
						value={size}
						onChange={setSize}
						showTicks={true}
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
		</div>
	);
};

export default FollowCursorPage;
