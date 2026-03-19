import { cn } from '@/lib/utils';

interface JLPTBadgeProps {
  level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
  className?: string;
}

const levelColors = {
  N1: 'bg-jlpt-n1 text-blue-800',
  N2: 'bg-jlpt-n2 text-purple-800',
  N3: 'bg-jlpt-n3 text-green-800',
  N4: 'bg-jlpt-n4 text-yellow-800',
  N5: 'bg-jlpt-n5 text-red-800',
};

export function JLPTBadge({ level, className }: JLPTBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-semibold',
      levelColors[level],
      className
    )}>
      {level}
    </span>
  );
}
