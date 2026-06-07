"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Terminal, FileCode2, Sparkles, Cpu, Layers } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import { PropsTable } from "../../components/table/PropsTable";
import { Credits } from "../../components/buttongroup/Credits";
import { componentDocsData, creditsData } from "./InstallationData";

import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-tomorrow.css";

const pkgManagers = ["pnpm", "npm", "yarn", "bun"] as const;
type PkgManager = typeof pkgManagers[number];

const installCommands: Record<PkgManager, string> = {
	pnpm: "pnpm add framer-motion lucide-react clsx tailwind-merge",
	npm: "npm i framer-motion lucide-react clsx tailwind-merge",
	yarn: "yarn add framer-motion lucide-react clsx tailwind-merge",
	bun: "bun add framer-motion lucide-react clsx tailwind-merge",
};

const cnCode = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

const usageCode = `import React from "react";
import { BlurText } from "@/components/reactbytes/BlurText";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <BlurText
        text="STUNNING INTERACTION"
        className="text-4xl md:text-6xl font-bold text-rb-accent-1"
        delay={0.2}
      />
    </div>
  );
}`;

const fadeUp = (delay: number = 0) => ({
	initial: { opacity: 0, y: 20, filter: "blur(8px)" },
	whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
	viewport: { once: true },
	transition: {
		duration: 0.8,
		delay,
		ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
	},
});

const CopyableCodeBlock: React.FC<{ code: string; filename?: string }> = ({ code, filename }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="relative group w-full bg-rb-neutral-3 p-1.5 rounded-[24px] border border-rb-neutral-4/50">
			{filename && (
				<div className="flex items-center justify-between px-5 py-2.5 text-xs font-mono text-rb-accent-2/40 border-b border-rb-neutral-4/20">
					<span>{filename}</span>
				</div>
			)}
			<div className="relative bg-rb-neutral-1 rounded-[18px] border border-rb-neutral-4 overflow-hidden">
				<pre className="p-5 overflow-auto max-h-[400px] text-sm font-mono text-rb-accent-2 leading-relaxed whitespace-pre scrollbar-thin">
					<code dangerouslySetInnerHTML={{ __html: Prism.highlight(code, Prism.languages.tsx, 'tsx') }} />
				</pre>
				<button
					onClick={handleCopy}
					className="absolute top-4 right-4 p-2.5 flex items-center justify-center rounded-full bg-rb-neutral-3 text-rb-accent-2/40 border border-rb-neutral-4 hover:text-rb-accent-1 hover:bg-rb-neutral-4 hover:border-rb-accent-2/30 transition-all duration-300 group/btn cursor-pointer"
					title="Copy code"
				>
					{copied ? (
						<Check size={14} className="text-emerald-500" />
					) : (
						<Copy size={14} className="group-hover/btn:scale-110 transition-transform" />
					)}
				</button>
			</div>
		</div>
	);
};

