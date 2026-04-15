import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/app/api', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/app/components', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/app/core', import.meta.url)),
      '@directives': fileURLToPath(new URL('./src/app/directives', import.meta.url)),
      '@environments': fileURLToPath(new URL('./src/environments', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/app/features', import.meta.url)),
      '@forms': fileURLToPath(new URL('./src/app/forms', import.meta.url)),
      '@guards': fileURLToPath(new URL('./src/app/guards', import.meta.url)),
      '@interceptors': fileURLToPath(new URL('./src/app/interceptors', import.meta.url)),
      '@mocks': fileURLToPath(new URL('./src/mocks', import.meta.url)),
      '@models': fileURLToPath(new URL('./src/app/models', import.meta.url)),
      '@pipes': fileURLToPath(new URL('./src/app/pipes', import.meta.url)),
      '@resolvers': fileURLToPath(new URL('./src/app/resolvers', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/app/services', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/app/shared', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/app/store', import.meta.url)),
    },
  },
  test: {
		globals: true,
		restoreMocks: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      exclude: [
        'src/mocks/**',
        'src/app/api/**',
        '**/*.html',
        '**/*.enum.ts',
        '**/*.module.ts',
        '**/*.actions.ts',
        '**/*.template.ts',
        '**/*.index.ts',
      ],
    },
  },
});
