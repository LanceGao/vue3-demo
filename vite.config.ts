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
  // server: {
  //   proxy: {
  //     // 选项写法
  //     '/api': {
  //       target: 'http://geek.itheima.net', // 目标地址
  //       changeOrigin: true, // 开启代理，在本地创建一个虚拟服务器，然后发送请求的数据，会同时会收到请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
  //       rewrite: (path) => path.replace(/^\/api/, ''), // 路径重写，移除路径中的/api
  //     }
  //   }
  // }
});
