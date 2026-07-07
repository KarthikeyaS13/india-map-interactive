import { motion } from "framer-motion";

interface CompanyMarkerProps {
  x: number;
  y: number;
  logo: string;
  isHovered: boolean;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export const CompanyMarker = ({ x, y, logo, isHovered, onMouseEnter, onMouseLeave }: CompanyMarkerProps) => {
  return (
    <motion.div
      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: [0, -5, 0],
        scale: isHovered ? 1.2 : 1 
      }}
      transition={{ 
        opacity: { duration: 0.5 },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.2 }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-10 h-10 rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center p-1 hover:shadow-xl transition-shadow relative z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="Company Logo" className="w-full h-full object-contain rounded-full" />
      </div>
      
      {/* Pulse ring effect */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-blue-500 opacity-20 -z-10"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};
