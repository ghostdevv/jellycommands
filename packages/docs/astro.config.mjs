// @ts-check
import starlightLinksValidator from 'starlight-links-validator';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://jellycommands.dev',

	output: 'static',
	trailingSlash: 'never',

	integrations: [
		starlight({
			title: 'JellyCommands',
			description:
				'Jellycommands is a developer experience focused command framework for discord.js. It has support for all types of application commands, including slash commands and conlabel menus. It also includes quality of life features such as caching and developer mode.',
			social: {
				github: 'https://github.com/ghostdevv/jellycommands',
			},
			favicon: '/logo.svg',
			customCss: ['./src/theme.css'],
			editLink: {
				baseUrl:
					'https://github.com/ghostdevv/jellycommands/edit/main/packages/docs/',
			},
			lastUpdated: true,
			plugins: [starlightLinksValidator()],
			sidebar: [
				{
					label: 'Guide',
					items: [
						{
							label: 'Get Started',
							items: [
								{
									label: 'Overview',
									link: '/guide/overview',
								},
								{
									label: 'Import vs Require',
									link: '/guide/require',
								},
							],
						},
						{
							label: 'Commands',
							items: [
								{
									label: 'Creating Commands',
									link: '/guide/commands/files',
								},
								{
									label: 'Registering Commands',
									link: '/guide/commands/registering',
								},
								{
									label: 'Dev Mode',
									link: '/guide/commands/dev',
								},
								{
									label: 'Slash Commands Extras',
									link: '/guide/commands/slash',
								},
								{
									label: 'Guards',
									link: '/guide/commands/guards',
								},
							],
						},
						{
							label: 'Events',
							items: [
								{
									label: 'Creating Events',
									link: '/guide/events/files',
								},
							],
						},
						{
							label: 'Buttons',
							items: [
								{
									label: 'Creating Buttons',
									link: '/guide/buttons/files',
								},
							],
						},
						{
							label: 'Core',
							items: [
								{
									label: 'Components',
									link: '/guide/components',
								},
								{
									label: 'Props',
									link: '/guide/props',
								},
								{
									label: 'Messages',
									link: '/guide/messages',
								},
							],
						},
						{
							label: 'Migrate',
							items: [
								{
									label: 'Components (1.0.0-next.44)',
									link: '/guide/migrate/components',
								},
								{
									label: 'Props (1.0.0-next.40)',
									link: '/guide/migrate/props',
								},
								{
									label: 'Discord.js v14 (1.0.0-next.31)',
									link: '/guide/migrate/djs14',
								},
							],
						},
					],
				},
				{
					label: 'API',
					items: [
						{
							label: 'Core',
							items: [
								{
									label: 'Client',
									link: '/api/client',
								},
								{
									label: 'Props',
									link: '/api/props',
								},
								{
									label: 'Commands',
									link: '/api/commands',
								},
								{
									label: 'Events',
									link: '/api/events',
								},
								{
									label: 'Buttons',
									link: '/api/buttons',
								},
								{
									label: 'App Types',
									link: '/api/types',
								},
							],
						},
					],
				},
			],
		}),
	],
});
