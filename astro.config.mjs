// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { site } from './src/site.config.ts';
import { readdirSync, readFileSync } from 'node:fs';

// Strony ukryte przed Google (noindex / szkic) nie trafiają do mapy strony
const hidden = new Set();
try {
  for (const f of readdirSync('./src/data/oferty')) {
    const j = JSON.parse(readFileSync(`./src/data/oferty/${f}`, 'utf8'));
    if (j.noindex || j.draft) hidden.add(`/oferta/${f.replace('.json', '')}/`);
  }
  for (const f of readdirSync('./src/content/pages')) {
    const t = readFileSync(`./src/content/pages/${f}`, 'utf8');
    if (/^noindex:\s*true/m.test(t)) hidden.add(`/${f.replace(/\.mdx?$/, '')}/`);
  }
} catch {}

// https://astro.build/config
export default defineConfig({
  // sitemap / RSS / canonical URL の絶対化に使う。デプロイ先に合わせて site.config.ts で変更する
  site: site.url,
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/admin') && !page.includes('/linki') && !page.includes('/search') && ![...hidden].some((h) => page.endsWith(h)) })],
  vite: {
    plugins: [tailwindcss()],
  },
});
