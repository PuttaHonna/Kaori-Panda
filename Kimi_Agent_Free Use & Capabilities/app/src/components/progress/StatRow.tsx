import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatRowProps {
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  value: string | number;
}

export function StatRow({ 
  icon: Icon, 
  iconColor = 'bg-purple-100 text-purple-600',
  label, 
  value 
}: StatRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center',
        iconColor
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="flex-1 text-gray-700 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );
}
