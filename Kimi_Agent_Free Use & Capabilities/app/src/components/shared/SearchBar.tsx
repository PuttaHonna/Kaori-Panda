import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function SearchBar({
  placeholder = 'Search...',
  value,
  onChange,
  className,
  inputRef
}: SearchBarProps) {
  return (
    <div className={cn(
      'relative',
      className
    )}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200',
          'bg-white text-gray-900 placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-bamboo-200 focus:border-bamboo-400',
          'transition-all duration-200'
        )}
      />
    </div>
  );
}
