import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  name: string;
  onUpdateName: (name: string) => void;
}

export function ProfileCard({ name, onUpdateName }: ProfileCardProps) {
  const [inputValue, setInputValue] = useState(name);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onUpdateName(inputValue.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-card"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Hi there! What's your name?
      </h3>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前は..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={cn(
            'w-full px-4 py-3 mb-4 rounded-xl border border-gray-200',
            'bg-gray-50 text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-bamboo-200 focus:border-bamboo-400',
            'transition-all duration-200 jp-text'
          )}
        />
        
        <Button
          type="submit"
          className={cn(
            'w-full bg-bamboo-400 hover:bg-bamboo-500 text-white',
            'rounded-full py-3 font-medium',
            'transition-all duration-200'
          )}
        >
          Update profile
        </Button>
      </form>
    </motion.div>
  );
}
