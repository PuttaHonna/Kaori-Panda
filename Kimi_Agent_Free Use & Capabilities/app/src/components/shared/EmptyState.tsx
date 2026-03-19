import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  iconElement?: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function EmptyState({ 
  icon: Icon,
  iconElement,
  title, 
  subtitle,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      {iconElement ? (
        <div className="mb-4">{iconElement}</div>
      ) : Icon ? (
        <Icon className="w-12 h-12 text-gray-300 mb-4" strokeWidth={1.5} />
      ) : null}
      <h3 className="text-gray-500 font-medium mb-1">{title}</h3>
      {subtitle && (
        <p className="text-gray-400 text-sm">{subtitle}</p>
      )}
    </div>
  );
}
