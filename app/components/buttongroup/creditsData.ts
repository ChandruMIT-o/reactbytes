import { CreditSection } from "./Credits";

export const sampleCreditsData: CreditSection[] = [
    {
        title: "Core Engineering Team",
        items: [
            {
                name: "Alex Rivera",
                role: "Lead Developer",
                url: "https://github.com/gaearon", // Automatically fetches avatar from github profile handle 
            },
            {
                name: "Sarah Chen",
                role: "UI Engineer",
                url: "https://github.com/shadcn", // Automatically resolves to GitHub dp asset pipeline
            }
        ]
    },
    {
        title: "Design & Brand Assets",
        items: [
            {
                name: "Lucide Icons",
                role: "UI Icon Pack Library",
                url: "https://lucide.dev",
                avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&auto=format&fit=crop&q=60" // Explicit custom icon override
            },
            {
                name: "Unsplash Matrix",
                role: "Photography Assets",
                url: "https://unsplash.com"
                // No avatar provided + No Github URL = component generates a neat "UM" fallback token!
            }
        ]
    },
    {
        title: "Special Thanks",
        items: [
            {
                name: "Anonymous Sponsor",
                role: "Financial Backing",
                // Works perfectly even without direct hyperlinks setup!
            }
        ]
    }
];