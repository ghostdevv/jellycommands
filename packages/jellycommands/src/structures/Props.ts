export class Props {
    #props = new Map<string, any>();

    constructor(init?: Record<string, any>) {
        for (const [key, value] of Object.entries(init || {})) this.set(key, value);
    }

    has(key: string): boolean {
        if (!key || typeof key != 'string')
            throw new TypeError(`Expected key of type string, received ${typeof key}`);

        return this.#props.has(key);
    }

    set<T>(key: string, value: T): void {
        if (!key || typeof key != 'string')
            throw new TypeError(`Expected key of type string, received ${typeof key}`);

        if (!value) throw new TypeError(`Expected to receive a value, received ${typeof value}`);

        if (this.has(key)) throw new Error(`Unable to overwrite the readonly prop: ${key}`);

        this.#props.set(key, value);
    }

    get<T>(key: string): T {
        if (!key || typeof key != 'string')
            throw new TypeError(`Expected key of type string, received ${typeof key}`);

        if (!this.#props.has(key)) throw new Error(`Unable to find prop: ${key}`);

        return this.#props.get(key);
    }
}
