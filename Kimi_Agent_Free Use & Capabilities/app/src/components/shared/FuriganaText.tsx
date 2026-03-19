import { useFurigana } from '@/hooks/useFurigana';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface FuriganaTextProps {
    text: string;
    className?: string;
}

export function FuriganaText({ text, className }: FuriganaTextProps) {
    const { furiganaHtml, isLoading } = useFurigana(text);

    if (isLoading) {
        return (
            <span className={cn('inline-flex items-center gap-1 jp-text opacity-70', className)}>
                {text} <Loader2 className="w-3 h-3 animate-spin border-none" />
            </span>
        );
    }

    return (
        <span
            className={cn('jp-text [&>ruby]:gap-0 [&>ruby>rt]:text-[0.6em] [&>ruby>rt]:text-gray-500 [&>ruby]:mx-[1px]', className)}
            dangerouslySetInnerHTML={{ __html: furiganaHtml }}
        />
    );
}
