---
title: Draw.io
---
## What's

Diagram(UMLなど)を作図できる。

### Draw.io

[draw.io Blog](https://www.drawio.com/blog)

```shell title="Draw.ioをDockerから動かす"
docker run -it --rm --name="draw" -p 8080:8080 -p 8443:8443 jgraph/drawio
# Open with offline mode
xdg-open http://localhost:8080/?offline=1&https=0 
```

![](/img/docs/Diagram-draw-io-app.png)

:::tip
Mermaidのmindmap形式でMindmap図が作成できる。
> In the draw.io editor, click Arrange > Insert > Advanced > Mermaid...
:::

### 参考

- [draw.ioの使い方を解説〜無料の高機能作図ツールを使って資料の質をあげよう！｜ferret](https://ferret-plus.com/8408)
- [【動画付き】 draw.io 使い方まとめ 〜エンジニアでなくても使えるTips集〜 #JavaScript - Qiita](https://qiita.com/G-awa/items/8fd414700b68b2bcafcc)
