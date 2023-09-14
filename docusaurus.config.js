const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'Dotsubo',
  tagline: '主にJavascript/C/C++プログラミング',
  url: 'https://hkawa90.github.io',
  baseUrl: '/Dotsubo/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'hkawa90', // Usually your GitHub org/user name.
  projectName: 'Dotsubo', // Usually your repo name.
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Dotsubo',
        logo: {
          alt: 'Dotsubo logo',
          src: 'img/Dotsubo-logos_transparent.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Tutorial',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/hkawa90/Dotsubo',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Dotsubo, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
    markdown: {
      mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],
});
