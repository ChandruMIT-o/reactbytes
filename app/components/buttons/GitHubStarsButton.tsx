"use client";

import React from "react";
import { Star } from "lucide-react";
import {
	Button,
	type ButtonProps,
} from "@/components/animate-ui/primitives/buttons/button";
import {
	GithubStars,
	GithubStarsNumber,
	GithubStarsLogo,
	GithubStarsIcon,
	GithubStarsParticles,
} from "@/components/animate-ui/primitives/animate/github-stars";

export type GitHubStarButtonProps = Omit<
	ButtonProps,
	"children" | "asChild"
> & {
	children?: React.ReactNode;
	asChild?: false; // Explicitly set to false to avoid type-union issues
	/** The number of stars to display (static or initial) */
	starCount?: number;
	/** Github username for automatic fetching */
	username?: string;
	/** Github repository for automatic fetching */
	repo?: string;
};

export function GitHubStarButton({
	starCount,
	username,
	repo,
	className = "",
	children,
	...props
}: GitHubStarButtonProps) {
	return (
		<GithubStars value={starCount} username={username} repo={repo}>
			<GithubStarsParticles>
				<Button
					type="button"
					className={`inline-flex items-center justify-center gap-2 hover:scale-100 whitespace-nowrap rounded-full bg-rb-accent-1 px-3 py-[7px] text-[16px] font-medium text-rb-neutral-2 transition-colors hover:opacity-90 focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 ${className}`}
					{...props}
				>
					<GithubStarsLogo className="h-5 w-5" />
					<span>Github</span>
					<div className="flex items-center gap-1.5">
						<GithubStarsIcon
							icon={Star}
							className="h-3.5 w-3.5"
							color="var(--rb-neutral-1)"
							activeClassName="fill-rb-neutral-1"
						/>
						<span className="min-w-[3ch] text-left tracking-tight font-semibold">
							<GithubStarsNumber />
						</span>
					</div>
					{children}
				</Button>
			</GithubStarsParticles>
		</GithubStars>
	);
}
