import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function htmlPartials() {
  return {
    name: 'html-partials',
    transformIndexHtml(html) {
      return html.replace(/<include\s+src="([^"]+)"\s*\/>/g, (match, src) => {
        const filePath = path.resolve(__dirname, src);
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath, 'utf-8');
        }
        return match;
      });
    }
  }
}

export default defineConfig({
  plugins: [htmlPartials()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
