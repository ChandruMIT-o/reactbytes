"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  style?: React.CSSProperties;
  activeColor?: string;
  hoverColor?: string;
  stiffness?: number;
  damping?: number;
}

export const VerticalMenu: React.FC<VerticalMenuProps> = ({ 
  items, 
  defaultSelected, 
  onSelect, 
  className,
  style,
  activeColor = '#121AFF',
  hoverColor = '#4753BF',
  stiffness = 300,
  damping = 30
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
      className={`relative flex flex-col gap-[7px] mt-[18px] mr-[10px] items-end ${className || ''}`}
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
        transition={{ type: "spring", stiffness, damping }}
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
        transition={{ type: "spring", stiffness, damping }}
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
            className={`
              relative flex w-fit h-fit px-[15px] py-[10px]
              text-[14px] font-medium font-['Outfit',sans-serif] 
              cursor-pointer text-center border-none outline-none
              transition-all duration-300 z-10
              active:scale-95 active:rounded-[15px]
              ${isSelected ? '' : isHovered ? '' : 'text-white/80'}
            `}
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
};

export default VerticalMenu;
