import { defineConfig } from 'vitest/config';
import { join } from 'desm';

export default defineConfig({
    test: {
        alias: {
            $src: join(import.meta.url, './src'),
            $mock: join(import.meta.url, './tests/common.ts'),
        },
    },
});
