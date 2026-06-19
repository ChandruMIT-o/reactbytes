"use client";

import dynamic from "next/dynamic";
import React from "react";

export const ComponentMap: Record<string, React.ComponentType<any>> = {
  "reveal-under": dynamic(() => import("../meta/text/TextEnter/RevealUnder")),
  "fall-down": dynamic(() => import("../meta/text/TextEnter/FallDown")),
  "variable-weight": dynamic(() => import("../meta/text/TextEnter/VariableWeightText")),
};
