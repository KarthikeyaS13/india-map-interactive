"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatePresence } from "../../data/companyPresence";
import { stateCoordinates } from "../../utils/stateCoordinates";
import { IndiaMapSVG } from "./IndiaMapSVG";
import { CompanyMarker } from "./CompanyMarker";
import { Tooltip } from "./Tooltip";
import { useAmbientMapAnimation } from "./useAmbientMapAnimation";

interface IndiaPresenceMapProps {
  locations: Record<string, StatePresence>;
}

export const IndiaPresenceMap = ({ locations }: IndiaPresenceMapProps) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  
  const [isIdle, setIsIdle] = useState(true);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = React.useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIsIdle(true), 5000);
  }, []);

  React.useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const ambientHighlights = useAmbientMapAnimation(isIdle);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    resetIdleTimer();
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const hoveredData = hoveredState ? locations[hoveredState] : null;

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[600px] md:h-[800px] flex items-center justify-center p-4">
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] -z-10" />

      <AnimatePresence mode="wait">
          <motion.div 
            key="india-map"
            ref={mapRef}
            className="relative h-full max-w-full"
            style={{ aspectRatio: "612 / 696" }}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <IndiaMapSVG 
              hoveredState={hoveredState}
              locations={locations}
              ambientHighlights={ambientHighlights}
              onStateHover={(stateId) => {
                resetIdleTimer();
                setHoveredState(stateId);
              }}
              onStateLeave={() => {
                resetIdleTimer();
                setHoveredState(null);
              }}
            />

            {/* Render state names */}
            {Object.entries(stateCoordinates).map(([stateName, coords]) => {
              const hasPresence = !!locations[stateName];
              return (
                <div
                  key={`label-${stateName}`}
                  className={`absolute transform -translate-x-1/2 pointer-events-none z-0 ${hasPresence ? 'translate-y-5 md:translate-y-6' : '-translate-y-1/2'}`}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                >
                  <span className={`text-[0.45rem] md:text-[0.6rem] font-bold tracking-wider text-center flex select-none ${hasPresence ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'text-slate-500/70 dark:text-slate-400/50'}`}>
                    {stateName}
                  </span>
                </div>
              );
            })}

            {/* Render markers for active states */}
            {Object.entries(locations).map(([stateName, stateData]) => {
              const coords = stateCoordinates[stateName];
              if (!coords) return null;
              
              const logo = stateData.logo || "";

              // Calculate stagger delay
              const isAmbientHighlighted = !!ambientHighlights[stateName];
              const ambientIndex = Object.keys(ambientHighlights).indexOf(stateName);
              const staggerDelay = isAmbientHighlighted ? (ambientIndex > -1 ? ambientIndex * 0.15 : 0) : 0;

              return (
                <CompanyMarker
                  key={stateName}
                  x={coords.x}
                  y={coords.y}
                  logo={logo}
                  isHovered={hoveredState === stateName}
                  isAmbientHighlighted={isAmbientHighlighted}
                  staggerDelay={staggerDelay}
                  onMouseEnter={() => {
                    resetIdleTimer();
                    setHoveredState(stateName);
                  }}
                  onMouseLeave={() => {
                    resetIdleTimer();
                    setHoveredState(null);
                  }}
                />
              );
            })}

            {/* Render Tooltip for India Map */}
            <AnimatePresence>
              {hoveredData && (
                <Tooltip 
                  key="tooltip"
                  // Create a summarized data object for the tooltip
                  data={{
                    state: hoveredState!,
                    offices: hoveredData.offices,
                    employees: hoveredData.employees,
                    description: hoveredData.description,
                    logo: hoveredData.logo || "",
                    status: hoveredData.status || "Active"
                  }} 
                  position={mousePos} 
                />
              )}
            </AnimatePresence>
          </motion.div>
      </AnimatePresence>
    </div>
  );
};
