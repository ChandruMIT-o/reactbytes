export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'LOADING'",
				description:
					"The text to be broken down and animated. Handles spaces automatically.",
			},
			{
				name: "animationDuration",
				type: "number",
				defaultValue: "1.5",
				description:
					"How long the blur takes to go from 0px to maxBlur (in seconds).",
			},
			{
				name: "staggerDelay",
				type: "number",
				defaultValue: "0.2",
				description:
					"The delay multiplier between each letter's animation start.",
			},
			{
				name: "maxBlur",
				type: "string",
				defaultValue: "'4px'",
				description: "The peak blur intensity applied to the text.",
			},
		],
	},
	{
		title: "Styling Props",
		props: [
			{
				name: "textColorClass",
				type: "string",
				defaultValue: "'text-white'",
				description: "Tailwind class for the text color.",
			},
			{
				name: "isOverlay",
				type: "boolean",
				defaultValue: "true",
				description:
					"If true, applies fixed inset-0. If false, fills parent container.",
			},
			{
				name: "containerClassName",
				type: "string",
				defaultValue: "''",
				description: "Extra utility classes for the outermost wrapper.",
			},
			{
				name: "textClassName",
				type: "string",
				defaultValue: "''",
				description: "Extra utility classes for the text container.",
			},
		],
	},
];

export const componentCode = `import React, { useMemo } from 'react';

export interface BlurTextProps {
  text?: string;
  animationDuration?: number;
  staggerDelay?: number;
  maxBlur?: string;
  textColorClass?: string;
  isOverlay?: boolean;
  containerClassName?: string;
  textClassName?: string;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text = 'LOADING',
  animationDuration = 1.5,
  staggerDelay = 0.2,
  maxBlur = '4px',
  textColorClass = 'text-white',
  isOverlay = true,
  containerClassName = '',
  textClassName = '',
}) => {
  const letters = useMemo(() => text.split(''), [text]);
  const animationName = \`blur-text-\${maxBlur.replace(/[^a-zA-Z0-9]/g, '')}\`;

  return (
    <>
      <style>{\`
        @keyframes \${animationName} {
          0% { filter: blur(0px); }
          100% { filter: blur(\${maxBlur}); }
        }
      \`}</style>
      
      <div
        className={\`
          \${isOverlay ? 'fixed inset-0 z-[9999]' : 'relative w-full h-full'}
          \${containerClassName}
        \`}
      >
        <div
          className={\`
            absolute inset-0 m-auto flex items-center justify-center
            w-full h-24
            \${textClassName}
          \`}
        >
          {letters.map((char, index) => (
            <span
              key={\`\${index}-\${char}\`}
              className={\`inline-block mx-1 sm:mx-1.5 \${textColorClass}\`}
              style={{
                animation: \`\${animationName} \${animationDuration}s \${
                  index * staggerDelay
                }s infinite linear alternate\`,
              }}
            >
              {char === ' ' ? '\\u00A0' : char}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlurText;`;
