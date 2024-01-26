import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), vueJsx(), visualizer()],
	build: {
		target: 'modules',
		emptyOutDir: true,
		minify: false,
		rollupOptions: {
			external: ['vue', 'vue-router', '@arco-design/web-vue', 'axios', '@lcdp-js/core', 'jsoneditor', 'video.js'],
			input: ['./index.ts'],
			output: [
				{
					format: 'es',
					dir: 'es',
					entryFileNames: '[name].js',
					preserveModules: true,
					preserveModulesRoot: './'
				},
				{
					format: 'commonjs',
					dir: 'lib',
					entryFileNames: '[name].js',
					preserveModules: true,
					preserveModulesRoot: './'
				}
			]
		},
		lib: {
			entry: './index.ts'
		}
	}
});
