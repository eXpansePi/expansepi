declare module "animejs/lib/anime.es.js";

export {};

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: Record<string, any>[];
    }
}