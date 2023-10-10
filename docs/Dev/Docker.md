# Dockerあれこれ

### tzdataインストールで質問が出てしまう

```dockerfile
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
  apt-get install -y --no-install-recommends tzdata
ENV TZ=Asia/Tokyo
```

### マルチステージ
- ステージ指定は`--target`
- ステージ名には小文字のみ

### 表示フォーマットオプション

```shell
--format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}\t{{.CreatedSince}}\t{{.Size}}"
```
`\t`を`,`にすればCSV形式になる。

| Tableのフィールド名 | 表示されるフィールド名 | 
| ------------------- | ---------------------- |
| .Repository         | REPOSITORY             |
| .Tag                | TAG                    |
| .Digest             | DIGEST                 |
| .ID                 | IMAGE ID               |
| .CreatedSince       | CREATED                |
| .Size               | SIZE                   |

上記以外は、[docker/api/client/formatter/formatter.go at master · BrianBland/docker](https://github.com/BrianBland/docker/blob/master/api/client/formatter/formatter.go)を参照。

### ヒアドキュメント

[Introduction to heredocs in Dockerfiles | Docker](https://www.docker.com/blog/introduction-to-heredocs-in-dockerfiles/)のようにヒアドキュメントが使える。さらにヒアドキュメントを埋め込むこともできる。

```dockerfile title="heredocs in heredocs"
RUN <<EOF
cat  << _END_ >> /home/$user/.bashrc
export NVM_DIR="/home/$user/.nvm" 
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm 
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion 
_END_
EOF
```

### build時のshell

デフォルトでは`sh -c`となっているが、`SHELL`で変更可能。

```dockerfile
SHELL [ "/usr/bin/bash", "-c" ]
```