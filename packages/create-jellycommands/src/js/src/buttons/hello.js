import { button } from 'jellycommands';

export default button({
    id: 'hello',

    async run({ interaction }) {
        interaction.reply({
            content: 'Hello from a button!',
        });
    },
});
