import translations from '@/lang/en';

type TranslationKeys = typeof translations;

type NestedKeyOf<T, K extends keyof T = keyof T> = K extends string
    ? T[K] extends Record<string, unknown>
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K
    : never;

type TranslationKey = NestedKeyOf<TranslationKeys>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
    const keys = path.split('.');
    let result: unknown = obj;

    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = (result as Record<string, unknown>)[key];
        } else {
            return path;
        }
    }

    return typeof result === 'string' ? result : path;
}

export function useTranslation() {
    const t = (key: TranslationKey): string => {
        return getNestedValue(translations as Record<string, unknown>, key);
    };

    return { t };
}

export function t(key: TranslationKey): string {
    return getNestedValue(translations as Record<string, unknown>, key);
}
