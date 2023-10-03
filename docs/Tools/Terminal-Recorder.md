---
title: Terminal Recorder
---
# Terminal Recorder

## What's

linux terminal のキー操作を記録・再生(animated GIF)する

[sassman/t-rec-rs: Blazingly fast terminal recorder that generates animated gif images for the web written in rust](https://github.com/sassman/t-rec-rs)

## Install

```shell title="Install"
# (未インストールであれば)brew インストール
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# t-recのインストール
brew install t-rec
```

:::tip

[[FEAT] add support for wayland on linux · Issue #27 · sassman/t-rec-rs](https://github.com/sassman/t-rec-rs/issues/27)

```shell title="Waylandではサポートされていない?"
$ t-rec
Error: X11 error X11Error { error_kind: Drawable, error_code: 9, sequence: 13, bad_value: 0, minor_opcode: 0, major_opcode: 14, extension_name: None, request_name: Some("GetGeometry") }
```

:::
## Howto

Wayland環境[^1]での動作確認できないので省略。

[^1]:`echo $XDG_SESSION_TYPE`を実行すれば`X11`か`wayland`か表示されるのでわかる。


## Uninstall

```shell
brew uninstall t-rec
brew autoremove
```

# Peek

## What's

画面操作をAnimated GIFへ記録する。

Peek[phw/peek: Simple animated GIF screen recorder with an easy to use interface](https://github.com/phw/peek)

## Install

```shell
sudo add-apt-repository ppa:peek-developers/stable
sudo apt update
sudo apt install peek
```

## Howto

LauncherかTerminalから`peek`と打つ。背景が透過のウィンドウが起動されるので、記録したい範囲に移動・拡縮しておく。プルダウンメニューで保存形式を`GIF`, `APNG`, `WebM`, `MP4`が選択できる。`●`をクリックして録画

:::note
これもまたWaylandでは動作しない。
:::

# Terminalizer

## What's

Terminalの入力・表示内容を再現。表示内容をAnimated GIFへ変換できる。

## Howto

[Terminalizerのススメ - Qiita](https://qiita.com/howking/items/2741808da0abeae85376)

