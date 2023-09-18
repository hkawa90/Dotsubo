# 開発環境

## Dev container

### Dev containerとは

Dockerの開発環境上でVSCodeが使えるようです。

### 使い方

いくつかの方法で、Dockerコンテナと接続します。

#### 既存のコンテナと接続する方法

```shell title="node環境のコンテナを実行"
docker run -itd -w /home/kawa90/app -v $(pwd):/home/kawa90/app node_18
```

- VSCodeの左下アイコンの`リモートウィンドウを開きます`をクリック
- 実行中のコンテナーにアタッチ

- プライマリサイドバーの`リモートエクスプローラ`をクリック
- リモートエクスプローラから`その他のコンテナー`から選ぶ

#### Dev Containerの設定に従って接続する方法

- `Dev Container`の設定ファイルがあるフォルダーオープンで、`フォルダーに開発コンテナの構成ファイルが含まれています。コンテナーで開発するフォルダーをもう一度開きます`のダイアログで、`コンテナーで再度開く`をクリック

- コマンドパレットから`Dev Containers: Reopen in Container`

```shell
mkdir .devcontainer
```

`.devcontainer` に `devcontainer.json`を作成します。また`Dockerfile`も配置します。

```json title="devcontainer.json"
{
    // 事前にUSERIDを設定してください(id -u $USER)
    "name": "dev-meson-env",
    "build": {
        "dockerfile": "Dockerfile",
        "context": "..", // buildするディレクトリへの相対パス
        "args": { "user": "${localEnv:USER}",
                  "userid": "${localEnv:USERID}",
                  "--target": "tracer" } // build-args
    },
    // リモート先のVS Codeにインストールする拡張機能
    "customizations": {
        "vscode" : {
            "extensions": [
                "ms-vscode.cpptools",
                "ms-vscode.cpptools-extension-pack",
                "vadimcn.vscode-lldb"
            ]
        }
    }
}
```

devcontainer.json に image または dockerFile プロパティを追加すると、VS Code は自動的に現在のワークスペースフォルダをコンテナに「バインド」マウントします。これを変更するには`workspaceMount`プロパティを追加します([Change default source code mount in containers](https://code.visualstudio.com/remote/advancedcontainers/change-default-source-mount))。

meta情報は[Dev Container metadata reference](https://containers.dev/implementors/json_reference/)参照

## VSCodeでデバッグ

TODO extension:                 "ms-vscode.cpptools",
                "ms-vscode.cpptools-extension-pack",
                "vadimcn.vscode-lldb"
TODO Task.json, launch.json

## QEMU

### Docker上にQemuをインストール

### 別アーキテクチャの(host:x86, container:arm)のコンテナを使う

``` shell
docker pull meedamian/simple-qemu
```

[meeDamian/simple-qemu: Emulating other CPU architectures in Docker made easy](https://github.com/meeDamian/simple-qemu)

RUN git clone  -b "$VERSION"  --depth=1  https://git.qemu.org/git/qemu.git

latest version[^latest]

[^latest]: 8.1

RUN ./configure --with-pkgversion="lncm-$VERSION${BUILD:+.b}$BUILD" \
        --target-list=$(awk '{printf s $0 "-linux-user"; s=","}' /built-architectures.txt) \
        --disable-blobs --disable-iconv --disable-vnc --disable-pie --disable-kvm \
        --audio-drv-list= \
        --enable-attr \
        --enable-linux-user \
        --enable-tcg \
        --static

``` shell
# Enable emulation on the host system
docker run --rm --privileged meedamian/simple-qemu -p yes
 
# Verify it worked
docker run --rm arm32v7/alpine uname -m
```

``` dockerfile
RUN apt-get update && apt-get -y upgrade
RUN apt-get -y install build-essential gdb python git
```

### Arm docker on x86

[balenalib/qemux86-64-ubuntu - Docker Image | Docker Hub](https://hub.docker.com/r/balenalib/qemux86-64-ubuntu)

[RaspberryPi OS 32bit armhf / armv7l の Docker Image 作成と起動](https://zenn.dev/pinto0309/articles/2e6483a2452c8f)

[Running and Building ARM Docker Containers on x86 | Stereolabs](https://www.stereolabs.com/docs/docker/building-arm-container-on-x86/)

[Dockerを使ってポータブルなArm64エミュレート環境を構築 - Qiita](https://qiita.com/muscat201807/items/468bb6608a61d6f31f1c)

[Running Raspbian on x86 docker](http://blog.guiraudet.com/raspberrypi/2016/03/03/raspbian-image-for-docker.html)

### Draw.io

```shell
docker run -it --rm --name="draw" -p 8080:8080 -p 8443:8443 jgraph/drawio
# Open with offline mode
Open http://localhost:8080/?offline=1&https=0 
```

