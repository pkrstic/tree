import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/tree/index.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rolldownOptions: {
      external: /^react(?:\/.*)?$/,
    },
  },
})
