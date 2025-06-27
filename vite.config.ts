import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // ⬅️ Needed for resolving the alias

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: "/nstsps/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ⬅️ This enables @ to point to /src
    },
  },
});
