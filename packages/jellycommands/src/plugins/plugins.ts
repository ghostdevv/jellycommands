import { JellyCommands } from '../JellyCommands';
import { Feature } from '../features/features';
import { MaybePromise } from '../utils/types';

/**
 * Feature plugins "provide" for features.
 * Responsible for registering the features.
 *
 * @see todo
 */
export interface FeaturePlugin<F extends Feature> {
    /**
     * The plugin id, which is unique and matches the feature id.
     */
    readonly id: string;

    /**
     * The type of plugin this is.
     */
    readonly type: 'feature';

    /**
     * This is called once after all the features have been
     * loaded, BEFORE the discord.js client is ready.
     * It's responsible for setting the feature up.
     *
     * todo support calling multiple times somehow for dynamic plugins
     *
     * @param client The client this effects.
     * @param features The features to register.
     *
     * @see todo
     */
    readonly register: (client: JellyCommands, features: Set<F>) => MaybePromise<void>;
}

/**
 * Options used with {@link defineFeaturePlugin}.
 */
type FeaturePluginOptions<F extends Feature> = Pick<FeaturePlugin<F>, 'register'>;

/**
 * Defines a feature plugin, these are "providers" for features.
 * Responsible for registering the features. There can only be one
 * feature plugin for each feature type.
 *
 * @param id The plugin id. Must be unique and MATCH the feature id.
 * @param options The plugin options.
 *
 * @see todo
 */
export function defineFeaturePlugin<F extends Feature>(
    id: string,
    options: FeaturePluginOptions<F>,
): FeaturePlugin<F> {
    return { ...options, id, type: 'feature' };
}

/**
 * Any type of plugin.
 */
export type AnyPlugin = FeaturePlugin<any>;

export interface SortedPlugins {
    /**
     * The feature plugins for the client.
     * @see todo
     */
    features: Map<string, FeaturePlugin<Feature>>;
}

/**
 * Parses the given plugins option to something usable.
 */
export function sortPlugins(client: JellyCommands, plugins: AnyPlugin[]): SortedPlugins {
    const features = new Map<string, FeaturePlugin<Feature>>();

    function exists(id: string) {
        return features.has(id);
    }

    for (const plugin of plugins) {
        if (exists(plugin.id)) {
            client.log.warn('Ignoring duplicate plugin of id:', plugin.id);
            continue;
        }

        switch (plugin.type) {
            case 'feature':
                features.set(plugin.id, plugin);
                break;

            default:
                throw new Error(`Unrecognised plugin found: "${JSON.stringify(plugin)}"`);
        }
    }

    return {
        features,
    };
}
