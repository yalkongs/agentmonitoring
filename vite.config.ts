import { defineConfig } from 'vite';

// Separate entry points keep the original dashboard and briefing styles isolated.
export default defineConfig({
  build: { rollupOptions: { input: { main: 'index.html', briefing: '1/index.html' } } },
});
