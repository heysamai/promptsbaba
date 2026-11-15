import { defineConfig } from 'astro/config';
import { site } from './src/site.config.mjs';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: site.url,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
});
