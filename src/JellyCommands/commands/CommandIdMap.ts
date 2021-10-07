import type { BaseOptions } from './base/options';
import { BaseCommand } from './base/BaseCommand';
import { Cache } from '../../util/Cache';

type idMap = Map<string, BaseCommand<BaseOptions>>;
type commandsList = Set<BaseCommand<BaseOptions>>;

export class CommandIdMap {
    private readonly save = new Cache('commandIdMap');

    constructor() {}

    get(commandsList: commandsList): idMap {
        const commands: idMap = new Map();

        const data = this.save.get<Record<string, string>>();
        if (!data) throw new Error('Command id map is null');

        for (const command of commandsList)
            commands.set(data[command.filePath || ''], command);

        return commands;
    }

    set(commands: commandsList) {
        const data: Record<string, string> = {};

        for (const command of commands)
            data[command.filePath || ''] = command.id || '';

        this.save.set(data);
    }
}
