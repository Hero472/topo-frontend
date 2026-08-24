import { useSyncExternalStore } from "react";

import en from "./en.json";
import es from "./es.json";
import pt from "./pt.json";

export type Language = "en" | "es" | "pt";

const translations = {
    en,
    es,
    pt,
} as const;

type Translation = typeof en;

type TranslationKey<T> = {
    [K in keyof T & string]:
        T[K] extends Record<string, unknown>
            ? `${K}.${TranslationKey<T[K]>}`
            : K;
}[keyof T & string];

export type TranslationKeys = TranslationKey<Translation>;

let currentLanguage: Language = "en";

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

function getLanguage(): Language {
    return currentLanguage;
}

export function setLanguage(language: Language): void {
    if (language === currentLanguage) {
        return;
    }

    currentLanguage = language;

    listeners.forEach((listener) => listener());
}

function getValue(
    translation: Translation,
    key: TranslationKeys
): string | undefined {
    const parts = key.split(".");

    let value: unknown = translation;

    for (const part of parts) {
        if (
            typeof value !== "object" ||
            value === null ||
            !(part in value)
        ) {
            return undefined;
        }

        value = (value as Record<string, unknown>)[part];
    }

    return typeof value === "string" ? value : undefined;
}

export function t(key: TranslationKeys): string {
    return (
        getValue(translations[currentLanguage], key) ??
        getValue(translations.en, key) ??
        key
    );
}

export function useLanguage(): Language {
    return useSyncExternalStore(
        subscribe,
        getLanguage,
        getLanguage
    );
}