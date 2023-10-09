---
sidebar_position: 3
---
# Tracer

## Command

[ptrace(2) - Linux manual page](https://man7.org/linux/man-pages/man2/ptrace.2.html)システムコールを使って関数、システムコールをトレースします。

### strace

プログラムを起動ないし、attachしてシステムコール内容を出力するトレースコマンドです。

```shell
> strace ls
execve("/usr/bin/ls", ["ls"], 0x7ffdf5aeef70 /* 70 vars */) = 0
brk(NULL)                               = 0x55ca845d0000
arch_prctl(0x3001 /* ARCH_??? */, 0x7ffcd45b2ea0) = -1 EINVAL (無効な引数です)
mmap(NULL, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f186eeae000
access("/etc/ld.so.preload", R_OK)      = -1 ENOENT (そのようなファイルやディレクトリはありません)
openat(AT_FDCWD, "/etc/ld.so.cache", O_RDONLY|O_CLOEXEC) = 3
```
[strace/strace: strace is a diagnostic, debugging and instructional userspace utility for Linux](https://github.com/strace/strace)

### ltrace

共有ライブラリの関数呼び出しをトレースするコマンドです。

[dkogan/ltrace](https://github.com/dkogan/ltrace)

## ptraceによりプロセスの挙動を変更できる

`ptrace`によるトレースサンプル

1. まず親プロセスで fork を呼び出す。
2. 生成された子プロセスで PTRACE_TRACEME を行い
3. exec (3) を行なう。

上記のコードを下記に示す。

```c title="ptraceサンプル1 intel 64bit"
#include <stdio.h>
#include <sys/ptrace.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#ifdef __x86_64__
#include <x86_64-linux-gnu/sys/reg.h>
#else
#error "Not supported."
#endif

int main()
{
    pid_t child, r;
    int status = 0;
    long orig_rax;
    child = fork();
    if (child == 0)
    {
        ptrace(PTRACE_TRACEME, 0, NULL, NULL);
        execl("/bin/ls", "ls", NULL);
    }
    else
    {
        r = waitpid(child, &status, WUNTRACED);
        if (WIFEXITED(status))
        {
            printf("child exited, status=%d\n", WEXITSTATUS(status));
        }
        else if (WIFSIGNALED(status))
        {
            printf("child killed (signal %d)\n", WTERMSIG(status));
        }
        else if (WIFSTOPPED(status))
        {
            printf("child stopped (signal %d)\n", WSTOPSIG(status));

        }
        else
        {
            printf("Unexpected status (0x%x)\n", status);
        }
        orig_rax = ptrace(PTRACE_PEEKUSER,
                          child, 8 * ORIG_RAX,
                          NULL);
        // check unistd_64.h(unistd_32.h on 32bit)
        // #define __NR_execve 59
        printf("The child made a "
               "system call %ld\n",
               orig_rax);
        ptrace(PTRACE_CONT, child, NULL, NULL);
    }
    return 0;
}
```
TODO: PTRACE_ATTACH sample code

### 参考
Linux Journal:
- [Playing with ptrace, Part I | Linux Journal](https://www.linuxjournal.com/article/6100)
    - [Playing with ptrace, Part II | Linux Journal](https://www.linuxjournal.com/article/6210)
- [ptraceシステムコール入門 ― プロセスの出力を覗き見してみよう！ - プログラムモグモグ](https://itchyny.hatenablog.com/entry/2017/07/31/090000)

## LD_PRELOADとdlsym (interposition)

### LD_PRELOAD

> 追加でユーザが指定する ELF 共有ライブラリのリスト。指定されたライブラリは、すべてのライブラリより前にロードされる。リストの区切りはスペースとコロンである。他の共有ライブラリにある関数を選択的に置き換えるために用いることができる。指定されたライブラリは「説明」の節で述べたルールを基いて検索される。 set-user-ID/set-group-ID  された ELF  バイナリでは、スラッシュを含んだパス名のライブラリは無視され、標準の検索ディレクトリのライブラリはそのライブラリファイルの set-user-ID 許可ビットが有効になっている場合のみロードされる。<br/>
> [Ubuntu Manpage: ld.so, ld-linux.so\* - 動的なリンカ/ローダ](https://manpages.ubuntu.com/manpages/xenial/ja/man8/ld-linux.so.8.html)

### Interposition

以下は環境変数LD_PRELOADで指定した共有ライブラリで上書きする例で、`work`は`write()`で標準出力に文字列`hello`を表示するだけ。共有ライブラリは`write()`をフックして、前後に`init_hook`, `fini_hook`を表示させて、元の`write()`を実行する。

```shell
$ ./work
hello
$ LD_PRELOAD=./libinterposition.so ./work
init_hook: constructor called! 0x7f7f32c0d060
hello
fini_hook: destructor called!
```

上記のソースコード以下の通り。

```c title="interposition.c"
#define  _GNU_SOURCE
#include <unistd.h>
#include <dlfcn.h>

ssize_t (*org)(int fd, const void *buf, size_t count) = 0;

__attribute__((constructor))
static void init_hook()
{
	org = (ssize_t(*)(int, const void *, size_t))dlsym(RTLD_NEXT, "write");
	printf("%s: constructor called! %p\n", __func__, org);
}

__attribute__((destructor))
static void fini_hook()
{
	printf("%s: destructor called!\n", __func__);
}
```

```c title="main.c"
#include <unistd.h>

int main(int argc, char *argv[])
{
    const char msg[] = "hello\n";
    write(1 /*stdout */ , msg, sizeof(msg));
    return 0;
}
```

:::note

gccでは`__attribute__`キーワードを使って関数に属性を付与できる。

> constructor / destructor

> The constructor attribute causes the function to be called automatically before execution enters main (). Similarly, the destructor attribute causes the function to be called automatically after main () has completed or exit () has been called. Functions with these attributes are useful for initializing data that will be used implicitly during the execution of the program.

- [Function Attributes - Using the GNU Compiler Collection (GCC)](https://gcc.gnu.org/onlinedocs/gcc-4.1.2/gcc/Function-Attributes.html)
- [Attribute Syntax - Using the GNU Compiler Collection (GCC)](https://gcc.gnu.org/onlinedocs/gcc-4.1.2/gcc/Attribute-Syntax.html#Attribute-Syntax)
:::

## Instrument functions

gccで`-finstrument-functions`[^1]のオプションをつけてコンパイルされると、ユーザ定義の規定関数を関数の入口・出口でコールされるようになる。具体的には、`__cyg_profile_func_enter`が関数の入口でコールされ、`__cyg_profile_func_exit`が関数の出口でコールされる。これを利用することで関数のコール回数や、トレースを行うようにできる。

[^1]:[Instrumentation Options (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html#index-finstrument-functions)

```c title="ユーザ定義のプロファイル関数"
#include <stdio.h>

void __cyg_profile_func_enter(void *this_fn,
                              void *call_site)
// highlight-next
    __attribute__((no_instrument_function));
void __cyg_profile_func_exit(void *this_fn,
                             void *call_site)
// highlight-next
    __attribute__((no_instrument_function));

void __cyg_profile_func_enter(void *addr, void *callsite)
{
    printf("enter %p %p\n", addr, callsite);
}

void __cyg_profile_func_exit(void *addr, void *callsite)
{
    printf("exit %p %p\n", addr, callsite);
}
```

:::note
関数に`no_instrument_function`属性を付与することで、プロファイル対象外の関数であることを宣言できる。すなわち、対象の関数の入口・出口ではプロファイル関数はコールされない。
:::
## eBPF

https://tech.tier4.jp/entry/2021/03/10/160000

## Live patching user space process

[SLES 15 SP4 | Administration Guide | User space live patching](https://documentation.suse.com/sles/15-SP4/html/SLES-all/cha-ulp.html)


https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=http://www.egr.unlv.edu/~ed/assembly64.pdf&ved=2ahUKEwjW5ICCl7CBAxXTlFYBHYcJDeg4ChAWegQIEBAB&usg=AOvVaw1MbTXudiVAokpNA6cM-7iu

[assembly64.pdf](http://www.egr.unlv.edu/~ed/assembly64.pdf)

[ida - Patching branch on assembly code - Reverse Engineering Stack Exchange](https://reverseengineering.stackexchange.com/questions/17734/patching-branch-on-assembly-code)

[SUSE/libpulp: libpulp enables live patching in user space applications.](https://github.com/SUSE/libpulp)

[2021-08-05-libpulp.pdf](https://www.pdxlinux.org/2021-08-05-libpulp.pdf)

[livepatch - Live Patching for Linux](http://ukai.jp/Software/livepatch/)

[ptraceシステムコール入門 ― プロセスの出力を覗き見してみよう！ - プログラムモグモグ](https://itchyny.hatenablog.com/entry/2017/07/31/090000)

[Visual Studio CodeでRust開発環境を整える - Qiita](https://qiita.com/84zume/items/377033ab6b6aee2a68d7)

[Linux上でのSharedLibraryへのHookをして既存のバイナリの挙動に割り込む - Qiita](https://qiita.com/recuraki/items/9b02508d4e547e2c0e52)

[Linux Kernel Module Rootkit — Syscall Table Hijacking | by GoldenOak | InfoSec Write-ups](https://infosecwriteups.com/linux-kernel-module-rootkit-syscall-table-hijacking-8f1bc0bd099c)

[Hooking Linux Kernel Functions, Part 1: Looking for the Perfect Solution | Apriorit](https://www.apriorit.com/dev-blog/544-hooking-linux-functions-1)

[Hooking Linux Kernel Functions, Part 2: How to Hook Functions with Ftrace | Apriorit](https://www.apriorit.com/dev-blog/546-hooking-linux-functions-2)

[seccomp – Alfonso Sánchez-Beato's blog](https://www.alfonsobeato.net/tag/seccomp/)

[c - Linux Kernel: System call hooking example - Stack Overflow](https://stackoverflow.com/questions/2103315/linux-kernel-system-call-hooking-example)

