
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // Nome do seu repositório
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Desativar minificação para facilitar o debug
    minify: false,
    // Ignorar avisos durante o build
    reportCompressedSize: false,
    // Aumentar o limite de avisos
    chunkSizeWarningLimit: 1000,
  },
}));
