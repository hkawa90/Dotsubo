# Shellあれこれ

ほぼbashについての記述です。

## Bash

- [Bash - GNU Project - Free Software Foundation](https://www.gnu.org/software/bash/)
    - [Man page of BASH](https://linuxjm.osdn.jp/html/GNU_bash/man1/bash.1.html)
    - [Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)
## SHELL自身のプロセスID

- $$ : 動作しているSHELLプロセス

``` shell title="PIDからシェル名を判定する"
SHELLNAME=`ls -l /proc/$$/exe`
if [[ "$SHELLNAME" == *bash* ]]; then
    echo "bash!"
fi
```

## 正規表現

$BASH_REMATCHに正規表現にマッチした文字列がキャプチャされる。
- $BASH_REMATCH[0] には、キャプチャとは関係なく、マッチした文字列全体が入る。
- $BASH_REMATCH[1] 以降には、キャプチャした順番で、マッチした文字列が入る。

```shell
if [[ $name =~ $re ]]; then
    echo ${BASH_REMATCH[1]}
fi
```

[Pattern Matching (Bash Reference Manual)](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html)

## ファイル読み込み

```shell
#!/bin/bash

while read line
do
  echo $line
done < ファイル名
```

```shell title="break pattern"
cat ${file} | while read line; do
    [[ "${line}" = "END" ]] && exit 0
done
```

```bash title="ファイルからpid:100の数字部分を読み込む"
file=hoge.txt # abc pid:100

cat ${file} | while read line; do
    echo ${line}
    if [[ ${line} =~ pid:([0-9]+)$ ]]; then
#        echo ${BASH_REMATCH[0]}
        echo ${BASH_REMATCH[1]}
        exit 0
    fi
done

echo "Done"
```

## library

-[mrbaseman/parse\_yaml: a simple yaml parser implemented in bash](https://github.com/mrbaseman/parse_yaml/tree/master)
    - Pure bash YAML parser
## 参考

- [linux - Pipe to/from the clipboard in a Bash script - Stack Overflow](https://stackoverflow.com/questions/749544/pipe-to-from-the-clipboard-in-a-bash-script)
- [【シェルスクリプト】オプションパーサーの紹介 #Bash - Qiita](https://qiita.com/ktamido/items/cdebdd6413fe0638a23b)
