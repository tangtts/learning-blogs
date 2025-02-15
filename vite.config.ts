import { defineConfig } from "vite";
import path, { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";
const pathSrc = path.resolve(__dirname, "src");
import vueJsx from '@vitejs/plugin-vue-jsx'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// https://vitejs.dev/config/
export default defineConfig({
  base: "/learning-blogs/",
  server: {
    port: 5000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/"),
      utils: resolve(__dirname, "src/utils/"),
      vuex: resolve(__dirname, "src/store/"),
    },
  },
  build:{
    chunkSizeWarningLimit:1500
  },
  plugins: [
    vueJsx(),
    vue(),
    AutoImport({
      imports: ["vue"],
      resolvers: [ElementPlusResolver(), IconsResolver({})],
      dts: path.resolve(pathSrc, "auto-imports.d.ts"),
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
  ],
});
