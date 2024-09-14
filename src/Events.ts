type SomeListener = (...args: unknown[]) => unknown;

export class Events<TEventsMap extends { [name: string]: unknown[] }> {
	private listeners = new Map<string, Set<SomeListener>>()
	private listenersOnce = new Map<string, Set<SomeListener>>()

	/**
	 * Registers listener for given event name
	 */
	on<TName extends keyof TEventsMap & string>(name: TName, listener: (...args: TEventsMap[TName]) => unknown): this {
		addElementToMapOfSet(this.listeners, name, listener as SomeListener);
		return this;
	}

	/**
	 * Registered lister for given event name but listener is called only once then remove from listeners
	 */
	once<TName extends keyof TEventsMap & string>(name: TName, listener: (...args: TEventsMap[TName]) => unknown): this {
		addElementToMapOfSet(this.listenersOnce, name, listener as SomeListener);
		return this;
	}

	/**
	 * Removes given listener for given event name
	 */
	off<TName extends keyof TEventsMap & string>(name: TName, listener: (...args: TEventsMap[TName]) => unknown): this {
		removeElementFromMapOfSet(this.listenersOnce, name, listener as SomeListener);
		removeElementFromMapOfSet(this.listeners, name, listener as SomeListener);
		return this;
	}

	/**
	 * Emits an event
	 */
	emit<TName extends keyof TEventsMap & string>(name: TName, ...args: TEventsMap[TName]): this {
		const listeners = this.listeners.get(name);
		if (listeners) {
			for (const listener of listeners) {
				listener(...args);
			}
		}

		const listenersOnce = this.listenersOnce.get(name);
		if (listenersOnce) {
			for (const listener of listenersOnce) {
				listener(...args);
			}
			this.listenersOnce.delete(name);
		}

		return this;
	}

}

function addElementToMapOfSet(map: Map<string, Set<SomeListener>>, key: string, element: SomeListener) {
	let set = map.get(key);
	if (!set) {
		set = new Set<SomeListener>();
		map.set(key, set);
	}
	set.add(element);
}

function removeElementFromMapOfSet(map: Map<string, Set<SomeListener>>, key: string, element: SomeListener) {
	const set = map.get(key);
	if (set) {
		set.delete(element);
	}
}
