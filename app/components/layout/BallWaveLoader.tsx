"use client";

import React from "react";

/**
 * A minimal ball-wave loading indicator for page-to-page transitions.
 * 7 dots oscillate left/right with staggered timing.
 */
export default function BallWaveLoader() {
	return (
		<div className="flex items-center justify-center w-full py-40">
			<div className="flex flex-col items-center gap-[6px]">
				{[1, 2, 3, 4, 5, 6, 7].map((n) => (
					<div
						key={n}
						className="ball-wave-dot"
						style={{
							animationDuration: `${
								n === 1 ? 1 :
								n === 2 ? 1.1 :
								n === 3 ? 1.05 :
								n === 4 ? 1.15 :
								n === 5 ? 1.1 :
								n === 6 ? 1.05 :
								1
							}s`,
							animationDirection: n % 2 === 0 ? "reverse" : "normal",
						}}
					/>
				))}
			</div>
		</div>
	);
}
