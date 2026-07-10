import { useState, useEffect, useRef, useCallback } from 'react';

const highlightColors = [
  "#DCEEFF", // Soft Sky Blue
  "#D9F5EC", // Soft Mint
  "#E8E1FF", // Soft Lavender
  "#FFF3D6", // Soft Sand
  "#FFE5EE", // Soft Rose
  "#E3F7F8", // Soft Cyan
  "#EEF3FF", // Soft Indigo Tint
  "#F2F5F9", // Soft Slate
];

export const SELECTABLE_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const REGIONAL_CLUSTERS = {
  South: ["Telangana", "Andhra Pradesh", "Tamil Nadu", "Kerala", "Karnataka"],
  North: ["Punjab", "Haryana", "Himachal Pradesh", "Uttarakhand"],
  West: ["Gujarat", "Maharashtra", "Goa"],
  East: ["Odisha", "Jharkhand", "West Bengal", "Bihar"],
  NorthEast: ["Assam", "Meghalaya", "Nagaland", "Tripura", "Manipur", "Mizoram", "Arunachal Pradesh", "Sikkim"]
};

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Returns a random combination of states
const getRandomHighlightedStates = (previousSelection: string[]): string[] => {
  const rand = Math.random();
  let selectedStates: string[] = [];

  // Occasionally return all states (~5% chance)
  if (rand < 0.05) {
    selectedStates = [...SELECTABLE_STATES];
  } 
  // Occasionally return regional clusters (~15% chance)
  else if (rand < 0.20) {
    const regions = Object.values(REGIONAL_CLUSTERS);
    selectedStates = regions[Math.floor(Math.random() * regions.length)];
  }
  // Occasionally 15+ states (~10% chance)
  else if (rand < 0.30) {
    const count = Math.floor(Math.random() * 5) + 15; // 15 to 19
    selectedStates = shuffleArray(SELECTABLE_STATES).slice(0, count);
  }
  // Mostly return 1-6 states, occasionally 8 or 10 (~70% chance)
  else {
    const possibleCounts = [1, 2, 3, 4, 5, 6, 8, 10];
    // Weight towards 1-6
    const weightedCounts = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 10];
    const count = weightedCounts[Math.floor(Math.random() * weightedCounts.length)];
    selectedStates = shuffleArray(SELECTABLE_STATES).slice(0, count);
  }

  // Ensure it doesn't match the exact previous combination
  const sortedPrev = [...previousSelection].sort().join(',');
  const sortedNext = [...selectedStates].sort().join(',');

  if (sortedPrev === sortedNext) {
    // Retry once if exact match
    return getRandomHighlightedStates(previousSelection);
  }

  return selectedStates;
};

export const useAmbientMapAnimation = (isIdle: boolean) => {
  const [ambientHighlights, setAmbientHighlights] = useState<Record<string, string>>({});
  const previousSelectionRef = useRef<string[]>([]);
  const cycleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerNextCycle = useCallback(() => {
    const nextStates = getRandomHighlightedStates(previousSelectionRef.current);
    previousSelectionRef.current = nextStates;

    const newHighlights: Record<string, string> = {};
    nextStates.forEach(state => {
      newHighlights[state] = highlightColors[Math.floor(Math.random() * highlightColors.length)];
    });

    setAmbientHighlights(newHighlights);
  }, []);

  useEffect(() => {
    if (!isIdle) {
      setAmbientHighlights({});
      if (cycleTimeoutRef.current) {
        clearInterval(cycleTimeoutRef.current);
        cycleTimeoutRef.current = null;
      }
      return;
    }

    // Start immediately on idle
    triggerNextCycle();

    // Loop every 3 seconds
    cycleTimeoutRef.current = setInterval(() => {
      triggerNextCycle();
    }, 3000);

    return () => {
      if (cycleTimeoutRef.current) {
        clearInterval(cycleTimeoutRef.current);
      }
    };
  }, [isIdle, triggerNextCycle]);

  return ambientHighlights;
};
