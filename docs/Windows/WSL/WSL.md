## Misc

- WSL上のGUIをWindowsから直接起動

```cmd
# `wsl -d'のオプション名はwsl -1 -vの起動したいdistro名称をいれる
cmd /c wsl -d Ubuntu-22.04  -- export DISPLAY=:0; emacs
```

## 類似

- [Android™️ 用 Windows サブシステム | Microsoft Learn](https://learn.microsoft.com/ja-jp/windows/android/wsa/)

## News

- [「Windows Subsystem for Linux」がv2.0.0に、多数の試験機能を追加 - 窓の杜](https://forest.watch.impress.co.jp/docs/news/1532311.html)