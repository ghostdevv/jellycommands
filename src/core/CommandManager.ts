import { readdirRecursiveSync } from '../util/fs';

export class CommandManager {
    private paths: string[];

    constructor(directories: string | string[]) {
        this.paths = [directories]
            .flat()
            .reduce(
                (files: string[], path: string) => [
                    ...files,
                    ...readdirRecursiveSync(path),
                ],
                [],
            )
            .filter((x) => x.endsWith('.js'));
    }
}
