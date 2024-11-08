// todo Current impl requires set values to be truthy
export class SetMap<K, V> {
	#map = new Map<K, Set<V>>();

	set(key: K, value: V) {
		this.#map.set(
			key,
			this.#map.get(key)?.add(value) || new Set<V>([value]),
		);
		return this;
	}

	get(key: K) {
		return this.#map.get(key);
	}

	clear() {
		return this.#map.clear();
	}

	get size() {
		return this.#map.size;
	}

	/**
	 * Delete `inner` from the set under `key`.
	 */
	delete(key: K, inner: V): boolean;
	/**
	 * Delete the entire set from the map.
	 */
	delete(key: K, inner?: never): boolean;
	delete(key: K, inner?: V): boolean {
		const current = this.#map.get(key);
		if (!current) return false;

		if (inner) {
			current?.delete(inner);
			this.#map.set(key, current);
		} else {
			this.#map.delete(key);
		}

		return true;
	}

	/**
	 * Checks if `inner` is in the set under `key`.
	 */
	has(key: K, inner: V): boolean;
	/**
	 * Checks if the entire set exists.
	 */
	has(key: K, inner?: never): boolean;
	has(key: K, inner?: V): boolean {
		const current = this.#map.get(key);
		return !!(inner ? current?.has(inner) : current);
	}

	keys() {
		return this.#map.keys();
	}

	values() {
		return this.#map.values();
	}

	entries() {
		return this.#map.entries();
	}
}
