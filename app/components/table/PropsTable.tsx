import React from "react";

// --- Types ---

export interface PropDefinition {
	/** The name of the prop */
	name: string;
	/** The TypeScript type of the prop */
	type: string;
	/** The default value, if any */
	defaultValue?: string;
	/** Description of what the prop does */
	description: React.ReactNode;
	/** Whether the prop is required */
	required?: boolean;
}

export interface PropCategory {
	/** Sub-header title (e.g., "Primary Props", "Secondary Props") */
	title: string;
	/** Array of props belonging to this category */
	props: PropDefinition[];
}

export interface PropsTableProps {
	/** The structured data to display in the table */
	categories: PropCategory[];
	/** Optional class to override the container wrapper */
	className?: string;
}

// --- Component ---

export const PropsTable: React.FC<PropsTableProps> = ({
	categories,
	className = "",
}) => {
	return (
		<div className={`w-full font-sans ${className}`}>
			{/* Main Content Outer Wrapper (Acts as the thick grey border/container) */}
			<div className="bg-rb-neutral-3 p-1.5 rounded-[24px] w-full relative">
				{/* Actual Content Area */}
				<div className="bg-rb-neutral-1 rounded-[18px] w-full overflow-hidden border border-rb-neutral-4">
					<table className="w-full text-left text-[14px] text-rb-accent-2/60 border-collapse">
						{/* Table Header */}
						<thead className="bg-rb-neutral-3 text-rb-accent-1 text-[16px] border-b border-rb-neutral-4">
							<tr>
								<th className="px-6 py-4 font-medium tracking-tight w-[20%]">
									Prop
								</th>
								<th className="px-6 py-4 font-medium tracking-tight w-[20%]">
									Type
								</th>
								<th className="px-6 py-4 font-medium tracking-tight w-[20%]">
									Default
								</th>
								<th className="px-6 py-4 font-medium tracking-tight w-[40%]">
									Description
								</th>
							</tr>
						</thead>

						{/* Table Body */}
						<tbody className="divide-y divide-rb-neutral-4">
							{categories.map((category, catIndex) => (
								<React.Fragment key={category.title}>
									{/* Sub-Header Row */}
									<tr className="bg-rb-neutral-4/30">
										<td colSpan={4} className="px-6 py-2.5">
											<span className="text-xs font-bold uppercase tracking-[0.1em] text-rb-accent-1/50">
												{category.title}
											</span>
										</td>
									</tr>

									{/* Prop Rows */}
									{category.props.map((prop, propIndex) => (
										<tr
											key={prop.name}
											className="group hover:bg-rb-neutral-3/40 transition-colors duration-300"
										>
											{/* Prop Name & Required Badge */}
											<td className="px-6 py-5 align-top">
												<div className="flex items-center gap-2.5 flex-wrap">
													<code className="text-rb-accent-1 bg-rb-neutral-4 px-2 py-0.5 rounded-[6px] text-md font-mono whitespace-nowrap">
														{prop.name}
													</code>
													{prop.required && (
														<span className="text-[9px] uppercase tracking-wider font-bold text-rb-neutral-2 bg-rb-accent-1 px-2 py-0.5 rounded-full">
															Required
														</span>
													)}
												</div>
											</td>

											{/* Type */}
											<td className="px-6 py-5 align-top">
												<code className="text-rb-accent-2/80 text-sm font-mono break-all leading-relaxed">
													{prop.type}
												</code>
											</td>

											{/* Default Value */}
											<td className="px-6 py-5 align-top">
												{prop.defaultValue ? (
													<code className="text-rb-accent-2/40 bg-rb-neutral-3 px-2 py-1 rounded-[6px] text-sm font-mono whitespace-nowrap border border-rb-neutral-4">
														{prop.defaultValue}
													</code>
												) : (
													<span className="text-rb-accent-2/20 italic">
														—
													</span>
												)}
											</td>

											{/* Description */}
											<td className="px-6 py-5 align-top leading-relaxed text-sm text-rb-accent-1/70">
												{prop.description}
											</td>
										</tr>
									))}
								</React.Fragment>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default PropsTable;
