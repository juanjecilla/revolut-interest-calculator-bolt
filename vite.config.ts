/// <reference types="vitest" />
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

function inlineCssPlugin(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const cssEntries = Object.entries(bundle).filter(
        ([name, chunk]) => chunk.type === 'asset' && name.endsWith('.css')
      );
      const htmlChunk = bundle['index.html'];
      if (!htmlChunk || htmlChunk.type !== 'asset' || cssEntries.length === 0) return;

      let html = htmlChunk.source as string;
      for (const [fileName, cssChunk] of cssEntries) {
        if (cssChunk.type !== 'asset') continue;
        const cssFileName = fileName.split('/').pop()!;
        const css = (cssChunk.source as string).trim();
        html = html.replace(
          new RegExp(`<link[^>]*href="[^"]*${cssFileName}"[^>]*>`),
          `<style>${css}</style>`
        );
        delete bundle[fileName];
      }
      htmlChunk.source = html;
    },
  };
}

export default defineConfig({
  base: '/revolut-interest-calculator-bolt/',
  plugins: [react(), inlineCssPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'es2020',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/revolut-interest-calculator-bolt/',
      },
    },
    exclude: ['node_modules', 'dist', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/main.tsx', 'src/vite-env.d.ts'],
    },
  },
});
