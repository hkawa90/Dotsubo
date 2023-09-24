# Rust
ちょっとRustを始めてみようと思った。。。

## 開発環境

### Rust

``` shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

``` shell title="バージョン確認"
rustc --version
```

``` shell title="アップデートするには"
rustup update
```

- cargo-binutils: [2-4. cargo-binutils](https://tomoyuki-nakabayashi.github.io/embedded-rust-techniques/02-setup/setup.html#2-4-cargo-binutils)
- cargo-generate: 既存のgitリポジトリをテンプレートとしてプロジェクトを立ち上げるためのツール
- llvm-tools-preview : LLVMネイティブコードカバレッジ
- clippy: [Clippyでもっとlintを](https://doc.rust-jp.rs/book-ja/appendix-04-useful-development-tools.html#clippy%E3%81%A7%E3%82%82%E3%81%A3%E3%81%A8lint%E3%82%92)
- rustfmt: [rustfmtを使った自動フォーマット](https://doc.rust-jp.rs/book-ja/appendix-04-useful-development-tools.html#rustfmt%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9F%E8%87%AA%E5%8B%95%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88)


``` shell title="Install cargo-binutils"
cargo install cargo-binutils cargo-generate
rustup component add llvm-tools-preview clippy rustfmt
```

``` shell title="ARM Cortex-Mアーキテクチャのクロスコンパイラを追加"
rustup target add thumbv6m-none-eabi thumbv7m-none-eabi thumbv7em-none-eabi thumbv7em-none-eabihf
```
Windowsなら併せて[Microsoft C++ Build Tools - Visual Studio](https://visualstudio.microsoft.com/ja/visual-cpp-build-tools/)もインストール。

### VSCode

#### Extensions

``` shell
# rust-analyzer拡張機能をインストール
code --install-extension rust-lang.rust-analyzer
# CodeLLDB 拡張機能をインストール
code --install-extension vadimcn.vscode-lldb
```

### Docker

[rust - Official Image | Docker Hub](https://hub.docker.com/_/rust)

``` sh
docker run -it --rm --user "$(id -u)":"$(id -g)" -v "$PWD":/usr/src/myapp -w /usr/src/myapp rust bash
```

FROM rust:1.72

## 参考文献

- [std - Rust](https://doc.rust-lang.org/std/)
- [The Embedded Rust Book](https://tomoyuki-nakabayashi.github.io/book/)

- [The Rust Programming Language 日本語版 - The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/)
- [Introduction - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/)
