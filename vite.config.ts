import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { siteConfig } from './src/config/site';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html
            .replace(/%SITE_NAME%/g, siteConfig.name)
            .replace(/%SITE_EMAIL%/g, siteConfig.contact.email)
            .replace(/%SITE_PHONE%/g, siteConfig.contact.phone)
            .replace(/%SITE_WHATSAPP_URL%/g, siteConfig.contact.whatsapp);
        }
      }
    ],
    build: {
      target: ['es2020', 'safari15.4', 'chrome87', 'firefox78', 'edge88'],
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('recharts') || id.includes('d3-')) return 'recharts_vendor';
              if (id.includes('firebase')) return 'firebase_vendor';
              if (id.includes('lucide-react')) return 'icons_vendor';
              if (id.includes('i18next')) return 'i18n_vendor';
              if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router')) return 'react_vendor';
              return 'vendor';
            }
          }
        }
      }
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
