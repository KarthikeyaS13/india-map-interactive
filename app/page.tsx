"use client";

import { useState } from "react";
import { IndiaPresenceMap } from "../components/IndiaMap/IndiaPresenceMap";
import { LocationForm } from "../components/IndiaMap/LocationForm";
import { companyPresence, CompanyLocation } from "../data/companyPresence";

export default function Home() {
  const [locations, setLocations] = useState<CompanyLocation[]>(companyPresence);

  const handleAddLocation = (newLoc: CompanyLocation) => {
    setLocations(prev => {
      // If the location already exists, update it. Otherwise, add it.
      const existsIndex = prev.findIndex(loc => loc.state === newLoc.state);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newLoc;
        return updated;
      }
      return [...prev, newLoc];
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[90rem] mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Presence Across India
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover our regional headquarters, development centers, and sales offices strategically located to serve you better.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Form Section */}
          <div className="w-full lg:w-1/3 shrink-0">
            <LocationForm onAddLocation={handleAddLocation} />
          </div>

          {/* Map Section */}
          <div className="w-full lg:w-2/3 bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 overflow-hidden relative">
            {/* Glassmorphism gradient overlays */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[120px]" />
              <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] bg-purple-100 dark:bg-purple-900/20 rounded-full blur-[100px]" />
            </div>

            <IndiaPresenceMap locations={locations} />
          </div>
          
        </div>
      </div>
    </main>
  );
}
