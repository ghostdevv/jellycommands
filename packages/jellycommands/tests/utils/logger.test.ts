import { describe, expect, it, vi } from 'vitest';
import { createLogger } from '$src/utils/logger';
import { mockJellyClient } from '$mock';

describe('logger', () => {
    it('regular and error logging works', () => {
        const log = vi.fn();
        const error = vi.fn();
        vi.stubGlobal('console', { log, error });

        const logger = createLogger(mockJellyClient());

        logger('logger()');
        logger.log('.log()');
        logger.error('.error()');

        expect(log).toHaveBeenCalledTimes(2);
        expect(error).toHaveBeenCalled();
    });

    it('debugging works', () => {
        const debug = vi.fn();
        vi.stubGlobal('console', { debug });

        const client = mockJellyClient(false);
        const logger = createLogger(client);

        logger.debug('.debug()');
        expect(debug).not.toHaveBeenCalled();

        client.joptions.debug = true;
        logger.debug('.debug()');
        expect(debug).toHaveBeenCalled();
    });
});
