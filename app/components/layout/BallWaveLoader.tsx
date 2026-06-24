"use client";

import React from "react";

export default function BallWaveLoader() {
	// Scoped keyframes & styles injected dynamically to completely avoid styled-components.
	// This keeps the loader fully portable, lightweight, and performant.
	const styleContent = `
    @keyframes swing-left {
      0% {
        transform: rotate(0deg);
        animation-timing-function: ease-out;
      }
      25% {
        transform: rotate(65deg);
        animation-timing-function: ease-in;
      }
      50% {
        transform: rotate(0deg);
        animation-timing-function: linear;
      }
    }

    @keyframes swing-right {
      0% {
        transform: rotate(0deg);
        animation-timing-function: linear;
      }
      50% {
        transform: rotate(0deg);
        animation-timing-function: ease-out;
      }
      75% {
        transform: rotate(-65deg);
        animation-timing-function: ease-in;
      }
    }

    .nc-cradle-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
    }

    .nc-ball-thread {
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;
      width: 20%; /* Balanced width for a 5-dot cradle */
      transform-origin: center top;
    }

    /* Spherical white balls with premium soft-bloom glow */
    .nc-ball-thread::after {
      content: '';
      display: block;
      width: 100%;
      height: 20%;
      border-radius: 50%;
      background-color: #ffffff;
    }

    /* Kinetic physics animation mappings */
    .nc-ball-thread:first-child {
      animation: swing-left 1.2s linear infinite;
    }

    .nc-ball-thread:last-child {
      animation: swing-right 1.2s linear infinite;
    }
  `;

	return (
		<div className="flex items-center justify-center w-full py-40 rounded-2xl border border-slate-900/60 select-none">
			<style dangerouslySetInnerHTML={{ __html: styleContent }} />

			<div className="nc-cradle-container">
				<div className="nc-ball-thread" />
				<div className="nc-ball-thread" />
				<div className="nc-ball-thread" />
				<div className="nc-ball-thread" />
				<div className="nc-ball-thread" />
			</div>
		</div>
	);
}