export const InstallationPage: React.FC = () => {
	const [activePkg, setActivePkg] = useState<PkgManager>("pnpm");
	const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

	const handleCopy = (text: string, id: string) => {
		navigator.clipboard.writeText(text);
		setCopiedMap((prev) => ({ ...prev, [id]: true }));
		setTimeout(() => {
			setCopiedMap((prev) => ({ ...prev, [id]: false }));
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-rb-neutral-2 text-rb-accent-1 selection:bg-rb-accent-1/20 py-10 pb-40 space-y-24">
			{/* Hero Section */}
			<section
				id="installation-title"
				className="relative flex flex-col items-center justify-center text-center pt-10 pb-6 overflow-hidden"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.97 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
					className="relative z-10 max-w-3xl px-6"
				>
					<motion.div
						{...fadeUp(0.1)}
						className="mb-6 inline-flex rounded-full px-4 py-1.5 border border-rb-neutral-4 bg-rb-neutral-3/80 backdrop-blur-sm"
					>
						<span className="text-[13px] text-rb-accent-3 font-medium tracking-wide flex items-center gap-2">
							Setup Guide
						</span>
					</motion.div>
					<motion.h1
						{...fadeUp(0.2)}
						className="text-5xl md:text-6xl font-bold tracking-tight text-rb-accent-1 mb-6 leading-[1.1]"
					>
						Seamless{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-rb-accent-2 to-rb-accent-3">
							Installation
						</span>
					</motion.h1>

					<motion.p
						{...fadeUp(0.3)}
						className="text-[16px] md:text-[17px] text-rb-accent-2/50 max-w-2xl mx-auto leading-relaxed font-light"
					>
						React Bytes components are designed to be copied and pasted directly into your codebase. No package bloating, no vendor lock-in. Just code that you own.
					</motion.p>
				</motion.div>
			</section>

			{/* Installation Steps Section */}
			<section className="max-w-4xl mx-auto w-full px-6 relative">
				<div className="relative flex flex-col gap-20">
					{/* Glowing vertical line connecting steps */}
					<div className="absolute left-6 top-6 bottom-6 w-[2px] bg-gradient-to-b from-rb-accent-2 via-rb-accent-3 to-rb-neutral-4 hidden md:block" />

					{/* Step 1 */}
					<motion.div {...fadeUp(0.4)} className="relative flex flex-col md:flex-row gap-8 pl-0 md:pl-16">
						{/* Step indicator circle */}
						<div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-rb-neutral-3 border border-rb-accent-2 flex items-center justify-center z-10 hidden md:flex">
							<span className="text-rb-accent-2 font-mono font-bold">1</span>
						</div>
						<div className="flex-1 space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-rb-neutral-3 border border-rb-accent-2 flex items-center justify-center md:hidden">
									<span className="text-rb-accent-2 font-mono font-bold text-xs">1</span>
								</div>
								<h3 className="text-xl font-bold text-rb-accent-1 flex items-center gap-2">
									<Terminal size={18} className="text-rb-accent-2" />
									Install Peer Dependencies
								</h3>
							</div>
							<p className="text-rb-accent-2/60 font-light text-[15px] leading-relaxed">
								React Bytes relies on a small set of standard libraries to handle smooth layout animations, icons, and dynamic class merging.
							</p>

							{/* Package Manager selector and command */}
							<div className="w-full flex flex-col gap-4">
								<div className="bg-rb-neutral-3 p-1.5 rounded-full flex gap-1 w-max border border-rb-neutral-4/40">
									{pkgManagers.map((pkg) => (
										<button
											key={pkg}
											onClick={() => setActivePkg(pkg)}
											className={`relative px-4 py-1.5 text-xs font-semibold rounded-full outline-none transition-colors duration-300 cursor-pointer ${activePkg === pkg ? "bg-rb-accent-1 text-rb-neutral-2 font-bold" : "text-rb-accent-2/60 hover:text-rb-accent-1"
												}`}
										>
											{pkg}
										</button>
									))}
								</div>

								<div className="relative group w-full bg-rb-neutral-3 p-1.5 rounded-[24px] border border-rb-neutral-4/50">
									<div className="flex items-center justify-between bg-rb-neutral-1 rounded-[18px] w-full p-5 pr-14 text-rb-accent-2 font-mono text-sm border border-rb-neutral-4 overflow-x-auto">
										<div className="flex items-center gap-3">
											<span className="text-rb-accent-1 select-none font-bold">$</span>
											<span>{installCommands[activePkg]}</span>
										</div>
										<button
											onClick={() => handleCopy(installCommands[activePkg], "dependencies")}
											className="absolute top-4 right-4 p-2.5 flex items-center justify-center rounded-full bg-rb-neutral-3 text-rb-accent-2/40 border border-rb-neutral-4 hover:text-rb-accent-1 hover:bg-rb-neutral-4 hover:border-rb-accent-2/30 transition-all duration-300 group/btn cursor-pointer"
											title="Copy command"
										>
											{copiedMap["dependencies"] ? (
												<Check size={14} className="text-emerald-500" />
											) : (
												<Copy size={14} className="group-hover/btn:scale-110 transition-transform" />
											)}
										</button>
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Step 2 */}
					<motion.div {...fadeUp(0.5)} className="relative flex flex-col md:flex-row gap-8 pl-0 md:pl-16">
						{/* Step indicator circle */}
						<div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-rb-neutral-3 border border-rb-accent-3 flex items-center justify-center z-10 hidden md:flex">
							<span className="text-rb-accent-3 font-mono font-bold">2</span>
						</div>
						<div className="flex-1 space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-rb-neutral-3 border border-rb-accent-3 flex items-center justify-center md:hidden">
									<span className="text-rb-accent-3 font-mono font-bold text-xs">2</span>
								</div>
								<h3 className="text-xl font-bold text-rb-accent-1 flex items-center gap-2">
									<Layers size={18} className="text-rb-accent-3" />
									Configure Class Utility
								</h3>
							</div>
							<p className="text-rb-accent-2/60 font-light text-[15px] leading-relaxed">
								Define the <code className="text-rb-accent-3 font-mono bg-rb-neutral-3 px-2 py-0.5 rounded">cn</code> helper to conditionally combine Tailwind CSS classes without stylesheet conflicts. Save it to <code className="text-rb-accent-3 font-mono bg-rb-neutral-3 px-2 py-0.5 rounded">lib/utils.ts</code> (or similar path in your project).
							</p>

							<CopyableCodeBlock code={cnCode} filename="lib/utils.ts" />
						</div>
					</motion.div>

					{/* Step 3 */}
					<motion.div {...fadeUp(0.6)} className="relative flex flex-col md:flex-row gap-8 pl-0 md:pl-16">
						{/* Step indicator circle */}
						<div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-rb-neutral-3 border border-rb-accent-2 flex items-center justify-center z-10 hidden md:flex">
							<span className="text-rb-accent-2 font-mono font-bold">3</span>
						</div>
						<div className="flex-1 space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-rb-neutral-3 border border-rb-accent-2 flex items-center justify-center md:hidden">
									<span className="text-rb-accent-2 font-mono font-bold text-xs">3</span>
								</div>
								<h3 className="text-xl font-bold text-rb-accent-1 flex items-center gap-2">
									<FileCode2 size={18} className="text-rb-accent-2" />
									Copy Component Source Code
								</h3>
							</div>
							<p className="text-rb-accent-2/60 font-light text-[15px] leading-relaxed">
								Browse any component from the sidebar, choose your settings, switch to the <strong className="text-rb-accent-1">Code</strong> tab, and copy the full React code directly into your local folder structure.
							</p>

							{/* Mock interactive UI representing Code Tab copying */}
							<div className="w-full bg-rb-neutral-3 p-1 rounded-[20px] border border-rb-neutral-4/40 mt-3 relative overflow-hidden">
								<div className="flex items-center justify-between px-4 py-2 border-b border-rb-neutral-4/40 bg-rb-neutral-2">
									<div className="flex gap-2">
										<span className="px-3 py-1 text-xs font-semibold rounded-full bg-rb-neutral-4 text-rb-accent-2/50 select-none">Preview</span>
										<span className="px-3 py-1 text-xs font-semibold rounded-full bg-rb-accent-1 text-rb-neutral-2 select-none font-bold">Code</span>
									</div>
									<div className="flex items-center gap-1.5">
										<div className="p-1.5 rounded-full bg-rb-neutral-3 text-rb-accent-1 border border-rb-neutral-4">
											<Copy size={10} />
										</div>
									</div>
								</div>
								<div className="p-4 bg-rb-neutral-1 font-mono text-[11px] text-rb-accent-2/40 select-none leading-relaxed">
									<div>{"export const BlurText = ({ text }) => {"}</div>
									<div className="pl-4">{"const words = text.split(' ');"}</div>
									<div className="pl-4">{"return ("}</div>
									<div className="pl-8">{"<motion.span>..."}</div>
									<div className="pl-4">{");"}</div>
									<div>{"};"}</div>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-rb-neutral-3 to-transparent pointer-events-none opacity-80" />
							</div>
						</div>
					</motion.div>

					{/* Step 4 */}
					<motion.div {...fadeUp(0.7)} className="relative flex flex-col md:flex-row gap-8 pl-0 md:pl-16">
						{/* Step indicator circle */}
						<div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-rb-neutral-3 border border-rb-accent-3 flex items-center justify-center z-10 hidden md:flex">
							<span className="text-rb-accent-3 font-mono font-bold">4</span>
						</div>
						<div className="flex-1 space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-rb-neutral-3 border border-rb-accent-3 flex items-center justify-center md:hidden">
									<span className="text-rb-accent-3 font-mono font-bold text-xs">4</span>
								</div>
								<h3 className="text-xl font-bold text-rb-accent-1 flex items-center gap-2">
									<Sparkles size={18} className="text-rb-accent-3" />
									Import & Use
								</h3>
							</div>
							<p className="text-rb-accent-2/60 font-light text-[15px] leading-relaxed">
								Now simply import the component where you need it, configure the desired properties (props), and elevate your web application.
							</p>

							<CopyableCodeBlock code={usageCode} filename="components/Home.tsx" />
						</div>
					</motion.div>
				</div>
			</section>

			{/* Dependencies Reference Section */}
			<section id="api-reference" className="max-w-4xl mx-auto w-full px-6">
				<motion.div {...fadeUp(0.1)} className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<Cpu size={24} className="text-rb-accent-2" />
						<HeaderText text="Peer Dependencies Reference" option={4} />
					</div>
					<ParagraphText
						text="Below is a detailed list of packages utilized by various React Bytes components."
						option={4}
					/>
				</motion.div>

				<motion.div {...fadeUp(0.2)} className="w-full">
					<PropsTable categories={componentDocsData} />
				</motion.div>
			</section>

			{/* Credits Section */}
			<section id="credits" className="max-w-4xl mx-auto w-full px-6 border-t border-rb-neutral-4/30 pt-16">
				<motion.div {...fadeUp(0.1)}>
					<Credits
						data={creditsData}
						mainTitle="Credits & Resources"
						subtitle="Built with passion by the React Bytes team and amazing open-source contributors."
					/>
				</motion.div>
			</section>
		</div>
	);
};

export default InstallationPage;
