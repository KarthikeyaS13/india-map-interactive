import React, { useMemo } from "react";
import India from "@svg-maps/india";
import { StatePresence } from "../../data/companyPresence";
import { motion } from "framer-motion";

interface IndiaMapSVGProps {
  hoveredState: string | null;
  locations: Record<string, StatePresence>;
  ambientHighlights?: Record<string, string>;
  onStateHover: (stateName: string, event: React.MouseEvent) => void;
  onStateLeave: () => void;
}

export const IndiaMapSVG = ({ hoveredState, locations, ambientHighlights = {}, onStateHover, onStateLeave }: IndiaMapSVGProps) => {
  // Sort locations: larger states first, then ambient highlighted states to the end (top of z-stack)
  const sortedLocations = useMemo(() => {
    return [...India.locations].sort((a, b) => {
      const aAmbient = !!ambientHighlights[a.name];
      const bAmbient = !!ambientHighlights[b.name];
      if (aAmbient && !bAmbient) return 1;
      if (!aAmbient && bAmbient) return -1;
      return b.path.length - a.path.length;
    });
  }, [ambientHighlights]);

  return (
    <svg
      viewBox={India.viewBox}
      className="w-full h-full drop-shadow-2xl filter"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="depth-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {sortedLocations.map((state) => {
        const locationData = locations[state.name];
        const isActive = !!locationData;
        const isHovered = hoveredState === state.name;

        // We only want the 28 states to be interactive
        const isSelectable = [
          "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
          "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
          "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
          "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
          "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
        ].includes(state.name);

        let baseFill = "#E8EEF8";
        let baseStroke = "#C8D4E5";
        
        if (locationData?.status === "Active") {
          baseFill = "#72D8B0";
          baseStroke = "#C8D4E5";
        } else if (locationData?.status === "Upcoming") {
          baseFill = "#FB923C";
          baseStroke = "#C8D4E5";
        }

        const ambientColor = ambientHighlights[state.name];
        const isAmbient = !!ambientColor;

        let targetFill = baseFill;
        let targetStroke = baseStroke;

        if (isAmbient && isSelectable) {
          targetFill = ambientColor;
          targetStroke = "#B7C9DD"; // Slightly brighten border
        }

        // Stagger delay based on index in highlighted states
        const ambientIndex = Object.keys(ambientHighlights).indexOf(state.name);
        const staggerDelay = isAmbient ? (ambientIndex > -1 ? ambientIndex * 0.15 : 0) : 0;

        let animateState: any = {};
        let transitionState: any = {};

        if (isHovered && isSelectable) {
          animateState = { 
            scale: 1, 
            y: 0, 
            fill: targetFill,
            stroke: targetStroke,
            filter: "brightness(1.03) drop-shadow(0px 2px 8px rgba(0,0,0,0.08))",
            opacity: 1
          };
          transitionState = { duration: 0.3 };
        } else if (isAmbient && isSelectable) {
          animateState = { 
            fill: targetFill, 
            stroke: targetStroke,
            scale: 1.01, 
            y: [0, -4.5, -4, -5, -4.5], // Initial lift then float
            filter: "brightness(1.02) drop-shadow(0px 8px 14px rgba(0,0,0,0.10)) drop-shadow(0px 2px 5px rgba(0,0,0,0.06))",
            opacity: 1
          };
          transitionState = {
            duration: 0.4,
            delay: staggerDelay,
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.15, 0.5, 0.8, 1],
              delay: staggerDelay
            }
          };
        } else {
          animateState = { 
            scale: 1, 
            y: 0, 
            fill: targetFill, 
            stroke: targetStroke,
            filter: "brightness(1) drop-shadow(0px 0px 0px rgba(0,0,0,0))",
            opacity: 1
          };
          transitionState = { duration: 0.4 };
        }

        return (
          <g key={state.id}>
            <motion.path
              id={state.id}
              d={state.path}
              className={`
                transition-colors duration-500 ease-in-out
                ${isSelectable ? "cursor-default" : "cursor-default"}
              `}
              strokeWidth="1"
              initial={false}
              animate={animateState}
              transition={transitionState}
              onMouseEnter={(e: any) => isSelectable && onStateHover(state.name, e)}
              onMouseLeave={() => isSelectable && onStateLeave()}
              style={{ transformOrigin: "center" }}
            />
            {/* 3D Lighting Overlay for ambient states */}
            {isAmbient && isSelectable && (
              <motion.path
                d={state.path}
                fill="url(#depth-gradient)"
                pointerEvents="none"
                initial={{ opacity: 0, scale: 1, y: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1.01,
                  y: [0, -4.5, -4, -5, -4.5]
                }}
                transition={{
                  opacity: { duration: 0.4, delay: staggerDelay },
                  scale: { duration: 0.4, delay: staggerDelay },
                  y: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.15, 0.5, 0.8, 1],
                    delay: staggerDelay
                  }
                }}
                style={{ transformOrigin: "center" }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
