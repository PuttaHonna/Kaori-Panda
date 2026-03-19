import { Mic, Lightbulb, Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onHint?: () => void;
  onKeyboard?: () => void;
}

export function VoiceInput({ 
  isListening, 
  onStartListening, 
  onStopListening,
  onHint,
  onKeyboard 
}: VoiceInputProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 bg-white border-t border-gray-100">
      {/* Hint Button */}
      <button
        onClick={onHint}
        className={cn(
          'flex flex-col items-center gap-1 p-2 rounded-xl',
          'text-gray-500 hover:bg-gray-100 transition-colors'
        )}
      >
        <Lightbulb className="w-6 h-6" />
        <span className="text-xs">hint</span>
      </button>
      
      {/* Mic Button */}
      <div className="flex-1 flex flex-col items-center">
        <motion.button
          onMouseDown={onStartListening}
          onMouseUp={onStopListening}
          onTouchStart={onStartListening}
          onTouchEnd={onStopListening}
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center',
            'bg-bamboo-400 text-white shadow-lg',
            'transition-all duration-200',
            'hover:bg-bamboo-500 hover:shadow-xl',
            'active:scale-95'
          )}
        >
          <Mic className="w-8 h-8" />
        </motion.button>
        <span className="text-xs text-gray-500 mt-2">
          {isListening ? 'Listening...' : 'Press and Hold'}
        </span>
      </div>
      
      {/* Keyboard Button */}
      <button
        onClick={onKeyboard}
        className={cn(
          'flex flex-col items-center gap-1 p-2 rounded-xl',
          'text-gray-500 hover:bg-gray-100 transition-colors'
        )}
      >
        <Keyboard className="w-6 h-6" />
        <span className="text-xs">keyboard</span>
      </button>
    </div>
  );
}
