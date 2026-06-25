"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface PreviewData {
    previewContent: React.ReactNode;
    children?: React.ReactNode;
    header?: React.ReactNode;
    tabsAction?: React.ReactNode;
    onReplay?: () => void;
}

interface PreviewContextType {
    isOpen: boolean;
    data: PreviewData | null;
    setData: (data: PreviewData) => void;
    setIsOpen: (isOpen: boolean) => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export function PreviewProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<PreviewData | null>(null);
    const searchParams = useSearchParams();

    // Sync with URL to handle manual URL changes or navigation back to home
    useEffect(() => {
        const isPreview = searchParams.get("preview") === "true";
        if (isPreview !== isOpen) {
            setIsOpen(isPreview);
        }
    }, [searchParams, isOpen]);

    return (
        <PreviewContext.Provider value={{ isOpen, data, setData, setIsOpen }}>
            {children}
        </PreviewContext.Provider>
    );
}

export function usePreview() {
    const context = useContext(PreviewContext);
    if (!context) throw new Error("usePreview must be used within PreviewProvider");
    return context;
}
