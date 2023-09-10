# Tracer

## Command

[ptrace(2) - Linux manual page](https://man7.org/linux/man-pages/man2/ptrace.2.html)システムコールを使って関数、システムコールをトレースします。

### strace

プログラムを起動ないし、attachしてシステムコール内容を出力します。

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