import { Mic, BookOpen, Trophy, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TabType } from '@/types';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'speak' as TabType, label: 'Speak', icon: Mic },
  { id: 'knowledge' as TabType, label: 'Knowledge', icon: BookOpen },
  { id: 'compete' as TabType, label: 'Compete', icon: Trophy },
  { id: 'progress' as TabType, label: 'Progress', icon: BarChart3 },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200',
                isActive ? 'text-bamboo-400' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon 
                  className={cn(
                    'w-6 h-6 transition-all duration-200',
                    isActive && 'stroke-[2.5px]'
                  )} 
                />
              </motion.div>
              <span className={cn(
                'text-xs mt-1 font-medium transition-all duration-200',
                isActive && 'font-semibold'
              )}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 w-12 h-0.5 bg-bamboo-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
