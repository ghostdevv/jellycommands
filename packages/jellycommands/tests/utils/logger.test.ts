import { describe, expect, it, vi } from 'vitest';
import { createLogger } from '$src/utils/logger';
import { mockJellyClient } from '$mock';

describe('logger', () => {
    const error = vi.spyOn(console, 'error');
    const debug = vi.spyOn(console, 'debug');
    const log = vi.spyOn(console, 'log');

    it('works with regular logs', () => {
        const logger = createLogger(mockJellyClient());

        logger('logger()');
        logger.log('.log()');
        expect(log).toHaveBeenCalledTimes(2);
    });

    it('works with error logs', () => {
        const logger = createLogger(mockJellyClient());

        logger.error();
        expect(error).toHaveBeenCalledTimes(1);
    });

    it('works with debug logs', () => {
        const client = mockJellyClient();
        const logger = createLogger(client);

        logger.debug('.debug()');
        expect(debug).not.toHaveBeenCalledTimes(1);

        client.joptions.debug = true;
        logger.debug('.debug()');
        expect(debug).toHaveBeenCalledTimes(1);
    });

    it('debug should default to false', () => {
        const client = mockJellyClient();
        expect(client.joptions.debug).toBe(false);
    });

    it('debug should read envrionment variable', () => {
        vi.stubEnv('DEBUG', 'asd');
        const client = mockJellyClient();
        expect(client.joptions.debug).toBe(true);
    });
});
