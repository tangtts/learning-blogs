// vite.config.ts
import { defineConfig } from "file:///E:/study/learning-blogs/node_modules/.pnpm/vite@4.4.7_@types+node@20.4.5_sass@1.64.1/node_modules/vite/dist/node/index.js";
import path, { resolve } from "path";
import vue from "file:///E:/study/learning-blogs/node_modules/.pnpm/@vitejs+plugin-vue@4.2.3_vite@4.4.7_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///E:/study/learning-blogs/node_modules/.pnpm/unplugin-auto-import@0.16.6/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/study/learning-blogs/node_modules/.pnpm/unplugin-vue-components@0.25.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/vite.mjs";
import IconsResolver from "file:///E:/study/learning-blogs/node_modules/.pnpm/unplugin-icons@0.16.5/node_modules/unplugin-icons/dist/resolver.mjs";
import vueJsx from "file:///E:/study/learning-blogs/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.0.2_vite@4.4.7_vue@3.3.4/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { ElementPlusResolver } from "file:///E:/study/learning-blogs/node_modules/.pnpm/unplugin-vue-components@0.25.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_dirname = "E:\\study\\learning-blogs";
var pathSrc = path.resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig({
  server: {
    port: 5e3
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src/"),
      utils: resolve(__vite_injected_original_dirname, "src/utils/")
    }
  },
  build: {
    chunkSizeWarningLimit: 1500
  },
  plugins: [
    vueJsx(),
    vue(),
    AutoImport({
      imports: ["vue"],
      resolvers: [ElementPlusResolver(), IconsResolver({})],
      dts: path.resolve(pathSrc, "auto-imports.d.ts")
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver()]
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxzdHVkeVxcXFxsZWFybmluZy1ibG9nc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcc3R1ZHlcXFxcbGVhcm5pbmctYmxvZ3NcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3N0dWR5L2xlYXJuaW5nLWJsb2dzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHBhdGgsIHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tIFwidW5wbHVnaW4taWNvbnMvcmVzb2x2ZXJcIjtcclxuY29uc3QgcGF0aFNyYyA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA1MDAwLFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9cIiksXHJcbiAgICAgIHV0aWxzOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvdXRpbHMvXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOntcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDoxNTAwXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWVKc3goKSxcclxuICAgIHZ1ZSgpLFxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIGltcG9ydHM6IFtcInZ1ZVwiXSxcclxuICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpLCBJY29uc1Jlc29sdmVyKHt9KV0sXHJcbiAgICAgIGR0czogcGF0aC5yZXNvbHZlKHBhdGhTcmMsIFwiYXV0by1pbXBvcnRzLmQudHNcIiksXHJcbiAgICB9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCksIEljb25zUmVzb2x2ZXIoKV0sXHJcbiAgICB9KSxcclxuICBdLFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UCxTQUFTLG9CQUFvQjtBQUMxUixPQUFPLFFBQVEsZUFBZTtBQUM5QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxtQkFBbUI7QUFFMUIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsMkJBQTJCO0FBUnBDLElBQU0sbUNBQW1DO0FBTXpDLElBQU0sVUFBVSxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUk3QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLE1BQU07QUFBQSxNQUM5QixPQUFPLFFBQVEsa0NBQVcsWUFBWTtBQUFBLElBQ3hDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTTtBQUFBLElBQ0osdUJBQXNCO0FBQUEsRUFDeEI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQSxNQUNULFNBQVMsQ0FBQyxLQUFLO0FBQUEsTUFDZixXQUFXLENBQUMsb0JBQW9CLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUFBLE1BQ3BELEtBQUssS0FBSyxRQUFRLFNBQVMsbUJBQW1CO0FBQUEsSUFDaEQsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLG9CQUFvQixHQUFHLGNBQWMsQ0FBQztBQUFBLElBQ3BELENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
