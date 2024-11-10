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
			tableOfContents: {
				maxHeadingLevel: 4,
			},
			sidebar: [
				{
					label: 'Getting Started',
					link: '/getting-started',
				},
				{
					label: 'Components',
					items: [
						{
							label: 'Understanding Components',
							link: '/components',
						},
						{
							label: 'Commands',
							items: [
								{
									label: 'Creating Commands',
									link: '/components/commands',
								},
								{
									label: 'Dev Mode',
									link: '/components/commands/dev',
								},
								{
									label: 'Slash Commands',
									link: '/components/commands/slash',
								},
								{
									label: 'Context Menu Commands',
									link: '/components/commands/context-menu',
								},
								{
									label: 'Guards',
									link: '/components/commands/guards',
								},
								{
									label: 'Caching',
									link: '/components/commands/caching',
								},
							],
						},
						{
							label: 'Events',
							items: [
								{
									label: 'Creating Events',
									link: '/components/events',
								},
							],
						},
						{
							label: 'Buttons',
							items: [
								{
									label: 'Creating Buttons',
									link: '/components/buttons',
								},
							],
						},
						{
							label: 'Props',
							link: '/components/props',
						},
						{
							label: 'Deferring Interactions',
							link: '/components/deferring',
						},
					],
				},
				{
					label: 'Guides',
					items: [
						// {
						// 	label: 'Going to production',
						// 	link: '/guides/production',
						// },
						{
							label: 'File Loading Expanded',
							link: '/guides/fs',
						},
						{
							label: 'Messages',
							link: '/guides/messages',
						},
						{
							label: 'Import vs Require',
							link: '/guides/require',
						},
					],
				},
				{
					label: 'Breaking Changes',
					items: [
						{
							label: 'Components (1.0.0-next.44)',
							link: '/migrate/components',
						},
						{
							label: 'Props (1.0.0-next.40)',
							link: '/migrate/props',
						},
						{
							label: 'Discord.js v14 (1.0.0-next.32)',
							link: '/migrate/djs14',
						},
					],
				},
			],
		}),
	],
});
