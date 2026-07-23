"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown, Eye, EyeOff, Film, Keyboard } from "lucide-react";

export const AutomaticScrollRecorder: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "scrolling" | "paused">("idle");
  const [speed, setSpeed] = useState<number>(500); // default speed set to 500 px/s
  const [progress, setProgress] = useState<number>(0);
  const [isHUDHidden, setIsHUDHidden] = useState<boolean>(false);
  const [forceShowHUD, setForceShowHUD] = useState<boolean>(true); // Manual toggle to show HUD
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate current scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const pct = Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100));
      setProgress(pct);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Global cleanups on unmount
  useEffect(() => {
    return () => {
      if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, []);

  // Handle programmatic scroll starting, pausing, stopping
  const startScroll = (fromCurrent = false) => {
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = docHeight - winHeight;

    if (maxScroll <= 0) return;

    // Clear any active transitions, timeouts, or timelines
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const currentScroll = window.scrollY;
    let startY = fromCurrent ? currentScroll : 0;

    // If starting fresh and already near bottom, restart from top
    if (!fromCurrent && currentScroll >= maxScroll - 5) {
      startY = 0;
      window.scrollTo(0, 0);
    } else if (!fromCurrent) {
      window.scrollTo(0, 0);
      startY = 0;
    }

    setStatus("scrolling");

    const runScrollAnimation = (yVal: number) => {
      // Exclude "ready" section so it scrolls in a steady, linear fashion to the bottom
      const sectionIds = ["hero", "showcase", "core", "shaders", "specs"];
      const targets: number[] = [];

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const offsetTop = rect.top + window.scrollY;
          const clamped = Math.max(0, Math.min(maxScroll, offsetTop));
          targets.push(clamped);
        }
      });

      // Include final scroll position
      targets.push(maxScroll);

      // Sort and filter duplicates or targets that are too close to each other
      const sortedTargets = Array.from(new Set(targets))
        .sort((a, b) => a - b)
        .filter((val, index, self) => {
          if (index === 0) return true;
          return val - self[index - 1] > 80;
        });

      // Filter to only targets ahead of our current scroll position
      const remainingTargets = sortedTargets.filter((t) => t > yVal + 5);

      // Create a GSAP timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setStatus("idle");
          timelineRef.current = null;
        },
      });

      // Apply speed scaling relative to baseline speed (500 px/s)
      const baseSpeed = 500;
      tl.timeScale(speed / baseSpeed);

      let lastY = yVal;
      const scrollObj = { y: yVal };

      remainingTargets.forEach((targetY, index) => {
        const distance = targetY - lastY;
        if (distance <= 0) return;

        const isFinalScroll = targetY === maxScroll;
        const easeType = isFinalScroll ? "none" : "power2.inOut";

        // Transition duration:
        // - For intermediate sections: baseline 1.2s per 800px (clamped 0.8s - 2.5s).
        // - For the final linear scroll (Bento grid to bottom): baseline 400 px/s (steady promo scroll speed).
        const transitionDuration = isFinalScroll
          ? distance / 400
          : Math.max(0.8, Math.min(2.5, (distance / 800) * 1.2));

        // 1. Move camera to target section position
        tl.to(scrollObj, {
          y: targetY,
          duration: transitionDuration,
          ease: easeType,
          onUpdate: () => {
            window.scrollTo(0, scrollObj.y);
          },
        });

        // 2. Dwell at section for 1.5 seconds to show contents (skip for final page bottom)
        if (index < remainingTargets.length - 1) {
          tl.to({}, { duration: 1.5 }); // Pause
        }

        lastY = targetY;
      });

      timelineRef.current = tl;
    };

    if (fromCurrent) {
      setCountdown(null);
      runScrollAnimation(startY);
    } else {
      // Fresh start: Hide overlay IMMEDIATELY, start countdown, scroll after 2s delay
      setIsHUDHidden(true);
      setCountdown(2);
      
      let count = 2;
      countdownIntervalRef.current = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          setCountdown(null);
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
        } else {
          setCountdown(count);
        }
      }, 1000);

      delayTimeoutRef.current = setTimeout(() => {
        runScrollAnimation(0);
        delayTimeoutRef.current = null;
      }, 2000);
    }
  };

  const pauseScroll = () => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (timelineRef.current) {
      timelineRef.current.pause();
    }
    setCountdown(null);
    setStatus("paused");
  };

  const stopAndReset = () => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    setCountdown(null);
    setStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Adjust timeScale of the active timeline directly when speed changes
  useEffect(() => {
    if (status === "scrolling" && countdown === null && timelineRef.current) {
      const baseSpeed = 500;
      timelineRef.current.timeScale(speed / baseSpeed);
    }
  }, [speed]);

  // Listen to mouse wheel or touch movements to pause programmatic scroll on user interrupt
  useEffect(() => {
    const handleUserScrollInterrupt = () => {
      if (status === "scrolling") {
        pauseScroll();
      }
    };

    window.addEventListener("wheel", handleUserScrollInterrupt, { passive: true });
    window.addEventListener("touchmove", handleUserScrollInterrupt, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleUserScrollInterrupt);
      window.removeEventListener("touchmove", handleUserScrollInterrupt);
    };
  }, [status]);

  // HUD Auto-hide controller for changes to status or speed adjustments
  useEffect(() => {
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }

    if (status === "scrolling") {
      // If we are actively scrolling (not in starting delay countdown)
      if (countdown === null) {
        autoHideTimeoutRef.current = setTimeout(() => {
          setIsHUDHidden(true);
        }, 1000);
      }
    } else {
      setIsHUDHidden(false);
    }

    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [status, countdown]);

  // If user adjusts speed, temporarily show HUD to reflect speed change, then hide after 1.2s
  useEffect(() => {
    if (status === "scrolling" && countdown === null) {
      setIsHUDHidden(false);
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
      autoHideTimeoutRef.current = setTimeout(() => {
        setIsHUDHidden(true);
      }, 1200);
    }
  }, [speed]);

  // Global unlock listener (Ctrl + Alt + R) to unlock recorder mode
  useEffect(() => {
    const handleGlobalUnlock = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.code === "KeyR") {
        e.preventDefault();
        setIsUnlocked((prev) => {
          const next = !prev;
          if (!next) {
            // Lock mode: stop scrolling and reset
            stopAndReset();
          } else {
            setForceShowHUD(true);
            setIsHUDHidden(false);
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleGlobalUnlock);
    return () => {
      window.removeEventListener("keydown", handleGlobalUnlock);
    };
  }, [status, speed, countdown]);

  // Keyboard Shortcuts handler (active only when unlocked)
  useEffect(() => {
    if (!isUnlocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (status === "scrolling") {
            pauseScroll();
          } else {
            startScroll(status === "paused");
          }
          break;

        case "Escape":
          e.preventDefault();
          stopAndReset();
          break;

        case "ArrowUp":
          e.preventDefault();
          setSpeed((prev) => Math.min(1500, prev + 25));
          break;

        case "ArrowDown":
          e.preventDefault();
          setSpeed((prev) => Math.max(50, prev - 25));
          break;

        case "KeyH":
          e.preventDefault();
          setForceShowHUD((prev) => !prev);
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [status, speed, countdown, isUnlocked]);

  // If locked, render nothing to keep production clean of any trace
  if (!isUnlocked) {
    return null;
  }

  // Determine if HUD should be shown right now
  const shouldShowHUD = forceShowHUD && (!isHUDHidden || isHovered || status !== "scrolling");

  return (
    <>
      {/* Floating HUD Controller */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out transform ${
          shouldShowHUD
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-80 bg-[#0a0712]/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-[#f2eee9] font-sans">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  status === "scrolling" ? "bg-red-500" : "bg-[#c0dedd]"
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  status === "scrolling" ? "bg-red-500" : "bg-[#c0dedd]"
                }`}></span>
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#e6dff1]/90 flex items-center gap-1.5">
                <Film size={12} className="text-[#c0dedd]" /> Scroll Recorder
              </span>
            </div>
            
            <button
              onClick={() => setForceShowHUD(false)}
              className="text-[#e6dff1]/30 hover:text-white transition-colors duration-150"
              title="Hide HUD (Press 'H' to reveal)"
            >
              <EyeOff size={14} />
            </button>
          </div>

          {/* Status Display */}
          <div className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2 border border-white/5 mb-4">
            <span className="text-xs text-[#e6dff1]/60 font-mono">STATUS:</span>
            <span className={`text-xs font-mono font-bold tracking-wide uppercase ${
              status === "scrolling"
                ? countdown !== null ? "text-orange-400" : "text-red-400"
                : status === "paused"
                ? "text-yellow-400"
                : "text-[#c0dedd]"
            }`}>
              {status === "scrolling" && countdown !== null ? `Starting in ${countdown}s` : status}
            </span>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col gap-3">
            
            {/* Speed Controller */}
            <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 border border-white/5">
              <span className="text-xs text-[#e6dff1]/60 font-mono">SPEED SCALE:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSpeed((prev) => Math.max(50, prev - 25))}
                  className="p-1 hover:bg-white/10 rounded text-[#c0dedd] transition-all"
                  title="Decrease speed scale"
                >
                  <ChevronDown size={14} />
                </button>
                <span className="text-xs font-mono font-bold text-center w-16">
                  {Math.round((speed / 500) * 100)}%
                </span>
                <button
                  onClick={() => setSpeed((prev) => Math.min(1500, prev + 25))}
                  className="p-1 hover:bg-white/10 rounded text-[#c0dedd] transition-all"
                  title="Increase speed scale"
                >
                  <ChevronUp size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {/* Play/Pause Button */}
              {status === "scrolling" ? (
                <button
                  onClick={pauseScroll}
                  className="flex items-center justify-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-300 font-mono text-xs py-2 px-3 rounded-lg transition-all"
                  title="Pause (Space)"
                >
                  <Pause size={12} />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={() => startScroll(status === "paused")}
                  className="flex items-center justify-center gap-1.5 bg-[#c0dedd]/15 border border-[#c0dedd]/30 hover:bg-[#c0dedd]/25 text-[#c0dedd] font-mono text-xs py-2 px-3 rounded-lg transition-all"
                  title="Play (Space)"
                >
                  <Play size={12} />
                  <span>{status === "paused" ? "Resume" : "Start"}</span>
                </button>
              )}

              {/* Reset/Stop Button */}
              <button
                onClick={stopAndReset}
                className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-xs py-2 px-3 rounded-lg transition-all col-span-2"
                title="Reset (Esc)"
              >
                <RotateCcw size={12} />
                <span>Reset to Top</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-1">
              <div className="flex justify-between items-center text-[10px] text-[#e6dff1]/40 font-mono mb-1">
                <span>PROGRESS</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#c0dedd] to-[#8eb5b3] h-full rounded-full transition-all duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Help / Shortcut Info */}
            <div className="mt-2 border-t border-white/5 pt-3">
              <div className="flex items-center gap-1.5 text-[10px] text-[#e6dff1]/40 font-mono mb-1.5">
                <Keyboard size={10} />
                <span>HOTKEYS</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] font-mono text-[#e6dff1]/50">
                <div>[Space] Play/Pause</div>
                <div>[Esc] Reset to Top</div>
                <div>[↑/↓] Speed +/-</div>
                <div>[H] Toggle Panel</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mini Recording Hover Pill (visible only when HUD is hidden during recording) */}
      <div
        className={`fixed bottom-4 right-4 z-50 cursor-pointer transition-all duration-500 ease-out flex items-center gap-1.5 bg-[#0a0712]/85 backdrop-blur-sm border px-3 py-1.5 rounded-full shadow-lg text-[9px] font-mono tracking-wider text-[#e6dff1]/70 select-none ${
          !shouldShowHUD && status === "scrolling"
            ? "opacity-50 hover:opacity-100 translate-y-0 scale-100 border-red-500/20"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
        onClick={() => setForceShowHUD(true)}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
            countdown !== null ? "bg-orange-500 animate-pulse" : "bg-red-500"
          }`}></span>
        </span>
        <span>
          {countdown !== null ? `DELAY: ${countdown}s` : `REC (${Math.round((speed / 500) * 100)}%)`}
        </span>
      </div>

      {/* Mini Toggle Panel Reveal Button (visible only when manually hidden and not scrolling) */}
      <button
        onClick={() => setForceShowHUD(true)}
        className={`fixed bottom-6 right-6 z-50 p-3 bg-[#0a0712]/90 backdrop-blur-md border border-white/10 rounded-full shadow-lg text-[#c0dedd] hover:bg-[#c0dedd]/10 transition-all duration-300 ${
          !shouldShowHUD && status !== "scrolling"
            ? "opacity-80 hover:opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        title="Show Recorder Panel (Press 'H')"
      >
        <Eye size={16} />
      </button>
    </>
  );
};

export default AutomaticScrollRecorder;
