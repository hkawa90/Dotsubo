# Markdown / MDX

## Codeblock

- titleの付与: title="strings"
- 行ハイライト: highlight-next-line/start/end
- 行番号表示: showLineNumbers

````
```language title ="hoge"
console.log('hoge')
// highlight-next-line
line 1
line 2
line 3
// highlight-start
line 4
line 5
// highlight-end
line 6
```
````

- Theming

themeConfig/prismプロパティを変更する

- Interactive code editor

```shell
npm install --save @docusaurus/theme-live-codeblock
```

You will also need to add the plugin to your docusaurus.config.js.

```
module.exports = {
  // ...
  themes: ['@docusaurus/theme-live-codeblock'],
  // ...
};
```

````
```jsx live
function Clock(props) {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div>
      <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}
```
````

### Example

```language title ="hoge"
console.log('hoge')
// highlight-next-line
line 1
line 2
line 3
// highlight-start
line 4
line 5
// highlight-end
line 6
```
[参考URL]

[Code blocks | Docusaurus](https://docusaurus.io/docs/markdown-features/code-blocks)
