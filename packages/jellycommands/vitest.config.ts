import { defineConfig } from 'vitest/config';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		alias: {
			$src: join(__dirname, './src'),
			$mock: join(__dirname, './tests/mock.ts'),
		},
		include: ['tests/**/*.test.ts'],
		unstubEnvs: true,
		mockReset: true,
	},
});
