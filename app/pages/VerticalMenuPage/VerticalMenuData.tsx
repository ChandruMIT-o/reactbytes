export const componentCode = `import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface MenuItem {
  id: string;
  label: string;
}

export interface VerticalMenuProps {
  items: MenuItem[];
  defaultSelected?: string;
  onSelect?: (id: string) => void;
  className?: string;
  activeColor?: string;
  hoverColor?: string;
}

export const VerticalMenu: React.FC<VerticalMenuProps> = ({ 
  items, 
  defaultSelected, 
  onSelect, 
  className,
  style,
  activeColor = '#121AFF',
  hoverColor = '#4753BF'
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(defaultSelected || items[0]?.id || null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // States for shared background positions
  const [hoverRect, setHoverRect] = useState({ top: 0, left: 0, width: 0, height: 0, opacity: 0 });
  const [selectedRect, setSelectedRect] = useState({ top: 0, left: 0, width: 0, height: 0, opacity: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const updateHover = useCallback((id: string | null) => {
    if (id && buttonRefs.current[id]) {
      const btn = buttonRefs.current[id]!;
      setHoverRect({
        top: btn.offsetTop,
        left: btn.offsetLeft,
        width: btn.offsetWidth,
        height: btn.offsetHeight,
        opacity: 1
      });
    } else {
      // Replicate the "dot" behavior: shrink but stay at the last position
      setHoverRect(prev => ({
        ...prev,
        width: 5,
        height: 5,
        opacity: 1 
      }));
    }
  }, []);

  const updateSelected = useCallback((id: string | null) => {
    if (id && buttonRefs.current[id]) {
      const btn = buttonRefs.current[id]!;
      setSelectedRect({
        top: btn.offsetTop,
        left: btn.offsetLeft,
        width: btn.offsetWidth,
        height: btn.offsetHeight,
        opacity: 1
      });
    }
  }, []);

  // Initialize selected position and handle resize
  useEffect(() => {
    const timeout = setTimeout(() => updateSelected(selectedId), 50);
    window.addEventListener('resize', () => updateSelected(selectedId));
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', () => updateSelected(selectedId));
    };
  }, [selectedId, items, updateSelected]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    updateSelected(id);
    if (onSelect) onSelect(id);
  };

  return (
    <div 
      ref={containerRef}
      className={\`relative flex flex-col gap-[7px] items-end \${className || ''}\`}
      style={style}
    >
      {/* Shared Hover Background - Captured "sliding" and "dot" behavior */}
      <motion.div
        className="absolute bg-white rounded-[55px] z-0 pointer-events-none backdrop-blur-[50px] border border-white"
        initial={false}
        animate={{
          top: hoverRect.top,
          left: hoverRect.left,
          width: hoverRect.width,
          height: hoverRect.height,
          opacity: hoverRect.opacity
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Shared Selected Background - Sliding selection */}
      <motion.div
        className="absolute bg-white rounded-[100px] z-0 pointer-events-none"
        initial={false}
        animate={{
          top: selectedRect.top,
          left: selectedRect.left,
          width: selectedRect.width,
          height: selectedRect.height,
          opacity: selectedRect.opacity
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {items.map((item) => {
        const isSelected = selectedId === item.id;
        const isHovered = hoveredId === item.id;

        return (
          <button
            key={item.id}
            ref={el => { buttonRefs.current[item.id] = el; }}
            onMouseEnter={() => {
              setHoveredId(item.id);
              updateHover(item.id);
            }}
            onMouseLeave={() => {
              setHoveredId(null);
              updateHover(null);
            }}
            onClick={() => handleSelect(item.id)}
            className={\`
              relative flex w-fit h-fit px-[15px] py-[10px]
              text-[14px] font-medium font-['Outfit',sans-serif] 
              cursor-pointer text-center border-none outline-none
              transition-all duration-300 z-10
              active:scale-95 active:rounded-[15px]
              \${isSelected ? '' : isHovered ? '' : 'text-white/80'}
            \`}
            style={{
               color: isSelected ? activeColor : isHovered ? hoverColor : undefined,
               backgroundColor: 'rgba(255, 255, 255, 0.2)',
               backdropFilter: 'blur(70px)',
               borderRadius: isSelected ? '100px' : '30px',
               WebkitTapHighlightColor: 'transparent'
            }}
          >
            <span className="relative z-10 select-none">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};`;

export const VerticalMenuProps = [
  {
    name: "items",
    type: "MenuItem[]",
    defaultValue: "[]",
    description: "An array of menu items, each with an id and label.",
  },
  {
    name: "defaultSelected",
    type: "string",
    defaultValue: "undefined",
    description: "The id of the menu item that should be selected by default.",
  },
  {
    name: "onSelect",
    type: "(id: string) => void",
    defaultValue: "undefined",
    description: "Callback function triggered when a menu item is selected.",
  },
  {
    name: "className",
    type: "string",
    defaultValue: "''",
    description: "Additional CSS classes for the container.",
  },
  {
    name: "style",
    type: "React.CSSProperties",
    defaultValue: "{}",
    description: "Inline styles for the container.",
  },
  {
    name: "activeColor",
    type: "string",
    defaultValue: "'#121AFF'",
    description: "The text color of the selected menu item.",
  },
  {
    name: "hoverColor",
    type: "string",
    defaultValue: "'#4753BF'",
    description: "The text color of the hovered menu item.",
  },
  {
    name: "stiffness",
    type: "number",
    defaultValue: "300",
    description: "The stiffness of the spring animation.",
  },
  {
    name: "damping",
    type: "number",
    defaultValue: "30",
    description: "The damping of the spring animation.",
  },
];

export const creditsData = [
  {
    title: "Open Source Libraries",
    items: [
      {
        name: "Framer Motion",
        role: "Animations",
        url: "https://www.framer.com/motion/",
      },
      {
        name: "Lucide React",
        role: "Icons",
        url: "https://lucide.dev/",
      },
    ],
  },
];
