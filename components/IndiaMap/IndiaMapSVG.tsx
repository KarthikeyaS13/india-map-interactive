import React from "react";
import India from "@svg-maps/india";
import { CompanyLocation } from "../../data/companyPresence";

interface IndiaMapSVGProps {
  hoveredState: string | null;
  locations: CompanyLocation[];
  onStateHover: (stateName: string, event: React.MouseEvent) => void;
  onStateLeave: () => void;
}

export const IndiaMapSVG = ({ hoveredState, locations, onStateHover, onStateLeave }: IndiaMapSVGProps) => {
  return (
    <svg 
      viewBox={India.viewBox} 
      className="w-full h-full drop-shadow-2xl filter"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {India.locations.map((state) => {
        const locationData = locations.find((l) => l.state === state.name);
        const isActive = !!locationData;
        const isHovered = hoveredState === state.name;
        
        // We only want the 28 states to be interactive
        const isSelectable = [
          "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
          "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
          "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
          "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
          "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
        ].includes(state.name);

        let fillColor = "fill-slate-200 dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600";
        if (locationData?.status === "Active") {
          fillColor = "fill-emerald-500 dark:fill-emerald-600 stroke-emerald-600 dark:stroke-emerald-500";
        } else if (locationData?.status === "Upcoming") {
          fillColor = "fill-orange-400 dark:fill-orange-500 stroke-orange-500 dark:stroke-orange-400";
        }

        return (
          <path
            key={state.id}
            id={state.id}
            d={state.path}
            className={`
              transition-all duration-300 ease-in-out
              ${fillColor}
              ${isHovered && isSelectable ? "brightness-110 -translate-y-1" : ""}
              ${isSelectable ? "cursor-pointer" : "cursor-default"}
            `}
            strokeWidth="1"
            filter={isActive ? "url(#glow)" : ""}
            onMouseEnter={(e) => isSelectable && onStateHover(state.name, e)}
            onMouseLeave={() => isSelectable && onStateLeave()}
            style={{ transformOrigin: "center" }}
          />
        );
      })}
    </svg>
  );
};
