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
