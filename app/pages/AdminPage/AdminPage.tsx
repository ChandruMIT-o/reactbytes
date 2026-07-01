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
	ListTodo,
	Lock,
	LogOut,
	ShieldAlert,
	Mail,
	Key,
	TrendingUp,
	Users,
	BarChart2,
	MousePointerClick,
	RefreshCcw
} from "lucide-react";

// Firebase Imports
import { 
	signInWithPopup, 
	GoogleAuthProvider, 
	signInWithEmailAndPassword, 
	signOut,
	onAuthStateChanged,
	User
} from "firebase/auth";
import { 
	doc, 
	getDoc, 
	collection, 
	query, 
	where, 
	getDocs, 
	orderBy, 
	limit,
	Timestamp 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Recharts Imports
import {
	AreaChart,
	Area,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
	PieChart,
	Pie,
	Cell
} from "recharts";

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
	// Active Tab inside Dashboard ("analytics" | "checklist")
	const [activeAdminTab, setActiveAdminTab] = useState<"analytics" | "checklist">("analytics");

	// Authentication state
	const [user, setUser] = useState<User | null>(null);
	const [isAdminState, setIsAdminState] = useState<boolean>(false);
	const [authLoading, setAuthLoading] = useState<boolean>(true);
	
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginError, setLoginError] = useState("");
	const [signingIn, setSigningIn] = useState(false);

	// Checklist states
	const [components, setComponents] = useState<ComponentChecklist[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedStatus, setSelectedStatus] = useState<string>("all"); // "all", "ready", "inprogress"
	const [refreshing, setRefreshing] = useState(false);

	// Analytics states
	const [analyticsData, setAnalyticsData] = useState<any[]>([]);
	const [popularComponents, setPopularComponents] = useState<any[]>([]);
	const [pieData, setPieData] = useState<any[]>([]);
	const [analyticsLoading, setAnalyticsLoading] = useState(true);
	const [analyticsRefreshing, setAnalyticsRefreshing] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Firebase Auth Listener
	useEffect(() => {
		if (!auth) {
			setAuthLoading(false);
			setLoginError("Firebase credentials are not configured. Please create a .env.local file in the project root containing your Firebase configuration.");
			return;
		}
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);
			if (currentUser && currentUser.email && db) {
				try {
					// Check if user is in Firestore 'admins' collection
					const adminDoc = await getDoc(doc(db, "admins", currentUser.email));
					if (adminDoc.exists()) {
						setIsAdminState(true);
					} else {
						setIsAdminState(false);
					}
				} catch (err) {
					console.error("Error checking admin status:", err);
					setIsAdminState(false);
				}
			} else {
				setIsAdminState(false);
			}
			setAuthLoading(false);
		});
		return () => unsubscribe();
	}, []);

	// Fetch checklist checklist
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

	// Query stats data from Firestore
	const fetchAnalyticsData = async (showRefresh = false) => {
		if (showRefresh) setAnalyticsRefreshing(true);
		setAnalyticsLoading(true);
		try {
			// Query last 14 days of stats
			const statsQ = query(
				collection(db, "daily_stats"),
				orderBy("date", "desc"),
				limit(14)
			);
			const snapshot = await getDocs(statsQ);
			let dailyStatsList: any[] = [];
			snapshot.forEach(doc => {
				dailyStatsList.push(doc.data());
			});
			
			// Compute live data for today so stats are real-time
			const startOfToday = new Date();
			startOfToday.setHours(0, 0, 0, 0);
			const startTimestamp = Timestamp.fromDate(startOfToday);
			
			// Query page views for today
			const pvQ = query(collection(db, "page_views"), where("timestamp", ">=", startTimestamp));
			const pvSnap = await getDocs(pvQ);
			const uniqueSessions = new Set<string>();
			let totalPV = 0;
			pvSnap.forEach(doc => {
				totalPV++;
				const data = doc.data();
				if (data.session_id) uniqueSessions.add(data.session_id);
			});

			// Query interaction events for today
			const reQ = query(collection(db, "raw_events"), where("timestamp", ">=", startTimestamp));
			const reSnap = await getDocs(reQ);
			
			let todayCopies = 0;
			let todayCopyCode = 0;
			let todayCopyInstall = 0;
			const todayComponents: Record<string, { copy_code: number; copy_install: number; total: number }> = {};
			
			reSnap.forEach(doc => {
				const data = doc.data();
				const compId = data.component_id || "unknown";
				const type = data.interaction_type;
				
				if (!todayComponents[compId]) {
					todayComponents[compId] = { copy_code: 0, copy_install: 0, total: 0 };
				}
				
				if (type === "copy_code") {
					todayComponents[compId].copy_code++;
					todayCopyCode++;
					todayCopies++;
				} else if (type === "copy_install") {
					todayComponents[compId].copy_install++;
					todayCopyInstall++;
					todayCopies++;
				}
				todayComponents[compId].total++;
			});

			const todayStats = {
				date: new Date().toISOString().split("T")[0],
				unique_visitors: uniqueSessions.size,
				total_page_views: totalPV,
				total_copies: todayCopies,
				total_copy_code: todayCopyCode,
				total_copy_install: todayCopyInstall,
				components: todayComponents,
				isLive: true
			};

			// Add today's stats if they exist or replace the aggregated one for today
			const existingTodayIndex = dailyStatsList.findIndex(s => s.date === todayStats.date);
			if (existingTodayIndex > -1) {
				dailyStatsList[existingTodayIndex] = todayStats;
			} else {
				dailyStatsList.unshift(todayStats);
			}

			// Reverse so it's chronologically ascending
			dailyStatsList.reverse();

			// Format daily stats for charts
			const formattedStats = dailyStatsList.map(s => ({
				date: s.date.slice(5), // MM-DD format
				visitors: s.unique_visitors || 0,
				pageViews: s.total_page_views || 0,
				copies: s.total_copies || 0,
				copyCode: s.total_copy_code || 0,
				copyInstall: s.total_copy_install || 0
			}));
			setAnalyticsData(formattedStats);

			// Aggregate component stats for component popularity table/chart
			const componentAgg: Record<string, { name: string; copyCode: number; copyInstall: number; total: number }> = {};
			let overallCopyCode = 0;
			let overallCopyInstall = 0;

			dailyStatsList.forEach(day => {
				if (!day.components) return;
				Object.entries(day.components).forEach(([id, data]: [string, any]) => {
					const compName = Object.values(ComponentRegistry).find(c => c.id === id)?.label || id;
					if (!componentAgg[id]) {
						componentAgg[id] = { name: compName, copyCode: 0, copyInstall: 0, total: 0 };
					}
					componentAgg[id].copyCode += data.copy_code || 0;
					componentAgg[id].copyInstall += data.copy_install || 0;
					componentAgg[id].total += data.total || 0;

					overallCopyCode += data.copy_code || 0;
					overallCopyInstall += data.copy_install || 0;
				});
			});

			const popularList = Object.values(componentAgg)
				.sort((a, b) => b.total - a.total)
				.slice(0, 10); // Top 10

			setPopularComponents(popularList);
			setPieData([
				{ name: "Copy Code", value: overallCopyCode, color: "#a78bfa" },
				{ name: "Copy Install", value: overallCopyInstall, color: "#34d399" }
			]);
		} catch (error) {
			console.error("Error querying analytics stats:", error);
		} finally {
			setAnalyticsLoading(false);
			setAnalyticsRefreshing(false);
		}
	};

	// Auth Actions
	const handleGoogleLogin = async () => {
		if (!auth) return;
		setLoginError("");
		setSigningIn(true);
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
		} catch (err: any) {
			setLoginError(err.message || "Failed to log in with Google");
			setSigningIn(false);
		}
	};

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password || !auth) return;
		setLoginError("");
		setSigningIn(true);
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (err: any) {
			setLoginError(err.message || "Failed to log in. Please check credentials.");
			setSigningIn(false);
		}
	};

	const handleLogout = async () => {
		if (!auth) return;
		try {
			await signOut(auth);
		} catch (err) {
			console.error("Logout failed:", err);
		}
	};

	// Load data when authenticated
	useEffect(() => {
		if (isAdminState) {
			fetchChecklist();
			fetchAnalyticsData();
		}
	}, [isAdminState]);

	// Toggles and bulk actions for checklist (kept exactly same)
	const handleToggleField = async (componentId: string, field: string, currentValue: boolean) => {
		const newValue = !currentValue;
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
			setComponents((prev) =>
				prev.map((c) => (c.id === componentId ? { ...c, [field]: currentValue } : c))
			);
		}
	};

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
			fetchChecklist();
		}
	};

	// Manual aggregation helper
	const handleManualAggregation = async () => {
		setAnalyticsRefreshing(true);
		try {
			// Trigger local / remote Cloud Function
			const functionUrl = "https://triggerstatsaggregation-us-central1-react-bytes.cloudfunctions.net/triggerStatsAggregation";
			// Or invoke local Next.js proxy/endpoint or functions URL
			await fetch(functionUrl, { method: "POST" }).catch(() => {});
			// Re-fetch client side live statistics
			await fetchAnalyticsData(true);
		} catch (error) {
			console.error(error);
		} finally {
			setAnalyticsRefreshing(false);
		}
	};

	// Calculations for checklist stats
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

	// Render Loading state
	if (authLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<RefreshCw size={36} className="animate-spin text-rb-accent-1" />
				<span className="text-rb-font-secondary text-sm font-semibold tracking-wider uppercase">Verifying Authorization...</span>
			</div>
		);
	}

	// Render Login Screen if not Admin
	if (!user || !isAdminState) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md bg-rb-neutral-3/20 backdrop-blur-md border border-white/5 p-8 rounded-[24px] shadow-2xl flex flex-col relative overflow-hidden"
				>
					{/* Gradient highlight behind */}
					<div className="absolute -top-10 -right-10 w-40 h-40 bg-rb-accent-1/10 rounded-full blur-2xl pointer-events-none" />
					<div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

					<div className="flex items-center gap-3 mb-6">
						<div className="p-3 bg-rb-accent-2/10 rounded-2xl border border-rb-accent-2/20 text-rb-accent-2">
							<Lock size={20} />
						</div>
						<div>
							<h2 className="text-xl font-bold text-rb-accent-1">Admin Dashboard Portal</h2>
							<p className="text-xs text-rb-font-secondary mt-0.5">Authorization Required</p>
						</div>
					</div>

					{user && !isAdminState ? (
						<div className="flex flex-col gap-4 py-4 text-center">
							<div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 flex items-start gap-3 text-left">
								<ShieldAlert size={20} className="shrink-0 text-rose-400" />
								<div className="text-xs">
									<p className="font-bold">Access Denied</p>
									<p className="mt-1 leading-relaxed">
										You are logged in as <strong>{user.email}</strong>, but this account is not registered as an administrator in the database.
									</p>
								</div>
							</div>
							<p className="text-xs text-rb-font-secondary">
								Please contact the database owner or log in with an authorized administrator account.
							</p>
							<button 
								onClick={handleLogout}
								className="mt-2 w-full py-3 bg-rb-neutral-3 border border-white/5 rounded-xl hover:bg-rb-neutral-4 text-rb-accent-1 text-sm font-semibold transition-all cursor-pointer select-none flex items-center justify-center gap-2"
							>
								<LogOut size={14} />
								Sign Out & Try Again
							</button>
						</div>
					) : (
						<form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
							{loginError && (
								<div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2 font-medium">
									<AlertCircle size={14} className="shrink-0" />
									<span>{loginError}</span>
								</div>
							)}

							<div className="flex flex-col gap-1.5">
								<label className="text-xs text-rb-font-secondary font-bold uppercase tracking-wider">Email Address</label>
								<div className="relative">
									<Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rb-font-secondary/50" />
									<input 
										type="email" 
										placeholder="admin@reactbytes.com"
										value={email}
										onChange={e => setEmail(e.target.value)}
										required
										className="w-full pl-11 pr-4 py-3 bg-rb-neutral-3/50 border border-white/5 rounded-xl text-rb-accent-1 placeholder-rb-font-secondary/30 focus:border-rb-accent-2/40 outline-none text-sm transition-all"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-xs text-rb-font-secondary font-bold uppercase tracking-wider">Password</label>
								<div className="relative">
									<Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rb-font-secondary/50" />
									<input 
										type="password" 
										placeholder="••••••••"
										value={password}
										onChange={e => setPassword(e.target.value)}
										required
										className="w-full pl-11 pr-4 py-3 bg-rb-neutral-3/50 border border-white/5 rounded-xl text-rb-accent-1 placeholder-rb-font-secondary/30 focus:border-rb-accent-2/40 outline-none text-sm transition-all"
									/>
								</div>
							</div>

							<button 
								type="submit" 
								disabled={signingIn}
								className="mt-2 w-full py-3 bg-rb-accent-2 text-rb-neutral-2 font-extrabold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center select-none"
							>
								{signingIn ? <RefreshCw size={16} className="animate-spin text-rb-neutral-2" /> : "Sign In with Credentials"}
							</button>

							<div className="relative my-2 flex items-center justify-center">
								<div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
								<span className="relative z-10 px-3 bg-rb-neutral-2 text-[10px] uppercase font-bold tracking-widest text-rb-font-secondary/50">Or</span>
							</div>

							<button 
								type="button" 
								onClick={handleGoogleLogin} 
								disabled={signingIn}
								className="w-full py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-rb-accent-1 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-3 select-none"
							>
								<svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
									<path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.76 14.93 1 12 1 7.37 1 3.4 3.65 1.39 7.54l3.77 2.92C6.07 7.23 8.79 5.04 12 5.04z" />
									<path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.45h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.71 2.88c2.17-2 3.71-4.94 3.71-8.56z" />
									<path fill="#FBBC05" d="M5.16 14.86a7.22 7.22 0 010-4.52l-3.77-2.92a11.95 11.95 0 000 10.36l3.77-2.92z" />
									<path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.71-2.88c-1.03.69-2.35 1.1-4.25 1.1-3.21 0-5.93-2.19-6.9-5.42l-3.77 2.92C3.4 20.35 7.37 23 12 23z" />
								</svg>
								Continue with Google
							</button>
						</form>
					)}
				</motion.div>
			</div>
		);
	}

	// Render Main Dashboard Portal
	return (
		<div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-1 sm:px-4">
			{/* Admin Header with Logout */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
				<div>
					<HeaderText text="Admin Portal" option={3} />
					<p className="text-sm text-rb-font-secondary mt-1">
						React Bytes platform system diagnostics, usage logging, and checklist tracking
					</p>
				</div>
				<div className="flex items-center gap-3 self-start sm:self-auto">
					{/* Active tab switcher */}
					<div className="flex bg-rb-neutral-3/50 p-1 border border-white/5 rounded-xl">
						<button
							onClick={() => setActiveAdminTab("analytics")}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
								activeAdminTab === "analytics"
									? "bg-rb-accent-2 text-rb-neutral-2 font-bold shadow-md"
									: "text-rb-font-secondary hover:text-rb-accent-1"
							}`}
						>
							<BarChart2 size={13} />
							Analytics
						</button>
						<button
							onClick={() => setActiveAdminTab("checklist")}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
								activeAdminTab === "checklist"
									? "bg-rb-accent-2 text-rb-neutral-2 font-bold shadow-md"
									: "text-rb-font-secondary hover:text-rb-accent-1"
							}`}
						>
							<ListTodo size={13} />
							Registry Checklist
						</button>
					</div>

					<button
						onClick={handleLogout}
						className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 text-rb-font-secondary hover:text-rose-400 text-xs transition-all cursor-pointer select-none"
						title="Sign Out"
					>
						<LogOut size={13} />
						Logout
					</button>
				</div>
			</div>

			{activeAdminTab === "analytics" ? (
				/* ANALYTICS TAB CONTENT */
				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-bold text-rb-accent-1">Traffic & Event Monitoring</h3>
							<p className="text-xs text-rb-font-secondary mt-0.5">Aggregated daily statistics and copy interaction logs</p>
						</div>
						<button
							onClick={() => fetchAnalyticsData(true)}
							disabled={analyticsLoading || analyticsRefreshing}
							className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rb-neutral-3 border border-white/5 hover:bg-rb-neutral-4 text-rb-accent-2 text-sm transition-all duration-300 disabled:opacity-50 select-none cursor-pointer"
						>
							<RefreshCw size={14} className={analyticsRefreshing ? "animate-spin" : ""} />
							Refresh Data
						</button>
					</div>

					{analyticsLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
							{[1, 2, 3].map(n => (
								<div key={n} className="h-32 bg-rb-neutral-3/20 border border-white/5 rounded-2xl animate-pulse" />
							))}
							<div className="h-80 bg-rb-neutral-3/10 border border-white/5 rounded-2xl animate-pulse col-span-1 md:col-span-3" />
						</div>
					) : (
						<>
							{/* Analytics Metrics Cards */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
								{/* Total Unique Visitors */}
								<div className="relative overflow-hidden bg-rb-neutral-3/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col justify-between group">
									<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-rb-accent-1 pointer-events-none">
										<Users size={60} />
									</div>
									<div className="flex items-center gap-3 text-rb-font-secondary mb-2">
										<Users size={16} className="text-rb-accent-3" />
										<span className="text-xs uppercase font-bold tracking-wider">Unique Visitors (14d)</span>
									</div>
									<div>
										<h2 className="text-3xl font-extrabold text-rb-accent-1 tracking-tight">
											{analyticsData.reduce((acc, curr) => acc + curr.visitors, 0)}
										</h2>
										<p className="text-[10px] text-rb-font-secondary mt-1">
											Sum of unique visitor counts
										</p>
									</div>
								</div>

								{/* Total Page Views */}
								<div className="relative overflow-hidden bg-rb-neutral-3/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col justify-between group">
									<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-rb-accent-1 pointer-events-none">
										<TrendingUp size={60} />
									</div>
									<div className="flex items-center gap-3 text-rb-font-secondary mb-2">
										<TrendingUp size={16} className="text-rb-accent-2" />
										<span className="text-xs uppercase font-bold tracking-wider">Page Views (14d)</span>
									</div>
									<div>
										<h2 className="text-3xl font-extrabold text-rb-accent-1 tracking-tight">
											{analyticsData.reduce((acc, curr) => acc + curr.pageViews, 0)}
										</h2>
										<p className="text-[10px] text-rb-font-secondary mt-1">
											Total catalog views recorded
										</p>
									</div>
								</div>

								{/* Total Component Copies */}
								<div className="relative overflow-hidden bg-rb-neutral-3/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col justify-between group">
									<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-rb-accent-1 pointer-events-none">
										<MousePointerClick size={60} />
									</div>
									<div className="flex items-center gap-3 text-rb-font-secondary mb-2">
										<MousePointerClick size={16} className="text-emerald-400" />
										<span className="text-xs uppercase font-bold tracking-wider">Total Copies (14d)</span>
									</div>
									<div>
										<h2 className="text-3xl font-extrabold text-rb-accent-1 tracking-tight">
											{analyticsData.reduce((acc, curr) => acc + curr.copies, 0)}
										</h2>
										<p className="text-[10px] text-rb-font-secondary mt-1">
											Clicks on copy snippet triggers
										</p>
									</div>
								</div>

								{/* Copy Types ratio */}
								<div className="relative overflow-hidden bg-rb-neutral-3/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col justify-between group">
									<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-rb-accent-1 pointer-events-none">
										<Layers size={60} />
									</div>
									<div className="flex items-center gap-3 text-rb-font-secondary mb-2">
										<Layers size={16} className="text-fuchsia-400" />
										<span className="text-xs uppercase font-bold tracking-wider">Install vs Code</span>
									</div>
									<div>
										<div className="flex items-baseline gap-1.5">
											<h2 className="text-2xl font-extrabold text-rb-accent-1 tracking-tight">
												{analyticsData.reduce((acc, curr) => acc + curr.copyInstall, 0)}
											</h2>
											<span className="text-xs text-rb-font-secondary">/</span>
											<h2 className="text-2xl font-extrabold text-rb-accent-1 tracking-tight">
												{analyticsData.reduce((acc, curr) => acc + curr.copyCode, 0)}
											</h2>
										</div>
										<p className="text-[10px] text-rb-font-secondary mt-1">
											Install calls vs Code copies
										</p>
									</div>
								</div>
							</div>

							{/* Traffic Charts Row */}
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								{/* Visitors & Page Views Area Chart */}
								<div className="lg:col-span-2 bg-rb-neutral-3/20 border border-white/5 p-5 rounded-2xl flex flex-col h-[320px]">
									<span className="text-xs uppercase font-bold tracking-wider text-rb-font-secondary mb-4 flex items-center gap-1.5">
										<TrendingUp size={14} className="text-rb-accent-2" />
										Traffic Timeline
									</span>
									<div className="flex-1 w-full text-xs">
										{mounted && (
											<ResponsiveContainer width="100%" height="100%">
												<AreaChart data={analyticsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
													<defs>
														<linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
															<stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2}/>
															<stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
														</linearGradient>
														<linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
															<stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
															<stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
														</linearGradient>
													</defs>
													<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
													<XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" />
													<YAxis stroke="rgba(255,255,255,0.3)" />
													<Tooltip 
														contentStyle={{ 
															backgroundColor: "#161616", 
															borderColor: "rgba(255,255,255,0.1)",
															borderRadius: "12px",
															color: "#fff"
														}} 
													/>
													<Legend wrapperStyle={{ color: "rgba(255,255,255,0.5)" }} />
													<Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#a78bfa" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
													<Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#34d399" fillOpacity={1} fill="url(#colorVisitors)" strokeWidth={2} />
												</AreaChart>
											</ResponsiveContainer>
										)}
									</div>
								</div>

								{/* Copy interaction distribution pie */}
								<div className="bg-rb-neutral-3/20 border border-white/5 p-5 rounded-2xl flex flex-col h-[320px]">
									<span className="text-xs uppercase font-bold tracking-wider text-rb-font-secondary mb-4 flex items-center gap-1.5">
										<Layers size={14} className="text-fuchsia-400" />
										Interaction Types (Copies)
									</span>
									<div className="flex-1 w-full text-xs flex items-center justify-center relative">
										{mounted && pieData.reduce((a, b) => a + b.value, 0) > 0 ? (
											<ResponsiveContainer width="100%" height="100%">
												<PieChart>
													<Pie
														data={pieData}
														cx="50%"
														cy="45%"
														innerRadius={60}
														outerRadius={80}
														paddingAngle={5}
														dataKey="value"
													>
														{pieData.map((entry, index) => (
															<Cell key={`cell-${index}`} fill={entry.color} />
														))}
													</Pie>
													<Tooltip
														contentStyle={{ 
															backgroundColor: "#161616", 
															borderColor: "rgba(255,255,255,0.1)",
															borderRadius: "12px",
															color: "#fff"
														}}
													/>
													<Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "rgba(255,255,255,0.5)" }} />
												</PieChart>
											</ResponsiveContainer>
										) : (
											<div className="text-rb-font-secondary italic text-xs">No copies logged yet</div>
										)}
									</div>
								</div>
							</div>

							{/* Popular Components Chart & Table */}
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								{/* Popular components chart */}
								<div className="lg:col-span-2 bg-rb-neutral-3/20 border border-white/5 p-5 rounded-2xl flex flex-col h-[380px]">
									<span className="text-xs uppercase font-bold tracking-wider text-rb-font-secondary mb-4 flex items-center gap-1.5">
										<BarChart2 size={14} className="text-rb-accent-3" />
										Top Performing Components
									</span>
									<div className="flex-1 w-full text-xs">
										{mounted && popularComponents.length > 0 ? (
											<ResponsiveContainer width="100%" height="100%">
												<BarChart data={popularComponents} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
													<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
													<XAxis type="number" stroke="rgba(255,255,255,0.3)" />
													<YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.3)" width={120} />
													<Tooltip
														contentStyle={{ 
															backgroundColor: "#161616", 
															borderColor: "rgba(255,255,255,0.1)",
															borderRadius: "12px",
															color: "#fff"
														}}
													/>
													<Legend wrapperStyle={{ color: "rgba(255,255,255,0.5)" }} />
													<Bar dataKey="copyCode" name="Copy Code" fill="#a78bfa" stackId="a" radius={[0, 4, 4, 0]} />
													<Bar dataKey="copyInstall" name="Copy Install" fill="#34d399" stackId="a" radius={[0, 4, 4, 0]} />
												</BarChart>
											</ResponsiveContainer>
										) : (
											<div className="flex items-center justify-center h-full text-rb-font-secondary italic">No component copies recorded yet</div>
										)}
									</div>
								</div>

								{/* Top Components Table List */}
								<div className="bg-rb-neutral-3/20 border border-white/5 p-5 rounded-2xl flex flex-col h-[380px] overflow-hidden">
									<span className="text-xs uppercase font-bold tracking-wider text-rb-font-secondary mb-4 flex items-center gap-1.5 shrink-0">
										<Layers size={14} className="text-rb-accent-1" />
										Adoption Rankings
									</span>
									<div className="flex-1 overflow-y-auto scrollbar-none hover:scrollbar-thin">
										{popularComponents.length > 0 ? (
											<div className="flex flex-col gap-2.5">
												{popularComponents.map((comp, idx) => (
													<div 
														key={comp.name} 
														className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
													>
														<div className="flex items-center gap-3">
															<span className="text-xs font-bold text-rb-font-secondary bg-white/5 w-5 h-5 rounded-full flex items-center justify-center">
																{idx + 1}
															</span>
															<span className="text-sm font-semibold text-rb-accent-1">{comp.name}</span>
														</div>
														<div className="text-right">
															<span className="text-sm font-extrabold text-rb-accent-2">{comp.total}</span>
															<span className="text-[10px] text-rb-font-secondary block uppercase font-bold">copies</span>
														</div>
													</div>
												))}
											</div>
										) : (
											<div className="flex items-center justify-center h-full text-rb-font-secondary italic text-xs">No copy logs recorded yet</div>
										)}
									</div>
								</div>
							</div>

							{/* Debug Aggregator control */}
							<div className="p-4 bg-rb-neutral-3/20 border border-white/5 rounded-2xl flex items-center justify-between">
								<div className="flex items-center gap-2">
									<AlertCircle size={16} className="text-rb-accent-2" />
									<span className="text-xs text-rb-font-secondary leading-relaxed">
										Aggregated daily logs are generated at midnight. You can manually run the statistics calculation now to synchronize logs.
									</span>
								</div>
								<button 
									onClick={handleManualAggregation}
									disabled={analyticsRefreshing}
									className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-rb-accent-1 transition-all select-none cursor-pointer flex items-center gap-1.5 shrink-0"
								>
									<RefreshCcw size={12} className={analyticsRefreshing ? "animate-spin" : ""} />
									Aggregate Logs Now
								</button>
							</div>
						</>
					)}
				</div>
			) : (
				/* REGISTRY CHECKLIST TAB CONTENT (Kept exactly same) */
				<>
					{/* Stats Cards Checklist Dashboard */}
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
