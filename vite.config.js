import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    entries: ['index.html', 'src/**/*.{jsx,tsx,js,ts}']
  },
  resolve: {
    alias: {
      '@designcodeio/threeui/style.css': path.resolve(__dirname, 'src/shaders/threeui.css'),
      '@designcodeio/threeui': path.resolve(__dirname, 'src/shaders/animated-top-dock/AnimatedTopDock.tsx'),
      three128: path.resolve(__dirname, 'node_modules/three128')
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
