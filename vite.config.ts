import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-chrome-extension',
      buildEnd() {
        // Ensure dist directory exists
        mkdirSync('dist', { recursive: true });
        mkdirSync('dist/icons', { recursive: true });
        
        // Generate manifest.json
        const manifest = {
          manifest_version: 3,
          name: "Autopilot AI Assistant",
          version: "1.0.0",
          description: "AI-powered browser automation assistant using Claude",
          permissions: [
            "activeTab",
            "storage",
            "scripting",
            "tabs"
          ],
          host_permissions: [
            "<all_urls>"
          ],
          action: {
            default_popup: "index.html",
            default_icon: {
              "16": "icons/icon16.png",
              "48": "icons/icon48.png",
              "128": "icons/icon128.png"
            }
          },
          icons: {
            "16": "icons/icon16.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png"
          }
        };

        writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));

        // Generate placeholder icons
        const iconSizes = [16, 48, 128];
        const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        
        iconSizes.forEach(size => {
          writeFileSync(`dist/icons/icon${size}.png`, transparentPixel);
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});