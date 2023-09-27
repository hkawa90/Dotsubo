# Markdown Cheat Sheet

## MindMap版

Cheat SheetをMindmapで作成した理由は、各アイテムが俯瞰できるので、ページスクロールが不要と考えたから。各アイテムに対応するテンプレートは各アイテムをクリックしたらクリップボードへコピーできれば、いいかなと考えた。例えば、リンクの部分ををクリックすると`[リンクテキスト](URL)`の文字列がクリップボードへコピーされる。

Mermaid出力SVGにJavascriptを埋め込んでみたが、Docusaurus に取り込むとJavascriptがうまく動かない。とりあえずはDocusaurusでは使わず、単品で使おう。

![](/img/docs/mermaid.svg "Markdown Cheat Sheet")

1. mermaidでMINDMAP作成

``` title="今回作成したMarkdown Cheat SheetのMINDMAP"
mindmap
  root((Docusaurus<br/>Markdown))
    Basic
        "# Headers"
        &gt; Blockquotes
        &grave;inline code&grave;
        code block
            // highlight-next-line
            // highlight-start
            // highlight-end
            showLineNumbers
            title=""
        水平線
        箇条書き
        番号付きリスト
        リンク
    文字装飾
        &ast;イタリック&ast;
        &ast;&ast;太字&ast;&ast;
        ~~打ち消し~~
    画像
    表
    折りたたみ
    Admonitions
    Tabs
    Inline TOC
    front matter
```
2. SVGをVSCodeで開く
3. XML Tools extensionなどで整形(もとのSVGは1行だけで改行ないため)
4. svgの各ノードにidを付与

```svg title="mermaidで作成されたSVG"
        <g transform="translate(457.9880785429832, 250.5741934424104)" class="mindmap-node section-8" id="n-25">
            <g>
                <path d="M0 30.815624999999997 v-25.815624999999997 q0,-5 5,-5 h92.4765625 q5,0 5,5 v30.815624999999997 H0 Z" class="node-bkg node-no-border" id="node-25"></path>
                <line y2="35.815625" x2="102.4765625" y1="35.815625" x1="0" class="node-line-8"></line>
            </g>
            <g transform="translate(51.23828125, 5)" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" dy="1em">
                <g>
                    <rect class="background"></rect>
                    <text y="-10.1" id="frontmatter">
                        <tspan dy="1.1em" y="-0.1em" x="0" class="text-outer-tspan">
                            <tspan font-weight="normal" class="text-inner-tspan" font-style="normal">front</tspan>
                            <tspan font-weight="normal" class="text-inner-tspan" font-style="normal"> matter</tspan>
                        </tspan>
                    </text>
                </g>
            </g>
        </g>
```

5. SVGにJavascriptを埋め込む

```js title="SVGにCDATAセクションでJavascriptを埋め込む.nodeTextにnodeに対応する文字列を入れておく"
function toClipBoard() {
    const text = this;
    navigator.clipboard.writeText(text).then(
    () => {
        // コピーに成功したときの処理
        console.log('Copy success!' + ',' + text)
    },
    () => {
        // コピーに失敗したときの処理
        console.log('Copy fail!')
    });        
}

for (var cnt=1; cnt <= 25; cnt++ ) {
    const node=document.getElementById("n-"+cnt);
    node.addEventListener("click", toClipBoard.bind(nodeText[cnt]));
}
```