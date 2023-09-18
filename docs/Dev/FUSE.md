# FUSE

- [libfuse/libfuse: The reference implementation of the Linux FUSE (Filesystem in Userspace) interface](https://github.com/libfuse/libfuse)
    - [libfuse: libfuse API documentation](http://libfuse.github.io/doxygen/)
    - [Release libfuse 3.16.1 · libfuse/libfuse](https://github.com/libfuse/libfuse/releases/tag/fuse-3.16.1)

> FUSE (Filesystem in Userspace) は、ユーザー空間プログラムが Linux カーネルにファイルシステムをエクスポートするためのインターフェースです。FUSE プロジェクトは、fuse カーネル・モジュール（通常のカーネル・レポジトリで管理）と libfuse ユーザ空間ライブラリ（このリポジトリで管理）の 2 つのコンポーネントから構成されています。libfuse は、FUSE カーネル・モジュールと通信するためのリファレンス実装を提供します。
>
> − [Libfuse About](https://github.com/libfuse/libfuse#about)

## 使用条件

``` title="Kernel Config:Linux Kernel設定が必要"
File systems  --->
  <*/M> FUSE (Filesystem in Userspace) support [CONFIG_FUSE_FS]
```

## Install

meson, pkg-config, pytestなどが必要。

[Install](https://github.com/libfuse/libfuse#installation)参照

もしくはパッケージとしてインストール(ただしVer2系)。

```shell
apt install ibfuse-dev
```

## Configuration

```shell title="Setup /etc/fuse.conf"
cat > /etc/fuse.conf << "EOF"
# Set the maximum number of FUSE mounts allowed to non-root users.
# The default is 1000.
#
#mount_max = 1000

# Allow non-root users to specify the 'allow_other' or 'allow_root'
# mount options.
#
#user_allow_other
EOF
```

## 使用方法

FUSE ファイルシステムは、fuse3 で提供されている fusermount3[^1]を使う

[^1]: [fusermount3(1) — Arch manual pages](https://man.archlinux.org/man/fusermount3.1)


## 参考文献

- [Filesystem in Userspace (FUSE) のカーネルとデーモン間の通信 - Qiita](https://qiita.com/tkusumi/items/6dc204ba964264c72a9a)