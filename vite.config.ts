import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'onDo',
        short_name: 'onDo',
        description: 'My awesome Vite-powered PWA!',
        theme_color: '#ffffff',
        icons: [
            {
              src: "./icons/apple-touch-icon-57x57.png",
              sizes: "57x57",
              type: "image/png"
            },
            {
              src: "./icons/apple-touch-icon-60x60.png",
              sizes: "60x60",
              type: "image/png"
            },
            {
              src: "./icons/apple-touch-icon-72x72.png",
              sizes: "72x72",
              type: "image/png"
            },
            {
              src: "./icons/apple-touch-icon-76x76.png",
              sizes: "76x76",
              type: "image/png"
            },
            {
              src: "./icons/apple-touch-icon-114x114.png",
              sizes: "114x114",
              type: "image/png"
            },
            {
              src: "./icons/apple-touch-icon-120x120.png",
              sizes: "120x120",
              type: "image/png"
            },

            {
              "src": "./icons/apple-touch-icon-144x144.png",
              sizes: "144x144",
              type: "image/png"
            },
            {
              "src": "./icons/apple-touch-icon-152x152.png",
              sizes: "152x152",
              type: "image/png"
            }
          ]
      }
    })
  ]
});