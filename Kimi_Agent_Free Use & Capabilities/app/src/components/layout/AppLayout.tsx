import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import type { TabType } from '@/types';

interface AppLayoutProps {
  children: ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onSettings?: () => void;
}

export function AppLayout({ 
  children, 
  activeTab, 
  onTabChange,
  onSettings 
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onSettings={onSettings} />
      
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </main>
      
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
