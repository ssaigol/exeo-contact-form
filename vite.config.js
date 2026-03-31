import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  build: { sourcemap: "hidden" },
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    sentryVitePlugin({
      org: "aldisa-global-inc",
      project: "exeo-apps-portal-frontend-react",
      sourcemaps: {
        filesToDeleteAfterUpload: ["./dist/**/*.map"],
      },
    }),
  ],
});
