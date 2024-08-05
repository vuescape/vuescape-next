import { defineConfig, mergeConfig } from 'vite'
import rootConfig from '../../vite.config'

// import vue from '@vitejs/plugin-vue'
import path, { resolve } from 'path'

// import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
const localConfig =  defineConfig({
  // plugins: [vue(), dts({ rollupTypes: true })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // 'pinia': path.resolve(__dirname, 'node_modules/pinia'),
      // 'vue': path.resolve(__dirname, 'node_modules/vue'),
      // 'vue-router': path.resolve(__dirname, 'node_modules/vue-router'),
    },
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'vuescape',
      // the proper extensions will be added
      fileName: 'vuescape',
    },
  },
})

export default mergeConfig(rootConfig, localConfig);
