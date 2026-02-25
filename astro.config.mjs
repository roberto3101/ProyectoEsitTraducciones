import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://esittraducciones.com',
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-PE',
          en: 'en-US',
          fr: 'fr-FR',
        },
      },
    }),
    react(),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
