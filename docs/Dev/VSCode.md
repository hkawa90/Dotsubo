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