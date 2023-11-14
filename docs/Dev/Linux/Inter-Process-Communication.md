# Inter Process Communication

プロセスが使う共有リソースの管理、協調動作するためプロセス間で通信を行う必要がある。大きくはセマフォ,メッセージキュー,共有メモリがある.

## セマフォ(POSIX)
プロセスやスレッド間でその動作を 同期させることができる.セマフォでは値が0となると使用状態となり、待機する.

1. 作成
     セマフォの初期値を指定して、作成する.
2. 待機
    セマフォ値が1以上になるまで待機状態になる.
3. ポスト
   セマフォ値を1増加させる.
4. 削除
   セマフォを削除.

#### 名前付き
プロセス間で同じ名前のセマフォ に対し操作を行うことができる.
```c title="名前付きセマフォによるプロセス間排他制御"
// 親プロセスと子プロセス間で名前付きセマフォで排他制御します.
// Note:
// -lpthreadでリンクする
// Dockerで動かす場合は--ipc オプション設定を行うこと(Dockerではセマフォ値が常に0となっていたため正しく動作しなかった)

#include <errno.h>
#include <fcntl.h>
#include <semaphore.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h> /* For mode constants */
#include <sys/wait.h>
#include <unistd.h>

const char *semName = "linux-sem-sample";

void parent(void) {
    int ret = 0;
    // O_CREAT と O_EXCL の両方が指定された場合、指定された名前 name のセマフォがすでに存在するとエラーが返される
    // O_CREAT が指定され、指定した名前 name のセマフォがすでに存在する場合、 mode と value は無視される。
    sem_t *sem_id = sem_open(semName, O_CREAT, S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH, 1);
    {
        int val = 0;
        if (sem_getvalue(sem_id, &val) == -1) {
            perror("sem_getvalue failed:");
            return;
        }
        printf("sem_getvalue: %d\n", val);
    }
    if (sem_id == SEM_FAILED) {
        perror("Parent side: sem_open failed");
        return;
    }

    do {
        // This sem_wait() function is a cancellation point
        ret = sem_wait(sem_id);
        if (ret == EINTR) {
            continue;
        } else {
            break;
        }
    } while (ret != 0);

    printf("I am parent process. Critical section.\n");
    if (sem_post(sem_id) != 0) {
        perror("Parent side: sem_post failed");
        exit(EXIT_FAILURE);
    }
    if (sem_close(sem_id) != 0) {
        perror("Parent side: sem_close failed");
        return;
    }

    if (sem_unlink(semName) < 0) {
        perror("Parent side: sem_unlink failed");
        return;
    }
}

void child(void) {
    int ret = 0;
    sem_t *sem_id = sem_open(semName, O_CREAT, S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH, 1);
    {
        int val = 0;
        if (sem_getvalue(sem_id, &val) == -1) {
            perror("sem_getvalue failed:");
        }
        printf("sem_getvalue: %d\n", val);
    }
    if (sem_id == SEM_FAILED) {
        perror("Child side: sem_open failed.");
        return;
    }
    do {
        ret = sem_wait(sem_id);
        if (ret == EINTR) {
            continue;
        } else {
            break;
        }
    } while (ret != 0);
    printf("I am child process. Critical section.\n");
    if (sem_post(sem_id) != 0) {
        perror("Child side: sem_post failed");
        exit(EXIT_FAILURE);
    }
}

int main(int argc, char *argv[]) {
    pid_t pid;
    pid = fork();

    if (pid < 0) {
        perror("fork");
        exit(EXIT_FAILURE);
    }

    if (!pid) {
        child();
    } else {
        int status;
        parent();
        wait(&status);
    }

    return 0;
}
```

上記プログラムが動作していると、`/dev/shm/`に`sem.`+`名前`のファイルのセマフォオブジェクトが作成されていることがわかる。

```shell
ls /dev/shm/
sem.linux-sem-sample

```

:::note
名前は、最大で **NAME_MAX**_-4_ (すなわち 251) 文字のヌル終端された文字列で、 スラッシュで始まり、スラッシュ以外の文字が 1 文字以上続く形式
:::

