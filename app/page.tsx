"use client";

import { useState, useEffect } from "react";
import { IndiaPresenceMap } from "../components/IndiaMap/IndiaPresenceMap";
import { LocationForm } from "../components/IndiaMap/LocationForm";
import { companyPresence, StatePresence } from "../data/companyPresence";

export default function Home() {
  const [locations, setLocations] = useState<Record<string, StatePresence>>(companyPresence);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("india_presence_locations");
    if (saved) {
      try {
        setLocations(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading locations from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when locations state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("india_presence_locations", JSON.stringify(locations));
    }
  }, [locations, isLoaded]);

  const handleAddLocation = (newLoc: any) => {
    setLocations(prev => {
      const stateName = newLoc.state;
      const updated = { ...prev };
      
      const existingState = updated[stateName] || { 
        status: newLoc.status,
        offices: 0,
        employees: 0,
        description: "",
        logo: newLoc.logo
      };
      
      updated[stateName] = {
        ...existingState,
        status: newLoc.status,
        offices: existingState.offices + newLoc.offices,
        employees: existingState.employees + newLoc.employees,
        description: newLoc.description || existingState.description,
        logo: newLoc.logo || existingState.logo
      };
      
      return updated;
    });
  };

  const handleResetLocations = () => {
    if (window.confirm("Are you sure you want to reset the map to default data? Any custom locations will be deleted.")) {
      setLocations(companyPresence);
      localStorage.setItem("india_presence_locations", JSON.stringify(companyPresence));
    }
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
          <div className="w-full lg:w-1/3 shrink-0 space-y-4">
            <LocationForm onAddLocation={handleAddLocation} />
            <button
              onClick={handleResetLocations}
              className="w-full py-2.5 px-4 text-sm font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 bg-white hover:bg-red-50 dark:bg-slate-900 dark:hover:bg-red-950/30 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-200"
            >
              Reset to Default Map Data
            </button>
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
