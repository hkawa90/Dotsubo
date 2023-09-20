# libpulp

[Manpage of PTRACE](http://surf.ml.seikei.ac.jp/~nakano/JMwww/html/LDP_man-pages/man2/ptrace.2.html)を使ったユーザスペースアプリケーションのライブパッチを行う。

- [SLES 15 SP4 | Administration Guide | User space live patching](https://documentation.suse.com/sles/15-SP4/html/SLES-all/cha-ulp.html)
- [SUSE/libpulp: libpulp enables live patching in user space applications.](https://github.com/SUSE/libpulp)

```shell tilte="Build"
apt install libtool autoconf autoconf-archive libelf-dev libjson-c-dev libseccomp-dev
pip3 install pexpect psutil

git clone -b 0.2.2 --depth 1 https://github.com/SUSE/libpulp.git

./bootstrap
./configure
make
make check
```

<details>
<summary>configure options</summary>
<pre><code>
For better control, use the options below.

Fine tuning of the installation directories:
  --bindir=DIR            user executables [EPREFIX/bin]
  --sbindir=DIR           system admin executables [EPREFIX/sbin]
  --libexecdir=DIR        program executables [EPREFIX/libexec]
  --sysconfdir=DIR        read-only single-machine data [PREFIX/etc]
  --sharedstatedir=DIR    modifiable architecture-independent data [PREFIX/com]
  --localstatedir=DIR     modifiable single-machine data [PREFIX/var]
  --runstatedir=DIR       modifiable per-process data [LOCALSTATEDIR/run]
  --libdir=DIR            object code libraries [EPREFIX/lib]
  --includedir=DIR        C header files [PREFIX/include]
  --oldincludedir=DIR     C header files for non-gcc [/usr/include]
  --datarootdir=DIR       read-only arch.-independent data root [PREFIX/share]
  --datadir=DIR           read-only architecture-independent data [DATAROOTDIR]
  --infodir=DIR           info documentation [DATAROOTDIR/info]
  --localedir=DIR         locale-dependent data [DATAROOTDIR/locale]
  --mandir=DIR            man documentation [DATAROOTDIR/man]
  --docdir=DIR            documentation root [DATAROOTDIR/doc/libpulp]
  --htmldir=DIR           html documentation [DOCDIR]
  --dvidir=DIR            dvi documentation [DOCDIR]
  --pdfdir=DIR            pdf documentation [DOCDIR]
  --psdir=DIR             ps documentation [DOCDIR]

Program names:
  --program-prefix=PREFIX            prepend PREFIX to installed program names
  --program-suffix=SUFFIX            append SUFFIX to installed program names
  --program-transform-name=PROGRAM   run sed PROGRAM on installed program names

System types:
  --build=BUILD     configure for building on BUILD [guessed]
  --host=HOST       cross-compile to build programs to run on HOST [BUILD]

Optional Features:
  --disable-option-checking  ignore unrecognized --enable/--with options
  --disable-FEATURE       do not include FEATURE (same as --enable-FEATURE=no)
  --enable-FEATURE[=ARG]  include FEATURE [ARG=yes]
  --enable-silent-rules   less verbose build output (undo: "make V=1")
  --disable-silent-rules  verbose build output (undo: "make V=0")
  --enable-shared[=PKGS]  build shared libraries [default=yes]
  --enable-static[=PKGS]  build static libraries [default=no]
  --enable-fast-install[=PKGS]
                          optimize for fast installation [default=yes]
  --enable-dependency-tracking
                          do not reject slow dependency extractors
  --disable-dependency-tracking
                          speeds up one-time build
  --disable-libtool-lock  avoid locking (might break parallel builds)
  --enable-sanitizers     compile ulp tools with address and
                          undefined-behaviour sanitizer [default=no]
  --enable-thread-sanitizer
                          compile ulp tools with thread sanitizer [default=no]
  --enable-valgrind       run tests through valgrind to catch memory errors in
                          libpulp.so [default=no]
  --enable-stack-check    build support for stack checking during live patch
                          application [default=no]
  --enable-docs-generation
                          create documentation files using Doxygen
                          [default=no]
  --enable-afl-testing    enable testing the ulp tool using the american
                          fuzzer lop [default=no]

</code></pre>
</details>

ちょっと動作確認できず。。。