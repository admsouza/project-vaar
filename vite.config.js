import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Tesseract loads the language by its fixed filename within langPath.
        assetFileNames: asset => asset.names.includes('por.traineddata.gz')
          ? 'assets/ocr/[name][extname]'
          : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
