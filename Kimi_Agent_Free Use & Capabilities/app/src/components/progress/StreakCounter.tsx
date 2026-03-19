import { motion } from 'framer-motion';

interface StreakCounterProps {
  days: number;
}

export function StreakCounter({ days }: StreakCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center py-8"
    >
      <motion.span
        key={days}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-7xl font-bold text-gray-700"
      >
        {days}
      </motion.span>
      <span className="text-gray-500 text-lg mt-2">days streak</span>
    </motion.div>
  );
}
