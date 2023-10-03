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