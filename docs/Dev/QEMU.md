# QEMU
QEMUは、汎用的なオープンソースのマシンエミュレータおよび仮想化ツール。

- [QEMU(Official Web Page)](https://www.qemu.org/)
    - [QEMU / QEMU · GitLab](https://gitlab.com/qemu-project/qemu)
    - [Welcome to QEMU’s documentation! — QEMU documentation](https://www.qemu.org/docs/master/)

System EmulationとUser Mode Emulationとがある。

- System Emulation : ゲストOSを実行するためのマシンの仮想モデル（CPU、メモリ、エミュレートされたデバイス）を提供
- User Mode Emulation : このモードでは、QEMUはあるCPU用にコンパイルされたプロセスを別のCPU上で起動することができます。

## Install

```shell title="User mode emulation"
sudo apt install binfmt-support qemu-user-static
```

## Run

コマンドオプションは以下の通り、詳細は[Linux User space emulator](https://www.qemu.org/docs/master/user/main.html#linux-user-space-emulator)参照。

```shell
qemu-i386 [-h] [-d] [-L path] [-s size] [-cpu model] [-g port] [-B offset] [-R size] program [arguments...]
```

## binfmt
### binfmtによる別アーキテクチャプログラム実行
`binfmt-support`というパッケージで導入される`update-binfmts`スクリプトでファイル拡張子をベースにして各種バイナリ 形式をインタプリタに登録し、該当するファイルが実行された時には適切な インタプリタが呼び出されるようにできます。これでhostと異なる別アーキテクチャのプログラムを実行できます。

```shell
sudo apt-get install binfmt-support
```

```shell title="armエミュレータの状態"
update-binfmts --display arm
```

```shell title="インストールからsystemd-binfmt.service設定まで"
sudo apt-get update
sudo apt-get install -y --no-install-recommends \
                     qemu qemu-system-misc qemu-user-static qemu-user binfmt-support
sudo sh -c 'echo :qemu-arm:M::\\x7f\\x45\\x4c\\x46\\x01\\x01\\x01\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x02\\x00\\x28\\x00:\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\xfe\\xff\\xff\\xff:/usr/bin/qemu-arm-static:F > /lib/binfmt.d/qemu-arm-static.conf'
sudo systemctl restart systemd-binfmt.service
```


### (補足)Linux binfmt_misc

> This Kernel feature allows you to invoke almost (for restrictions see below) every program by simply typing its name in the shell. This includes for example compiled Java(TM), Python or Emacs programs.
>
> — [Kernel Support for miscellaneous Binary Formats (binfmt\_misc) — The Linux Kernel documentation](https://docs.kernel.org/admin-guide/binfmt-misc.html)

```shell
mount binfmt_misc -t binfmt_misc /proc/sys/fs/binfmt_misc
```

## Cross

### Arm32

```shell
apt install g++-arm-linux-gnueabihf
```

## Build

```shell
sudo apt install libglib2.0-dev
git clone  -b stable-8.1  --depth=1  https://git.qemu.org/git/qemu.git
cd qemu
./configure --target-list=arm-linux-user \
        --disable-iconv --disable-vnc --disable-pie --disable-kvm --audio-drv-list= \
        --enable-attr --enable-linux-user --enable-tcg --static
make
make install
```
TODO:[ ] build確認

インストールバイナリ:
- qemu:x86用，システムエミュレータ
- qemu-system-x86_64:x86(64bit)用，システムエミュレータ
- qemu-system-ppc:PPC用，システムエミュレータ
- qemu-system-sparc:SPARC用，システムエミュレータ
- qemu-img:QEMUディスクイメージ作成・変換コマンド
- qemu-i386:i386用，ユーザモードエミュレーションコマンド
- qemu-ppc:PPC用，ユーザモードエミュレーションコマンド
- qemu-sparc:SPARC用，ユーザモードエミュレーションコマンド
- qemu-arm:ARM用，ユーザモードエミュレーションコマンド
- qemu-armeb:ARM(big endian)用，ユーザモードエミュレーションコマンド

## 参考文献

- [Docker and QEMU: A Powerful Combination for Accelerating Edge Computing Development and Optimizing Code Compilation | by Jegathesan Shanmugam | Medium](https://medium.com/@nullbyte.in/docker-and-qemu-a-powerful-combination-for-accelerating-edge-computing-development-and-optimizing-42da00259a02)
- [ARMing Yourself - Working with ARM on x86\_64 | Code Pyre](https://codepyre.com/2019/12/arming-yourself/)
- [クロスDockerの実行にqemuをコピーする必要がなくなった](https://zenn.dev/tetsu_koba/articles/b9545eb0231d7e)
- [QEMUのユーザーモードをDockerコンテナ上で使う - Qiita](https://qiita.com/FGtatsuro/items/c5dd8fdb028fe8948c2e)
- [Raspberry Pi のセルフビルド環境を QEMU で作る - Qiita](https://qiita.com/autch/items/c8c9cdc7b8e5821e81a4)
