import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function FloatingActionButton({ 
  onClick, 
  icon = <Plus className="w-6 h-6" />,
  className 
}: FloatingActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'fixed bottom-24 right-4 w-14 h-14 rounded-full bg-bamboo-400 text-white shadow-lg flex items-center justify-center z-40',
        'hover:bg-bamboo-500 hover:shadow-xl transition-all duration-200',
        className
      )}
    >
      {icon}
    </motion.button>
  );
}
