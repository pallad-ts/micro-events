type SomeListener = (...args: unknown[]) => unknown;

export class Events<TEventsMap extends Record<string, unknown[]>> {
	private listeners = new Map<string, Set<SomeListener>>()

	on<TName extends keyof TEventsMap & string>(name: TName, listener: (...args: TEventsMap[TName]) => unknown): this {
		let currentListeners = this.listeners.get(name);
		if (!currentListeners) {
			currentListeners = new Set<SomeListener>();
			this.listeners.set(name, currentListeners);
		}
		currentListeners.add(listener as SomeListener);
		return this;
	}

	off<TName extends keyof TEventsMap & string>(name: TName, listener: (...args: TEventsMap[TName]) => unknown): this {
		const currentListeners = this.listeners.get(name);
		if (currentListeners) {
			currentListeners.delete(listener as SomeListener);
		}
		return this;
	}

	emit<TName extends keyof TEventsMap & string>(name: TName, ...args: TEventsMap[TName]): this {
		const listeners = this.listeners.get(name);
		if (listeners) {
			for (const listener of listeners) {
				listener(...args);
			}
		}
		return this;
	}
}
