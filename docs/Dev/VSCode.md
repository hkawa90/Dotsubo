# VSCode

## What's

MicrosoftのIDE(electronベース)

## 設定

### フォーマッタ

1. `esbenp.prettier-vscode(Prettier - Code formatter)`をインストール
2. `settings.json`へ反映
2.1. コマンドパレットで`Preferences: Open User Settings (JSON)`を選択
2.2. 言語ごとにフォーマッタを指定

```json
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
```

### Linter

1. Install eslint

```shell
# いくつかの質問に答えていくと完了
cd my-project-directory
npm init @eslint/config
@eslint/create-config@0.4.6
Ok to proceed? (y) y
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ What format do you want your config file to be in? · JavaScript
Local ESLint installation not found.
The config that you've selected requires the following dependencies:

eslint@latest
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · npm
ls -l .eslintrc.js
cat .eslintrc.js
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
    }
}
```
2. Install dbaeumer.vscode-eslint

#### 参考
- [Find and fix problems in your JavaScript code - ESLint - Pluggable JavaScript Linter](https://eslint.org/)
    - [ESLintの推奨設定（eslint:recommended）のチェック内容 ｜ Tips Note by TAM](https://www.tam-tam.co.jp/tipsnote/javascript/post11934.html)
### 拡張機能
#### C/CPP開発環境

| 識別子 |内容                                         | 
| ---------- |-------------------------------------- | 
|[ms-vscode.cpptools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)|The C/C++ extension adds language support for C/C++ to Visual Studio Code, including editing (IntelliSense) and debugging features.|
|[ms-vscode.cmake-tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools)|CMake Tools provides the native developer a full-featured, convenient, and powerful workflow for CMake-based projects in Visual Studio Code.|
|[cschlosser.doxdocgen](https://marketplace.visualstudio.com/items?itemName=cschlosser.doxdocgen)|This VS Code Extensions provides Doxygen Documentation generation on the fly by starting a Doxygen comment block and pressing enter.|
|[ms-vscode.makefile-tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.makefile-tools)|This extension provides IntelliSense configurations to the VS Code C/C++ Extension for Makefile projects. It also provides convenient commands to build, debug, and run your targets.|
|[xaver.clang-format](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)|Clang-Format is a tool to format C/C++/Java/JavaScript/Objective-C/Objective-C++/Protobuf code. It can be configured with a config file within the working folder or a parent folder. Configuration see: http://clang.llvm.org/docs/ClangFormatStyleOptions.html|
|[llvm-vs-code-extensions.vscode-clangd](https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.|clangd helps developers write, understand and improve C/C++ code(See [What is clangd?](https://clangd.llvm.org/))
|[ajshort.include-autocomplete](https://marketplace.visualstudio.com/items?itemName=ajshort.include-autocomplete)|This extension provides autocompletion when typing C++ #include statements. It searches the configured include directories to provide suggestions, and also suggests standard headers.|
|[ms-vscode.cpptools-themes](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools-themes)|Semantic colorization was added to the C/C++ Extension in version 0.24.0.
vadimcn.vscode-lldb|see [User's Manual](https://github.com/vadimcn/codelldb/blob/v1.10.0/MANUAL.md)|

#### Markdown

- [yzhang.markdown-all-in-one](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) : All you need for Markdown (keyboard shortcuts, table of contents, auto preview and more).
- [shd101wyy.markdown-preview-enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced) : Markdown Preview Enhanced is an open source project released under the University of Illinois/NCSA Open Source License. Its ongoing development is made possible thanks to the support by these awesome backers.
    - [shd101wyy/vscode-markdown-preview-enhanced: One of the "BEST" markdown preview extensions for Visual Studio Code](https://github.com/shd101wyy/vscode-markdown-preview-enhanced)
        - [概要](https://shd101wyy.github.io/markdown-preview-enhanced/#/ja-jp/)
- [ICS.japanese-proofreading](https://marketplace.visualstudio.com/items?itemName=ICS.japanese-proofreading): VS Code上でテキストファイル・Markdownファイル・Re:VIEWファイルの日本語の文章をチェックする拡張機能です。該当のファイルを開いた時、更新した時に自動で校正のチェックを行い、文章内の問題のある箇所をマーキングし問題パネルにエラー内容を表示します。
    - [文章作成・メール作成に役立つ！　VS Codeの拡張機能「テキスト校正くん」を公開 - ICS MEDIA](https://ics.media/entry/18859/)
- [taichi.vscode-textlint](https://marketplace.visualstudio.com/items?itemName=taichi.vscode-textlint) : Integrates [textlint · The pluggable linting tool for text and markdown](https://textlint.github.io/) into VS Code. If you are new to textlint check the documentation.
- [chick-p/vscode-japanese-refinement-openai: This extension refines your text in Japanese with OpenAI.](https://github.com/chick-p/vscode-japanese-refinement-openai)
    - [OpenAI で日本語の文章を校正する VSCode 拡張を作った - ひよこまめ](https://blog.chick-p.work/blog/vscode-extention-refine-japanese-openai/)

#### Rust

[Windows]
- [Microsoft C++ Build Tools - Visual Studio](https://visualstudio.microsoft.com/ja/visual-cpp-build-tools/)
    - [Windows で Rust 用の開発環境を設定する | Microsoft Learn](https://learn.microsoft.com/ja-jp/windows/dev-environment/rust/setup)

- [rust-lang.rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) : This extension provides support for the Rust programming language. It is recommended over and replaces rust-lang.rust.
- [vadimcn.vscode-lldb](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb) : See [codelldb/MANUAL.md at v1.10.0 · vadimcn/codelldb](https://github.com/vadimcn/codelldb/blob/v1.10.0/MANUAL.md)
- [swellaby.vscode-rust-test-adapter](https://marketplace.visualstudio.com/items?itemName=swellaby.vscode-rust-test-adapter) : Rust Test Explorer for VS Code that enables viewing and running your Rust tests from the VS Code Sidebar.
- [JScearcy.rust-doc-viewer](https://marketplace.visualstudio.com/items?itemName=JScearcy.rust-doc-viewer) : This extension will take your locally generated project docs and display them in a new window for easier reference.
- [ritwickdey.LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) : Launch a development local Server with live reload feature for static & dynamic pages
- [serayuzgur.crates](https://marketplace.visualstudio.com/items?itemName=serayuzgur.crates) : Helps Rust developers managing dependencies with Cargo.toml.
- [tamasfe.even-better-toml](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) : Fully-featured TOML support

#### Bash

- [rogalmic.bash-debug](https://marketplace.visualstudio.com/items?itemName=rogalmic.bash-debug) : A bash debugger GUI frontend based on awesome bashdb scripts (bashdb now included in package).
- 
[mads-hartmann.bash-ide-vscode](https://marketplace.visualstudio.com/items?itemName=mads-hartmann.bash-ide-vscode): Visual Studio Code extension utilizing the Bash Language Server and integrates with explainshell and shellcheck.
- [Remisa.shellman](https://marketplace.visualstudio.com/items?itemName=Remisa.shellman) : Learn easy Shell Scripting with Shellman, examples included. Download free ebook (pdf, epub, mobi). Reading the Basics part of the book is strongly recommended if you are new to Shell Scripting.

#### Javasript

関連にHTML/CSSなど多数あるため、記事紹介。

- [2023年最新版 VSCodeのおすすめ拡張機能まとめ | Designup](https://designup.jp/editor-vscode-extentions.html)
- [【2023年最新】Web制作に役立つVSCodeのおすすめ拡張機能23選！│Muscle Coding](https://musclecoding.com/vscode-extension-web-design/)
- [【2023年】Web制作で使えるVSCodeオススメ拡張機能17選！ - PENGIN BLOG](https://pengi-n.co.jp/blog/vscode-extensions/)
- [プログラミング作業を効率化するVSCodeの拡張機能30選｜Kinsta®](https://kinsta.com/jp/blog/vscode-extensions/)