import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://esittraducciones.com',
  adapter: vercel(),
  output: 'server',
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
    sanity({
      projectId: 'rh87j8bk',
      dataset: 'production',
      useCdn: true,
      studioBasePath: '/admin',
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
