import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), vueJsx()],
	build: {
		target: 'modules',
		emptyOutDir: false,
		minify: false,
		rollupOptions: {
			external: ['vue', '@arco-design/web-vue'],
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
