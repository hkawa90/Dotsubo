# Markdown / MDX

## Codeblock

- titleの付与: title="strings"
- 行ハイライト: highlight-next-line/start/end
- 行番号表示: showLineNumbers

````
```language title ="hoge"
console.log('hoge')
// highlight-next-line
line 1
line 2
line 3
// highlight-start
line 4
line 5
// highlight-end
line 6
```
````

- Theming

themeConfig/prismプロパティを変更する

- Interactive code editor

```shell
npm install --save @docusaurus/theme-live-codeblock
```

You will also need to add the plugin to your docusaurus.config.js.

```
module.exports = {
  // ...
  themes: ['@docusaurus/theme-live-codeblock'],
  // ...
};
```

````jsx title="Tabs"
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="apple"
  values={[
    {label: 'Apple', value: 'apple'},
    {label: 'Orange', value: 'orange'},
    {label: 'Banana', value: 'banana'},
  ]}>
  <TabItem value="apple">This is an apple 🍎</TabItem>
  <TabItem value="orange">This is an orange 🍊</TabItem>
  <TabItem value="banana">This is a banana 🍌</TabItem>
</Tabs>
````

````
```jsx live
function Clock(props) {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}
```
````

``` markdown
<details>
<summary>サマリーです</summary>
隠された文書
</details>
```

````
```
export const Highlight = ({children, color}) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '0.2rem',
    }}>
    {children}
  </span>
);

<Highlight color="#25c2a0">Docusaurus green</Highlight> and <Highlight color="#1877F2">Facebook blue</Highlight> are my favorite colors.

I can write **Markdown** alongside my _JSX_!
```
````

``` title="Admonitions. 他にnote, info, caution, dangerがある"
:::tip
Tipsを書く
:::
```

### Example

```language title ="hoge"
console.log('hoge')
// highlight-next-line
line 1
line 2
line 3
// highlight-start
line 4
line 5
// highlight-end
line 6
```

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="apple"
  values={[
    {label: 'Apple', value: 'apple'},
    {label: 'Orange', value: 'orange'},
    {label: 'Banana', value: 'banana'},
  ]}>
  <TabItem value="apple">This is an apple 🍎</TabItem>
  <TabItem value="orange">This is an orange 🍊</TabItem>
  <TabItem value="banana">This is a banana 🍌</TabItem>
</Tabs>

<details>
<summary>サマリーです</summary>
隠された文書
</details>

export const Highlight = ({children, color}) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '0.2rem',
    }}>
    {children}
  </span>
);

<Highlight color="#25c2a0">Docusaurus green</Highlight> and <Highlight color="#1877F2">Facebook blue</Highlight> are my favorite colors.

I can write **Markdown** alongside my _JSX_!

:::tip
Tipsを書く
:::

## Markdown front matter

[Markdown front matter](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter)参照。

TODO: front matter

```yaml
id: 一意の文書ID
title: ドキュメントのテキストタイトル。ページのメタデータに使用され、複数の場所（サイドバー、次へ/前へボタン...）でフォールバック値として使用されます。Markdownタイトルが含まれていない場合、ドキュメントの先頭に自動的に追加されます。
pagination_label: このドキュメントの次へ/前へボタンで使用されるテキスト。
sidebar_label: この文書のサイドバーに表示されるテキスト。
sidebar_position: 自動生成されたサイドバーアイテムを使用するときに、生成されたサイドバースライス内のdocの位置を制御します。
sidebar_class_name: 自動生成されたサイドバーを使用するとき、対応するサイドバーラベルに特別なクラス名を与えます。
sidebar_custom_props: Assign custom props to the sidebar item referencing this doc
hide_title: false(ドキュメント上部のタイトルを隠すかどうか。これはフロントマターを通して宣言されたタイトルを隠すだけで、ドキュメントのトップにあるMarkdownタイトルには影響しません。)
draft: false(文書が進行中であることを示すブーリアン・フラグ。ドラフト文書は開発中のみ表示されます。)
```

TODO: front matter template

```yaml Template
---
id: doc-markdown
title: Docs Markdown Features
hide_title: false
hide_table_of_contents: false
sidebar_label: Markdown
sidebar_position: 3
pagination_label: Markdown features
custom_edit_url: https://github.com/facebook/docusaurus/edit/main/docs/api-doc-markdown.md
description: How do I find you when I cannot solve this problem
keywords:
  - docs
  - docusaurus
image: https://i.imgur.com/mErPwqL.png
slug: /myDoc
last_update:
  date: 1/1/2000
  author: custom author name
---
```


- [Code blocks | Docusaurus](https://docusaurus.io/docs/markdown-features/code-blocks)
