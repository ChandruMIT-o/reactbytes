"use client";

import React, { useEffect, useRef } from "react";

const colorToRgba = (color: string, alpha: number) => {
  if (color.startsWith("#")) {
    const cleanHex = color.substring(1);
    let r = 255, g = 255, b = 255;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
};

export interface HelonBraidProps {
  /** X spacing between nodes for hex layout. Defaults to 80. */
  spacingX?: number;
  /** Base radius of the curved strands. Defaults to 65. */
  baseRadius?: number;
  /** Speed of the wave animation. Defaults to 0.05. */
  speed?: number;
  /** Energy propagation multiplier on node interaction. Defaults to 12. */
  excitationMultiplier?: number;
  /** Background color of the canvas. Defaults to "#070a12". */
  backgroundColor?: string;
  /** Color of structural blueprint layer 1 (outer circles). Defaults to "#ffffff". */
  blueprintColor1?: string;
  /** Color of structural blueprint layer 2 (under strands & mid circles). Defaults to "#3b82f6". */
  blueprintColor2?: string;
  /** Color of structural blueprint layer 3 (over strands & inner circles). Defaults to "#ec4899". */
  blueprintColor3?: string;
  /** Opacity of the structural blueprint lines. Defaults to 0.02. */
  blueprintOpacity?: number;
  /** Optional custom CSS classes for the container. */
  className?: string;
  /** Optional overlay children. */
  children?: React.ReactNode;
}

export const HelonBraid: React.FC<HelonBraidProps> = ({
  spacingX = 80,
  baseRadius = 65,
  speed = 0.05,
  excitationMultiplier = 12,
  backgroundColor = "#070a12",
  blueprintColor1 = "#ffffff",
  blueprintColor2 = "#3b82f6",
  blueprintColor3 = "#ec4899",
  blueprintOpacity = 0.02,
  className = "",
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep a mutable ref of the config so the requestAnimationFrame loop can access 
  // the latest values without needing dependency array re-runs.
  const configRef = useRef({ spacingX, baseRadius, speed, excitationMultiplier, backgroundColor, blueprintColor1, blueprintColor2, blueprintColor3, blueprintOpacity });
  useEffect(() => {
    configRef.current = { spacingX, baseRadius, speed, excitationMultiplier, backgroundColor, blueprintColor1, blueprintColor2, blueprintColor3, blueprintOpacity };
  }, [spacingX, baseRadius, speed, excitationMultiplier, backgroundColor, blueprintColor1, blueprintColor2, blueprintColor3, blueprintOpacity]);

  // Signal the engine to rebuild structural dependencies (grid arrays) 
  // without tearing down the whole engine loop.
  const rebuildGridRef = useRef(false);
  useEffect(() => {
    rebuildGridRef.current = true;
  }, [spacingX]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let helonGrid: HelonNode[][] = [];
    let time = 0;
    let mouse = { x: null as number | null, y: null as number | null };
    
    // Dynamically tracking required rows and cols to fill the screen
    let activeRows = 0;
    let activeCols = 0;

    class HelonNode {
      r: number; c: number; x: number; y: number;
      charge: number; targetCharge: number; energy: number;
      phaseOffset: number; connections: HelonNode[];

      constructor(r: number, c: number, x: number, y: number) {
        this.r = r; this.c = c; this.x = x; this.y = y;
        this.charge = 0; 
        this.targetCharge = 0; 
        this.energy = 0;             
        this.phaseOffset = (r * 0.5 + c * 0.3);
        this.connections = [];       
      }

      update() {
        this.charge += (this.targetCharge - this.charge) * 0.1;
        this.energy *= 0.95; 
        if (Math.abs(this.charge) > 0.01 && Math.random() < 0.02) {
          this.targetCharge = (Math.random() > 0.5 ? 1 : -1) * Math.random();
        }
      }
    }

    const initGrid = () => {
      const { spacingX } = configRef.current;
      const spacingY = spacingX * 0.866; // sin(60 deg) for hex layout
      
      // Calculate dynamic grid size to fill the screen completely plus a 2-node margin buffer
      activeCols = Math.ceil(canvas.clientWidth / spacingX) + 2;
      activeRows = Math.ceil(canvas.clientHeight / spacingY) + 2;

      helonGrid = [];
      const startX = (canvas.clientWidth - (activeCols - 1) * spacingX) / 2;
      const startY = (canvas.clientHeight - (activeRows - 1) * spacingY) / 2;

      // Create Nodes
      for (let r = 0; r < activeRows; r++) {
        helonGrid[r] = [];
        for (let c = 0; c < activeCols; c++) {
          let xOffset = (r % 2 === 0) ? 0 : spacingX / 2;
          let x = startX + c * spacingX + xOffset;
          let y = startY + r * spacingY;
          helonGrid[r][c] = new HelonNode(r, c, x, y);
        }
      }

      // Link Neighbors
      for (let r = 0; r < activeRows; r++) {
        for (let c = 0; c < activeCols; c++) {
          const node = helonGrid[r][c];
          const isEven = (r % 2 === 0);
          const neighbors = isEven ? 
                [[0, -1], [0, 1], [-1,-1], [-1, 0], [1,-1], [1, 0]] :
                [[0, -1], [0, 1], [-1, 0], [-1, 1], [1, 0], [1, 1]];

          neighbors.forEach(([dr, dc]) => {
            let nr = r + dr;
            let nc = c + dc;
            if (nr >= 0 && nr < activeRows && nc >= 0 && nc < activeCols) {
              node.connections.push(helonGrid[nr][nc]);
            }
          });
        }
      }
    };

    const getBraidGeom = (nodeA: HelonNode, nodeB: HelonNode, side: 'under'|'over') => {
      const { baseRadius, speed, excitationMultiplier } = configRef.current;
      const midX = (nodeA.x + nodeB.x) / 2;
      const midY = (nodeA.y + nodeB.y) / 2;
      const dx = nodeB.x - nodeA.x;
      const dy = nodeB.y - nodeA.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / dist;
      const ny = dx / dist;

      const excitation = (nodeA.energy + nodeB.energy) * excitationMultiplier;
      const wave = Math.sin(time * speed + nodeA.phaseOffset) * 3;
      const offsetDist = (baseRadius * 0.38) + wave + excitation;

      const sign = (side === 'over') ? 1 : -1;
      const cx = midX + nx * offsetDist * sign;
      const cy = midY + ny * offsetDist * sign;

      const alpha = 0.3 + (nodeA.energy + nodeB.energy) * 0.6;
      const width = 2.0 + (nodeA.energy + nodeB.energy) * 2.5;

      return { nodeA, nodeB, cx, cy, alpha, width, side };
    };

    const drawStrand = (strand: any, maskMode = false) => {
      const { backgroundColor, blueprintColor2, blueprintColor3 } = configRef.current;
      ctx.beginPath();
      ctx.moveTo(strand.nodeA.x, strand.nodeA.y);
      ctx.quadraticCurveTo(strand.cx, strand.cy, strand.nodeB.x, strand.nodeB.y);

      if (maskMode) {
        ctx.strokeStyle = backgroundColor; 
        ctx.lineWidth = strand.width + 5;
        ctx.stroke();
      } else {
        const baseColor = strand.side === 'under' ? blueprintColor2 : blueprintColor3;
        ctx.strokeStyle = colorToRgba(baseColor, strand.alpha);
        ctx.lineWidth = strand.width;
        ctx.stroke();
      }
    };

    const triggerHelonInteraction = (targetNode: HelonNode) => {
      targetNode.energy = 1.2;
      targetNode.targetCharge = (Math.random() - 0.5) * 2;

      targetNode.connections.forEach((neighbor, index) => {
        setTimeout(() => {
          neighbor.energy = 0.8;
          neighbor.targetCharge = targetNode.targetCharge * 0.6;

          neighbor.connections.forEach((subNeighbor) => {
            if(subNeighbor !== targetNode) {
              setTimeout(() => {
                subNeighbor.energy = 0.4;
              }, 100);
            }
          });
        }, index * 50);
      });
    };

    const animate = () => {
      // Rebuild structural data on-the-fly if config changed
      if (rebuildGridRef.current) {
        initGrid();
        rebuildGridRef.current = false;
      }

      // Check for parent layout size changes (e.g. on mount or resize)
      const dpr = window.devicePixelRatio || 1;
      const expectedWidth = Math.floor(canvas.clientWidth * dpr);
      const expectedHeight = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== expectedWidth || canvas.height !== expectedHeight) {
        canvas.width = expectedWidth;
        canvas.height = expectedHeight;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initGrid();
      }

      time++;
      
      const { baseRadius, backgroundColor, blueprintColor1, blueprintColor2, blueprintColor3, blueprintOpacity } = configRef.current;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // 1. Structural blueprint lines
      ctx.save();
      ctx.lineWidth = 1;
      for (let r = 0; r < activeRows; r++) {
        for (let c = 0; c < activeCols; c++) {
          if (!helonGrid[r]?.[c]) continue;
          const node = helonGrid[r][c];

          // Outer circle (Blueprint Color 1)
          ctx.strokeStyle = blueprintColor1;
          ctx.globalAlpha = blueprintOpacity;
          ctx.beginPath();
          ctx.arc(node.x, node.y, baseRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Mid circle (Blueprint Color 2)
          ctx.strokeStyle = blueprintColor2;
          ctx.globalAlpha = blueprintOpacity * 0.65;
          ctx.beginPath();
          ctx.arc(node.x, node.y, baseRadius * 0.65, 0, Math.PI * 2);
          ctx.stroke();

          // Inner circle (Blueprint Color 3)
          ctx.strokeStyle = blueprintColor3;
          ctx.globalAlpha = blueprintOpacity * 0.35;
          ctx.beginPath();
          ctx.arc(node.x, node.y, baseRadius * 0.35, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Gather strands
      let strands: any[] = [];
      for (let r = 0; r < activeRows; r++) {
        for (let c = 0; c < activeCols; c++) {
          if (!helonGrid[r]?.[c]) continue;
          const node = helonGrid[r][c];
          node.update();
          node.connections.forEach(neighbor => {
            if (neighbor.r > node.r || (neighbor.r === node.r && neighbor.c > node.c)) {
              strands.push(getBraidGeom(node, neighbor, 'under'));
              strands.push(getBraidGeom(node, neighbor, 'over'));
            }
          });
        }
      }

      // Separated Weaving Passes
      strands.filter(s => s.side === 'under').forEach(s => drawStrand(s, false));
      strands.filter(s => s.side === 'over').forEach(s => drawStrand(s, true));
      strands.filter(s => s.side === 'over').forEach(s => drawStrand(s, false));

      // 2. Render Node Cores
      for (let r = 0; r < activeRows; r++) {
        for (let c = 0; c < activeCols; c++) {
          if (!helonGrid[r]?.[c]) continue;
          const node = helonGrid[r][c];
          let dMouse = 0;
          if (mouse.x !== null && mouse.y !== null) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 80) dMouse = (1 - dist / 80) * 0.4;
          }

          ctx.fillStyle = backgroundColor;
          ctx.strokeStyle = colorToRgba(blueprintColor3, 0.4 + node.energy + dMouse);
          ctx.lineWidth = 2 + node.energy * 3;

          ctx.beginPath();
          ctx.arc(node.x, node.y, 7 + node.energy * 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          if (Math.abs(node.charge) > 0.1 || node.energy > 0.1) {
            ctx.fillStyle = colorToRgba(blueprintColor2, node.energy + 0.3);
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2.5 + node.energy, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Event Handlers
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initGrid();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleClick = () => {
      if (mouse.x === null || mouse.y === null) return;
      let closestNode: HelonNode | null = null;
      let minDist = Infinity;
      const { spacingX } = configRef.current;

      for (let r = 0; r < activeRows; r++) {
        for (let c = 0; c < activeCols; c++) {
          if (!helonGrid[r]?.[c]) continue;
          const node = helonGrid[r][c];
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < minDist) {
            minDist = dist;
            closestNode = node;
          }
        }
      }

      if (closestNode && minDist < spacingX) {
        triggerHelonInteraction(closestNode);
      }
    };

    const handleExciteEvent = () => {
      const centerR = Math.floor(activeRows / 2);
      const centerC = Math.floor(activeCols / 2);
      const centerNode = helonGrid[centerR]?.[centerC];
      if (centerNode) {
        triggerHelonInteraction(centerNode);
      }
    };

    // Bind events
    window.addEventListener('resize', handleResize);
    window.addEventListener('excite-helon', handleExciteEvent);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    // Initial Start
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('excite-helon', handleExciteEvent);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const hasHeight = className.includes("h-") || className.includes("min-h-");

  return (
    <div className={`relative isolate w-full overflow-hidden select-none ${hasHeight ? "" : "h-full"} ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ backgroundColor }}
      />
      {children && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

export default HelonBraid;
