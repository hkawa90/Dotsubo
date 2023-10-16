# Bugs

## Buffer Overflow

範囲を超えてアクセスすることで、Segmentaiton faultが起きたり、誤った値になり誤動作したりする.

### 参考

- [Buffer Overflows CSE 351 Winter 2020](https://courses.cs.washington.edu/courses/cse351/20sp/lectures/15/CSE351-L15-buffoverflow_20sp.pdf)
- [CWE-119](https://jvndb.jvn.jp/ja/cwe/CWE-119.html)

## Stack corruption

スタックが破損することで、思わぬ動作となる.

### 参考

- [rkd.me.uk - Stack corruption and how to debug it](https://rkd.me.uk/posts/2020-04-11-stack-corruption-and-how-to-debug-it.html)

## Racing

データの競合により、データ値が思いもしない値になったりする.

### 参考

- [CWE-362](https://jvndb.jvn.jp/ja/cwe/CWE-362.html)

## Dead lock

> デッドロックとは、複数の実行中のプログラムなどが互いに他のプログラムの結果待ちとなり、待機状態に入ったまま動かなくなる現象を指します。
> デッドロックは、計算機科学において、2つ以上のスレッドあるいはプロセスなどの処理単位が互いの処理終了を待ち、結果としてどの処理も先に進めなくなってしまうことを言います。
> デッドロックは、排他制御により、他のタスクからの利用をロックすることで発生します。デッドロック状態のタスクは、その状態から回復することができないので、デットロックを発生させないように設計する必要があります。
> デッドロックの原因には、次のようなものがあります:
> - データの更新を行うのに共有ロックを取得していること
> - データを更新する順序が一定でない
> - 2つ以上のスレッドが一部のリソースと競合し、実行が不可能な方法で発生した場合
> - 参照のトランザクションと更新（削除を含む）のトランザクションとの間で多く発生する
> 
> デッドロックが発生すると、片方のトランザクションがロールバックで強制終了されます。

### 参考

- [デッドロック - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%83%E3%83%89%E3%83%AD%E3%83%83%E3%82%AF)
- [デッドロックの回避 (マルチスレッドのプログラミング)](https://docs.oracle.com/cd/E19455-01/806-2732/6jbu8v6qe/index.html)

## 参考

- [CWE - Organizations Participating](https://cwe.mitre.org/compatible/organizations.html#Information-Technology%20Promotion%20Agency%20(IPA),%20Japan)
- [組込みソフトウェア開発における品質向上の勧め［](https://www.ipa.go.jp/archive/publish/qv6pgp00000010b6-att/000027629.pdf)