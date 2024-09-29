import react from "@vitejs/plugin-react";
import fs from "fs/promises";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

function copyFiles() {
  return {
    name: "copy-license",
    closeBundle: async () => {
      await fs.copyFile("../LICENSE.md", "./dist/LICENSE.md");
      await fs.copyFile("../README.md", "./dist/README.md");
    }
  };
}

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "react-three-gpu-pathtracer",
      formats: ["es", "cjs"],
      fileName: (format) => `react-three-gpu-pathtracer.${format}.js`
    },
    rollupOptions: {
      external: ["react", "three", "@react-three/fiber"]
    },
    sourcemap: true,
    emptyOutDir: true
  },
  plugins: [react(), dts(), copyFiles()]
});
