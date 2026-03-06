declare module "animejs/lib/anime.es.js";

interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: Record<string, any>[];
}