import type { MessageCommand } from '../commands/types/messageCommands/MessageCommand';
import type { UserCommand } from '../commands/types/userCommands/UserCommand';
import type { Command } from '../commands/types/commands/Command';
import type { Button } from '../buttons/buttons';
import { Event } from '../events/Event';
import { read } from '../utils/files';

export type Feature = Button | Command | MessageCommand | UserCommand | Event;

export abstract class BaseFeature {
    public abstract options: BaseFeatureOptions;
    public abstract readonly TYPE: string;
}

export interface BaseFeatureOptions {
    disabled?: boolean;
}

const FEATURE_TYPES: Feature['TYPE'][] = [
    'BUTTON',
    'SLASH_COMMAND',
    'MESSAGE_COMMAND',
    'USER_COMMAND',
    'EVENT',
];

function isFeature(thing: any): thing is Feature {
    return !!thing && FEATURE_TYPES.some((type) => thing['TYPE'] === type);
}

export async function readFeatures(rawFeatures: string | Array<string | Feature>) {
    const features = new Set<Feature>();

    await read(rawFeatures, (feature) => {
        if (isFeature(feature) && !feature.options.disabled) {
            features.add(feature);
        }
    });

    return features;
}
