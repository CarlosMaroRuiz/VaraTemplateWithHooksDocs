// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'VaraNetwork Template por Monogatari Beta',
    tagline: 'Documentación ',
    favicon: 'img/favicon.ico',

    url: 'https://monogatari-template',
    baseUrl: '/',

    organizationName: 'Monogatari devs',
    projectName: 'vara-template-js',

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    i18n: {
        defaultLocale: 'es',
        locales: ['es'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: './sidebars.js',
                    routeBasePath: '/',
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            }),
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
        navbar: {
            title: 'VaraTemplateWithHooks',
            items: [{
                type: 'docSidebar',
                sidebarId: 'docs',
                position: 'left',
                label: 'Docs',
            }, ],
        },
        footer: {
            style: 'dark',
            links: [{
                title: 'Docs',
                items: [{
                    label: 'Introducción',
                    to: '/',
                }, ],
            }, ],
            copyright: `Copyright © ${new Date().getFullYear()} Monogatari devs`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    }),
};

export default config;