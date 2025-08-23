import { defineConfig } from "@farmfe/core";
import path from "path";

export default defineConfig({
  plugins: ["@farmfe/plugin-react"],
  compilation: {
    persistentCache: false,
    minify: true,
    sourcemap: false,
    output: {
      publicPath: "./",
    },
    resolve: {
      alias: {
        "@/": path.join(process.cwd(), "src"),
        "styled-system/": path.join(process.cwd(), "styled-system"),
      },
    },
  },
});
