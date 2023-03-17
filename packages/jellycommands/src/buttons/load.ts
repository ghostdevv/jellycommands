import { read } from '../utils/files';
import { Button } from './buttons';

export async function loadButtons(items: string | Array<string | Button>) {
    const buttons = new Set<Button>();

    await read(items, (button) => {
        if (!(button instanceof Button))
            throw new Error(`Found invalid item "${button}" in options.buttons`);

        // Only load if not disabled
        if (!button.options.disabled) {
            buttons.add(button);
        }
    });

    for (const button of buttons) {
        // Delete disabled buttons
        if (button.options.disabled) {
            buttons.delete(button);
            continue;
        }
    }

    return buttons;
}
