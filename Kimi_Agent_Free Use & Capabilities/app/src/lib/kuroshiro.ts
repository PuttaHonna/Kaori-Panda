import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

let kuroshiroInstance: Kuroshiro | null = null;
let initPromise: Promise<Kuroshiro> | null = null;

export async function getKuroshiro(): Promise<Kuroshiro> {
    if (kuroshiroInstance) return kuroshiroInstance;

    if (!initPromise) {
        initPromise = (async () => {
            const kuroshiro = new Kuroshiro();
            // Using the public/dict folder where we copied the .dat.gz files
            const analyzer = new KuromojiAnalyzer({ dictPath: '/dict/' });
            await kuroshiro.init(analyzer);
            kuroshiroInstance = kuroshiro;
            return kuroshiro;
        })();
    }

    return initPromise;
}
