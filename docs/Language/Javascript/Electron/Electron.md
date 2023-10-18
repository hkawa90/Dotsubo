# Electron

## What's

node.js + Chromiumという構成でDesktop上でWebアプリを実現する。

- [Build cross-platform desktop apps with JavaScript, HTML, and CSS | Electron](https://www.electronjs.org/ja/)
    - [はじめに | Electron](https://www.electronjs.org/ja/docs/latest/)

- Web Technologies
- Cross Platform
- Open Source

### Develop

- [Electron Fiddle | Electron](https://www.electronjs.org/fiddle) : Electron の API を試したり開発中の機能を試作するための学習ツール
- [Getting Started - Electron Forge](https://www.electronforge.io/): Electron ForgeはElectronアプリケーションのパッケージングと配布のためのオールインワンツール

#### Template

すべてを設えるのは大変です。


##### electron-quick-start[^1]

[^1]:[electron/electron-quick-start: Clone to try a simple Electron app](https://github.com/electron/electron-quick-start)

Exercise:

1. `Use this template`から`Create new repository`を選んで自分のアカウント上にリポジトリを作成
2. `git clone`して`npm install`を行う
3. `npm run start`で実行

`preload.js`あるし、そこそこメンテされてそう...

- [hkawa90/Electron-Sample: Electron app sample code](https://github.com/hkawa90/Electron-Sample)

##### electron-quick-start-typescript[^2]

[^2] : [electron/electron-quick-start-typescript: Clone to try a simple Electron app (in TypeScript)](https://github.com/electron/electron-quick-start-typescript)

##### electron-vite [^3]

Next generation Electron build tooling based on Vite.

- [Getting Started | electron-vite](https://electron-vite.org/guide/)
- [Build an Electron app with electron-vite - LogRocket Blog](https://blog.logrocket.com/build-electron-app-electron-vite/)
- [electron-vite で Electron アプリ開発の生産性を上げる | 豆蔵デベロッパーサイト](https://developer.mamezou-tech.com/blogs/2023/05/22/electron-vite/)

[^3]:[alex8088/electron-vite: Next generation Electron build tooling based on Vite 新一代 Electron 开发构建工具，支持源代码保护](https://github.com/alex8088/electron-vite)

##### retron

Vite + React + Electron + Material-UI Template. This is a skeleton template for easily creating React-based Electron projects.

[jooy2/retron: 📑 Vite + React + Electron + Material-UI Template. This is a skeleton template for easily creating React-based Electron projects.](https://github.com/jooy2/retron)

##### electron-quick-start-vue

Electron Quick Start Vue template with various options of UI Library, Auto load IPC handlers, etc.

[aufarijaal/electron-quick-start-vue: ✨ Electron Quick Start Vue template with various options of UI Library, Auto load IPC handlers, etc.](https://github.com/aufarijaal/electron-quick-start-vue)

##### create-electron-app

Generate a new Electron App within a minute!

[SanjaySunil/create-electron-app: Generate a new Electron App within a minute!](https://github.com/SanjaySunil/create-electron-app)

#### Sample/Example

- [electron/simple-samples: Minimal Electron applications with ideas for taking them further](https://github.com/electron/simple-samples) : 古い...

### はじめてみる

- [はじめに | Electron](https://www.electronjs.org/ja/docs/latest/)

### Packaging

> Electron Forge は、Electron アプリのパッケージ化と頒布を行うオールインワンのツールです。 このツールは内部で、既存の多くの Electron ツール (electron-packager、@electron/osx-sign、electron-winstaller など) を一つのインターフェースに統合しています。そのため、それらをまとめて繋げる方法について心配する必要はありません。
>
> - [アプリケーションのパッケージ | Electron](https://www.electronjs.org/ja/docs/latest/tutorial/tutorial-packaging)

- [Getting Started - Electron Forge](https://www.electronforge.io/)

### preload.js

> Electron の異なる種類のプロセスをブリッジするために、プリロード と呼ばれる特別なスクリプトを使用する必要があります。
> プリロードスクリプトは、Chrome 拡張機能の コンテンツスクリプト と同様の、レンダラーがウェブページを読み込む前に注入されるスクリプトです。 特権アクセスを必要とする機能をレンダラーに追加するために、global オブジェクトを contextBridge API で定義できます。
> - [プリロードスクリプトの利用 | Electron](https://www.electronjs.org/ja/docs/latest/tutorial/tutorial-preload)

## 参考

- [最新版で学ぶElectron入門 - ウェブ技術でPCアプリを開発しよう - ICS MEDIA](https://ics.media/entry/7298/)
- [Electron Desktop App Template. I wrote a bunch of Python code as a… | by Erich Izdepski | CodeX | Medium](https://medium.com/codex/electron-desktop-app-template-14c5e9c40b1e)
- [electron-template · GitHub Topics](https://github.com/topics/electron-template)