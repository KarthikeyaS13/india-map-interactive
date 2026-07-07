import { motion } from "framer-motion";

interface TooltipProps {
  data: {
    state: string;
    offices: number;
    employees: number;
    logo: string;
    description: string;
    status: string;
  };
  position: { x: number; y: number };
}

export const Tooltip = ({ data, position }: TooltipProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 pointer-events-none"
      style={{
        left: position.x + 20,
        top: position.y - 40,
      }}
    >
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl rounded-2xl p-4 w-64">
        <div className="flex items-center gap-3 mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          {data.logo && (
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-sm shrink-0 border border-gray-100 dark:border-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.logo} alt="logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">{data.state}</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {data.status}
            </span>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Offices</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.offices}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Employees</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.employees}</span>
          </div>
          {data.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic pt-2 border-t border-gray-100 dark:border-gray-800">
              {data.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
