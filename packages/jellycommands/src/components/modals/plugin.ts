import { defineComponentPlugin } from '../../plugins/plugins';
import type { Modal } from './modals';

export const MODALS_COMPONENT_ID = 'jellycommands.modal';

// TODO test this function
async function findModal(
	incomingId: string,
	modals: Set<Modal>,
): Promise<Modal | null> {
	for (const modal of modals) {
		const { id } = modal.options;

		switch (typeof id) {
			case 'string':
				if (id === incomingId) return modal;
				break;

			case 'function':
				// todo should this be sync only? might cause issues when not deffered
				if (await id(incomingId)) return modal;
				break;

			case 'object':
				if (id.test(incomingId)) return modal;
				break;
		}
	}

	return null;
}

export const modalsPlugin = defineComponentPlugin<Modal>(MODALS_COMPONENT_ID, {
	register(client, modals) {
		client.on('interactionCreate', async (interaction) => {
			if (interaction.isModalSubmit()) {
				const modal = await findModal(interaction.customId, modals);

				if (modal) {
					if (modal.options.defer) {
						await interaction.deferReply(
							typeof modal.options.defer === 'object'
								? modal.options.defer
								: {},
						);
					}

					await modal.run({
						client,
						props: client.props,
						interaction,
					});
				}
			}
		});
	},
});
