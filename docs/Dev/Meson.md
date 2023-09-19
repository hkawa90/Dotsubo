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

### meson.build テンプレート作成

```shell title="テンプレート作成"
meson init --type executable
```

```
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

meson.buildとテンプレートソースプログラムの作成を行う。その後は下記コマンドでbuilddirディレクトリにビルド用ファイル作成とビルドをninjaで実行する。

### meson.buildの書き方

#### Project

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

## 実行例

```shell
meson setup builddir
meson compile -C builddir
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
