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

### ltrace

共有ライブラリの関数呼び出しをトレースするコマンドです。

## [Gcc/Clang Program Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html#index-finstrument-functions)

`-finstrument-functions`オプションを使ってコンパイルすることで、関数のEnter(__cyg_profile_func_enter)/Exit(__cyg_profile_func_exit)時にユーザ定義の関数をコールする。

```
void __cyg_profile_func_enter (void *this_fn,
                               void *call_site);
void __cyg_profile_func_exit  (void *this_fn,
                               void *call_site);
```

## ptraceによりプロセスの挙動を変更できる

[ptraceシステムコール入門 ― プロセスの出力を覗き見してみよう！ - プログラムモグモグ](https://itchyny.hatenablog.com/entry/2017/07/31/090000)

## LD_PRELOADとdlsym (interposition)

### LD_PRELOAD

manページによると
[ld.so(8) - Linux manual page](https://man7.org/linux/man-pages/man8/ld.so.8.html)

```
       LD_PRELOAD
              A list of additional, user-specified, ELF shared objects
              to be loaded before all others.  This feature can be used
              to selectively override functions in other shared objects.

              The items of the list can be separated by spaces or
              colons, and there is no support for escaping either
              separator.  The objects are searched for using the rules
              given under DESCRIPTION.  Objects are searched for and
              added to the link map in the left-to-right order specified
              in the list.

              In secure-execution mode, preload pathnames containing
              slashes are ignored.  Furthermore, shared objects are
              preloaded only from the standard search directories and
              only if they have set-user-ID mode bit enabled (which is
              not typical).

              Within the names specified in the LD_PRELOAD list, the
              dynamic linker understands the tokens $ORIGIN, $LIB, and
              $PLATFORM (or the versions using curly braces around the
              names) as described above in Dynamic string tokens.  (See
              also the discussion of quoting under the description of
              LD_LIBRARY_PATH.)

              There are various methods of specifying libraries to be
              preloaded, and these are handled in the following order:

              (1)  The LD_PRELOAD environment variable.

              (2)  The --preload command-line option when invoking the
                   dynamic linker directly.

              (3)  The /etc/ld.so.preload file (described below).
```

LD_PRELOADとは、/lib/ld-linux.so.2 の動作を制御する環境変数の一つであり、環境変数LD_PRELOADに共有オブジェクトを指定して実行することによって先にLD_PRELOADで指定した共有オブジェクトがリンクされます。

したがって、その共有オブジェクトに同名の関数を定義しておくことによって、元の共有ライブラリに定義されている関数の代わりにLD_PRELOADで指定した共有オブジェクトの関数を実行させることが可能になります。

さて、今回実現したいのは「特定の関数の開始時にフックして、ある処理を挟む」ことなので、LD_PRELOADで置き換えた関数の実行後に元の関数に処理を戻します。これを実現する方法はいくつかありますが、一番簡単な方法はRTLD_NEXTハンドルを引数に指定して、dlsym(3)を呼びだすことです (LD_PRELOADで置き換えた後の関数内でその関数を呼び出しても、置き換えた後の関数を再帰的に呼びだすだけなので無限ループしてしまいます)。

RTLD_NEXTハンドルとはGNU拡張による特殊なハンドルであり、現在の共有オブジェクトの次の共有オブジェクト以降で発見されるシンボルの値を取ってきます。つまり今回の場合では、LD_PRELOADで置き換える前の本来の共有ライブラリにて定義されている関数のシンボルを取ってくることができます。ちなみにRTLD_NEXTハンドルを利用するためには、GNU拡張を有効にするためにdlfcn.h をincludeする前に #define _GNU_SOURCE する必要があります。

環境変数のLD_PRELOADの共有ライブラリで関数を上書きできます。


           void *handle;
           int (*fptr)(int), *iptr, result;
           /* open the needed symbol table */
           handle = dlopen("/usr/home/me/libfoo.so", RTLD_LOCAL | RTLD_LAZY);
           /* find the address of the function my_function */
           fptr = (int (*)(int))dlsym(handle, "my_function");
           /* find the address of the data object my_object */
           iptr = (int *)dlsym(handle, "my_OBJ");
           /* invoke my_function, passing the value of my_OBJ as the parameter */
           result = (*fptr)(*iptr);
APPLICATION USAGE         top
       The following special purpose values for handle are reserved for
       future use and have the indicated meanings:

       RTLD_DEFAULT
                   The identifier lookup happens in the normal global
                   scope; that is, a search for an identifier using
                   handle would find the same definition as a direct use
                   of this identifier in the program code.

       RTLD_NEXT   Specifies the next executable object file after this
                   one that defines name.  This one refers to the
                   executable object file containing the invocation of
                   dlsym().  The next executable object file is the one
                   found upon the application of a load order symbol
                   resolution algorithm (see dlopen()).  The next symbol
                   is either one of global scope (because it was
                   introduced as part of the original process image or
                   because it was added with a dlopen() operation
                   including the RTLD_GLOBAL flag), or is in an
                   executable object file that was included in the same
                   dlopen() operation that loaded this one.


```c title="interposition.c"
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

ssize_t write(int fd, const void *buf, size_t count)
{
	int ret;

	/*
	 * Do what you like to do here
	 */ 
	printf("%s: hook!\n", __func__);
	ret = (int)org(fd, buf, count);
	/*
	 * Do what you like to do here
	 */
    return ret;

}

```

``` title="main.c"
main(int argc, char *argv[])
{
    write(1 /*stdout */ , "hello¥n");
}
```

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