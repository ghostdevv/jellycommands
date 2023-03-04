import { read } from '../utils/files';
import { Button } from './buttons';

export async function loadButtons(items: string | Array<string | Button>) {
    const buttons = new Set<Button>();

    await read(items, (button) => {
        if (!(button instanceof Button))
            throw new Error(`Found invalid item "${button}" in options.buttons`);

        buttons.add(button);
    });

    return buttons;
}
