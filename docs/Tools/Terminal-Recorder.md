---
title: Terminal Recorder
---
# [sassman/t-rec-rs: Blazingly fast terminal recorder that generates animated gif images for the web written in rust](https://github.com/sassman/t-rec-rs)

## What's

linux terminal のキー操作を記録・再生(animated GIF)する

## Install

```shell title="Install"
# brew インストール
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
(echo; echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"') >> /home/kawa90/.bash_profile
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

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

Wayland環境での動作確認できないので省略。

## Uninstall

```shell
brew uninstall t-rec
brew autoremove
```

# Peek[phw/peek: Simple animated GIF screen recorder with an easy to use interface](https://github.com/phw/peek)

## What's

画面操作をAnimated GIFへ記録する。

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

