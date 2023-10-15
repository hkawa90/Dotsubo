# Shared Memory

複数のプロセス間で同じメモリ空間を利用.

## IPC

メッセージ、セマフォ、および共有メモリーなどの操作を目的としたインターフェースで現在は、POSIX IPC に置き換えられている.

- [Man page of SHM\_OVERVIEW](https://linuxjm.osdn.jp/html/LDP_man-pages/man7/shm_overview.7.html)

## System V 共有メモリAPI

|関数名   |説明   |
|---|---|
|shmget[^1][^4]|共有メモリ取得   |
|shmat[^2]|共有メモリへのポインタ取得(attach)|
|shmdt[^2]|共有メモリへのポインタ破棄(detach)|
|shmctl[^3]|共有メモリのアクセス権の変更などの制御|


[^1]: [Man page of SHMGET](https://linuxjm.osdn.jp/html/LDP_man-pages/man2/shmget.2.html)
[^2]: [Man page of SHMOP](https://linuxjm.osdn.jp/html/LDP_man-pages/man2/shmat.2.html)
[^3]: [Man page of SHMCTL](https://linuxjm.osdn.jp/html/LDP_man-pages/man2/shmctl.2.html)
[^4]: [Man page of FTOK](https://linuxjm.osdn.jp/html/LDP_man-pages/man3/ftok.3.html)


```shell title="共有メモリ状況"
ipcs -m
```

### 共有メモリ作成

1. ftok()でユニークなkeyを作成
2. shmget()でメモリ作成
3. shmat()でメモリへのポインタ確保
4. 共有メモリアクセス
5. shmdt()でメモリ破棄
6. shmctl()でメモリ消去

### 共有メモリ利用

上記手順とほぼ同じ、上記2.で`IPC_CREAT`でメモリ確保しない。


サンプルコード：

import Gist from 'react-gist';

<Gist id="2dd06d48fa897d5826946b63a61ff244" 
/>

## POSIX 共有メモリAPI

|関数名   |説明   |
|---|---|
|shm_open[^5]|POSIX 共有メモリーオブジェクトを(新規に)作成/オープン|
|shm_unlink[^5]|作成されたオブジェクトの削除|
|mmap()[^6]|マップする|
|munmap()[^6]|アンマップする|

[^5]: [Man page of SHM\_OPEN](https://linuxjm.osdn.jp/html/LDP_man-pages/man3/shm_open.3.html#lbAL)
[^6]: [Man page of MMAP](https://linuxjm.osdn.jp/html/LDP_man-pages/man2/mmap.2.html)

:::note
- `-lrt`でリンクすること
- システムコール munmap() は指定されたアドレス範囲のマップを消去し、 これ以降のその範囲内へのメモリー参照は不正となる。 この領域は、プロセスが終了したときにも自動的にアンマップされる。 一方、ファイルディスクリプターをクローズしても、この領域はアンマップされない。
- 移植性が必要なアプリケーションでは、 getpagesize() ではなく sysconf(_SC_PAGESIZE) を利用すべきである。

```c title=移植性が必要なアプリケーションでは、getpagesize()ではなくsysconf(_SC_PAGESIZE)を利用すべきである
#include <unistd.h> 
long sz = sysconf(_SC_PAGESIZE);
```

:::

### 共有メモリ

1. shm_open()で名前を指定して共有メモリーオブジェクト新規作成
2. mmap()で共有メモリオブジェクトをメモリ上にマッピングしてポインタ取得
3. メモリアクセス
4. munmap()でアンマップ
5. shm_unlink()で共有メモリーオブジェクト削除

TODO:サンプルプログラム