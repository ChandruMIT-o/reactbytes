// --- TYPES ---
export interface MorphCarouselItem {
	title: string;
	description: string;
	image: string;
	thumb: string;
}

export interface MorphCarouselProps {
	items?: MorphCarouselItem[];
	distortion?: number;
	speed?: number;
	scale?: number;
	transitionDuration?: number;
	interval?: number;
	autoPlay?: boolean;
	showThumbs?: boolean;
	showNav?: boolean;
	showCaptions?: boolean;
	className?: string;
}

export const DEFAULT_ITEMS: MorphCarouselItem[] = [
	{
		title: "Cyberpunk Metropolis",
		description: "A neon-drenched city of the future, where technology and humanity collide.",
		image: "https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=2070&auto=format&fit=crop",
		thumb: "https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=200&auto=format&fit=crop"
	},
	{
		title: "Digital Ethereal",
		description: "Transcending physical boundaries through fluid digital geometry.",
		image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2070&auto=format&fit=crop",
		thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop"
	},
	{
		title: "Neural Network",
		description: "Vibrant pathways of information flowing through a synthetic mind.",
		image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
		thumb: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200&auto=format&fit=crop"
	}
];
