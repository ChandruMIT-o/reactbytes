"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ArrowCursorProps {
	color?: string;
	size?: number;
}

export const ArrowCursor = ({ color = "#F2F5F8", size = 20 }: ArrowCursorProps) => {
	const cursorRef = useRef<HTMLDivElement | null>(null);
	const rotationRef = useRef<HTMLDivElement | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const cursor = cursorRef.current;
		const rotationWrapper = rotationRef.current;
		if (!cursor || !rotationWrapper) return;

		const position = {
			distanceX: 0,
			distanceY: 0,
			distance: 0,
			pointerX: 0,
			pointerY: 0,
		};
		let previousPointerX = 0;
		let previousPointerY = 0;
		let angle = 0;
		let previousAngle = 0;
		let angleDisplace = 0;
		const degrees = 57.296; // 180 / Math.PI

		const rotate = () => {
			const unsortedAngle = Math.atan(Math.abs(position.distanceY) / Math.abs(position.distanceX)) * degrees;
			previousAngle = angle;

			if (position.distanceX <= 0 && position.distanceY >= 0) {
				angle = 90 - unsortedAngle + 0;
			} else if (position.distanceX < 0 && position.distanceY < 0) {
				angle = unsortedAngle + 90;
			} else if (position.distanceX >= 0 && position.distanceY <= 0) {
				angle = 90 - unsortedAngle + 180;
			} else if (position.distanceX > 0 && position.distanceY > 0) {
				angle = unsortedAngle + 270;
			}

			if (isNaN(angle)) {
				angle = previousAngle;
			} else {
				if (angle - previousAngle <= -270) {
					angleDisplace += 360 + angle - previousAngle;
				} else if (angle - previousAngle >= 270) {
					angleDisplace += angle - previousAngle - 360;
				} else {
					angleDisplace += angle - previousAngle;
				}
			}

			rotationWrapper.style.transform = `rotate(${angleDisplace}deg)`;
		};

		const move = (event: PointerEvent) => {
			previousPointerX = position.pointerX;
			previousPointerY = position.pointerY;
			position.pointerX = event.clientX;
			position.pointerY = event.clientY;
			position.distanceX = previousPointerX - position.pointerX;
			position.distanceY = previousPointerY - position.pointerY;
			const distance = Math.sqrt(position.distanceY ** 2 + position.distanceX ** 2);

			cursor.style.transform = `translate3d(${position.pointerX}px, ${position.pointerY}px, 0)`;

			if (distance > 1) {
				rotate();
			}
		};

		window.addEventListener("pointermove", move);

		// Force hide system cursor globally
		const style = document.createElement("style");
		style.id = "cursor-none-global";
		style.innerHTML = `
			* {
				cursor: none !important;
			}
		`;
		document.head.appendChild(style);

		// Initialize position to avoid jump
		const initialMove = (e: MouseEvent) => {
			position.pointerX = e.clientX;
			position.pointerY = e.clientY;
			cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
			window.removeEventListener("mousemove", initialMove);
		};
		window.addEventListener("mousemove", initialMove);

		return () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("mousemove", initialMove);
			const existingStyle = document.getElementById("cursor-none-global");
			if (existingStyle) {
				document.head.removeChild(existingStyle);
			}
		};
	}, [size]);

	if (!mounted) return null;

	return createPortal(
		<div
			ref={cursorRef}
			className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
			style={{
				width: size,
				height: size,
				marginLeft: -size / 2,
				marginTop: -size * (3 / 32),
			}}
		>
			<div
				ref={rotationRef}
				className="w-full h-full transition-transform duration-150 ease-out will-change-transform"
			>
				<svg
					viewBox="0 0 32 32"
					style={{ width: "100%", height: "100%" }}
				>
					<path
						d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z"
						fill={color}
					/>
					<path
						d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3m0-2h0A4.58,4.58,0,0,0,11.76,3.8L2.84,24.33A4.58,4.58,0,0,0,7,30.75a6.08,6.08,0,0,0,1.21-.17,1.87,1.87,0,0,0,.4-.13L16,27.18l7.29,3.44a1.64,1.64,0,0,0,.39.14A6.37,6.37,0,0,0,25,31a4.59,4.59,0,0,0,4.21-6.41l-9-20.75A4.62,4.62,0,0,0,16,1Z"
						fill="#111920"
					/>
				</svg>
			</div>
		</div>,
		document.body
	);
};

