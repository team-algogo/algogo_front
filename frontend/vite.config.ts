import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";

  return {
    server: {
      proxy: isDev
        ? {
          "/api": {
            target: env.VITE_API_BASE_URL,
            changeOrigin: true,
            secure: false,
          },
        }
        : undefined,
      cors: true,
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: [
        { find: "@api", replacement: resolve(__dirname, "src/api") },
        { find: "@assets", replacement: resolve(__dirname, "src/assets") },
        {
          find: "@components",
          replacement: resolve(__dirname, "src/components"),
        },
        { find: "@pages", replacement: resolve(__dirname, "src/pages") },
        { find: "@store", replacement: resolve(__dirname, "src/store") },
        { find: "@type", replacement: resolve(__dirname, "src/type") },
        { find: "@utils", replacement: resolve(__dirname, "src/utils") },
      ],
    },
  };
});
