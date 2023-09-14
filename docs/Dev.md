# 開発環境

## Dev container

### Dev containerとは

Dev Containers 拡張機能を使用すると、Docker コンテナをフル機能の開発環境として使用できます。 コンテナにデプロイするかどうかに関係なく、コンテナは次のことができるため、優れた開発環境になります。

- デプロイ先と同じオペレーティング システム上で、一貫性があり、簡単に再現可能なツールチェーンを使用して開発します。
- ローカル マシンへの影響を心配することなく、異なる別個の開発環境間ですばやく切り替え、安全に更新を行うことができます。
- 新しいチームメンバー/貢献者が一貫した開発環境で簡単に起動して実行できるようにします。ローカル設定に影響を与えることなく、新しいテクノロジを試したり、コード ベースのコピーを複製したりできます。

Dockerの開発環境上でVSCodeが使えるようです。

### 設定

```shell
mkdir .devcontainer
```

`.devcontainer` に `devcontainer.json`を作成します。また`Dockerfile`も配置します。

```json title="devcontainer.json"
{
    // 表示される名前
	"name": "表示される名前",
    "image": "",
	"build": {
		"dockerfile": "Dockerfile",
        "context": "..", // buildするディレクトリへの相対パス
        "args": { "VARIANT": "3" } // build-args
    },
	// リモート先のVS Codeにインストールする拡張機能
	"extensions": [
		"ms-vscode.cpptools"
	],
}
```

devcontainer.json に image または dockerFile プロパティを追加すると、VS Code は自動的に現在のワークスペースフォルダをコンテナに「バインド」マウントします。これを変更するには`workspaceMount`プロパティを追加します([Change default source code mount in containers](https://code.visualstudio.com/remote/advancedcontainers/change-default-source-mount))。

meta情報は[Dev Container metadata reference](https://containers.dev/implementors/json_reference/)参照