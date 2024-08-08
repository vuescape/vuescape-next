import { defineConfig, mergeConfig } from 'vite';
import rootConfig from '../../vite.config';
import { resolve } from 'path';
var localConfig = defineConfig({
    // plugins: [vue(), dts({ rollupTypes: true })],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'vuescape',
            fileName: 'vuescape',
        },
    },
});
export default mergeConfig(rootConfig, localConfig);
