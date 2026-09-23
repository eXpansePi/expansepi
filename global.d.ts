interface Window {
    gtag: (...args: unknown[]) => void;
    /** gtag pushes its `arguments` object, not a plain record. */
    dataLayer: IArguments[];
}