declare module 'wanakana' {
    export function bind(element: HTMLInputElement | HTMLTextAreaElement, options?: Record<string, unknown>): void;
    export function unbind(element: HTMLInputElement | HTMLTextAreaElement): void;
    export function toHiragana(text: string, options?: Record<string, unknown>): string;
    export function toKatakana(text: string, options?: Record<string, unknown>): string;
    export function toRomaji(text: string, options?: Record<string, unknown>): string;
}

declare module 'kuroshiro' {
    export default class Kuroshiro {
        init(analyzer: unknown): Promise<void>;
        convert(text: string, options?: { to?: string, mode?: string, romajiSystem?: string, delimiter_start?: string, delimiter_end?: string }): Promise<string>;
    }
}

declare module 'kuroshiro-analyzer-kuromoji' {
    export default class KuromojiAnalyzer {
        constructor(options?: { dictPath?: string });
    }
}
