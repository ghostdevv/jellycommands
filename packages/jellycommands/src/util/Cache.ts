import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { join } from 'path';

export class Cache {
    private readonly name;

    private readonly cacheFile;

    private readonly cacheDirectory = join(
        fileURLToPath(import.meta.url),
        '../../.jellycommands',
    );

    constructor(name: string) {
        this.name = name;

        this.cacheFile = join(this.cacheDirectory, this.name + '.json');

        // If the cache directory doesn't exist, create it
        if (!existsSync(this.cacheDirectory)) mkdirSync(this.cacheDirectory);

        // If the cache file doesn't exist, create it
        if (!existsSync(this.cacheFile))
            writeFileSync(this.cacheFile, '{}', 'utf-8');
    }

    set<T extends Record<any, any>>(object: T) {
        const json = JSON.stringify(object, null, 4);
        writeFileSync(this.cacheFile, json, 'utf-8');
    }

    get<T>(): T | null {
        const json = readFileSync(this.cacheFile, 'utf-8');

        try {
            const object = JSON.parse(json);
            return object;
        } catch {
            return null;
        }
    }
}
