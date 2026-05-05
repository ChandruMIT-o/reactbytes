export const componentCode = `import NovelMenu from './NovelMenu';

export default function Example() {
  return <NovelMenu brandName="NOVEL" />;
}`;

export const NovelMenuProps = [
  {
    name: "brandName",
    type: "string",
    default: '"NOVEL"',
    description: "The name displayed in the top-left corner.",
  },
  {
    name: "accentColor",
    type: "string",
    default: '"#C0DEDD"',
    description: "Primary accent color for highlights and hover effects.",
  },
  {
    name: "navLinks",
    type: "NavLink[]",
    default: "DEFAULT_NAV_LINKS",
    description: "Array of objects with title and href for the main menu.",
  },
  {
    name: "socialLinks",
    type: "SocialLink[]",
    default: "DEFAULT_SOCIAL_LINKS",
    description: "Array of objects with icon component and href for socials.",
  },
];

export const creditsData = [
  {
    title: "Inspiration & Libraries",
    items: [
      {
        name: "Anime.js",
        role: "Animation Engine",
        url: "https://animejs.com/",
      },
      {
        name: "Lucide React",
        role: "Icons",
        url: "https://lucide.dev/",
      },
    ],
  },
];
