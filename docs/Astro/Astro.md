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

## Deploy

[Deploy your Astro Site 🚀 Astro Documentation](https://docs.astro.build/en/guides/deploy/)

## Plugin...

- [kevinzunigacuellar/remark-code-title: 🔌 remark plugin to add titles to code blocks](https://github.com/kevinzunigacuellar/remark-code-title)