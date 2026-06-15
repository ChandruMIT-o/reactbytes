"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import HeaderText from "../../components/textfields/HeaderText";
import { ComponentRegistry } from "../../components/layout/ComponentRegistry";
import { 
	Check, 
	Search, 
	Layers, 
	Grid, 
	CheckCircle2, 
	ExternalLink, 
	RefreshCw, 
	Sparkles,
	AlertCircle,
	ListTodo
} from "lucide-react";

interface ComponentChecklist {
	id: string;
	label: string;
	category: "text" | "background" | "carousel" | "miscellaneous" | "cursor";
	props: boolean;
	presets: boolean;
	installation: boolean;
	api: boolean;
	credits: boolean;
	impact: boolean;
}

const CHECKLIST_FIELDS = [
	{ key: "props", label: "Check Props", desc: "Props defined & verified" },
	{ key: "presets", label: "Presets Work", desc: "Interactive states render" },
	{ key: "installation", label: "Installation", desc: "CLI & Manual commands" },
	{ key: "api", label: "API References", desc: "Props table matches meta" },
	{ key: "credits", label: "Check Credits", desc: "Attribution is correct" },
	{ key: "impact", label: "Impact Analysis", desc: "Performance & FPS tested" },
] as const;

export const AdminPage = () => {
	const [components, setComponents] = useState<ComponentChecklist[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedStatus, setSelectedStatus] = useState<string>("all"); // "all", "ready", "inprogress"
	const [refreshing, setRefreshing] = useState(false);

	const fetchChecklist = async (showRefresh = false) => {
		if (showRefresh) setRefreshing(true);
		try {
			const res = await fetch("/api/checklist");
			if (!res.ok) throw new Error("Failed to fetch checklist");
			const data = await res.json();
			const savedChecklist = data.checklist || {};

			const registryComponents = Object.values(ComponentRegistry)
				.filter((entry) => entry.category !== "general")
				.map((entry) => {
					const saved = savedChecklist[entry.id] || {};
					return {
						id: entry.id,
						label: entry.label,
						category: entry.category as any,
						props: !!saved.props,
						presets: !!saved.presets,
						installation: !!saved.installation,
						api: !!saved.api,
						credits: !!saved.credits,
						impact: !!saved.impact,
					};
				});

			setComponents(registryComponents);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchChecklist();
	}, []);

	// Grouping & Filtering
	const uniqueCategories = useMemo(() => {
		const cats = components.map((c) => c.category);
		return Array.from(new Set(cats));
	}, [components]);

	const totalComponents = components.length;
	const readyComponents = useMemo(() => {
		return components.filter(
			(c) => c.props && c.presets && c.installation && c.api && c.credits && c.impact
		).length;
	}, [components]);

	const percentReady = totalComponents > 0 ? Math.round((readyComponents / totalComponents) * 100) : 0;

	const filteredComponents = useMemo(() => {
		return components.filter((c) => {
			const matchesSearch = c.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
				c.id.toLowerCase().includes(searchQuery.toLowerCase());
			
			const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
			
			const isReady = c.props && c.presets && c.installation && c.api && c.credits && c.impact;
			const matchesStatus = 
				selectedStatus === "all" ||
				(selectedStatus === "ready" && isReady) ||
				(selectedStatus === "inprogress" && !isReady);

			return matchesSearch && matchesCategory && matchesStatus;
		});
	}, [components, searchQuery, selectedCategory, selectedStatus]);

	// Toggle a single checkbox
	const handleToggleField = async (componentId: string, field: string, currentValue: boolean) => {
		const newValue = !currentValue;
		
		// Optimistic Update
		setComponents((prev) =>
			prev.map((c) => (c.id === componentId ? { ...c, [field]: newValue } : c))
		);

		try {
			const res = await fetch("/api/checklist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ componentId, field, value: newValue }),
			});
			if (!res.ok) throw new Error();
		} catch (err) {
			// Rollback on failure
			setComponents((prev) =>
				prev.map((c) => (c.id === componentId ? { ...c, [field]: currentValue } : c))
			);
		}
	};

	// Mark all or Clear all for a component
	const handleBulkAction = async (componentId: string, action: "all" | "clear") => {
		const targetState = action === "all";
		const targetChecklist = {
			props: targetState,
			presets: targetState,
			installation: targetState,
			api: targetState,
			credits: targetState,
			impact: targetState,
		};

		// Optimistic Update
		setComponents((prev) =>
			prev.map((c) => (c.id === componentId ? { ...c, ...targetChecklist } : c))
		);

		try {
			const res = await fetch("/api/checklist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ componentId, checklist: targetChecklist }),
			});
			if (!res.ok) throw new Error();
		} catch (err) {
			// Refresh to roll back safely
			fetchChecklist();
		}
	};

	return (
		<div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-1 sm:px-4">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
				<div>
					<HeaderText text="Admin Dashboard" option={3} />
					<p className="text-sm text-rb-font-secondary mt-1">
						Component Registry Verification Checklist & Dispatch Progress
					</p>
				</div>
				<button
					onClick={() => fetchChecklist(true)}
					disabled={refreshing || loading}
					className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rb-neutral-3 border border-white/5 hover:bg-rb-neutral-4 text-rb-accent-2 text-sm transition-all duration-300 disabled:opacity-50 select-none self-start sm:self-auto cursor-pointer"
				>
					<RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
					Sync Status
				</button>
			</div>

			{loading ? (
				/* Loading skeleton layout */
				<div className="flex flex-col gap-6 py-10">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						{[1, 2, 3].map((n) => (
							<div key={n} className="h-32 bg-rb-neutral-3/20 border border-white/5 rounded-2xl animate-pulse" />
						))}
					</div>
					<div className="h-12 bg-rb-neutral-3/20 border border-white/5 rounded-xl animate-pulse w-full" />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[1, 2, 4].map((n) => (
							<div key={n} className="h-80 bg-rb-neutral-3/10 border border-white/5 rounded-2xl animate-pulse" />
						))}
					</div>
				</div>
			) : (
				<>
					{/* Stats Cards Dashboard */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						{/* Category card */}
						<div className="relative overflow-hidden bg-rb-neutral-3/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col justify-between group">
							<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-rb-accent-1 pointer-events-none">
								<Grid size={80} />
							</div>
							<div className="flex items-center gap-3 text-rb-font-secondary mb-2">
								<Grid size={18} className="text-rb-accent-3" />
								<span className="text-xs uppercase font-bold tracking-wider">Categories</span>
							</div>
							<div>
								<h2 className="text-4xl font-extrabold text-rb-accent-1 tracking-tight">
									{uniqueCategories.length}
								</h2>
								<p className="text-xs text-rb-font-secondary mt-1">
									Active layout categories
								</p>
							</div>
						</div>

						{/* Total components card */}
						<div className="relative overflow-hidden bg-rb-neutral-3/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col justify-between group">
							<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-rb-accent-1 pointer-events-none">
								<Layers size={80} />
							</div>
							<div className="flex items-center gap-3 text-rb-font-secondary mb-2">
								<Layers size={18} className="text-rb-accent-2" />
								<span className="text-xs uppercase font-bold tracking-wider">Total Components</span>
							</div>
							<div>
								<h2 className="text-4xl font-extrabold text-rb-accent-1 tracking-tight">
									{totalComponents}
								</h2>
								<p className="text-xs text-rb-font-secondary mt-1">
									Registered in ComponentRegistry
								</p>
							</div>
						</div>

						{/* Ready to dispatch card */}
						<div className="relative overflow-hidden bg-rb-neutral-3/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col justify-between group col-span-1 md:col-span-1">
							<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-rb-accent-1 pointer-events-none">
								<CheckCircle2 size={80} />
							</div>
							<div className="flex items-center gap-3 text-rb-font-secondary mb-2">
								<CheckCircle2 size={18} className="text-emerald-400" />
								<span className="text-xs uppercase font-bold tracking-wider">Ready to Dispatch</span>
							</div>
							<div>
								<div className="flex items-baseline gap-2">
									<h2 className="text-4xl font-extrabold text-rb-accent-1 tracking-tight">
										{readyComponents}
									</h2>
									<span className="text-sm text-rb-font-secondary">/ {totalComponents}</span>
									<span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full ml-auto font-medium">
										{percentReady}%
									</span>
								</div>
								
								{/* Custom dynamic progress bar */}
								<div className="w-full bg-rb-neutral-4 h-2 rounded-full overflow-hidden mt-3 relative">
									<motion.div 
										initial={{ width: 0 }}
										animate={{ width: `${percentReady}%` }}
										transition={{ duration: 0.8, ease: "easeOut" }}
										className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-rb-accent-2 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Filters Panel */}
					<div className="flex flex-col gap-4 bg-rb-neutral-3/20 border border-white/5 p-5 rounded-2xl">
						<div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
							{/* Search Input */}
							<div className="relative flex-1 max-w-md">
								<Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rb-font-secondary" />
								<input
									type="text"
									placeholder="Search components..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-11 pr-4 py-2.5 bg-rb-neutral-3/60 border border-white/5 rounded-xl text-rb-accent-1 placeholder-rb-font-secondary/40 focus:border-rb-accent-2/40 focus:ring-1 focus:ring-rb-accent-2/20 outline-none text-sm transition-all"
								/>
							</div>

							{/* Status dropdown filter */}
							<div className="flex items-center gap-2 self-end md:self-auto">
								<span className="text-xs text-rb-font-secondary uppercase font-bold tracking-wider hidden sm:inline">Status:</span>
								<div className="flex bg-rb-neutral-3/50 p-1 border border-white/5 rounded-xl">
									{[
										{ id: "all", label: "All" },
										{ id: "ready", label: "Ready" },
										{ id: "inprogress", label: "In Progress" },
									].map((opt) => (
										<button
											key={opt.id}
											onClick={() => setSelectedStatus(opt.id)}
											className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
												selectedStatus === opt.id
													? "bg-rb-accent-2 text-rb-neutral-2 font-bold shadow-md"
													: "text-rb-font-secondary hover:text-rb-accent-1"
											}`}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>
						</div>

						{/* Category Filter Horizontal Scroll */}
						<div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4 overflow-x-auto scrollbar-none">
							<span className="text-xs text-rb-font-secondary uppercase font-bold tracking-wider mr-2">Category:</span>
							{[
								{ id: "all", label: "All Categories" },
								{ id: "text", label: "Text" },
								{ id: "background", label: "Background" },
								{ id: "carousel", label: "Carousels" },
								{ id: "miscellaneous", label: "Miscellaneous" },
								{ id: "cursor", label: "Cursors" },
							].map((cat) => (
								<button
									key={cat.id}
									onClick={() => setSelectedCategory(cat.id)}
									className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-300 border ${
										selectedCategory === cat.id
											? "bg-rb-accent-1 border-rb-accent-1 text-rb-neutral-2 hover:opacity-95"
											: "bg-transparent border-white/5 text-rb-font-secondary hover:text-rb-accent-1 hover:border-white/10"
									}`}
								>
									{cat.label}
								</button>
							))}
						</div>
					</div>

					{/* Component Grid */}
					<div className="flex flex-col gap-6">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-semibold text-rb-font-secondary flex items-center gap-2">
								<ListTodo size={16} />
								Showing {filteredComponents.length} components
							</h3>
						</div>

						<AnimatePresence mode="popLayout">
							{filteredComponents.length === 0 ? (
								<motion.div 
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex flex-col items-center justify-center py-20 bg-rb-neutral-3/10 border border-white/5 rounded-2xl text-center"
								>
									<AlertCircle size={40} className="text-rb-accent-2/30 mb-3" />
									<h4 className="text-rb-accent-2 font-semibold">No Components Found</h4>
									<p className="text-xs text-rb-font-secondary mt-1">
										Try adjusting your search query or status filters.
									</p>
								</motion.div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{filteredComponents.map((comp) => {
										const isFullyReady = comp.props && comp.presets && comp.installation && comp.api && comp.credits && comp.impact;
										return (
											<motion.div
												key={comp.id}
												layout
												initial={{ opacity: 0, y: 12 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, scale: 0.95 }}
												transition={{ duration: 0.3 }}
												whileHover={{ y: -2 }}
												className={`flex flex-col bg-rb-neutral-3/30 border rounded-2xl overflow-hidden transition-all duration-300 ${
													isFullyReady 
														? "border-emerald-500/15 shadow-[0_4px_20px_rgba(16,185,129,0.02)]" 
														: "border-white/5"
												}`}
											>
												{/* Component Info Card Header */}
												<div className={`p-5 flex items-start justify-between gap-4 border-b ${
													isFullyReady ? "border-emerald-500/10 bg-emerald-500/[0.01]" : "border-white/5 bg-white/[0.005]"
												}`}>
													<div className="flex flex-col gap-1.5">
														<Link 
															href={`/${comp.id}`}
															className="group/link flex items-center gap-1.5 text-lg font-bold text-rb-accent-1 hover:text-rb-accent-2 transition-colors"
														>
															{comp.label}
															<ExternalLink size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-rb-accent-2" />
														</Link>
														<div className="flex items-center gap-2">
															<span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-rb-neutral-4 text-rb-font-secondary font-semibold">
																{comp.category}
															</span>
														</div>
													</div>

													{/* Status badge */}
													<div>
														{isFullyReady ? (
															<span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.1)]">
																<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
																Ready
															</span>
														) : (
															<span className="inline-flex items-center gap-1.5 text-xs font-bold text-rb-accent-2 bg-rb-accent-2/10 border border-rb-accent-2/20 px-3 py-1 rounded-full">
																<span className="w-1.5 h-1.5 rounded-full bg-rb-accent-2/60" />
																In Progress
															</span>
														)}
													</div>
												</div>

												{/* Grid of 6 checklist switches */}
												<div className="p-5 flex-1 flex flex-col justify-between gap-5">
													<div className="grid grid-cols-2 gap-3">
														{CHECKLIST_FIELDS.map((field) => {
															const isChecked = !!comp[field.key as keyof ComponentChecklist];
															return (
																<button
																	key={field.key}
																	onClick={() => handleToggleField(comp.id, field.key, isChecked)}
																	className={`group p-3 flex flex-col text-left rounded-xl border transition-all duration-300 active:scale-[0.98] select-none cursor-pointer ${
																		isChecked
																			? "bg-rb-accent-2/10 border-rb-accent-2/30 text-rb-accent-1 shadow-[0_0_12px_rgba(230,223,241,0.02)]"
																			: "bg-rb-neutral-3/20 border-white/5 text-rb-font-secondary/80 hover:border-white/10 hover:text-rb-accent-1 hover:bg-rb-neutral-4/20"
																	}`}
																>
																	<div className="flex items-center justify-between w-full mb-1">
																		<span className={`text-[13px] font-bold transition-colors ${
																			isChecked ? "text-rb-accent-2" : "text-rb-font-primary/90"
																		}`}>
																			{field.label}
																		</span>
																		<div className={`w-[18px] h-[18px] flex items-center justify-center rounded border transition-all duration-200 ${
																			isChecked 
																				? "bg-rb-accent-2 border-rb-accent-2 text-rb-neutral-2" 
																				: "border-white/20 group-hover:border-white/40"
																		}`}>
																			{isChecked && <Check size={12} strokeWidth={3} />}
																		</div>
																	</div>
																	<span className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">
																		{field.desc}
																	</span>
																</button>
															);
														})}
													</div>

													{/* Bulk actions footer */}
													<div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
														<span className="text-[11px] text-rb-font-secondary">
															{Object.values(comp).filter(Boolean).length - 3} of 6 complete
														</span>
														<div className="flex items-center gap-2">
															<button
																onClick={() => handleBulkAction(comp.id, "clear")}
																className="text-xs px-2.5 py-1 text-rb-font-secondary hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
															>
																Clear All
															</button>
															<button
																onClick={() => handleBulkAction(comp.id, "all")}
																className="text-xs px-2.5 py-1 text-rb-accent-2 hover:bg-rb-accent-2/10 border border-rb-accent-2/20 hover:border-rb-accent-2/40 rounded-lg transition-all cursor-pointer font-medium"
															>
																Mark Complete
															</button>
														</div>
													</div>
												</div>
											</motion.div>
										);
									})}
								</div>
							)}
						</AnimatePresence>
					</div>
				</>
			)}
		</div>
	);
};

export default AdminPage;
