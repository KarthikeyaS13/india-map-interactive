import React, { useState } from "react";
import { companyLogo } from "../../data/companyPresence";
import { stateCoordinates } from "../../utils/stateCoordinates";
import { MapPin, Users, Building, PlusCircle } from "lucide-react";

interface LocationFormProps {
  onAddLocation: (location: any) => void;
}

export const LocationForm = ({ onAddLocation }: LocationFormProps) => {
  const [stateName, setStateName] = useState("");
  const [offices, setOffices] = useState(1);
  const [employees, setEmployees] = useState(10);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Active" | "Upcoming">("Active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stateName) return;

    onAddLocation({
      state: stateName,
      offices: Number(offices),
      employees: Number(employees),
      description: description || "New Location",
      status,
      logo: companyLogo, // use default logo for now
    });

    // Reset form
    setStateName("");
    setOffices(1);
    setEmployees(10);
    setDescription("");
    setStatus("Active");
  };

  const availableStates = Object.keys(stateCoordinates).sort();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 p-6 md:p-8">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-500" />
        Add / Update Location
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select State</label>
          <select 
            required
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="" disabled>Choose a state...</option>
            {availableStates.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Building className="w-4 h-4 text-slate-400" /> Offices
            </label>
            <input 
              type="number" 
              min="1"
              required
              value={offices}
              onChange={(e) => setOffices(e.target.valueAsNumber)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Users className="w-4 h-4 text-slate-400" /> Employees
            </label>
            <input 
              type="number" 
              min="1"
              required
              value={employees}
              onChange={(e) => setEmployees(e.target.valueAsNumber)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value as "Active" | "Upcoming")}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. Regional Headquarters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          Add to Map
        </button>
      </form>
    </div>
  );
};
