import { readdirRecursive, posixify } from 'ghoststools';
import { lstatSync, existsSync } from 'fs';
import { readJSFile } from '../../util/fs';
import { parse, resolve } from 'path';

export default abstract class BaseManager<ManagerTarget> {
    constructor() {}

    protected abstract add(
        item: ManagerTarget,
        path: string,
    ): void | Promise<void>;

    load(path: string) {
        path = resolve(posixify(path));

        if (!existsSync(path)) throw new Error(`Path ${path} does not exist`);

        const isDirectory = lstatSync(path).isDirectory();
        return isDirectory ? this.loadDirectory(path) : this.loadFile(path);
    }

    async loadFile(path: string): Promise<ManagerTarget> {
        if (!existsSync(path)) throw new Error(`File ${path} does not exist`);

        const { ext } = parse(path);
        if (!['.js', '.mjs', '.cjs'].includes(ext))
            throw new Error(`${path} is not a JS file`);

        const item = await readJSFile(path);

        await this.add(item, path);

        return item;
    }

    async loadDirectory(path: string): Promise<ManagerTarget[]> {
        if (!existsSync(path))
            throw new Error(`Directory ${path} does not exist`);

        const paths = readdirRecursive(path).filter((p: string) =>
            ['.js', '.mjs', '.cjs'].includes(parse(p).ext),
        );

        const items = [];

        for (const path of paths) {
            const item = await this.loadFile(path);
            items.push(item);
        }

        return items;
    }
}
