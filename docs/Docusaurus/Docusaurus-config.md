---
sidebar_position: 1
---
# Docusaurus configuration

## 構造

```
.
├── README.md
├── blog
├── docs
├── docusaurus.config.js => navbar, footer
├── sidebars.js
├── src
│   ├── components
│   │   ├── HomepageFeatures
│   │         ├── index.js => main
│   ├── css
│   └── pages
│       ├── index.js => header
└── static
```

``` title="画面構成"
+------------------------------------------+
|                 navbar                   |--{title,logo,items,hideOnScroll,style}
+------------------------------------------+
|                 header                   |
+------------------------------------------+
|                 main                     |
+------------------------------------------+
|                 footer                   |
+------------------------------------------+
```

### navbar

titleはnavbarのタイトル文字列を設定, hideOnScroll[^hideOnScroll], styleは省略[^navbar-style]

[^hideOnScroll]: [Auto-hide sticky navbar](https://docusaurus.io/docs/api/themes/configuration#auto-hide-sticky-navbar)
[^navbar-style]:[Navbar style](https://docusaurus.io/docs/api/themes/configuration#navbar-style)
#### logo[^navbar-logo]
- src : logイメージのパス
- srcDark: darkモード時のlogイメージのパス
- href: logクリック時の行き先URL
- target: リンク先の URL を表示する場所[^anchor-target]


[^anchor-target]:[アンカー要素 - HTML: ハイパーテキストマークアップ言語 | MDN](https://developer.mozilla.org/ja/docs/Web/HTML/Element/a)
[^navbar-logo]:[Navbar logo](https://docusaurus.io/docs/api/themes/configuration#navbar-logo)
#### items[^navbar-items]
- type: itemのタイプ指定
  - default: 
  - dropdown[^navbar-drowpdown]
  - doc[^navbar-doclink]
  - docSidebar[^navbar-docSidebar]
  - docsVersionDropdown[^navbar-docVersionDropdown]
  - docsVersion[^navbar-docVersion]
  - localeDropdown[^navbar-localeDropdown]
  - search[^navbar-search]
  - html[^navbar-html]
- label:itemのラベル名称
- html:labelと同様にラベルをHTMLで記述
- to: client-side routing
- href:full-page navigation
- prependBaseUrlToHref:hrefにbaseUrlを付与する
- position:navbarに配置する位置を指定(left|right)
- activeBasePath:このパスで始まるすべてのルートにアクティブクラスのスタイルを適用します。通常は必要ありません。
- activeBaseRegex:必要であれば activeBasePath に代わるもの。
- className: Custom CSS Class

[^navbar-items]:[Navbar items](https://docusaurus.io/docs/api/themes/configuration#navbar-items)
[^navbar-drowpdown]:[Navbar dropdown](https://docusaurus.io/docs/api/themes/configuration#navbar-dropdown)
[^navbar-doclink]:[Navbar doc link](https://docusaurus.io/docs/api/themes/configuration#navbar-doc-link)
[^navbar-docSidebar]:[Navbar linked to a sidebar](https://docusaurus.io/docs/api/themes/configuration#navbar-doc-sidebar)
[^navbar-docVersionDropdown]:[Navbar docs version dropdown](https://docusaurus.io/docs/api/themes/configuration#navbar-docs-version-dropdown)
[^navbar-docVersion]:[Navbar docs version](https://docusaurus.io/docs/api/themes/configuration#navbar-docs-version)
[^navbar-localeDropdown]:[Navbar locale dropdown](https://docusaurus.io/docs/api/themes/configuration#navbar-locale-dropdown)
[^navbar-search]:[Navbar search](https://docusaurus.io/docs/api/themes/configuration#navbar-search)
[^navbar-html]:[Navbar with custom HTML](https://docusaurus.io/docs/api/themes/configuration#navbar-with-custom-html)
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
- [navbar](https://docusaurus.io/docs/api/themes/configuration#navbar)でページ上部のナビゲーションバーの設定を行う

navbar:

![navbar](/img/docs/navbar.png)

- [footer](https://docusaurus.io/docs/api/themes/configuration#footer-1)を変更
- [prism](https://prismjs.com/index.html)のthemeを設定.[FormidableLabs/prism-react-renderer: 🖌️ Renders highlighted Prism output to React (+ theming & vendored Prism)](https://github.com/FormidableLabs/prism-react-renderer)の `packages/prism-react-renderer/src/themes`にtheme.

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

memo:

- [DocSearch: Search made for documentation | DocSearch by Algolia](https://docsearch.algolia.com/)
  - [イケてる全文検索サービス「Algolia」を触ってみよう - Qiita](https://qiita.com/yoohya/items/eefbb3a0dc60cd11ab9a)