import { readdirRecursiveSync } from '../util/fs';

export class CommandManager {
    constructor() {}

    load(path: string) {
        const paths = readdirRecursiveSync(path)
            .filter((x) => x.endsWith('.js'))
            .map((path) => ({ path, data: require(path) }));
    }
}
