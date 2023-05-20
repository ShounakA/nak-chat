import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    solidPlugin(), 
    VitePWA({ 
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'nak-chat',
        short_name: 'nak-chat',
        description: 'My Awesome Chat App',
        display: 'minimal-ui',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/src/assets/pwa-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: '/src/assets/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
  },
  build: {
    manifest: true,
    target: 'esnext',
  },
});
