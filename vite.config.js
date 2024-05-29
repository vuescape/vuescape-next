import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import path, { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), dts({ rollupTypes: true })],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'pinia': path.resolve(__dirname, 'node_modules/pinia'),
            'vue': path.resolve(__dirname, 'node_modules/vue'),
            'vue-router': path.resolve(__dirname, 'node_modules/vue-router'),
        },
    },
    build: {
        sourcemap: 'inline',
        rollupOptions: {
            external: ['pinia', 'vue', 'vue-router'],
        },
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'vuescape',
            // the proper extensions will be added
            fileName: 'vuescape',
        },
    },
});
