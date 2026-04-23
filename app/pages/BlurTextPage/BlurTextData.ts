export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "''",
				description:
					"The text to be broken down and animated. Handles spaces automatically.",
			},
			{
				name: "animateBy",
				type: "'words' | 'letters'",
				defaultValue: "'letters'",
				description: "Whether to animate each word or each letter individually.",
			},
			{
				name: "direction",
				type: "'top' | 'bottom' | 'none'",
				defaultValue: "'top'",
				description: "The direction from which the text elements appear.",
			},
			{
				name: "duration",
				type: "number",
				defaultValue: "0.5",
				description: "The duration of the animation for each individual element.",
			},
			{
				name: "delay",
				type: "number",
				defaultValue: "0",
				description: "Base delay before the animation sequence starts.",
			},
			{
				name: "loop",
				type: "boolean",
				defaultValue: "false",
				description: "Whether the animation should loop continuously (pulsing effect).",
			},
			{
				name: "blurAmount",
				type: "number",
				defaultValue: "10",
				description: "The peak blur intensity in pixels.",
			},
		],
	},
	{
		title: "Advanced Props",
		props: [
			{
				name: "easing",
				type: "string | number[]",
				defaultValue: "'easeOut'",
				description: "Custom easing function or cubic-bezier array.",
			},
			{
				name: "threshold",
				type: "number",
				defaultValue: "0.1",
				description: "Intersection observer threshold to trigger animation.",
			},
			{
				name: "rootMargin",
				type: "string",
				defaultValue: "'0px'",
				description: "Intersection observer root margin.",
			},
			{
				name: "onAnimationComplete",
				type: "() => void",
				defaultValue: "undefined",
				description: "Callback function triggered when all elements finish animating.",
			},
			{
				name: "className",
				type: "string",
				defaultValue: "''",
				description: "Additional CSS classes for the text container.",
			},
		],
	},
];

export const componentCode = `import React, { useRef, useEffect, useState } from "react";
import { motion, Variant } from "framer-motion";

export interface BlurTextProps {
  text?: string;
  delay?: number;
  stagger?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "none";
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  onAnimationComplete?: () => void;
  easing?: string | number[];
  loop?: boolean;
  blurAmount?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 0,
  stagger = 0.05,
  className = "",
  animateBy = "letters",
  direction = "top",
  duration = 0.5,
  threshold = 0.1,
  rootMargin = "0px",
  onAnimationComplete,
  easing = "easeOut",
  loop = false,
  blurAmount = 10,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const getVariants = () => {
    const yOffset = direction === "top" ? -40 : direction === "bottom" ? 40 : 0;

    return {
      hidden: {
        filter: \`blur(\${blurAmount}px)\`,
        opacity: 0,
        y: yOffset,
      },
      visible: {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
      },
    };
  };

  const variants = getVariants();

  return (
    <p
      ref={ref}
      className={\`flex flex-wrap items-center justify-center \${className}\`}
    >
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial="hidden"
          animate={
            inView
              ? loop
                ? {
                    filter: ["blur(0px)", \`blur(\${blurAmount}px)\`, "blur(0px)"],
                    opacity: [1, 0.5, 1],
                    y: 0,
                  }
                : "visible"
              : "hidden"
          }
          variants={variants}
          transition={
            loop
              ? {
                  duration: duration * 2,
                  repeat: Infinity,
                  delay: delay + i * stagger,
                  ease: "easeInOut",
                }
              : {
                  delay: delay + i * stagger,
                  duration: duration,
                  ease: easing,
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                }
          }
          onAnimationComplete={() => {
            if (!loop) {
              animatedCount.current += 1;
              if (animatedCount.current === elements.length && onAnimationComplete) {
                onAnimationComplete();
              }
            }
          }}
          className="inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {el === " " ? "\\u00A0" : el}
          {animateBy === "words" && i < elements.length - 1 && "\\u00A0"}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;`;




export const creditsData = [
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
				role: "Animation",
				url: "https://framer.com/motion",
			},
			{
				name: "Lucide",
				role: "Iconography",
				url: "https://lucide.dev",
			},
		],
	},
];

