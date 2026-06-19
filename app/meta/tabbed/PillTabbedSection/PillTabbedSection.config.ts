import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const pillTabbedSectionConfig: ComponentConfig = {
  slug: "pill-tabbed-section",
  name: "Pill Tabbed Section",
  category: "miscellaneous",
  componentPath: "app/meta/tabbed/PillTabbedSection/PillTabbedSection.tsx",
  containerClassName: "w-full min-h-[500px] !h-auto flex items-center justify-center p-8 bg-black rounded-[32px] border border-white/5 relative overflow-hidden",
  props: [
    {
      name: "defaultTab",
      type: "select",
      default: "orchestrations",
      options: [
        { id: "home", label: "Dashboard Home" },
        { id: "flow", label: "Data Flow" },
        { id: "modules", label: "Core Modules" },
        { id: "architecture", label: "System Architecture" },
        { id: "orchestrations", label: "Open Orchestrations" },
      ],
      description: "The ID of the tab that should be active on initial render.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Classic Tabs",
      config: {
        defaultTab: "orchestrations",
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "React Bytes",
          role: "Collection",
          url: "https://reactbytes.dev",
        },
      ],
    },
    {
      title: "Open Source Libraries",
      items: [
        {
          name: "React",
          role: "UI Framework",
          url: "https://react.dev",
        },
        {
          name: "Framer Motion",
          role: "Animations",
          url: "https://www.framer.com/motion/",
        },
        {
          name: "Tailwind CSS",
          role: "Styling",
          url: "https://tailwindcss.com",
        },
        {
          name: "Lucide React",
          role: "Icons",
          url: "https://lucide.dev",
        },
      ],
    },
  ],
};
