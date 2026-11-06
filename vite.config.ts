import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      '@xyflow/react',
      'lucide-react',
      'zustand',
      'dagre',
      'clsx',
      'tailwind-merge',
    ],
  },
  build: {
    target: 'esnext',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@xyflow')) return 'vendor-xyflow';
            if (id.includes('dagre')) return 'vendor-dagre';
            if (id.includes('lucide-react')) return 'vendor-icons';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    strictPort: false,
  },
});
