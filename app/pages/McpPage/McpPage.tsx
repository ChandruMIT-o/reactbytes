"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Terminal, Cpu, Info, ShieldAlert, Settings, Sparkles } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";

import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";

const cursorConfigCode = `{
  "mcpServers": {
    "react-bytes": {
      "type": "sse",
      "url": "https://react-bytes.web.app/api/mcp"
    }
  }
}`;

const claudeConfigCode = `{
  "mcpServers": {
    "react-bytes": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/inspector",
        "sse",
        "https://react-bytes.web.app/api/mcp"
      ]
    }
  }
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

const CopyableCodeBlock: React.FC<{ code: string; filename?: string; language?: string }> = ({ code, filename, language = "json" }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const highlightedHtml = Prism.highlight(
		code,
		language === "json" ? Prism.languages.json : Prism.languages.typescript,
		language
	);

	return (
		<div className="relative group w-full bg-rb-neutral-3 p-1.5 rounded-[24px] border border-rb-neutral-4/50">
			{filename && (
				<div className="flex items-center justify-between px-5 py-2.5 text-xs font-mono text-rb-accent-2/40 border-b border-rb-neutral-4/20">
					<span>{filename}</span>
				</div>
			)}
			<div className="relative bg-rb-neutral-1 rounded-[18px] border border-rb-neutral-4 overflow-hidden">
				<pre className="p-5 overflow-auto max-h-[400px] text-sm font-mono text-rb-accent-2 leading-relaxed whitespace-pre scrollbar-thin">
					<code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
				</pre>
				<button
					onClick={handleCopy}
					className="absolute top-4 right-4 p-2.5 flex items-center justify-center rounded-full bg-rb-neutral-3 text-rb-accent-2/40 border border-rb-neutral-4 hover:text-rb-accent-1 hover:bg-rb-neutral-4 hover:border-rb-accent-2/30 transition-all duration-300 group/btn cursor-pointer"
					title="Copy configuration"
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

export const McpPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-rb-neutral-2 text-rb-accent-1 selection:bg-rb-accent-1/20 py-10 pb-40 space-y-24">
			{/* Hero Section */}
			<section
				id="mcp-header"
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
							Model Context Protocol
						</span>
					</motion.div>
					<motion.h1
						{...fadeUp(0.2)}
						className="text-5xl md:text-6xl font-bold tracking-tight text-rb-accent-1 mb-6 leading-[1.1]"
					>
						AI-Native{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-rb-accent-2 to-rb-accent-3">
							MCP Integration
						</span>
					</motion.h1>

					<motion.p
						{...fadeUp(0.3)}
						className="text-[16px] md:text-[17px] text-rb-accent-2/50 max-w-2xl mx-auto leading-relaxed font-light"
					>
						Expose React Bytes UI components directly to your AI assistants (like Cursor, Windsurf, or Claude Desktop). Enable your model to discover, read, and write clean TSX source codes automatically.
					</motion.p>
				</motion.div>
			</section>

			{/* MCP Setup Steps Section */}
			<section id="mcp-setup" className="max-w-4xl mx-auto w-full px-6 relative">
				<div className="relative flex flex-col gap-20">
					{/* Glowing vertical line connecting steps */}
					<div className="absolute left-6 top-6 bottom-6 w-[2px] bg-gradient-to-b from-rb-accent-2 via-rb-accent-3 to-rb-neutral-4 hidden md:block" />

					{/* Step 1 */}
					<motion.div {...fadeUp(0.4)} className="relative flex flex-col md:flex-row gap-8 pl-0 md:pl-16">
						<div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-rb-neutral-3 border border-rb-accent-2 flex items-center justify-center z-10 hidden md:flex">
							<span className="text-rb-accent-2 font-mono font-bold">1</span>
						</div>
						<div className="flex-1 space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-rb-neutral-3 border border-rb-accent-2 flex items-center justify-center md:hidden">
									<span className="text-rb-accent-2 font-mono font-bold text-xs">1</span>
								</div>
								<h3 className="text-xl font-bold text-rb-accent-1 flex items-center gap-2">
									<Settings size={18} className="text-rb-accent-2" />
									Configure Cursor / Windsurf
								</h3>
							</div>
							<p className="text-rb-accent-2/60 font-light text-[15px] leading-relaxed">
								To integrate React Bytes into Cursor, open your editor settings, go to <code className="text-rb-accent-2 font-mono bg-rb-neutral-3 px-2 py-0.5 rounded">Features &gt; MCP</code>, click <strong className="text-rb-accent-1">Add New MCP Server</strong>, and enter the configuration:
							</p>

							<div className="grid grid-cols-1 gap-2 bg-rb-neutral-3/30 border border-rb-neutral-4/40 p-5 rounded-2xl max-w-xl text-sm leading-relaxed text-rb-accent-2/80 font-mono">
								<div><strong>Name:</strong> react-bytes</div>
								<div><strong>Type:</strong> SSE</div>
								<div><strong>URL:</strong> https://react-bytes.web.app/api/mcp</div>
							</div>

							<p className="text-xs text-rb-accent-2/40 italic">
								Or directly configure it in your Cursor configuration file:
							</p>
							<CopyableCodeBlock code={cursorConfigCode} filename="~/.codeium/config.json or cursor settings" />
						</div>
					</motion.div>

					{/* Step 2 */}
					<motion.div {...fadeUp(0.5)} className="relative flex flex-col md:flex-row gap-8 pl-0 md:pl-16">
						<div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-rb-neutral-3 border border-rb-accent-3 flex items-center justify-center z-10 hidden md:flex">
							<span className="text-rb-accent-3 font-mono font-bold">2</span>
						</div>
						<div className="flex-1 space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-rb-neutral-3 border border-rb-accent-3 flex items-center justify-center md:hidden">
									<span className="text-rb-accent-3 font-mono font-bold text-xs">2</span>
								</div>
								<h3 className="text-xl font-bold text-rb-accent-1 flex items-center gap-2">
									<Terminal size={18} className="text-rb-accent-3" />
									Configure Claude Desktop
								</h3>
							</div>
							<p className="text-rb-accent-2/60 font-light text-[15px] leading-relaxed">
								Add the following server mapping to your global <code className="text-rb-accent-3 font-mono bg-rb-neutral-3 px-2 py-0.5 rounded">claude_desktop_config.json</code> to enable tool-calling for Claude Desktop:
							</p>

							<CopyableCodeBlock code={claudeConfigCode} filename="%APPDATA%/Claude/claude_desktop_config.json" />
						</div>
					</motion.div>
				</div>
			</section>

			{/* MCP Tools Usage Section */}
			<section id="mcp-usage" className="max-w-4xl mx-auto w-full px-6 space-y-8">
				<motion.div {...fadeUp(0.1)} className="mb-4">
					<div className="flex items-center gap-3 mb-2">
						<Cpu size={24} className="text-rb-accent-2" />
						<HeaderText text="Exposed Protocol Tools" option={4} />
					</div>
					<ParagraphText
						text="The MCP server exposes specialized tools designed to feed raw code and context directly to the LLM agent."
						option={4}
					/>
				</motion.div>

				<motion.div {...fadeUp(0.2)} className="space-y-6">
					{/* Tool 1 */}
					<div className="bg-rb-neutral-3/30 border border-rb-neutral-4/40 p-6 rounded-2xl hover:bg-rb-neutral-3/50 transition-colors space-y-3">
						<div className="flex items-center justify-between">
							<span className="px-3 py-1 text-xs font-semibold rounded-full bg-rb-accent-2/10 text-rb-accent-2 border border-rb-accent-2/20 font-mono">
								get_component
							</span>
							<span className="text-xs text-rb-accent-2/40">Tool ID: tools/call</span>
						</div>
						<h4 className="text-lg font-semibold text-rb-accent-1">Fetch Unified Code & Context</h4>
						<p className="text-sm text-rb-accent-2/70 font-light leading-relaxed">
							Retrieves the raw TSX component code from our dynamic build database, packages it with installation steps, dependency metadata, preset configurations, credits, and custom developer instructions (`context_from_dev`).
						</p>
						<div className="text-xs font-mono text-rb-accent-2/50 border-t border-rb-neutral-4/20 pt-3">
							Arguments: <code className="text-rb-accent-3 bg-rb-neutral-3/50 px-1.5 py-0.5 rounded">slug: string</code> (e.g. "magnetic-text")
						</div>
					</div>

					{/* Note Box */}
					<div className="flex gap-4 bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl text-emerald-400 text-sm leading-relaxed font-light">
						<Info size={20} className="shrink-0 mt-0.5" />
						<div>
							<strong className="font-bold text-rb-accent-1">LLM Optimized Output:</strong> The response format merges both source code and usage guidelines into a single, token-efficient text block. This allows AI subagents to fully comprehend constraints and drop component code into your project without reverse-engineering compiled JS bundles.
						</div>
					</div>
				</motion.div>
			</section>
		</div>
	);
};

export default McpPage;
