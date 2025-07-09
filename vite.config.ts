import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		conditions: ['browser']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'happy-dom',
		setupFiles: ['./src/test-setup.ts'],
		globals: true,
		alias: {
			$lib: new URL('./src/lib', import.meta.url).pathname
		},
		environmentOptions: {
			happyDOM: {
				settings: {
					disableJavaScriptEvaluation: false,
					disableJavaScriptFileLoading: false,
					disableCSSFileLoading: false,
					disableIframePageLoading: false,
					disableComputedStyleRendering: false
				}
			}
		}
	}
});
