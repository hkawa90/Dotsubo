---
title: QEMU beginner
description: Emulation ARM.
tags: [QEMU]
---

ARM CPUバイナリをX86-64で動かす。QEMUを使ってEmulationする。

```shell title="install QEMU"
sudo apt-get install qemu qemu-user qemu-user-static binfmt-support
```

```shell
update-binfmts --display | grep arm
```

`enabled`でなければ、次のコマンドを実行する。

```shell title="ARMバイナリを実行できるように"
sudo update-binfmts --import qemu-arm
```

これでARM CPU向けバイナリを実行できるようになった。

ARM環境の`rootfs`があれば、`chroot`で実行してみる。

```shell
sudo chroot /hoge/rootfs /bin/sh
```