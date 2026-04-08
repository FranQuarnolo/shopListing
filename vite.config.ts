import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin inline: reemplaza %APP_VERSION% en index.html con la versión del package.json
    {
      name: 'html-version-inject',
      transformIndexHtml(html: string) {
        return html.replace('%APP_VERSION%', pkg.version);
      },
    },
  ],
  define: {
    // Inyecta la versión del package.json como constante global en el bundle.
    // Se accede con: __APP_VERSION__ (declarado en vite-env.d.ts)
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
