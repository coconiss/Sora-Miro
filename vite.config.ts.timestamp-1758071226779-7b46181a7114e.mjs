// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/study/00.%EA%B0%9C%EC%9D%B8/Java/Korea_Tour/Git/Sora-Miro/node_modules/vite/dist/node/index.js";
import react from "file:///D:/study/00.%EA%B0%9C%EC%9D%B8/Java/Korea_Tour/Git/Sora-Miro/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "D:\\study\\00.\uAC1C\uC778\\Java\\Korea_Tour\\Git\\Sora-Miro";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    base: "/",
    // 루트 도메인에 올릴 때
    // Note: avoid embedding sensitive API keys into the client bundle here.
    // Keep secrets on the server/worker and expose only the proxy URL to the client.
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      // Ensure environment variables are embedded in the build
      sourcemap: true,
      // Helps with debugging
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            vendor: ["@radix-ui/react-dialog", "@tanstack/react-query"]
          }
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxzdHVkeVxcXFwwMC5cdUFDMUNcdUM3NzhcXFxcSmF2YVxcXFxLb3JlYV9Ub3VyXFxcXEdpdFxcXFxTb3JhLU1pcm9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHN0dWR5XFxcXDAwLlx1QUMxQ1x1Qzc3OFxcXFxKYXZhXFxcXEtvcmVhX1RvdXJcXFxcR2l0XFxcXFNvcmEtTWlyb1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovc3R1ZHkvMDAuJUVBJUIwJTlDJUVDJTlEJUI4L0phdmEvS29yZWFfVG91ci9HaXQvU29yYS1NaXJvL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgLy8gTG9hZCBlbnYgZmlsZSBiYXNlZCBvbiBgbW9kZWAgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5LlxyXG4gIC8vIFNldCB0aGUgdGhpcmQgcGFyYW1ldGVyIHRvICcnIHRvIGxvYWQgYWxsIGVudiByZWdhcmRsZXNzIG9mIHRoZSBgVklURV9gIHByZWZpeC5cclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcclxuICBcclxuICByZXR1cm4ge1xyXG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gICAgYmFzZTogXCIvXCIsIC8vIFx1QjhFOFx1RDJCOCBcdUIzQzRcdUJBNTRcdUM3NzhcdUM1RDAgXHVDNjJDXHVCOUI0IFx1QjU0Q1xyXG4gICAgLy8gTm90ZTogYXZvaWQgZW1iZWRkaW5nIHNlbnNpdGl2ZSBBUEkga2V5cyBpbnRvIHRoZSBjbGllbnQgYnVuZGxlIGhlcmUuXHJcbiAgICAvLyBLZWVwIHNlY3JldHMgb24gdGhlIHNlcnZlci93b3JrZXIgYW5kIGV4cG9zZSBvbmx5IHRoZSBwcm94eSBVUkwgdG8gdGhlIGNsaWVudC5cclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBvdXREaXI6IFwiZGlzdFwiLFxyXG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcclxuICAgICAgLy8gRW5zdXJlIGVudmlyb25tZW50IHZhcmlhYmxlcyBhcmUgZW1iZWRkZWQgaW4gdGhlIGJ1aWxkXHJcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZSwgLy8gSGVscHMgd2l0aCBkZWJ1Z2dpbmdcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgIHJlYWN0OiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICAgICAgICAgIHZlbmRvcjogWydAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSddLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9O1xyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQW9WLFNBQVMsY0FBYyxlQUFlO0FBQzFYLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFHeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFNBQU87QUFBQSxJQUNMLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxJQUNqQixNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFHTixTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixhQUFhO0FBQUE7QUFBQSxNQUViLFdBQVc7QUFBQTtBQUFBLE1BQ1gsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sY0FBYztBQUFBLFlBQ1osT0FBTyxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxZQUNoRCxRQUFRLENBQUMsMEJBQTBCLHVCQUF1QjtBQUFBLFVBQzVEO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
