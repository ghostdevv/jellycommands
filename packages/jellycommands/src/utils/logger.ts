import { JellyCommands } from '../JellyCommands';

export interface Logger {
    (...messages: any[]): void;
    log: (...messages: any[]) => void;
    debug: (...messages: any[]) => void;
    error: (...errors: any[]) => void;
}

export function createLogger(client: JellyCommands): Logger {
    const methods = {
        log: (...messages: any[]) =>
            console.log('\x1b[1m\x1b[35m[JellyCommands Log]\x1b[22m\x1b[39m', ...messages),
        error: (...errors: any[]) =>
            console.error('\x1b[1m\x1b[31m[JellyCommands Error]\x1b[22m\x1b[39m', ...errors),
        debug: (...messages: any[]) => {
            if (!client.joptions.debug) {
                console.debug('\x1b[1m\x1b[34m[JellyCommands Debug]\x1b[22m\x1b[39m', ...messages);
            }
        },
    };

    return Object.assign(methods.log, methods);
}
