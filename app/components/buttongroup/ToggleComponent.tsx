"use client";

import React from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Toggle from "./Toggle";

interface ToggleComponentProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    className?: string;
    disabled?: boolean;
}

export const ToggleComponent: React.FC<ToggleComponentProps> = ({
    checked = false,
    onChange,
    label = "Switch",
    className = "",
    disabled = false,
}) => {
    return (
        <div className={cn("w-full select-none font-sans", className)}>
            <div
                onClick={() => !disabled && onChange?.(!checked)}
                className={cn(
                    "flex items-center gap-3 p-1.5 w-full bg-rb-neutral-3 rounded-full shadow-lg shadow-black/20 border border-rb-neutral-4/50 backdrop-blur-sm group transition-all duration-300",
                    !disabled ? "cursor-pointer active:scale-[0.98]" : "opacity-50 cursor-not-allowed"
                )}
            >
                {/* Icon Circle */}
                <div className="relative flex items-center shrink-0">
                    <div className={cn(
                        "w-9 h-9 rounded-full border border-white/10 shadow-inner flex items-center justify-center transition-colors duration-300",
                        checked ? "bg-rb-accent-1 text-rb-neutral-1" : "bg-rb-neutral-4 text-rb-accent-1/60 group-hover:text-rb-accent-1"
                    )}>
                        {checked ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </div>
                </div>

                {/* Label Area */}
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-rb-accent-2/40 leading-none">
                        Option
                    </span>
                    <span className="text-md font-sans font-medium text-rb-accent-1 tracking-wide truncate">
                        {label}
                    </span>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-5 bg-rb-neutral-4/50 shrink-0" />

                {/* Toggle Switch */}
                <div className="flex items-center px-2" onClick={(e) => e.stopPropagation()}>
                    <Toggle
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default ToggleComponent;

