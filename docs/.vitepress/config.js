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

        socialLinks: [
            { icon: 'github', link: 'https://github.com/ghostdevv/jellycommands' },
            { icon: 'discord', link: 'https://discord.gg/2Vd4wAjJnm' },
        ],

        footer: {
            message: 'MIT Licensed',
            copyright: 'Copyright © 2021-present Willow (GHOST) & Contributors',
        },

        editLinks: true,
        editLinkText: 'Suggest changes to this page',

        nav: [
            { text: 'Guide', link: '/guide/quickstart' },
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
                    ],
                },
            ],

            '/guide': [
                {
                    text: 'Get Started',
                    items: [
                        {
                            text: 'Quick Start',
                            link: '/guide/quickstart',
                        },
                        {
                            text: 'Import vs Require',
                            link: '/guide/require',
                        },
                    ],
                },
                {
                    text: 'Core',
                    items: [
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
                    text: 'Commands',
                    items: [
                        {
                            text: 'Loading Commands',
                            link: '/guide/commands/loading',
                        },
                        {
                            text: 'Creating Commands',
                            link: '/guide/commands/files',
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
                            text: 'Loading Events',
                            link: '/guide/events/loading',
                        },
                        {
                            text: 'Creating Events',
                            link: '/guide/events/files',
                        },
                    ],
                },
                {
                    text: 'Migrate',
                    items: [
                        {
                            text: 'Discord.js v14',
                            link: '/guide/migrate/djs14',
                        },
                    ],
                },
            ],
        },
    },
});
