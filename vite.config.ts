import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: "/", // 루트 도메인에 올릴 때
    define: {
      // Make environment variables available in the client-side code
      'import.meta.env.VITE_TOUR_API_KEY': JSON.stringify(env.VITE_TOUR_API_KEY)
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      // Ensure environment variables are embedded in the build
      sourcemap: true, // Helps with debugging
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['@radix-ui/react-dialog', '@tanstack/react-query'],
          },
        },
      },
    },
  };
});