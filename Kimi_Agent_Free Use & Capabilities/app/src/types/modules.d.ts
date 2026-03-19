declare module 'wanakana' {
    export function bind(element: HTMLInputElement | HTMLTextAreaElement, options?: any): void;
    export function unbind(element: HTMLInputElement | HTMLTextAreaElement): void;
    export function toHiragana(text: string, options?: any): string;
    export function toKatakana(text: string, options?: any): string;
    export function toRomaji(text: string, options?: any): string;
}

declare module 'kuroshiro' {
    export default class Kuroshiro {
        init(analyzer: any): Promise<void>;
        convert(text: string, options?: { to?: string, mode?: string, romajiSystem?: string, delimiter_start?: string, delimiter_end?: string }): Promise<string>;
    }
}

declare module 'kuroshiro-analyzer-kuromoji' {
    export default class KuromojiAnalyzer {
        constructor(options?: { dictPath?: string });
    }
}
