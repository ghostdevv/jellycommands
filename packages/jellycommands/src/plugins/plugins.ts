import { Component } from '../components/components';
import { JellyCommands } from '../JellyCommands';
import { MaybePromise } from '../utils/types';

/**
 * Component plugins "provide" for components.
 * Responsible for registering the components.
 *
 * @see todo
 */
export interface ComponentPlugin<F extends Component> {
    /**
     * The plugin id, which is unique and matches the component id.
     */
    readonly id: string;

    /**
     * The type of plugin this is.
     */
    readonly type: 'component';

    /**
     * This is called once after all the components have been
     * loaded, BEFORE the discord.js client is ready.
     * It's responsible for setting the component up.
     *
     * todo support calling multiple times somehow for dynamic plugins
     *
     * @param client The client this effects.
     * @param components The components to register.
     *
     * @see todo
     */
    readonly register: (client: JellyCommands, components: Set<F>) => MaybePromise<void>;
}

/**
 * Options used with {@link defineComponentPlugin}.
 */
type ComponentPluginOptions<F extends Component> = Pick<ComponentPlugin<F>, 'register'>;

/**
 * Defines a component plugin, these are "providers" for components.
 * Responsible for registering the components. There can only be one
 * component plugin for each component type.
 *
 * @param id The plugin id. Must be unique and MATCH the component id.
 * @param options The plugin options.
 *
 * @see todo
 */
export function defineComponentPlugin<F extends Component>(
    id: string,
    options: ComponentPluginOptions<F>,
): ComponentPlugin<F> {
    return { ...options, id, type: 'component' };
}

/**
 * Any type of plugin.
 */
export type AnyPlugin = ComponentPlugin<any>;

export interface SortedPlugins {
    /**
     * The component plugins for the client.
     * @see todo
     */
    components: Map<string, ComponentPlugin<Component>>;
}

/**
 * Parses the given plugins option to something usable.
 */
export function sortPlugins(client: JellyCommands, plugins: AnyPlugin[]): SortedPlugins {
    const components = new Map<string, ComponentPlugin<Component>>();

    function exists(id: string) {
        return components.has(id);
    }

    for (const plugin of plugins) {
        if (exists(plugin.id)) {
            client.log.warn('Ignoring duplicate plugin of id:', plugin.id);
            continue;
        }

        switch (plugin.type) {
            case 'component':
                components.set(plugin.id, plugin);
                break;

            default:
                throw new Error(`Unrecognised plugin found: "${JSON.stringify(plugin)}"`);
        }
    }

    return {
        components: components,
    };
}
