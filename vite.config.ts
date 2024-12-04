import { resolve } from 'path'

import { defineConfig, mergeConfig } from 'vite'

import rootConfig from '../../vite.config'

const localConfig = defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/vuescape.ts'),
      name: 'vuescape',
      fileName: 'vuescape'
    }
  }
})

export default mergeConfig(rootConfig, localConfig)
