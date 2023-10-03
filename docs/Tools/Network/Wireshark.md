# Sniffer

ネットワーク上を流れているパケットをモニタリングするもので、ここではS/Wのものを紹介する。

# Wireshark

GUIベースのネットワーク上のパケットの収集・表示・解析を行える。

## What's

- [Wireshark · Go Deep](https://www.wireshark.org/)
    - [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/)

## Howto

- [Wireshark · Display Filter Reference: Index](https://www.wireshark.org/docs/dfref/)

## 参考

# Tcpdump

主にLinux上で動作するSniffer.パケット解析機能・GUIはない。

## What's

- [Home | TCPDUMP & LIBPCAP](https://www.tcpdump.org/)

## Howto

``` shell
function read_arguments() {
    local arguments_msg=$1
    local opt=$2
    local line=""
    echo $arguments_msg
    read line
    echo $opt$line
}

local opt=(ファイル書き込み インターフェース)
local selection=$(echo ${opt[*]} | tr " " "\n" | fzf --header="選択してください(タブキーで複数選択可" --reverse --height 40%)
local option=""
if [[ "$selection" == *ファイル書き込み* ]]; then
    option=${option} $(read_arguments "ファイル名を入力してください" "-w ")"
fi
if [[ "$selection" == *インターフェース* ]]; then
    interface=$(ls /sys/class/net | tr " " "\n"| fzf --header="インターフェースを選択してください" --reverse --height 40%)
    option="${option} -i ${interface}"
fi

```

- [Home | TCPDUMP & LIBPCAP](https://www.tcpdump.org/index.html#documentation)

## 参考

- [【tcpdump】の見方, 使い方, Filter, オプション(ローテーション等), 解析方法について | SEの道標](https://milestone-of-se.nesuke.com/sv-basic/linux-basic/tcpdump/)
- [tcpdumpチートシート - Qoosky](https://www.qoosky.io/techs/7bba672b1c)


