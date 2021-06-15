export declare const posixify: (path: string) => string;
export declare const readdirRecursiveSync: (path: string) => string[];
export declare const resolveImport: (imp: {
    default?: any;
}) => any;
export declare const readJSFile: (path: string) => Promise<any>;
export declare const readdirJSFiles: (path: string) => Promise<{
    path: string;
    data: any;
}[]>;
