"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CompanyLocation } from "../../data/companyPresence";
import { stateCoordinates } from "../../utils/stateCoordinates";
import { IndiaMapSVG } from "./IndiaMapSVG";
import { CompanyMarker } from "./CompanyMarker";
import { Tooltip } from "./Tooltip";

interface IndiaPresenceMapProps {
  locations: CompanyLocation[];
}

export const IndiaPresenceMap = ({ locations }: IndiaPresenceMapProps) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const hoveredData = locations.find((p) => p.state === hoveredState);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[600px] md:h-[800px] flex items-center justify-center p-4">
      
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] -z-10" />

      <motion.div 
        ref={mapRef}
        className="relative h-full max-w-full"
        style={{ aspectRatio: "612 / 696" }}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <IndiaMapSVG 
          hoveredState={hoveredState}
          locations={locations}
          onStateHover={(stateId) => setHoveredState(stateId)}
          onStateLeave={() => setHoveredState(null)}
        />

        {/* Render state names */}
        {Object.entries(stateCoordinates).map(([stateName, coords]) => {
          const hasPresence = locations.some(p => p.state === stateName);
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
        {locations.map((location) => {
          const coords = stateCoordinates[location.state];
          if (!coords) return null;

          return (
            <CompanyMarker
              key={location.state}
              x={coords.x}
              y={coords.y}
              logo={location.logo}
              isHovered={hoveredState === location.state}
              onMouseEnter={() => setHoveredState(location.state)}
              onMouseLeave={() => setHoveredState(null)}
            />
          );
        })}

        {/* Render Tooltip */}
        <AnimatePresence>
          {hoveredData && (
            <Tooltip 
              key="tooltip"
              data={hoveredData} 
              position={mousePos} 
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
