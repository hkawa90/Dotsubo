# Meson

- [The Meson Build system](https://mesonbuild.com/)
    - [mesonbuild/meson: The Meson Build System](https://github.com/mesonbuild/meson)

## Mesonとは

Makeの代替.メタビルドシステムとも呼ばれるらしい。バックエンドにninjaを選択した場合は以下の流れとなる。まずはソースツリーにmeson.buidファイル(makefileのようなもの)を作成する。C/C++ではユニットテスト、カバレッジ測定を簡単に連携できる。

## 用意するもの

- Python3
- Gccなど
- [Ninja, a small build system with a focus on speed](https://ninja-build.org/)
    - [Ccache — Compiler cache](https://ccache.dev/)[^1]

[^1]:[ccache でビルド高速化。と設定のポイント - Qiita](https://qiita.com/naohikowatanabe/items/a6cb8745737481b103e3)

## Install

pipかaptでインストールできる。

```shell
sudo apt-get -y install meson
```

## 使い方

`meson.build`ファイルに必要な記述を行い、mesonコマンドで実行していく。

### meson.build テンプレートからの作成

```shell title="テンプレート作成"
mkdir my-project
cd my-project
meson init --type executable
Using "my-project" (name of current directory) as project name.
Using "my-project" (project name) as name of executable to build.
Defaulting to generating a C language project.
Sample project created. To build it run the
following commands:

meson setup builddir
meson compile -C builddir
ls
meson.build  my_project.c
```

```shell title="initコマンド"
usage: meson init [-h] [-C WD] [-n NAME] [-e EXECUTABLE] [-d DEPS]
                  [-l {c,cpp,cs,cuda,d,fortran,java,objc,objcpp,rust,vala}] [-b]
                  [--builddir BUILDDIR] [-f] [--type {executable,library}] [--version VERSION]
                  [sourcefile [sourcefile ...]]

positional arguments:
  sourcefile                                      source files. default: all recognized files in
                                                  current directory

optional arguments:
  -h, --help                                      show this help message and exit
  -C WD                                           directory to cd into before running
  -n NAME, --name NAME                            project name. default: name of current directory
  -e EXECUTABLE, --executable EXECUTABLE          executable name. default: project name
  -d DEPS, --deps DEPS                            dependencies, comma-separated
  -l {c,cpp,cs,cuda,d,fortran,java,objc,objcpp,rust,vala}, --language {c,cpp,cs,cuda,d,fortran,java,objc,objcpp,rust,vala}
                                                  project language. default: autodetected based on
                                                  source files
  -b, --build                                     build after generation
  --builddir BUILDDIR                             directory for build
  -f, --force                                     force overwrite of existing files and directories.
  --type {executable,library}                     project type. default: executable based project
  --version VERSION                               project version. default: 0.1
```

meson.buildとテンプレートソースプログラムの作成を行う。作成される`meson.build`は以下の通り.

```meson title="initコマンドで生成されたmeson.build"
project('my-project', 'c',
  version : '0.1',
  default_options : ['warning_level=3'])

exe = executable('my_project', 'my_project.c',
  install : true)

test('basic', exe)
```

その後は下記コマンドでbuilddirディレクトリにビルド用ファイル作成とビルドをninjaで実行する。

```shell
meson setup builddir
meson compile -C builddir
```

なお、`type`に`library`を選択した場合の`meson.build`は以下の通り.

```meson
project('my-lib', 'c',
  version : '0.1',
  default_options : ['warning_level=3'])

# These arguments are only used to build the shared library
# not the executables that use the library.
lib_args = ['-DBUILDING_MY_LIB']

shlib = shared_library('my_lib', 'my_lib.c',
  install : true,
  c_args : lib_args,
  gnu_symbol_visibility : 'hidden',
)

test_exe = executable('my_lib_test', 'my_lib_test.c',
  link_with : shlib)
test('my_lib', test_exe)

# Make this library usable as a Meson subproject.
my_lib_dep = declare_dependency(
  include_directories: include_directories('.'),
  link_with : shlib)

# Make this library usable from the system's
# package manager.
install_headers('my_lib.h', subdir : 'my_lib')

pkg_mod = import('pkgconfig')
pkg_mod.generate(
  name : 'my-lib',
  filebase : 'my_lib',
  description : 'Meson sample project.',
  subdirs : 'my_lib',
  libraries : shlib,
  version : '0.1',
)
```

### meson.buildの書き方

#### Project(必須)

project[^project]は各プロジェクトで最初に呼び出される関数で、Meson を初期化する。この関数の最初の引数は、このプロジェクトの名前を定義する文字列でなければなりません。

[^project] : [Reference-manual - project](https://mesonbuild.com/Reference-manual_functions.html#project)

```meson title="プロジェクト記述例"
 #コメント
 project(‘myproject’,	#プロジェクト名
 	‘cpp’,				#言語指定(c/cpp/cuda/d/objc/objcpp/fortran/java/cs(C#)/vala/rust)
 	version : ‘0.1’,	#バージョン指定
 	default_options : [‘warning_level=3’, ‘cpp_std=c++14’])	# デフォルトオプション設定
```

#### executable

新しい実行ファイル[^executable]を作成する。最初の引数で名前を指定し、残りの位置引数で使用する入力ファイルを定義する。

```meson
 exe = executable('exec',							#実行ファイル名
 	include_directories: ['/usr/local/include'],	#インクルードディレクトリ指定
 	cpp_args: ['-g', '-Wall'],						#コンパイラオプション設定
 	link_args: ['-L.'],								#リンクオプション設定
 	)
```

[^executable] : [Reference-manual - executable](https://mesonbuild.com/Reference-manual_functions.html#executable)

#### library

共有(shared)、静的(static)なライブラリ[^library]を生成する.

[^library]: [library()](https://mesonbuild.com/Reference-manual_functions.html#library)

#### shared_library

```meson title="共有ライブラリを作成する"
tracer_lib = shared_library(
  'tracer',                         # targetの名称: lib`name`.soというファイル名になる
  tracer_srcs,                      # srcファイル指定
  include_directories: includes,    # include path設定
  c_args: c_compile_options,        # コンパイルオプション
  link_args: c_link_options,        # linker オプション
  dependencies: external_lib_deps,  # 依存関係
  install: false,                   # インストール対象とするか
)
```

- [shared_library function](https://mesonbuild.com/Reference-manual_functions.html#shared_library)

#### static_library

```meson title="静的ライブラリを作成する"
tracer_static_lib = static_library(
  'tracer',                         # targetの名称: lib`name`.aというファイル名になる
  tracer_srcs,
  include_directories: includes,
  c_args: c_compile_options,
  link_args: c_link_options,
  dependencies: external_lib_deps,
  install: false,
)
```

- [static_library function](https://mesonbuild.com/Reference-manual_functions.html#static_library)

#### both_libraries

共有(shared)、静的(static)なライブラリを生成する.

- [both_libraries](https://mesonbuild.com/Reference-manual_functions.html#both_libraries)

### ライブラリ依存関係構築

必要な外部ライブラリなどの依存関係を記述できる.ライブラリが存在しない場合ビルドは失敗する.`pkg-config`が使えるライブラリであれば,`dependency`[^dependency]を使うことができる.

```meson title="ハイライト部分が依存関係構築部分"
# highlight-start
cc = meson.get_compiler('c')
lib_pthread = cc.find_library('pthread', required: true)
# highlight-end
shared_library(
  'tracer',
  tracer_srcs,
  include_directories: includes,
  c_args: c_compile_options,
  link_args: c_link_options,
  # highlight-next-line
  dependencies: [lib_pthread],
  install: false,
)
```
[^dependency] : [Dependencies](https://mesonbuild.com/Dependencies.html#dependency-detection-method)

### 複数階層

いくつかのサブディレクトリなどで管理されたプロジェクトでは`meson.build`を複数作成しておいて、プロジェクトのrootディレクトリの`meson.build`から`subdir()`[^subdir]指定したディレクトをカレントディレクトリとして`meson.build`を実行することができる.

[^subdir]: [subdir function](https://mesonbuild.com/Reference-manual_functions.html#subdir)

### Custom-target
TODO: 工事中

```meson
ex_configure_lib = custom_target( 'crt-config', # unique ID
  input : [],
  output: ['configure'],
  command: ['./crt_configure.sh']
)

ex_make_lib =  custom_target( 'crt-config', # unique ID
  input : [],
  output: ['configure'],
  command: ['./configure']
)
```

```sh title="create configure file"
aclocal
autoheader
automake --add-missing --copy
autoconf
```

### 参考

- [configureの作り方(autotoolsの使い方） - のぴぴのメモ](https://nopipi.hatenablog.com/entry/2013/01/14/025509)

## 実行例

```shell title="セットアップからビルドまで"
meson setup builddir
cd builddir
meson compile # meson compile -C builddirではcdしなくていい.
```

```shell title="コンパイラの設定変更"
CC=clang CXX=clang++ meson setup --wipe builddir
```

```shell title="管理者権限でインストール"
sudo meson install -C builddir
```

```shell title="Build"
meson compile -C builddir
```

```shell title="Test実行"
meson test -C builddir
```

```shell title="Configureation確認"
meson configure -Dwarning_level=2 builddir
```

```shell title="Clean"
meson clean -C builddir
```

```shell title="static analyzer(clang)"
cd builddir
ninja scan-build
```

```shell title="clang-tidy"
cd builddir
ninja clang-tidy
```

## meson.build sample

```meson title="doxygen"
# Usage:
# > cd build_directories
# > ninja docs
doxygen = find_program('doxygen', required : false)
if doxygen.found()
  message('Doxygen found')
  run_target('docs', command : [doxygen, meson.source_root() + '/Doxyfile'])    
else
  warning('Documentation disabled without doxygen')
endif
```
- [configuration - Cannot run Doxygen from Meson on a C++ project - Stack Overflow](https://stackoverflow.com/questions/52520146/cannot-run-doxygen-from-meson-on-a-c-project/52534082#52534082)
- [doc/api/meson.build · a52f0db3c54b093a2c44dce37ea6dd5582a19c5a · libinput / libinput · GitLab](https://gitlab.freedesktop.org/libinput/libinput/blob/a52f0db3c54b093a2c44dce37ea6dd5582a19c5a/doc/api/meson.build)
- [run_target](https://mesonbuild.com/Reference-manual_functions.html#run_target)

```meson title="Run external command"
source = join_paths(meson.source_root(), 'test.txt')
dest = join_paths(meson.build_root(), 'test2.txt')
message('copying @0@ to @1@ ...'.format(source, dest))
r = run_command('cp', source, dest)
```
- [How to run a shell command from a Meson script? - Stack Overflow](https://stackoverflow.com/questions/52608835/how-to-run-a-shell-command-from-a-meson-script)
- [run_command](https://mesonbuild.com/Reference-manual_functions.html#run_command)