#### 名前無し
Process-shared semaphoreもしくはMemory based semaphoreと呼ばれる形式で共有メモリーを使って操作する.
sem_init - 名前なしセマフォを初期化する

##### サンプルプログラム
```c title="待ちプロセス.こちらを先に実行させる"
// プロセス間でProcess-shared semaphoreにて排他制御
// こちらはセマフォで待ち状態となっている。他プロセスが共有メモリ経由でpostすると解除されて次の制御へ移行する.

#include <errno.h>
#include <fcntl.h>
#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <unistd.h>

#define NAME "linux-sem-sample"

int main(int argc, char *argv[]) {
    int fd;
    int ret = 0;
    void *ptr;
    struct stat stat;

    fd = shm_open(NAME, O_CREAT | O_RDWR, S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH);
    ftruncate(fd, sizeof(sem_t));
    fstat(fd, &stat);
    ptr = mmap(NULL, stat.st_size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    sem_t *sem = (sem_t *)ptr;
    if (sem_init(sem, 1, 0) < 0) {
        perror("sem_init");
    }
    do {
        // This sem_wait() function is a cancellation point
        ret = sem_wait(sem);
        if (ret == EINTR) {
            continue;
        } else {
            break;
        }
    } while (ret != 0);
    printf("Enter critical section\n");

    sem_destroy(sem);
    shm_unlink(NAME);
    return 0;
}
```

```c title="このプロセスが共有メモリ経由でpostする"
// プロセス間でProcess-shared semaphoreにて排他制御
// こちらのプロセスが共有メモリ経由でpostすると、別プロセスのセマフォが解除されて次の制御へ移行する.

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <sys/wait.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <errno.h>

#define NAME "linux-sem-sample"

int main(int argc, char *argv[])
{
    int fd;
    void *ptr;
    struct stat stat;

    fd = shm_open(NAME, O_RDWR, S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH);
    ftruncate(fd, sizeof(sem_t));
    fstat(fd, &stat);
    ptr = mmap(NULL, stat.st_size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    sem_t *sem = (sem_t*)ptr;

    if (sem_post(sem) < 0) {
        perror("post");
    }
    sem_destroy( sem );
    shm_unlink(NAME);
    return 0;
}
```

