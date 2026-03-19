import { MessageSquare } from 'lucide-react';
import type { Message } from '@/types';
import { EmptyState } from '@/components/shared/EmptyState';
import { cn } from '@/lib/utils';

interface HistoryListProps {
  messages: Message[];
}

export function HistoryList({ messages }: HistoryListProps) {
  if (messages.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>
        <EmptyState
          iconElement={
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-gray-400" />
            </div>
          }
          title="No conversation history yet"
          subtitle="Start chatting to see your conversation reports here"
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'p-4 rounded-2xl',
              message.type === 'user' ? 'bg-stat-blue ml-4' : 'bg-white mr-4'
            )}
          >
            <p className="jp-text text-gray-900 mb-1">{message.japanese}</p>
            <p className="text-sm text-gray-500 mb-1">{message.romaji}</p>
            <p className="text-sm text-gray-600">{message.english}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
