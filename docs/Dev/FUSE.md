# FUSE

- [libfuse/libfuse: The reference implementation of the Linux FUSE (Filesystem in Userspace) interface](https://github.com/libfuse/libfuse)
    - [libfuse: libfuse API documentation](http://libfuse.github.io/doxygen/)
    - [Release libfuse 3.16.1 · libfuse/libfuse](https://github.com/libfuse/libfuse/releases/tag/fuse-3.16.1)

> FUSE (Filesystem in Userspace) は、ユーザー空間プログラムが Linux カーネルにファイルシステムをエクスポートするためのインターフェースです。FUSE プロジェクトは、fuse カーネル・モジュール（通常のカーネル・レポジトリで管理）と libfuse ユーザ空間ライブラリ（このリポジトリで管理）の 2 つのコンポーネントから構成されています。libfuse は、FUSE カーネル・モジュールと通信するためのリファレンス実装を提供します。
>
> − [Libfuse About](https://github.com/libfuse/libfuse#about)

## 使用条件

```doc title="Kernel Config:Linux Kernel設定が必要"
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

## Sample App
TODO : libfuse3での動作確認

```c title="app.c"
#include <stdio.h>
#include <string.h>
#include "appFS.h"


void resource1(char **contents, size_t*length)
{
    static char buf[MAX_LEN];
    static int counter = 0;

    printf("getter %d\n", counter);
    snprintf(buf, MAX_LEN-1, "%d\n", counter);
    counter++;

    *contents = buf;
    *length = strlen(buf);
}

int main(int argc, char *argv[])
{
    PUBLISHING_FILE file;

    // Setup publishing files
    file.getter = resource1;
    strcpy(file.path, "/file1");
    file.stat.st_mode = S_IFREG | 0777;
    file.stat.st_nlink = 1;
    file.stat.st_uid = getuid();
    file.stat.st_gid = getgid();
    add_publish_resource(&file);

    strcpy(file.path, "/debug/counter");
    add_publish_resource(&file);
    for (;;) {
        sleep(5);
    }

    return 0;
}
```

```c title="appFS.c"
#define FUSE_USE_VERSION 26 // FUSEのバージョンでAPIの相違があるため、APIバージョンを指定

#include <fuse.h>
#include <fuse/fuse_lowlevel.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <unistd.h> 
#include <pthread.h>

#include <libgen.h> // for basename
#include <fnmatch.h> // for fnmatche

#include <signal.h>


#include "appFS.h"


typedef struct _appFS {
    char mount_point[PATH_MAX];
    int numOfFiles;
    PUBLISHING_FILE files[FILE_MAX];
    pthread_mutex_t mutex;
} APP_FS;

static APP_FS appFS;


int indexOfFiles(const char *path)
{
    int i;
    int index = -1;

    pthread_mutex_lock(&appFS.mutex);

    for (i = 0; i < appFS.numOfFiles; i++) {
        if (!strcmp(path, appFS.files[i].path)) {
            printf("indexOfFiles: %s %s\n", path, appFS.files[i].path);
            index = i;
        }
        printf("!indexOfFiles: %s %s %d\n", path, appFS.files[i].path, appFS.numOfFiles);
    }
    printf("indexOfFiles: missing.\n");

    pthread_mutex_unlock(&appFS.mutex);
    return index;
}

static int getattr_callback(const char *path, struct stat *stbuf) {
    int index;

    memset(stbuf, 0, sizeof(struct stat));
    printf("attr read %s\n", path);

    if ((index = indexOfFiles(path)) == -1) {
        return -ENOENT;
    } else {
        pthread_mutex_lock(&appFS.mutex);
        memcpy(stbuf, &appFS.files[index].stat, sizeof (struct stat));
        pthread_mutex_unlock(&appFS.mutex);
    }
    return 0;
}

static int readdir_callback(const char *path, void *buf, fuse_fill_dir_t filler, off_t offset, struct fuse_file_info *fi) {
    int index;

    printf("readdir %s\n", path);
    filler(buf, ".", NULL, 0);
    filler(buf, "..", NULL, 0);

    pthread_mutex_lock(&appFS.mutex);
    for (index = 0; index < appFS.numOfFiles; index++) {
        char tmp_buf[PATH_MAX] = {0};
        strcpy(tmp_buf, path);
        if (tmp_buf[strlen(tmp_buf)-1] == '/') {
            strcat(tmp_buf, "?*");
        } else {
            strcat(tmp_buf, "/?*");
        }

        if (fnmatch(tmp_buf, appFS.files[index].path, FNM_PATHNAME) != 0) {
            printf("ignore file %s %s\n", tmp_buf, appFS.files[index].path);
            continue;
        }
        printf("readdir: %s\n", basename(appFS.files[index].path));
        filler(buf, basename(appFS.files[index].path), NULL, 0);
    }
    pthread_mutex_unlock(&appFS.mutex);

    return 0;
}

static int open_callback(const char *path, struct fuse_file_info *fi) {
    int index;

    if ((index = indexOfFiles(path)) == -1) {
        return -ENOENT;
    }
    printf("open %s\n", path);
    return 0;
}

static int read_callback(const char *path, char *buf, size_t size, off_t offset, struct fuse_file_info *fi) {
    int index;
    char *contents;

    if ((index = indexOfFiles(path)) == -1) {
        return -ENOENT;
    }

    printf("read %s\n", path);
    size_t len;
    
    pthread_mutex_lock(&appFS.mutex);
    (appFS.files[index].getter)(&contents, &len);
    pthread_mutex_unlock(&appFS.mutex);
    // 読み込み開始位置がファイルの長さを超えていないかチェック
    if (offset >= len) {
        return 0;
    }

    // ファイルの長さよりバッファサイズが大きければファイルの終わりまでの長さにする
    if (offset + size > len) {
        size = (len - offset);
    }

    memcpy(buf, contents + offset, size);
    return size;
}

#ifdef USE_LOW_LEVEL_API
static struct fuse_lowlevel_ops fuse_appfs_operations = {
    .getattr = getattr_callback,
    .open = open_callback,
    .read = read_callback,
    .readdir = readdir_callback,
};
#else
static struct fuse_operations fuse_appfs_operations = {
    .getattr = getattr_callback,
    .open = open_callback,
    .read = read_callback,
    .readdir = readdir_callback,
};
#endif


void *appFSmainThread(void* arg)
{
    int argc = 6;
    char *argv[] = {"hoge", "-o", "auto_unmount", "-s", "-f", appFS.mount_point};
#ifdef USE_LOW_LEVEL_API
    struct fuse_args args = FUSE_ARGS_INIT(argc, argv);
    struct fuse_chan *ch;
    char *mountpoint = NULL;
    int err = -1;

    if (fuse_parse_cmdline(&args, &mountpoint, NULL, NULL) != -1 &&
        (ch = fuse_mount(mountpoint, &args)) != NULL) {
        struct fuse_session *se;
        
        se = fuse_lowlevel_new(&args, &fuse_appfs_operations,
                               sizeof(fuse_appfs_operations), NULL);
        if (se != NULL) {
            if (fuse_set_signal_handlers(se) != -1) {
                fuse_session_add_chan(se, ch);
                err = fuse_session_loop(se);
                fuse_remove_signal_handlers(se);
                fuse_session_remove_chan(ch);
            }
            fuse_session_destroy(se);
        }
        fuse_unmount(mountpoint, ch);
    }
    fuse_opt_free_args(&args);
#else
    fuse_main(argc, argv, &fuse_appfs_operations, NULL);
#endif
    return (void *)NULL;
}

void appFS_signal_handler(int sig, siginfo_t *info, void *ctx)
{
    exit(0);
}


__attribute__((constructor)) void appFSmain() 
{
    pthread_t appfs;
    struct sigaction sa_sig;

    printf("constructor\n");

    appFS.numOfFiles = 0;
    strncpy(appFS.mount_point, DEFAULT_MOUNT_POINT, FILE_MAX);

    strcpy(appFS.files[appFS.numOfFiles].path, "/");
    appFS.files[appFS.numOfFiles].stat.st_mode = S_IFDIR | 0755;
    appFS.files[appFS.numOfFiles].stat.st_nlink = 2;
    appFS.files[appFS.numOfFiles].stat.st_uid = getuid();
    appFS.files[appFS.numOfFiles].stat.st_gid = getgid();
    appFS.numOfFiles++;

    strcpy(appFS.files[appFS.numOfFiles].path, "/debug");
    appFS.files[appFS.numOfFiles].stat.st_mode = S_IFDIR | 0755;
    appFS.files[appFS.numOfFiles].stat.st_nlink = 2;
    appFS.files[appFS.numOfFiles].stat.st_uid = getuid();
    appFS.files[appFS.numOfFiles].stat.st_gid = getgid();
    appFS.numOfFiles++;

    pthread_mutex_init(&appFS.mutex, NULL);

    memset(&sa_sig, 0, sizeof(sa_sig));
    sa_sig.sa_sigaction = appFS_signal_handler;
    sa_sig.sa_flags = SA_SIGINFO;

    if (sigaction(SIGINT, &sa_sig, NULL) < 0)
    {
    }

    // Run fuse
#if 1
    pthread_create(&appfs, NULL, appFSmainThread, NULL);
#else
    appFSmainThread();
#endif

}

int add_publish_resource(PUBLISHING_FILE *file)
{
    pthread_mutex_lock(&appFS.mutex);
    memcpy(&appFS.files[appFS.numOfFiles], file, sizeof(PUBLISHING_FILE));
    appFS.numOfFiles++;
    pthread_mutex_unlock(&appFS.mutex);
    return 0;
}


#ifndef MAKE_SHARED
int main(int argc, char *argv[])
{
    PUBLISHING_FILE file;

    // Setup publishing files
    file.getter = resource1;
    strcpy(file.path, "/file1");
    file.stat.st_mode = S_IFREG | 0777;
    file.stat.st_nlink = 1;
    file.stat.st_uid = getuid();
    file.stat.st_gid = getgid();
    add_publish_resource(&file);

    strcpy(file.path, "/debug/counter");
    add_publish_resource(&file);
    for (;;) {
        sleep(5);
    }

    return 0;
}
#endif
```

```c title="appFS.h"
#ifndef _APPFS_H_
#define _APPFS_H_

#include <stddef.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/types.h>
#include <limits.h> // for PATH_MAX

#ifdef __cplusplus
extern "C"
{
#endif

#define FILE_MAX		(100)
#define MAX_LEN			(100)

#define DEFAULT_MOUNT_POINT	"/tmp/ex37"
typedef void (*appFsGetter)(char **, size_t *);
typedef void (*appFsSetter)(const char *, size_t);

typedef struct _file {
    appFsGetter getter;
    appFsSetter setter;
    struct stat stat;
    char path[PATH_MAX];
} PUBLISHING_FILE;

int add_publish_resource(PUBLISHING_FILE *);
    
#ifdef __cplusplus
};
#endif
    
#endif
```

```c title="appFS_dummy.c"
#include "appFS.h"

int add_publish_resource(PUBLISHING_FILE *file)
{
}
```

```python title="meson.build"
project('cpputest', 'c', 'cpp')

c_compile_options = ['-g', '-Wall', '-DMAKE_SHARED']
#c_compile_options = ['-g', '-Wall', '-DUSE_LOW_LEVEL_API']

cc = meson.get_compiler('c')

#lib_fuse = cc.find_library('fuse', required: true)
lib_fuse = dependency('fuse')
lib_pthread = cc.find_library('pthread', required: true)



executable('inotify_test', 
                 ['inotify_test.cpp'])

appFS_slib = shared_library(
  'appFS',
  ['appFS.c'],
#  include_directories: includes,
  c_args: c_compile_options,
#  link_args: c_link_options,
  dependencies: [lib_fuse, lib_pthread],
  install: false,
)


appFS_lib = static_library(
  'appFS',
  ['appFS.c'],
#  include_directories: includes,
  c_args: c_compile_options,
#  link_args: c_link_options,
  dependencies: [lib_fuse, lib_pthread],
  install: false,
)


appFS_slib_dummy = shared_library(
  'appFS_dummy',
  ['appFS_dummy.c'],
  c_args: c_compile_options,
  install: false,
)

executable('appFS_sample1',
                 ['app.c'],
                 link_with: [appFS_lib],
                 c_args: c_compile_options)

executable('appFS_sample2',
                 ['app.c'],
                 link_with: [appFS_slib_dummy],
                 c_args: c_compile_options)

```

## 参考文献

- [Filesystem in Userspace (FUSE) のカーネルとデーモン間の通信 - Qiita](https://qiita.com/tkusumi/items/6dc204ba964264c72a9a)