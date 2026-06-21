"use client";
import React, { useState, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { createLayout, stagger, random } from "animejs";
import { flushSync } from "react-dom";

export interface InstallationTabsProps {
	cliCommand?: string;
	manualCommand?: string;
	componentName?: string;
	extraLibraries?: string[];
}

interface Token {
	text: string;
	className: string;
	layoutId: string;
}

const tokenizeCommand = (code: string): Token[] => {
	const keywordSet = /^(const|let|var|function|return|if|else|for|while|new|this|true|false|null|undefined|async|await|import|export|from|class|extends|pnpm|npm|yarn|bun|add|install|i|git|clone)$/;
	const tokenRegex = /(['"`])(?:\\.|[^\\])*?\1|[a-zA-Z_$][a-zA-Z0-9_$]*|\s+|[^a-zA-Z_$'"`\s]+/g;
	
	const tokens = code.match(tokenRegex) || [];
	const counts: { [key: string]: number } = {};
	
	return tokens.map((t, idx) => {
		if (/^\s+$/.test(t)) {
			return {
				text: t,
				className: "whitespace",
				layoutId: "",
			};
		}
		counts[t] = (counts[t] || 0) + 1;
		const layoutId = `${t}-${counts[t]}`;
		
		let className = "text-rb-accent-1"; // default
		if (/^['"`]/.test(t)) {
			className = "text-emerald-400"; // string
		} else if (/^[a-zA-Z_$]/.test(t)) {
			if (keywordSet.test(t)) {
				className = "text-rb-accent-1 font-semibold"; // keyword
			} else {
				className = "text-rb-accent-2"; // variable/other
			}
		} else {
			className = "text-rb-accent-2/50"; // operator/symbol
		}
		
		return {
			text: t,
			className,
			layoutId,
		};
	});
};

export const InstallationTabs: React.FC<InstallationTabsProps> = ({
	cliCommand,
	manualCommand,
	componentName,
	extraLibraries,
}) => {
	const [activeTab, setActiveTab] = useState<"CLI" | "Manual">("CLI");
	const [activePkgManager, setActivePkgManager] = useState<"pnpm" | "npm" | "yarn" | "bun">("pnpm");
	const [copied, setCopied] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const layoutRef = useRef<any>(null);

	// Try to extract component name from cliCommand if componentName is not provided
	let derivedComponentName = componentName;
	if (!derivedComponentName && cliCommand) {
		const match = cliCommand.match(/(?:pnpm add|npm i|yarn add|bun add|npm install)\s+([@a-zA-Z0-9\-\/]+)/);
		if (match) {
			derivedComponentName = match[1];
		}
	}

	const showPkgSelector = !!(derivedComponentName || (extraLibraries && extraLibraries.length > 0));

	// Generate the CLI command based on package manager
	let cliCommandToDisplay = "";
	if (derivedComponentName) {
		switch (activePkgManager) {
			case "pnpm":
				cliCommandToDisplay = `pnpm add ${derivedComponentName}`;
				break;
			case "npm":
				cliCommandToDisplay = `npm i ${derivedComponentName}`;
				break;
			case "yarn":
				cliCommandToDisplay = `yarn add ${derivedComponentName}`;
				break;
			case "bun":
				cliCommandToDisplay = `bun add ${derivedComponentName}`;
				break;
		}
	} else {
		cliCommandToDisplay = cliCommand || "npm install react-bytes";
	}

	// Generate the Manual command based on package manager and extra libraries
	let manualCommandToDisplay = "";
	if (extraLibraries && extraLibraries.length > 0) {
		const libs = extraLibraries.join(" ");
		switch (activePkgManager) {
			case "pnpm":
				manualCommandToDisplay = `pnpm add ${libs}`;
				break;
			case "npm":
				manualCommandToDisplay = `npm i ${libs}`;
				break;
			case "yarn":
				manualCommandToDisplay = `yarn add ${libs}`;
				break;
			case "bun":
				manualCommandToDisplay = `bun add ${libs}`;
				break;
		}
	}

	useEffect(() => {
		if (containerRef.current) {
			layoutRef.current = (createLayout as any)(containerRef.current, {
				duration: 750,
				delay: 50,
				ease: "inOutExpo",
				enterFrom: {
					opacity: 0,
					scale: 0.9,
					duration: 600,
					delay: 50,
				},
				leaveTo: {
					opacity: 0,
					transform: () => `translate(${(random as any)(-40, 40)}px, ${(random as any)(-120, 120)}px) rotate(${(random as any)(-20, 20)}deg)`,
					duration: 550,
					delay: (stagger as any)([0, 150], { from: "random" }),
					ease: "out(3)",
				},
			});
		}
		return () => {
			if (layoutRef.current) {
				layoutRef.current = null;
			}
		};
	}, []);

	const handleTabChange = (tab: "CLI" | "Manual") => {
		if (layoutRef.current) {
			layoutRef.current.update(() => {
				flushSync(() => {
					setActiveTab(tab);
				});
			});
		} else {
			setActiveTab(tab);
		}
	};

	const handlePkgChange = (pkg: "pnpm" | "npm" | "yarn" | "bun") => {
		if (layoutRef.current) {
			layoutRef.current.update(() => {
				flushSync(() => {
					setActivePkgManager(pkg);
				});
			});
		} else {
			setActivePkgManager(pkg);
		}
	};

	const handleCopy = () => {
		let text = "";
		if (activeTab === "CLI") {
			text = cliCommandToDisplay;
		} else {
			if (extraLibraries && extraLibraries.length > 0) {
				text = manualCommandToDisplay;
			} else {
				text = manualCommand || "";
			}
		}
		if (text) {
			navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const springConfig = {
		type: "spring",
		stiffness: 260,
		damping: 30,
	} as const;

	const renderTokens = (command: string) => {
		const tokens = tokenizeCommand(command);
		return tokens.map((token, index) => {
			if (token.className === "whitespace") {
				return <span key={index}>{token.text}</span>;
			}
			return (
				<span
					key={index}
					data-layout-id={token.layoutId}
					className={`${token.className} inline-block`}
				>
					{token.text}
				</span>
			);
		});
	};

	return (
		<div className="w-full max-w-4xl font-sans">
			{/* Tabs Header Row */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 w-full mb-0">
				{/* CLI / Manual Tabs */}
				<div className="bg-rb-neutral-3 p-1.5 pb-0 rounded-t-[20px] flex gap-1.5 w-max">
					{(["CLI", "Manual"] as const).map((tab) => (
						<motion.button
							key={tab}
							onClick={() => handleTabChange(tab)}
							className="relative px-3 py-1.5 text-[16px] font-medium rounded-full outline-none transition-colors duration-300 cursor-pointer"
							style={{
								color:
									activeTab === tab
										? "var(--rb-neutral-2)"
										: "var(--rb-accent-2)",
							}}
							whileHover="hover"
						>
							<span className="relative z-[1]">{tab}</span>

							{activeTab === tab && (
								<motion.div
									layoutId="install-active-pill"
									className="absolute inset-0 bg-rb-accent-1 rounded-full z-0"
									transition={springConfig}
								/>
							)}

							{activeTab !== tab && (
								<motion.div
									className="absolute inset-0 rounded-full z-0"
									variants={{
										hover: {
											backgroundColor: "var(--rb-neutral-4)",
										},
									}}
									transition={{ duration: 0.2 }}
								/>
							)}
						</motion.button>
					))}
				</div>

				{/* Package Manager Tabs */}
				{showPkgSelector && (
					<div className="bg-rb-neutral-3 p-2 pb-0 rounded-t-[20px] flex gap-1.5 w-max sm:self-end">
						{(["pnpm", "npm", "yarn", "bun"] as const).map((pkg) => (
							<motion.button
								key={pkg}
								onClick={() => handlePkgChange(pkg)}
								className="relative px-2.5 py-1.5 text-sm font-medium rounded-full outline-none transition-colors duration-300 cursor-pointer"
								style={{
									color:
										activePkgManager === pkg
											? "var(--rb-neutral-2)"
											: "var(--rb-accent-2)",
								}}
								whileHover="hover"
							>
								<span className="relative z-[1]">{pkg}</span>

								{activePkgManager === pkg && (
									<motion.div
										layoutId="pkg-active-pill"
										className="absolute inset-0 bg-rb-accent-1 rounded-full z-0"
										transition={springConfig}
									/>
								)}

								{activePkgManager !== pkg && (
									<motion.div
										className="absolute inset-0 rounded-full z-0"
										variants={{
											hover: {
												backgroundColor: "var(--rb-neutral-4)",
											},
										}}
										transition={{ duration: 0.2 }}
									/>
								)}
							</motion.button>
						))}
					</div>
				)}
			</div>

			{/* Main Content Outer Wrapper (Acts as the thick grey border) */}
			<div className="bg-rb-neutral-3 p-1.5 rounded-[24px] sm:rounded-tl-none sm:rounded-tr-none w-full relative">
				{/* Actual Content Area */}
				<div
					ref={containerRef}
					className="bg-rb-neutral-1 rounded-[18px] w-full p-5 pr-14 text-rb-accent-2/60 font-mono text-[16px] border border-rb-neutral-4 min-h-[82px] flex flex-col justify-center overflow-hidden"
				>
					{activeTab === "CLI" ? (
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-3">
								<span data-layout-id="dollar" className="text-rb-accent-1 select-none inline-block">
									$
								</span>
								<span className="inline-block text-rb-accent-1">
									{renderTokens(cliCommandToDisplay)}
								</span>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-3 font-sans">
							{manualCommand && (
								<p data-layout-id="manual-instruction" className="text-rb-accent-2/80 text-sm leading-relaxed block">
									{manualCommand}
								</p>
							)}

							{extraLibraries && extraLibraries.length > 0 ? (
								<div className="flex items-center gap-3 font-mono text-[16px]">
									<span data-layout-id="dollar" className="text-rb-accent-1 select-none inline-block">
										$
									</span>
									<span className="inline-block text-rb-accent-1">
										{renderTokens(manualCommandToDisplay)}
									</span>
								</div>
							) : (
								!manualCommand && (
									<p className="text-sm text-rb-accent-2/50 font-sans italic">
										No dependencies required for manual installation.
									</p>
								)
							)}
						</div>
					)}
				</div>

				{/* Copy Button */}
				<button
					onClick={handleCopy}
					className="absolute top-4 right-4 p-2.5 items-center justify-center rounded-full bg-rb-neutral-3 text-rb-accent-2/40 border border-rb-neutral-4 hover:text-rb-accent-2 hover:bg-rb-neutral-4 transition-all group cursor-pointer"
					title="Copy to clipboard"
				>
					{copied ? (
						<Check size={14} className="text-emerald-500" />
					) : (
						<Copy
							size={14}
							className="group-hover:scale-110 transition-transform"
						/>
					)}
				</button>
			</div>
		</div>
	);
};

export default InstallationTabs;
