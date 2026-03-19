import { Info, Settings, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSettings?: boolean;
  onSettings?: () => void;
  className?: string;
}

export function Header({
  title,
  showBack = false,
  onBack,
  showSettings = true,
  onSettings,
  className
}: HeaderProps) {
  return (
    <header className={cn(
      'sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100',
      className
    )}>
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-bamboo-100 flex items-center justify-center">
                <span className="text-lg">🐼</span>
              </div>
              {!title && (
                <span className="font-semibold text-lg text-gray-900">Kaori-Panda</span>
              )}
            </motion.div>
          )}
          {title && (
            <h1 className="font-semibold text-lg text-gray-900">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!showBack && (
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Info className="w-5 h-5 text-gray-500" />
            </button>
          )}
          {showSettings && (
            <button
              onClick={onSettings}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
