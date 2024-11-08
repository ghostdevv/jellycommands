export interface BaseComponentOptions {
	/**
	 * When `true` the component won't be loaded by JellyCommands.
	 * If you're using the filesystem loader a `_` prefix in the
	 * filename will automatically enable this.
	 *
	 * @default false
	 */
	disabled?: boolean;
}

export const COMPONENT_SYMBOL = Symbol.for('jellycommands.component');

/**
 * In JellyCommands component is a part of your Discord bot such as a `command`/`event`/etc.
 */
export abstract class Component<
	O extends BaseComponentOptions = BaseComponentOptions,
> {
	public readonly [COMPONENT_SYMBOL]: string;

	/**
	 * A human readable name for the component.
	 */
	// public readonly componentName: string;

	/**
	 * The components options
	 */
	public abstract readonly options: O;

	/**
	 * The base class for all components.
	 *
	 * @param id Machine readable identifier for the component. Changing this is a breaking change.
	 * @param name A human readable name of the component. Changing this is not considered breaking.
	 */
	constructor(id: string, _name: string) {
		this[COMPONENT_SYMBOL] = id;
		// todo
		// this.componentName = name;
	}

	get id(): string {
		return this[COMPONENT_SYMBOL];
	}
}

/**
 * Check if the `thing` is a component.
 * @param thing "Thing" to check.
 */
export function isComponent(thing: any): thing is Component {
	return thing && typeof thing === 'object' && COMPONENT_SYMBOL in thing;
}
