---
title: プログラム事始め
sidebar_position: 1
---

# プログラム事始め

## hello

``` shell title="ARM環境でサンプルを動かしてみる"
# cargoコマンドで新しいプロジェクト(パッケージ)作成
cargo new hello_cargo
cd hello_cargo
tree 
# highlight-start
.
├── Cargo.toml
└── src
    └── main.rs
# highlight-end
cargo build
./target/debug/hello_cargo
# highlight-next-line
Hello, world!
# 作成された実行可能ファイルを調べてみる
file ./target/debug/hello_cargo
# highlight-next-line
./target/debug/hello_cargo: ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, BuildID[sha1]=57c1c2343e655d1f9d1c87601ba06dd2c7ecee8b, for GNU/Linux 3.7.0, with debug_info, not stripped
```

``` rust title="main.rs"
fn main() {
    println!("Hello, world!");
}
```

`Cargo.toml`はRustの設定ファイルで以下のように書かれている。フォーマットは[TOML](https://toml.io/)形式。詳細内容は[The Manifest Format - The Cargo Book](https://doc.rust-lang.org/cargo/reference/manifest.html)参照。

``` toml title="Cargo.toml"
[package]
name = "hello_cargo"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
```

## ここまででわかったこと

- cargo[^1]コマンドで新しいプロジェクト作成ができる
- ソースコードの拡張子は`rs`
- 関数名の前に`fn`
- ビルドした実行可能プログラムはネイティブなバイナリ
- ソースコードのprintln!はマクロ[^2]とよばれるもの

[^1]:Rustのビルドシステム兼パッケージマネージャ
[^2]:[マクロ - The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/ch19-06-macros.html)
