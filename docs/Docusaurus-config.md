---
sidebar_position: 1
---
# Docusaurus configuration

## 日本語化

lang属性が`ja`になります。

```js title="docusaurus.config.js"
module.exports = {
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },
```

## Mermaidの導入

[Mermaid](https://docusaurus.io/docs/markdown-features/diagrams#installation)を参照。

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

残念ながら、mindmapはちゃんと動きません。そのうち直ることを期待。
* [Can't render \`mindmap\` mermaid diagrams · Issue #9032 · facebook/docusaurus](https://github.com/facebook/docusaurus/issues/9032)

## 編集不可に

ページ編集のURL指定があると、各ページに編集へのリンクが自動挿入される。

```js title="docusaurus.config.jsでeditUrlを削除"
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/main/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
```

### themeConfig

- Githubリポジトリへのリンクを変更(下記`href`)
- navbarでページ上部のナビゲーションバーの設定を行う

navbar:

![navbar](/img/docs/navbar.png)

```js title="docusaurus.config"
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'My Site',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
```

