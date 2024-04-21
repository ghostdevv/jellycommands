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
        expect(error).toHaveBeenCalled();
    });

    it('works with debug logs', () => {
        const client = mockJellyClient(false);
        const logger = createLogger(client);

        logger.debug('.debug()');
        expect(debug).not.toHaveBeenCalled();

        client.joptions.debug = true;
        logger.debug('.debug()');
        expect(debug).toHaveBeenCalled();
    });
});
