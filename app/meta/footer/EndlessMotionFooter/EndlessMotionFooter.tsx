import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// Helper to dynamically resolve the nearest scrolling ancestor
const getScrollParent = (node: HTMLElement | null): HTMLElement => {
  if (typeof window === 'undefined') return {} as HTMLElement;
  if (!node) return document.documentElement;
  
  let parent = node.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }
    parent = parent.parentElement;
  }
  return document.documentElement;
};

interface LineProps {
  text: string;
  minScale: number;
  textColor: string;
  scroller?: string | HTMLElement | null;
}

/**
 * Individual Line Component
 * Mirrors the .line-block and .line-text logic from the reference
 */
const EndlessLine: React.FC<LineProps> = ({ text, minScale, textColor, scroller }) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!textRef.current) return;

      gsap.fromTo(
        textRef.current,
        { scale: 1 },
        {
          scale: minScale,
          ease: "none",
          scrollTrigger: {
            trigger: textRef.current,
            scroller: scroller || undefined,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [minScale, scroller]);

  return (
    <section className="flex items-center justify-center min-h-[20vh] flex-[0_0_20vh]">
      <span
        ref={textRef}
        className="m-0 text-[11vw] leading-none md:text-[177px] font-semibold tracking-[-0.06em] text-center whitespace-nowrap origin-center will-change-transform"
        style={{ color: textColor }}
      >
        {text}
      </span>
    </section>
  );
};

export interface EndlessMotionFooterProps {
  /** The repeated text string to display */
  text?: string;
  /** The footer section background color */
  bgColor?: string;
  /** The repeated text color */
  textColor?: string;
  /** Scale animation end value when fully scrolled */
  minScale?: number;
  /** Number of lines displayed in each scroll loop group */
  lineCount?: number;
  /** Enable/disable infinite scroll looping via Lenis */
  infinite?: boolean;
  /** 
   * 'internal' (default): self-contained scrolling inside the container.
   * 'page-footer': pins scrolling to the bottom of the page, scrolling infinitely
   *                on scroll-down and releasing scroll control on scroll-up.
   */
  mode?: 'internal' | 'page-footer';
  /** Custom scroller container for ScrollTrigger (defaults to internal scroller) */
  scroller?: string | HTMLElement | null;
  /** Enable auto-scrolling marquee effect when not manually scrolling */
  autoScroll?: boolean;
  /** Speed of the auto-scrolling marquee (pixels per frame) */
  autoScrollSpeed?: number;
  /** Additional wrapper CSS classes */
  className?: string;
}

export const EndlessMotionFooter: React.FC<EndlessMotionFooterProps> = ({
  text = "Endless Motion",
  bgColor = "#0b84ff",
  textColor = "#e8e5d8",
  minScale = 0.5,
  lineCount = 5,
  infinite = true,
  mode = "internal",
  scroller,
  autoScroll = true,
  autoScrollSpeed = 1,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [internalScroller, setInternalScroller] = useState<HTMLDivElement | null>(null);
  const targetScroll = useRef(0);

  useEffect(() => {
    if (containerRef.current) {
      setInternalScroller(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    // Resolve the scroll container
    const scrollEl = scroller
      ? (typeof scroller === 'string' ? document.querySelector(scroller) as HTMLElement : scroller)
      : getScrollParent(containerRef.current);

    // Initialize Lenis for Smooth & Infinite Scrolling bounded to the container wrapper
    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: contentRef.current,
      smoothWheel: true,
      syncTouch: true,
      infinite: infinite,
    });

    let rafId: number;
    let autoScrollPos = 0;

    function raf(time: number) {
      if (mode === 'internal') {
        if (infinite && autoScroll) {
          if (!lenis.isScrolling) {
            autoScrollPos += autoScrollSpeed;
            lenis.scrollTo(autoScrollPos, { immediate: true, force: true });
            targetScroll.current = autoScrollPos;
          } else {
            autoScrollPos = lenis.scroll;
            targetScroll.current = lenis.scroll;
          }
        }
      } else if (mode === 'page-footer' && scrollEl) {
        // In page-footer mode, we auto-scroll slowly only when the window/container scroll is locked at the bottom
        const isWindow = scrollEl === document.documentElement || scrollEl === document.body;
        const scrollTop = isWindow ? window.scrollY : scrollEl.scrollTop;
        const scrollHeight = scrollEl.scrollHeight;
        const clientHeight = isWindow ? window.innerHeight : scrollEl.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        const isAtBottom = scrollTop >= maxScroll - 10;

        if (isAtBottom && infinite && autoScroll && !lenis.isScrolling) {
          autoScrollPos += autoScrollSpeed;
          lenis.scrollTo(autoScrollPos, { immediate: true, force: true });
          targetScroll.current = autoScrollPos;
        } else if (!isAtBottom) {
          // If we scroll up and leave the page bottom, smoothly ease the footer scroll back to 0 exponentially
          if (lenis.scroll > 0 && !lenis.isScrolling) {
            targetScroll.current = targetScroll.current * 0.8;
            if (targetScroll.current < 0.5) targetScroll.current = 0;
            lenis.scrollTo(targetScroll.current, { immediate: true, force: true });
          }
          autoScrollPos = lenis.scroll;
        } else {
          autoScrollPos = lenis.scroll;
        }
      }

      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Sync ScrollTrigger updates with Lenis scrolling
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger once everything is loaded
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Capture mouse wheel scrolls when locked at the bottom of the page
    const handleWheel = (e: WheelEvent) => {
      if (mode !== 'page-footer' || !scrollEl) return;

      const isWindow = scrollEl === document.documentElement || scrollEl === document.body;
      const scrollTop = isWindow ? window.scrollY : scrollEl.scrollTop;
      const scrollHeight = scrollEl.scrollHeight;
      const clientHeight = isWindow ? window.innerHeight : scrollEl.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const isAtBottom = scrollTop >= maxScroll - 10;

      if (isAtBottom && e.deltaY > 0) {
        // Scroll down at page bottom -> scroll footer infinitely
        e.preventDefault();
        if (!isWindow) {
          scrollEl.scrollTop = maxScroll;
        } else {
          window.scrollTo(0, maxScroll);
        }
        targetScroll.current += e.deltaY * 0.5;
        lenis.scrollTo(targetScroll.current);
      }
    };

    // Capture touch drags (mobile touch support)
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (mode === 'page-footer' && e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (mode !== 'page-footer' || !scrollEl || e.touches.length !== 1) return;

      const isWindow = scrollEl === document.documentElement || scrollEl === document.body;
      const scrollTop = isWindow ? window.scrollY : scrollEl.scrollTop;
      const scrollHeight = scrollEl.scrollHeight;
      const clientHeight = isWindow ? window.innerHeight : scrollEl.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const isAtBottom = scrollTop >= maxScroll - 10;

      if (isAtBottom) {
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY; // positive = scroll down

        if (deltaY > 0) {
          // scroll down internally
          e.preventDefault();
          if (!isWindow) {
            scrollEl.scrollTop = maxScroll;
          } else {
            window.scrollTo(0, maxScroll);
          }
          targetScroll.current += deltaY * 1.0;
          lenis.scrollTo(targetScroll.current);
          touchStartY = currentY;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      clearTimeout(timer);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [infinite, autoScroll, autoScrollSpeed, mode, scroller]);

  const activeScroller = scroller !== undefined ? scroller : internalScroller;

  return (
    <main 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden font-sans select-none ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Accessibility Labels */}
      <h1 className="sr-only">Endless Motion typography scroll experiment</h1>
      <p className="sr-only">
        A smooth scrolling typography demo with repeated decorative text that scales based on
        its position in the viewport.
      </p>

      {/* Main Animation Container */}
      <div ref={contentRef} className="flex flex-col px-[2vw] overflow-hidden" aria-hidden="true">
        {/* First Group */}
        <div className="flex flex-col">
          {[...Array(lineCount)].map((_, i) => (
            <EndlessLine 
              key={`group1-${i}`} 
              text={text} 
              minScale={minScale}
              textColor={textColor}
              scroller={activeScroller}
            />
          ))}
        </div>

        {/* Second Group (Required for seamless infinite loop when infinite is enabled) */}
        {infinite && (
          <div className="flex flex-col">
            {[...Array(lineCount)].map((_, i) => (
              <EndlessLine 
                key={`group2-${i}`} 
                text={text} 
                minScale={minScale}
                textColor={textColor}
                scroller={activeScroller}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default EndlessMotionFooter;
