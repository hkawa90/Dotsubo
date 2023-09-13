# Tracer

## Command

[ptrace(2) - Linux manual page](https://man7.org/linux/man-pages/man2/ptrace.2.html)システムコールを使って関数、システムコールをトレースします。

### strace

プログラムを起動ないし、attachしてシステムコール内容を出力するコマンドです。

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

## [Gcc/Clang Program Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html#index-finstrument-functions)

`-finstrument-functions`オプションを使ってコンパイルすることで、関数のEnter(__cyg_profile_func_enter)/Exit(__cyg_profile_func_exit)時にユーザ定義の関数をコールする。

```
void __cyg_profile_func_enter (void *this_fn,
                               void *call_site);
void __cyg_profile_func_exit  (void *this_fn,
                               void *call_site);
```

## ptraceによりプロセスの挙動を変更できる

## LD_PRELOAD

## dlsym (interposition)

```
 void *handle = dlsym(RTLD_NEXT, "puts");
```

```c
#include    <sys/types.h>
#include    <dlfcn.h>
#include    <stdio.h>
 
void *
malloc(size_t size)
{
        static void * (* fptr)() = 0;
        char             buffer[50];
 
        if (fptr == 0) {
                fptr = (void * (*)())dlsym(RTLD_NEXT, "malloc");
                if (fptr == NULL) {
                        (void) printf("dlopen: %s\n", dlerror());
                        return (0);
                }
        }
 
        (void) sprintf(buffer, "malloc: %#x bytes\n", size);
        (void) write(1, buffer, strlen(buffer));
        return ((*fptr)(size));
}
```