import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // English routes -> internal routes
      { source: '/en/courses', destination: '/en/kurzy' },
      { source: '/en/courses/:slug*', destination: '/en/kurzy/:slug*' },
      { source: '/en/vacancies', destination: '/en/volne-pozice' },
      { source: '/en/vacancies/:slug*', destination: '/en/volne-pozice/:slug*' },
      { source: '/en/about', destination: '/en/o-nas' },
      { source: '/en/contact', destination: '/en/kontakt' },
      { source: '/en/home', destination: '/en/home' },
      // Russian routes -> internal routes
      { source: '/ru/kursy', destination: '/ru/kurzy' },
      { source: '/ru/kursy/:slug*', destination: '/ru/kurzy/:slug*' },
      { source: '/ru/vakansii', destination: '/ru/volne-pozice' },
      { source: '/ru/vakansii/:slug*', destination: '/ru/volne-pozice/:slug*' },
      { source: '/ru/glavnaya', destination: '/ru/home' },
      // Czech routes -> internal routes (for consistency, though they match)
      { source: '/cs/domu', destination: '/cs/home' },
    ];
  },
};

export default nextConfig;
