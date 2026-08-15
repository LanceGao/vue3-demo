import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // 开启响应式语法糖
      reactivityTransform: true
    }),
  ],
});
