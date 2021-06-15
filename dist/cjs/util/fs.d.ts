export declare const posixify: (path: string) => string;
export declare const readdirRecursiveSync: (path: string) => string[];
export declare const readJSFile: (path: string) => Promise<any>;
export declare const readdirJSFiles: (path: string) => Promise<{
    path: string;
    data: any;
}[]>;
