"use client";
import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { buildPrompt } from "@/lib/buildPrompt";

interface CopyPromptButtonProps {
  slug: string;
  liveUsageCode?: string;
}

export function CopyPromptButton({
  slug,
  liveUsageCode,
}: CopyPromptButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function handleClick() {
    try {
      const res = await fetch(`/api/mcp/${slug}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      const prompt = buildPrompt(data, liveUsageCode);
      await navigator.clipboard.writeText(prompt);
      setStatus("copied");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      className="p-2.5 flex items-center justify-center rounded-full bg-rb-neutral-3 text-rb-accent-2/40 border border-rb-neutral-4 hover:text-rb-accent-2 hover:bg-rb-neutral-4 transition-all group"
      title="Copy LLM Prompt"
    >
      {status === "copied" ? (
        <Check size={14} className="text-emerald-500" />
      ) : status === "error" ? (
        <X size={14} className="text-red-500" />
      ) : (
        <Copy
          size={14}
          className="group-hover:scale-110 transition-transform"
        />
      )}
    </button>
  );
}
