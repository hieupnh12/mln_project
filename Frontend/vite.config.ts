import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      "~": "/app",
    },
  },
  server: {
    proxy: {
      // Frontend gọi /mlnStudy/... → Vite bỏ prefix → backend thật /api, /chapters, ...
      "/mlnStudy": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/mlnStudy/, ""),
      },
    },
  },
});
