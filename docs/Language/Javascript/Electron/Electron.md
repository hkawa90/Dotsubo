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

[vis.js](https://visjs.org/)のvis-timelineのデモを実装してみる

1. viteでプロジェクトを構成する

```shell
npm create vite@latest timeline-demo
Need to install the following packages:
create-vite@4.4.1
Ok to proceed? (y) y
✔ Select a framework: › Vanilla
✔ Select a variant: › JavaScript

Scaffolding project in /home/kawa90/work/js/timeline-demo...

Done. Now run:

  cd timeline-demo
  npm install
  npm run dev

cd timeline-demo/
```
2. [Timeline | groups | Group example](https://visjs.github.io/vis-timeline/examples/timeline/groups/groups.html)を導入

```shell
npm i vis-timeline --save
npm i moment --save
rm counter.js
```

3. index.html, main.jsを修正

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="visualization"></div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

```js
import './style.css'
import * as vis from 'vis-timeline/standalone'
import moment from 'moment'

var now = moment().minutes(0).seconds(0).milliseconds(0);
var groupCount = 3;
var itemCount = 20;

// create a data set with groups
var names = ["John", "Alston", "Lee", "Grant"];
var groups = new vis.DataSet();
for (var g = 0; g < groupCount; g++) {
  groups.add({ id: g, content: names[g] });
}

// create a dataset with items
var items = new vis.DataSet();
for (var i = 0; i < itemCount; i++) {
  var start = now.clone().add(Math.random() * 200, "hours");
  var group = Math.floor(Math.random() * groupCount);
  items.add({
    id: i,
    group: group,
    content:
      "item " +
      i +
      ' <span style="color:#97B0F8;">(' +
      names[group] +
      ")</span>",
    start: start,
    type: "box",
  });
}

// create visualization
var container = document.getElementById("visualization");
var options = {
  groupOrder: "content", // groupOrder can be a property name or a sorting function
};

var timeline = new vis.Timeline(container);
timeline.setOptions(options);
timeline.setGroups(groups);
timeline.setItems(items);
```

```css title="追加部分のみ"
#visualization {
  box-sizing: border-box;
  width: 100%;
  height: 300px;
}
```
4. 動作確認

```shell
npm run dev
```

5. electron-viteの導入

```shell
npm install electron electron-vite --save-dev
```

6. package.jsonの修正

```json title="scriptsに下記を追加"
"scripts": {
    "dev": "electron-vite dev -w",
    "build": "electron-vite build",
    "preview": "electron-vite preview"
},
```

7. フォルダ構成の変更

```shell
mkdir -p src/main
mkdir -p src/preload
mkdir -p src/renderer/src
mv index.html src/renderer
mv main.js src/renderer/src
mv style.css src/renderer/src
touch src/preload/preload.js
```

8. src/main/main.js(Electron main process)の作成

```js
import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({});

  // Vite dev server URL
  mainWindow.loadURL('http://localhost:5173');
  mainWindow.on('closed', () => mainWindow = null);
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow == null) {
    createWindow();
  }
});
```

9. electron.vite.config.jsの作成

```js title="electron.vite.config.js"
import { defineConfig } from "electron-vite";

export default defineConfig({
    publicDir: false,
    main: {
        build: {
            outDir: './dist/main', //出力場所の指定
        }
    },
    preload: {
        build: {
            outDir: './dist/preload', //出力場所の指定
        }
    },
    renderer: {
        root: './src/renderer', //開発ディレクトリ設定
        build: {
            outDir: './dist/renderer', //出力場所の指定
        }
    }
});
```

10. package.jsonの修正

- "type": "module"の行を削除
- "main": "./dist/main/main.js"の追加

11. index.htmlの変更

```html title="スクリプトのパス変更"
<script type="module" src="src/main.js"></script>
```

12. 動作確認

```shell
npm run dev
```

13. Electron Forgeでパッケージ作成

```js title="forge.config.cjs作成"
module.exports = {
  packagerConfig: {
    ignore: [
      /^\/src/,
      /(.eslintrc.json)|(.gitignore)|(electron.vite.config.ts)|(forge.config.cjs)|(tsconfig.*)/,
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
```

```json title="package.json description/licenseフィールドはforgeが使うため必須項目"
"description": "vis-timeline electron app demo.",
"license": "IPC",
"main": "./dist/main/index.js",
"scripts": {
  "start": "electron-vite preview --outDir=dist",
  "dev": "electron-vite dev --outDir=dist",
  "package": "electron-vite build --outDir=dist && electron-forge package",
  "make": "electron-vite build --outDir=dist && electron-forge make"
},
"devDependencies": {
  "@electron-forge/cli": "^6.2.1",
  "@electron-forge/maker-deb": "^6.2.1",
  "@electron-forge/maker-rpm": "^6.2.1",
  "@electron-forge/maker-squirrel": "^6.2.1",
  "@electron-forge/maker-zip": "^6.2.1",
}
```

```shell title="Install electron-forge/cli"
npm install --save-dev @electron-forge/cli
npx electron-forge import
✔ Checking your system
✔ Locating importable project
✔ Processing configuration and dependencies
  ✔ Installing dependencies
  ✔ Copying base template Forge configuration
  ✔ Fixing .gitignore
✔ Finalizing import

› We have attempted to convert your app to be in a format that Electron Forge understands.
  Thanks for using Electron Forge!
```

```shell title="rpmモジュールのインストールとパッケージング. deb/rpmファイルが作成される"
sudo apt install -y rpm
npm run make

✔ Checking your system
✔ Loading configuration
✔ Resolving make targets
  › Making for the following targets: deb, rpm
✔ Running package command
  ✔ Preparing to package application
  ✔ Running packaging hooks
    ✔ Running generateAssets hook
    ✔ Running prePackage hook
  ✔ Packaging application
    ✔ Packaging for x64 on linux [2s]
  ✔ Running postPackage hook
✔ Running preMake hook
✔ Making distributables
  ✔ Making a deb distributable for linux/x64 [20s]
  ✔ Making a rpm distributable for linux/x64 [33s]
✔ Running postMake hook
  › Artifacts available at: /home/kawa90/work/js/timeline-demo/out/make
```

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