# Procfs

# What's

Linuxの疑似ファイルシステムで、主にプロセス関連のKernel情報にアクセス・操作できる。

## /proc/[PID]

プロセスID毎にフォルダがあり、その中にそのプロセスに関する情報にアクセスできる。フォルダ内のファイルの意味は次の通り。

| ファイル名 |ファイル名 |内容                                         | 
| ---------- |-| -------------------------------------------- | 
| cmdline    || プロセスを開始したコマンド                   | 
| cwd        || プロセスのカレントワーキングディレクトリ     | 
| exe        || プロセスの実行ファイルへのシンボリックリンク | 
| root||ルートディレクトリへのシンボリックリンク|
|cpu||各cpuでのCPUタイムと統計情報|
|environ||プロセスの環境変数の一覧|
|fd||プロセスが使用しているファイル・デバイスのファイル記述子|
|maps||プロセスのアドレス空間の状態|
|mem||プロセスのアドレス空間の内容|
|statm||プロセスのページ割り当て|
|stat||プロセスの状態|
|status||statより詳しいプロセス状態|
|attr||Security attributes|
|    |apparmor|
|    |current|
|    |exec|represents the attributes assigned to the process / this is needed to support role/domain transitions|
|    |fscreate|represents the attributes to assign files created by subsequent calls - mkdir - symlink|
|    |keycreate|if/when a process writes a security context into this file all previous keys will be labelled with this context|
|    |prev|shows previous values /proc/[PID]/attr/current|
|    |smack|
|    |sockcreate| if/when a process writes security context into this file all the previously created sockets will be labelled with this context|
|arch_status||To be exposed via /proc/[pid]/arch_status is a new interface for exposing architectural-specific information for a given Linux process.|
|autogroup||Linux 2.6.38以降、カーネルは以下の機能を提供している。オートグルーピングとして知られる機能を提供するようになった。ビルドのような、マルチプロセスでCPUに負荷のかかるワークロードに直面して、対話型デスクトップのパフォーマンスを向上させるためにLinuxカーネルを多数の並列ビルドプロセスでビルドする場合など|
|auxv||実行時にプロセスに渡された ELF インタープリター情報が格納されている。|
|cgroup||プロセスやタスクが所属するコントロールグループを示す。|
|clear_refs|||
|comm|||
|coredump_filter|||
|cpuset|||
|fd||プロセスがオープンしたファイル各々に対するエントリーを含むサブディレクトリ。 ファイルディスクリプターがファイル名で、 実際のファイルへのシンボリックリンクになっている。|
|fdinfo||そのプロセスがオープンしているファイル毎の エントリーが入っており、ファイルディスクリプターがファイル名となっている。 各ファイルの内容を読み出すことで、対応するファイルディスクリプターに関する 情報を得ることができる。|
|io||プロセスの I/O 統計情報を表示する。|
|gid_map|||
|limits||リソース制限について、 ソフトリミット、ハードリミット、計測単位を表示する |
|map_files|| メモリーマップされたファイルに対応するエントリーが置かれる|
|mountinfo||マウントポイントについての情報|
|mounts||マウント名前空間に現在マウントされている 全ファイルシステムのリスト。 |
|mountstats||そのプロセスのマウント名前空間内のマウントポイントに関する 各種情報 (統計、設定情報) を参照|
|ns|||
|numa_maps|||
|oom_adj||メモリー不足 (OOM) の状況下でどのプロセスを殺すべきかを選択す るのに使用されるスコアを調整するのに使用される。|
|oom_score||OOM-killer のプロセス選択用として、カーネルが このプロセス に対して与えた現在のスコアを表示する。 |
|oom_score_adj|||
|pagemap|||
|personality|||
|root||UNIX と Linux では、 ファイルシステムのルート (/) をプロセスごとに別々にできる。 これはシステムコール chroot(2) によって設定する。 このファイルはプロセスのルートディレクトリを指すシンボリックリンクで、 exe や fd/* などと同じような動作をする。|
|smaps||そのプロセスの各マッピングのメモリー消費量を表示する|
|stack|||
|syscall|||
|task|||
|uid_map|||
|gid_map|||
|wchan|||

import Gist from 'react-gist';

<Gist id="0f2efbaeca2932fef2df90fb15ad06da" 
/>

### /proc/[PID]/fd

各ディスクリプタ毎に`type:[inode]`のフォーマットで表されるリソースとリンクされていることがわかる。

```bash
ls -l1 /proc/5481/fd
合計 0
lr-x------ 1 kawa90 kawa90 64 10月  6 23:32 0 -> 'pipe:[56692]'
lrwx------ 1 kawa90 kawa90 64 10月  6 23:32 1 -> 'socket:[29030]'
```
一方対応する inode を持たないファイルディスクリプタ (例えば、epoll_create(2)、eventfd(2)、inotify_init(2)、signalfd(2)、timerfd(2) によって生成されるファイルディスクリプタ) の場合、エントリは、以下の形式の内容を持つシンボリックリンクとなる。

``` title="anonymous inode"
anon_inode:<file-type>
```

### /proc/[PID]/net/[tcp|udp]

```shell title="ネットワーク情報の表示"
cat /proc/5481/net/tcp | head
  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode                                                     
   0: 00000000:0BB8 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 155699 1 0000000000000000 100 0 0 10 0                    
   1: 00000000:01BD 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 31389 1 0000000000000000 100 0 0 10 0                     
   2: 00000000:0019 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 31491 1 0000000000000000 100 0 0 10 0                     
   3: 00000000:008B 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 31390 1 0000000000000000 100 0 0 10 0                     
   4: 3600007F:0035 00000000:0000 0A 00000000:00000000 00:00000000 00000000   104        0 33260 1 0000000000000000 100 0 0 10 5                     
   5: 3500007F:0035 00000000:0000 0A 00000000:00000000 00:00000000 00000000   104        0 33258 1 0000000000000000 100 0 0 10 5                     
   6: 0100007F:0277 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 163033 1 0000000000000000 100 0 0 10 0                    
   7: 400BA8C0:9656 C2E541AC:01BB 01 00000000:00000000 02:000006AC 00000000  1000        0 166332 2 0000000000000000 21 4 25 10 -1                   
   8: 400BA8C0:EA80 856FC7B9:01BB 01 00000000:00000000 02:0000083A 00000000  1000        0 155958 2 0000000000000000 20 4 13 10 -1   
   ```

<Gist id="805850c5d30b10272f37e679e6f977a2" 
/>

### /proc/[PID]/arp (RFC 826)

`arp -a`とほぼ同じ内容が表示される。

MACアドレスの一部はEthernet vender codeを含んでいて、[MAC addresses | tables](https://tables.octaviadata.com/content/mac-addresses)などで検索できメーカを調べることができる。

### /proc/[PID]/*

+ anycast6
+ arp
+ bnep
+ connector
+ dev
+ dev_mcast
+ dev_snmp6
+ fib_trie
+ fib_triestat
+ hci
+ icmp
+ icmp6
+ if_inet6
+ igmp
+ igmp6
+ ip6_flowlabel
+ ip6_mr_cache
+ ip6_mr_vif
+ ip_mr_cache
+ ip_mr_vif
+ ip_tables_matches
+ ip_tables_names
+ ip_tables_targets
+ ipv6_route
+ l2cap
+ mcfilter
+ mcfilter6
+ netfilter
+ netlink
+ netstat
+ packet
+ protocols
+ psched
+ ptype
+ raw
+ raw6
+ rfcomm
+ route
+ rt6_stats
+ rt_acct
+ rt_cache
+ sco
+ snmp
+ snmp6
+ sockstat
+ sockstat6
+ softnet_stat
+ stat [^stat]
    + arp_cache:
    + ndisc_cache:
    + rt_cache:
+ tcp
+ tcp6
+ udp
+ udp6
+ udplite
+ udplite6
+ unix
+ wireless
+ xfrm_stat

## Doc

- [The /proc Filesystem — The Linux Kernel documentation](https://docs.kernel.org/filesystems/proc.html)
- [/proc](https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/proc.html)

## 関連ライブラリ

- [prometheus/procfs: procfs provides functions to retrieve system, kernel and process metrics from the pseudo-filesystem proc.](https://github.com/prometheus/procfs)
- [procfs · PyPI](https://pypi.org/project/procfs/)
- [procfs - crates.io: Rust Package Registry](https://crates.io/crates/procfs)
- [procfs-stats - npm](https://www.npmjs.com/package/procfs-stats)

[^stat]: [lnstat(8) - Linux manual page](https://man7.org/linux/man-pages/man8/lnstat.8.html)