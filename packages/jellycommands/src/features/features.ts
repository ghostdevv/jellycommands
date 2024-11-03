export interface BaseFeatureOptions {
    /**
     * When `true` the feature won't be loaded by JellyCommands.
     * If you're using the filesystem loader a `_` prefix in the
     * filename will automatically enable this.
     *
     * @default false
     */
    disabled?: boolean;
}

export const FEATURE_SYMBOL = Symbol.for('jellycommands.feature');

export abstract class Feature<O extends BaseFeatureOptions = BaseFeatureOptions> {
    public readonly [FEATURE_SYMBOL]: string;

    /**
     * A human readable name for the feature.
     */
    public readonly featureName: string;

    /**
     * The features options
     */
    public abstract readonly options: O;

    /**
     * The base class for all features.
     *
     * @param id Machine readable identifier for the feature. Changing this is a breaking change.
     * @param name A human readable name of the feature. Changing this is not considered breaking.
     */
    constructor(id: string, name: string) {
        this[FEATURE_SYMBOL] = id;
        this.featureName = name;
    }

    get id(): string {
        return this[FEATURE_SYMBOL];
    }
}

/**
 * Check if the `thing` is a feature.
 * @param thing "Thing" to check.
 */
export function isFeature(thing: any): thing is Feature {
    return thing && typeof thing == 'object' && FEATURE_SYMBOL in thing;
}
