"use client";

import React, { useState } from "react";
import ComboBox, { ComboBoxOption } from "../../components/combobox/ComboBox";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PropsTable from "../../components/table/PropsTable";

const OPTIONS: ComboBoxOption[] = [
	{ id: "nextjs", label: "Next.js", description: "The React Framework for the Web" },
	{ id: "react", label: "React", description: "A JavaScript library for building user interfaces" },
	{ id: "tailwind", label: "Tailwind CSS", description: "A utility-first CSS framework" },
	{ id: "framer", label: "Framer Motion", description: "A production-ready motion library for React" },
	{ id: "typescript", label: "TypeScript", description: "JavaScript with syntax for types" },
	{ id: "vite", label: "Vite", description: "Next Generation Frontend Tooling" },
	{ id: "lucide", label: "Lucide Icons", description: "Beautifully simple, pixel-perfect icons" },
];

export const ComboBoxPage = () => {
	const [value, setValue] = useState("");

	return (
		<div className="flex flex-col gap-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
			<div className="flex flex-col gap-3">
				<HeaderText text="ComboBox" option={1} />
				<ParagraphText 
					text="A premium, searchable dropdown component with keyboard navigation and custom animations. Perfect for selecting from long lists of options." 
					option={1} 
				/>
			</div>

			<div className="bg-rb-neutral-3 p-1.5 rounded-[24px] w-full max-w-xl">
				<div className="bg-rb-neutral-1 rounded-[18px] border border-rb-neutral-4 p-10 flex flex-col items-center justify-center min-h-[400px] gap-6">
					<ComboBox 
						label="Framework"
						options={OPTIONS} 
						value={value} 
						onChange={setValue} 
						placeholder="Search frameworks..."
					/>
					
					{value && (
						<div className="text-sm text-rb-accent-1/60 animate-in fade-in zoom-in duration-300">
							Selected: <span className="text-rb-accent-1 font-mono font-bold bg-rb-neutral-4 px-2 py-0.5 rounded-md">{value}</span>
						</div>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<HeaderText text="Properties" option={3} />
				<PropsTable 
					categories={[
						{
							title: "Core Props",
							props: [
								{
									name: "options",
									type: "ComboBoxOption[]",
									required: true,
									description: "An array of objects containing id, label, and optional description."
								},
								{
									name: "value",
									type: "string",
									description: "The currently selected option ID."
								},
								{
									name: "onChange",
									type: "(value: string) => void",
									description: "Callback function triggered when an option is selected."
								},
								{
									name: "placeholder",
									type: "string",
									defaultValue: "'Select an option...'",
									description: "Placeholder text for the search input."
								},
								{
									name: "label",
									type: "string",
									description: "Optional label displayed above the ComboBox."
								}
							]
						}
					]}
				/>
			</div>
		</div>
	);
};
