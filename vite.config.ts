// // vite.config.ts
// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';
// import vueDevTools from 'vite-plugin-vue-devtools';
// import AutoImport from 'unplugin-auto-import/vite';
// import Components from 'unplugin-vue-components/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
// import { fileURLToPath } from 'url';

// export default defineConfig({
//   // ❗️ 关键修改：设置 base 为项目路径（仓库名）
//   base: process.env.NODE_ENV === 'production' ? '/ApexGrouping/' : '/', // 与 GitHub Pages 路径一致
  
//   plugins: [
//     vue(),
//     vueDevTools(),
//     AutoImport({ resolvers: [ElementPlusResolver()] }),
//     Components({ resolvers: [ElementPlusResolver()] }),
//   ],
  
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url)),
//     },
//   },
  
//   // 其他配置保持不变
//   server: {
//     port: 3000,
//     strictPort: false
//   },
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes('node_modules')) {
//             return id.toString().split('node_modules/')[1].split('/')[0].toString();
//           }
//         },
//       },
//     },
//   },
// });



// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { fileURLToPath } from 'url';
import compressPlugin from 'vite-plugin-compression'; // 新增：资源压缩插件

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ApexGrouping/' : '/',
  
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] }),
    
    // 新增：压缩插件配置
    compressPlugin({
      verbose: true,
      disable: false,
      threshold: 10240, // 10KB 以上文件压缩
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false, // 保留原文件
    }),
  ],
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  
  server: {
    port: 3000,
    strictPort: false
  },
  
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
    
    // 新增：静态资源处理
    assetsInlineLimit: 4096, // 4KB 以下资源内联
    chunkSizeWarningLimit: 1000, // 分块大小警告阈值
    outDir: 'dist',
    assetsDir: 'assets',
  },
  
  // 新增：优化视频和大文件加载
  optimizeDeps: {
    exclude: ['video.js'], // 排除大型依赖，避免预构建
  },
  
  // 新增：自定义文件处理规则
  assetsInclude: ['**/*.mp4', '**/*.webm'],
});