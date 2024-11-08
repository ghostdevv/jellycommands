import { defineConfig } from 'vitepress';

export default defineConfig({
	title: 'JellyCommands',
	description:
		'Jellycommands is a developer experience focused command framework for discord.js. It has support for all types of application commands, including slash commands and context menus. It also includes quality of life features such as caching and developer mode.',

	head: [['link', { rel: 'icon', href: '/logo.svg' }]],

	themeConfig: {
		repo: 'ghostdevv/jellycommands',
		docsDir: 'docs',
		docsBranch: 'main',
		logo: '/logo.svg',

		search: {
			provider: 'local',
		},

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/ghostdevv/jellycommands',
			},
			{ icon: 'discord', link: 'https://discord.gg/2Vd4wAjJnm' },
		],

		footer: {
			message: 'MIT Licensed',
			copyright:
				'Copyright © 2021-present Willow (GHOST) & Contributors',
		},

		editLinks: true,
		editLinkText: 'Suggest changes to this page',

		nav: [
			{ text: 'Guide', link: '/guide/overview' },
			{ text: 'API', link: '/api/' },
		],

		sidebar: {
			'/api': [
				{
					text: 'Core',
					items: [
						{
							text: 'Client',
							link: '/api/client',
						},
						{
							text: 'Props',
							link: '/api/props',
						},
						{
							text: 'Commands',
							link: '/api/commands',
						},
						{
							text: 'Events',
							link: '/api/events',
						},
						{
							text: 'Buttons',
							link: '/api/buttons',
						},
						{
							text: 'App Types',
							link: '/api/types',
						},
					],
				},
			],

			'/guide': [
				{
					text: 'Get Started',
					items: [
						{
							text: 'Overview',
							link: '/guide/overview',
						},
						{
							text: 'Import vs Require',
							link: '/guide/require',
						},
					],
				},
				{
					text: 'Commands',
					items: [
						{
							text: 'Creating Commands',
							link: '/guide/commands/files',
						},
						{
							text: 'Registering Commands',
							link: '/guide/commands/registering',
						},
						{
							text: 'Dev Mode',
							link: '/guide/commands/dev',
						},
						{
							text: 'Slash Commands Extras',
							link: '/guide/commands/slash',
						},
						{
							text: 'Guards',
							link: '/guide/commands/guards',
						},
					],
				},
				{
					text: 'Events',
					items: [
						{
							text: 'Creating Events',
							link: '/guide/events/files',
						},
					],
				},
				{
					text: 'Buttons',
					items: [
						{
							text: 'Creating Buttons',
							link: '/guide/buttons/files',
						},
					],
				},
				{
					text: 'Core',
					items: [
						{
							text: 'Components',
							link: '/guide/components',
						},
						{
							text: 'Props',
							link: '/guide/props',
						},
						{
							text: 'Messages',
							link: '/guide/messages',
						},
					],
				},
				{
					text: 'Migrate',
					items: [
						{
							text: 'Components (1.0.0-next.44)',
							link: '/guide/migrate/components',
						},
						{
							text: 'Props (1.0.0-next.40)',
							link: '/guide/migrate/props',
						},
						{
							text: 'Discord.js v14 (1.0.0-next.31)',
							link: '/guide/migrate/djs14',
						},
					],
				},
			],
		},
	},
});
