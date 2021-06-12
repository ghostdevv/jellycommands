import { readdirSync, lstatSync } from 'fs';
import { join, resolve, parse } from 'path';

export const posixify = (path: string) => path.replace(/\\/g, '/');

export const readdirRecursiveSync = (path: string): string[] =>
    readdirSync(path)
        .map((file) => join(path, file))
        .reduce(
            (files: string[], file: string) => [
                ...files,
                ...(lstatSync(file).isDirectory()
                    ? readdirRecursiveSync(file)
                    : [file]),
            ],
            [],
        )
        .map((p) => resolve(p))
        .map((p) => posixify(p));

export const isDisabled = (path: string) => parse(path).name.startsWith('_');