##### 参考
- [Man page of SEM\_OVERVIEW](https://linuxjm.osdn.jp/html/LDP_man-pages/man7/sem_overview.7.html)

## メッセージキュー

POSIX メッセージキューを使用すると、プロセス間で メッセージの形でのデータのやり取りを行うことができる.システム上のメッセージの上限などは`/proc/sys/fs/mqueue`でアクセスできる.

```shell title="/procインタフェース内容はMQ_OVERVIEW参照"
ls /proc/sys/fs/mqueue/
msg_default  msg_max  msgsize_default  msgsize_max  queues_max
```

### サンプルプログラム

```c
// 親プロセスと子プロセス間でメッセージキューを介して通信します.
// Note:
// -lpthreadでリンクする

#include <errno.h>
#include <fcntl.h>
#include <semaphore.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h> /* For mode constants */
#include <sys/wait.h>
#include <unistd.h>
#include <mqueue.h>
#include <string.h>

const char *Name = "/linux-sem-sample"; // 先頭に`/`をつける. `/`は1個だけ
#define BUFFER_SIZE (256)
#define PERMISSIONS 0666


void parent(void) {
    char buffer[BUFFER_SIZE];
    struct mq_attr attr;
    mqd_t mqd;

    attr.mq_flags = 0;
    attr.mq_maxmsg = 5;
    attr.mq_msgsize = BUFFER_SIZE;
    attr.mq_curmsgs = 0;

    if ((mqd = mq_open(Name, O_RDONLY | O_CREAT, PERMISSIONS, &attr)) == -1) {
        perror("mq_open failed.");
        exit(EXIT_FAILURE);
    }

    if (mq_receive(mqd, buffer, BUFFER_SIZE, NULL) == -1) {
        perror("Server: mq_receive");
        exit(1);
    } else {
        printf("Parent: mq_receive=%s\n", buffer);
    }
}

void child(void) {
    char buffer[BUFFER_SIZE];
    struct mq_attr attr;
    mqd_t mqd;

    attr.mq_flags = 0;
    attr.mq_maxmsg = 5;
    attr.mq_msgsize = BUFFER_SIZE;
    attr.mq_curmsgs = 0;

    if ((mqd = mq_open(Name, O_WRONLY | O_CREAT, PERMISSIONS, &attr)) == -1) {
        perror("mq_open failed.");
        exit(EXIT_FAILURE);
    }
    strcpy(buffer, Name);
    if (mq_send(mqd, Name, strlen(Name) + 1, 0) == -1) {
        perror("Child : mq_send failed.");
        exit(EXIT_FAILURE);
    }
    printf("msg_send %s\n", buffer);

    if (mq_close(mqd) == -1) {
        perror("mq_close failed.");
        exit(EXIT_FAILURE);
    }
    // 指定されたメッセージキュー name を削除する。 メッセージキュー名は直ちに削除される。 
    // キュー自体は、そのキューをオープンした他のすべてのプロセスが そのキューを参照する
    // 記述子をクローズした時点で破棄される。
    if (mq_unlink(Name) == -1) {
        perror("child: mq_unlink failed.");
        exit(EXIT_FAILURE);
    }
}

int main(int argc, char *argv[]) {
    pid_t pid;
    pid = fork();

    if (pid < 0) {
        perror("fork");
        exit(EXIT_FAILURE);
    }

    if (!pid) {
        child();
    } else {
        int status;
        parent();
        wait(&status);
    }

    return 0;
}
```

### 参考

- [Man page of MQ\_OVERVIEW](https://linuxjm.osdn.jp/html/LDP_man-pages/man7/mq_overview.7.html)
- [linux kernelの脆弱性( CVE-2017-11176 ) — | サイオスOSS | サイオステクノロジー - SIOS SECURITY BLOG](https://security.sios.jp/vulnerability/kernel-security-vulnerability-20170716/)

## 共有メモリ

[Shared Memory](SharedMemory.md)参照.

## その他

TODO: 解説・サンプルプログラム

### Signal

### 名前付きパイプ

#### 参考
- [Anonymous and Named Pipes in Linux | Baeldung on Linux](https://www.baeldung.com/linux/anonymous-named-pipes)
- [Introduction to Named Pipes | Linux Journal](https://www.linuxjournal.com/article/2156)
- [Named Pipe or FIFO with example C program - GeeksforGeeks](https://www.geeksforgeeks.org/named-pipe-fifo-example-c-program/)

### Read-Write Lock

同期プリミティブ(synchronization primitive)[^1]のひとつ。複数のスレッド・プロセスでリソースに対してreadは可能だが、writeは排他を行いたい場合に使う.

[^1]: 同期プリミティブとは複数のスレッドやプロセスによる同一のリソース（計算機資源）などへの同時アクセスによって、競合状態（レースコンディション）を起こす危険があるコード領域（クリティカルセクション）内の処理を排他制御・直列化するなどの目的で用いることのできる、基本的なメカニズム.

#### 参考
- [読み取り/書き込みロックの使用 - IBM Documentation](https://www.ibm.com/docs/ja/aix/7.1?topic=programming-using-read-write-locks)
- [【C言語】POSIXスレッドのRead-Write Lockの使い方](https://hiroyukichishiro.com/read-write-lock-in-c-language/)

### UNIXドメインソケット通信

UNIXドメインソケットとは、同じコンピュータ上で実行されている異なるプログラム（プロセス）間でデータを送受信するプロセス間通信（IPC）のひとつ.

#### 参考
- [C言語ソケット通信サンプル(UNIXドメイン) | 底辺プログラマーの戯言](https://www.mathkuro.com/c-cpp/c-unix-domain-socket-sample/)


