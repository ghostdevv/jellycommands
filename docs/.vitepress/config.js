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
            { text: 'Guide', link: '/guide/' },
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
        },
    },
});
