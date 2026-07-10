import { motion } from "framer-motion";

interface CompanyMarkerProps {
  x: number;
  y: number;
  logo: string;
  isHovered: boolean;
  isAmbientHighlighted?: boolean;
  staggerDelay?: number;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export const CompanyMarker = ({ x, y, logo, isHovered, isAmbientHighlighted, staggerDelay = 0, onMouseEnter, onMouseLeave }: CompanyMarkerProps) => {
  return (
    <motion.div
      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: isHovered ? [0, -5, 0] : (isAmbientHighlighted ? [0, -4.5, -4, -5, -4.5] : 0),
        scale: isHovered ? 1.2 : (isAmbientHighlighted ? 1.03 : 1)
      }}
      transition={{ 
        opacity: { duration: 0.4, delay: isHovered ? 0 : staggerDelay },
        y: isHovered 
          ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
          : (isAmbientHighlighted ? { duration: 3.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.5, 0.8, 1], delay: staggerDelay } : { duration: 0.4 }),
        scale: { duration: 0.4, delay: isHovered ? 0 : staggerDelay }
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
        className="absolute inset-0 rounded-full bg-blue-500 -z-10"
        initial={{ opacity: 0 }}
        animate={
          (isHovered || isAmbientHighlighted) 
            ? { scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }
            : { scale: 1, opacity: 0 }
        }
        transition={{ 
          duration: 2, 
          repeat: (isHovered || isAmbientHighlighted) ? Infinity : 0, 
          ease: "easeInOut",
          delay: isHovered ? 0 : staggerDelay 
        }}
      />
    </motion.div>
  );
};
