import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_BACKEND_URL?.trim() || "http://localhost:8080";

  return {
    plugins: [tailwindcss(), reactRouter()],
    resolve: {
      alias: {
        "~": "/app",
      },
    },
    server: {
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        "/chapters": {
          target: backendUrl,
          changeOrigin: true,
        },
        "/lessons": {
          target: backendUrl,
          changeOrigin: true,
        },
        "/materials": {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
