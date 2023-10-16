---
sidebar_position: 3
---
# Tracer

## Command

[ptrace(2) - Linux manual page](https://man7.org/linux/man-pages/man2/ptrace.2.html)システムコールを使って関数、システムコールをトレースします.

`ptrace()`はSELinux, Redhatでは以下コマンドで無効化できる。`Permission denied`で実行が拒否される.

```shell
setsebool -P deny_ptrace on
```

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

共有ライブラリの関数呼び出しをトレースするコマンドです。ltrace は PLT に仕掛けを行うことで、関数呼び出しのトレースを実現している。最近の実行ファイルはPLT[^1]を使っていないので何も表示されない。表示するためには`-z lazy`オプション[^2]でリンクする必要がある。

[^1]:動的リンカーが再配置処理をPLTとGOTを用いる。
[^2]:Mark object lazy runtime binding

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

上記は、プロセスを`exec`したが、プロセスIDで実行中のプロセスに対しても`ptrace`を`PTRACE_ATTACH`でトレースし、最後に`PTRACE_DETACH`でトレース終了することができる.また`PTRACE_SINGLESTEP`でデバッガのステップ実行のようなトレースもできる.

[^single]: [ptraceを使ってみよう！ - バイナリの歩き方](https://07c00.hatenablog.com/entry/2013/08/31/142001)

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

## Seccomp

- [kernel.org/doc/Documentation/prctl/seccomp\_filter.txt](https://www.kernel.org/doc/Documentation/prctl/seccomp_filter.txt)

- [Seccomp BPF (SECure COMPuting with filters) — The Linux Kernel documentation](https://www.kernel.org/doc/html/v4.19/userspace-api/seccomp_filter.html?highlight=seccomp)
- [seccomp/libseccomp: The main libseccomp repository](https://github.com/seccomp/libseccomp)
- [Introduction to Seccomp - Speaker Deck](https://speakerdeck.com/mrtc0/introduction-to-seccomp)
- [seccomp – Alfonso Sánchez-Beato's blog](https://www.alfonsobeato.net/tag/seccomp/)

>        SCMP_ACT_TRACE(uint16_t msg_num)
> If the thread is being traced and the tracing process specified the PTRACE_O_TRACESECCOMP option in the call to ptrace(2), the tracing process will be notified, via PTRACE_EVENT_SECCOMP, and the value provided in msg_num can be retrieved using the PTRACE_GETEVENTMSG option.
>
> [seccomp\_init(3) - Linux manual page](https://man7.org/linux/man-pages/man3/seccomp_init.3.html)

## Live patching user space process

- [SLES 15 SP4 | Administration Guide | User space live patching](https://documentation.suse.com/sles/15-SP4/html/SLES-all/cha-ulp.html)
- [SUSE/libpulp: libpulp enables live patching in user space applications.](https://github.com/SUSE/libpulp)
- [2021-08-05-libpulp.pdf](https://www.pdxlinux.org/2021-08-05-libpulp.pdf)
- [livepatch - Live Patching for Linux](http://ukai.jp/Software/livepatch/)

## Misc

- [Redirecting functions in shared ELF libraries - CodeProject](https://www.codeproject.com/Articles/70302/Redirecting-functions-in-shared-ELF-libraries)
    - [shoumikhin/ELF-Hook at 8aba5856357475130bd50ef550ee8baf2025db8c](https://github.com/shoumikhin/ELF-Hook/tree/8aba5856357475130bd50ef550ee8baf2025db8c)
- [kubo/plthook: Hook function calls by replacing PLT(Procedure Linkage Table) entries.](https://github.com/kubo/plthook)
- [kubo/funchook: Hook function calls by inserting jump instructions at runtime](https://github.com/kubo/funchook)
- [GNU poke](http://www.jemarch.net/poke.html)
- [kubo/injector: Library for injecting a shared library into a Linux or Windows process](https://github.com/kubo/injector)
- [lief-project/LIEF: LIEF - Library to Instrument Executable Formats](https://github.com/lief-project/LIEF)

## Reference

- [Linux上でのSharedLibraryへのHookをして既存のバイナリの挙動に割り込む - Qiita](https://qiita.com/recuraki/items/9b02508d4e547e2c0e52)
- [Linux Kernel Module Rootkit — Syscall Table Hijacking | by GoldenOak | InfoSec Write-ups](https://infosecwriteups.com/linux-kernel-module-rootkit-syscall-table-hijacking-8f1bc0bd099c)
- [Hooking Linux Kernel Functions, Part 1: Looking for the Perfect Solution | Apriorit](https://www.apriorit.com/dev-blog/544-hooking-linux-functions-1)
    - [Hooking Linux Kernel Functions, Part 2: How to Hook Functions with Ftrace | Apriorit](https://www.apriorit.com/dev-blog/546-hooking-linux-functions-2)
        - [Playing with ptrace (64-bit), Part I – Innovative Innocation](https://hoymkot.wordpress.com/2020/03/14/playing-with-ptrace-64-bit-part-i/)
- [seccomp – Alfonso Sánchez-Beato's blog](https://www.alfonsobeato.net/tag/seccomp/)
- [c - Linux Kernel: System call hooking example - Stack Overflow](https://stackoverflow.com/questions/2103315/linux-kernel-system-call-hooking-example)
- [ptraceシステムコール入門 ― プロセスの出力を覗き見してみよう！ - プログラムモグモグ](https://itchyny.hatenablog.com/entry/2017/07/31/090000)
- [LinuxカーネルのコアであるeBPFを実装したSysdigとFalco – Sysdig](https://sysdig.jp/blog/sysdig-and-falco-now-powered-by-ebpf/)
- [Intercepting and Emulating Linux System Calls with Ptrace](https://nullprogram.com/blog/2018/06/23/)
- [簡易 strace を作ってシステムコールを表示する](https://blog.ssrf.in/post/follow-system-call-with-ptrace/)
- [linux - No output when running ltrace - Stack Overflow](https://stackoverflow.com/questions/43213505/no-output-when-running-ltrace)
https://askubuntu.com/questions/201303/what-is-a-defunct-process-and-why-doesnt-it-get-killed
- [Roberto Jordaney, personal blog - Hooking Shared Library](https://rjordaney.is/lectures/hooking_shared_lib/)
- [c - Hook and Replace Export Function in the Loaded ELF ( .so shared library ) - Stack Overflow](https://stackoverflow.com/questions/29648919/hook-and-replace-export-function-in-the-loaded-elf-so-shared-library)
- [dbhi/binhook: A survey of techniques to hook and/or replace functions in executable binaries or shared libraries](https://github.com/dbhi/binhook)
- [デバッガを自作してみよう](https://zenn.dev/irugo/articles/49b3f66efaddf6)
- [Intercepting and Emulating Linux System Calls with Ptrace](https://nullprogram.com/blog/2018/06/23/)
    - [skeeto/ptrace-examples: Examples for Linux ptrace(2)](https://github.com/skeeto/ptrace-examples)
- [Code injection in running process using ptrace | by shashank Jain | Medium](https://medium.com/@jain.sm/code-injection-in-running-process-using-ptrace-d3ea7191a4be)
- [gaffe23/linux-inject: Tool for injecting a shared object into a Linux process](https://github.com/gaffe23/linux-inject/tree/master)
    - [linux-inject/slides\_BHArsenal2015.pdf at master · gaffe23/linux-inject](https://github.com/gaffe23/linux-inject/blob/master/slides_BHArsenal2015.pdf)
- [Google Code Archive - Long-term storage for Google Code Project Hosting.](https://code.google.com/archive/p/ptrace-tools/)

## Trap

- __builtin_debugtrap for some versions of clang (identified with __has_builtin(__builtin_debugtrap))
    On MSVC and Intel C/C++ Compiler: __debugbreak
- For ARM C/C++ Compiler: __breakpoint(42)
- For x86/x86_64, assembly: int3
- For ARM Thumb, assembly: .inst 0xde01
- For ARM AArch64, assembly: .inst 0xd4200000
- For other ARM, assembly: .inst 0xe7f001f0
- For Alpha, assembly: bpt
- For non-hosted C with GCC (or something which masquerades as it), __builtin_trap
- Otherwise, include signal.h and
    - If defined(SIGTRAP) (i.e., POSIX), raise(SIGTRAP)
    - Otherwise, raise(SIGABRT)
- raise(SIGTRAP);

> [c++ - Is there a portable equivalent to DebugBreak()/\_\_debugbreak? - Stack Overflow](https://stackoverflow.com/questions/173618/is-there-a-portable-equivalent-to-debugbreak-debugbreak)

- [kmcallister/embedded-breakpoints: Embed GDB breakpoints in C source code](https://github.com/kmcallister/embedded-breakpoints)