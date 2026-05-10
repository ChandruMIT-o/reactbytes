"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import IridescentGradient from "../../meta/background/gradient/IridescentGradient";
import { loaderProps, componentCode, creditsData } from "./IridescentGradientData";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw } from "lucide-react";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";

const DEFAULT_TITLE = "An awesome title";
const DEFAULT_SWITCH_TEXT = "switch bg";
const DEFAULT_STRIPE_COLOR = "#ffffff";
const DEFAULT_BG_COLOR = undefined;
const DEFAULT_CHECKED = true;

export const IridescentGradientPage = () => {
	const [title, setTitle] = useState(DEFAULT_TITLE);
	const [switchText, setSwitchText] = useState(DEFAULT_SWITCH_TEXT);
	const [stripeColor, setStripeColor] = useState(DEFAULT_STRIPE_COLOR);
	const [bgColor, setBgColor] = useState<string | undefined>(DEFAULT_BG_COLOR);
	const [checked, setChecked] = useState(DEFAULT_CHECKED);
	const [key, setKey] = useState(0);

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		setTitle(DEFAULT_TITLE);
		setSwitchText(DEFAULT_SWITCH_TEXT);
		setStripeColor(DEFAULT_STRIPE_COLOR);
		setBgColor(DEFAULT_BG_COLOR);
		setChecked(DEFAULT_CHECKED);
		setKey((prev) => prev + 1);
	};

	const usageCode = `<IridescentGradient
  title="${title}"
  switchText="${switchText}"
  stripeColor="${stripeColor}"
  ${bgColor ? `bgColor="${bgColor}"` : ""}
  checked={${checked}}
  onCheckedChange={(checked) => console.log(checked)}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="iridescent-gradient-title">
				<HeaderText text="Iridescent Gradient" option={3} />
			</div>
			<ParagraphText
				text="A sophisticated background with an iridescent, shimmering effect that reacts to a toggle switch. Perfect for hero sections and premium landing pages."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[600px] relative overflow-hidden flex items-center justify-center border border-rb-neutral-4 rounded-xl">
							<IridescentGradient
								key={key}
								title={title}
								switchText={switchText}
								stripeColor={stripeColor}
								bgColor={bgColor}
								checked={checked}
								onCheckedChange={setChecked}
							/>
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
									Controls
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
					<DefaultTextInput
						label="Title Text"
						value={title}
						onChange={setTitle}
						placeholder="Enter title..."
					/>

					<DefaultTextInput
						label="Switch Text"
						value={switchText}
						onChange={setSwitchText}
						placeholder="Enter switch label..."
					/>

					<ColorPicker
						label="Stripe Color"
						value={stripeColor}
						onChange={setStripeColor}
					/>

					<ColorPicker
						label="Background Color"
						value={bgColor}
						onChange={(val) => setBgColor(val)}
					/>

					<ToggleComponent
						label="Checked State"
						checked={checked}
						onChange={setChecked}
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

export default IridescentGradientPage;
