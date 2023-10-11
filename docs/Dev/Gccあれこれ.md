# Gccあれこれ

## rpath

rpath は、リンカーに渡される動的ライブラリのパス。そのrpathで指定されたパスは実行可能ファイルに埋め込まれ、実行時に動的ライブラリのパスとして扱われる。一方ない場合はLD_LIBRARY_PATHなどで参照する。rpathは実行ファイルに格納されており、`readelf -d -w <exe file>`や`objdump -x <exe file>`で確認できる。

mesonでは`build_rpath`, `install_rpath`で指定する。

## ELF

標準バイナリ形式で、Executable and Linking Formatの略。`readelf`コマンドでヘッダ情報を確認できる。

- [Man page of ELF](https://linuxjm.osdn.jp/html/LDP_man-pages/man5/elf.5.html)
- [What Is an ELF File? | Baeldung on Linux](https://www.baeldung.com/linux/executable-and-linkable-format-file)

## DWARF

デバッグ情報のフォーマット[^1]。`objdump`で確認できる[^2]。

[^1]: [DWARF Debugging Information Format](https://dwarfstd.org/)
[^2]: gcc v12.3.0ではDWARF Version 1([dwarf\_1\_1\_0.pdf](https://dwarfstd.org/doc/dwarf_1_1_0.pdf))だった。