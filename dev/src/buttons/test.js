import { button } from 'jellycommands';

export default button({
    id: 'test',

    async run({ interaction }) {
        interaction.reply({
            content: 'Hello World',
        });
    },
});
