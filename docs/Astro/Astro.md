# Astro

DocusaurusだとSVGのハンドリングがうまくいかないのでちょっと寄り道

## Whats

> Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.

- [Astro](https://astro.build/)
    - [Getting Started 🚀 Astro Documentation](https://docs.astro.build/en/getting-started/)

## Install

### 本体の導入

こちらはデフォルトのthemeの場合。テーマを使いたい場合は次の`テーマの導入へ`。

``` title="nodeは必須"
npm create astro@latest
```

![](/img/docs/install-astro.gif)

### テーマの導入

[Themes | Astro](https://astro.build/themes/)からお好みを選んで、下記の書式でインストールする。

```shell
npm create astro@latest -- --template <EXAMPLE_NAME>
```

もしくは

```shell title="テーマの導入"
npm create astro@latest -- --template <github-username>/<github-repo>
```

例えば、[Astro Big Doc | Astro](https://astro.build/themes/details/astro-big-doc/)を選んだ場合は、`Get started`をクリックして移動したURLは`https://github.com/MicroWebStacks/astro-big-doc`となっているので、以下のようにコマンドを実行すればいい。

```shell
npm create astro@latest -- --template MicroWebStacks/astro-big-doc
```
### Docker

Dockerを使うなら`host`オプションを追加。

```json title="package.jsonを修正してDockerで使えるようhostオプション追加、あとついでにport番号も変更j"
{
  "name": "my-docs",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    // highlight-next-line
    "dev": "astro dev --port 3000 --host 0.0.0.0",
```

### Editor

`.astro`ファイルを使うためのVSCodeエクステンションがある。詳しくは、[Astro - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)参照。

```
ext install astro-build.astro-vscode
```
## 設定
- [設定方法 🚀 Astroドキュメント](https://docs.astro.build/ja/reference/configuration-reference/#%E3%83%9E%E3%83%BC%E3%82%AF%E3%83%80%E3%82%A6%E3%83%B3%E3%81%AE%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)
- [[2023年6月版]Astro.js 小ネタ集 その2 Markdownの表示カスタマイズいろいろ](https://zenn.dev/asopitech/articles/20230604-012854_1)
- [Astro でコードブロックのシンタックスハイライトをしつつタイトルも付ける | monolithic kernel](https://blog.mono0x.net/2023/07/10/astro-syntax-highlight-with-title/)
## Deploy

[Deploy your Astro Site 🚀 Astro Documentation](https://docs.astro.build/en/guides/deploy/)

## Plugin...

- [kevinzunigacuellar/remark-code-title: 🔌 remark plugin to add titles to code blocks](https://github.com/kevinzunigacuellar/remark-code-title)