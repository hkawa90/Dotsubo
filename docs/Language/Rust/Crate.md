---
title: ライブラリ/クレートというもの
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ライブラリ

じぶんだけじゃ何もできない...

## クレート(Crate)

Rustにおけるコンパイルの単位。クレートには、実行バイナリ（アプリケーション）とライブラリという2つの種類があります。

## 実際のライブラリを使ってみる

実際にライブラリを使ってみます。ライブラリとしてはratauiと呼ばれるtui-rsの後継となるTerminal User Interfaceのライブラリです。

### Install

ratatuiを現在のプロジェクトにインストールします。

<Tabs>
  <TabItem value="cargo" label="Cargo" default>

``` shell
cargo add ratatui --features all-widgets
```

</TabItem>
  <TabItem value="toml" label="TOML">

``` toml
[dependencies]
ratatui = { version = "0.23.0", features = ["all-widgets"]}
```

  </TabItem>
</Tabs>

``` toml title="導入後のCargo.tomlにdependenciesが追加された"
[dependencies]
ratatui = { version = "0.23.0", features = ["all-widgets"] }
```

### ライブラリのExampleを実行してみる

Exampleが用意されていれば`Cargo`コマンドで実行できる。

``` shell
git clone --depth 1 https://github.com/ratatui-org/ratatui.git
cd ratatui
cargo run --example demo
```

### ライブラリのドキュメント

[Docs.rs](https://docs.rs/)から欲しいライブラリを検索できて、ライブラリ内容を確認できる。今回の`ratatui`は[ratatui - Rust](https://docs.rs/ratatui/latest/ratatui/)に説明がある。

### ratauiのテンプレートからサンプルを作成して実行してみる.

まずは`cargo generate`でテンプレートからプロジェクト作成してみる。

``` shell
cargo generate --git https://github.com/ratatui-org/rust-tui-template --name ratatui-sample
cd ratatui-sample
cargo build
# highlight-next-line
./target/debug/ratatui-sample
```

<details>
<summary>テンプレートから生成されたmain.rs</summary>

``` rust
use ratatui_sample::app::{App, AppResult};
use ratatui_sample::event::{Event, EventHandler};
use ratatui_sample::handler::handle_key_events;
use ratatui_sample::tui::Tui;
use std::io;
use tui::backend::CrosstermBackend;
use tui::Terminal;

fn main() -> AppResult<()> {
    // Create an application.
    let mut app = App::new();

    // Initialize the terminal user interface.
    let backend = CrosstermBackend::new(io::stderr());
    let terminal = Terminal::new(backend)?;
    let events = EventHandler::new(250);
    let mut tui = Tui::new(terminal, events);
    tui.init()?;

    // Start the main loop.
    while app.running {
        // Render the user interface.
        tui.draw(&mut app)?;
        // Handle events.
        match tui.events.next()? {
            Event::Tick => app.tick(),
            Event::Key(key_event) => handle_key_events(key_event, &mut app)?,
            Event::Mouse(_) => {}
            Event::Resize(_, _) => {}
        }
    }

    // Exit the user interface.
    tui.exit()?;
    Ok(())
}
```

</details>


## ここまででわかったこと

- ほしいライブラリは[Docs.rs](https://docs.rs/)から欲しいライブラリを検索できる
- `template`が用意されていれば`cargo generate`を使ってサンプルプログラムを作成できる

## 参考文献

- [クレートとモジュール――Rustのモジュールシステムを理解する：基本からしっかり学ぶRust入門（12） - ＠IT](https://atmarkit.itmedia.co.jp/ait/articles/2206/24/news007.html)

[^1]:[ratatui-org/ratatui: Rust library that's all about cooking up terminal user interfaces (TUIs)](https://github.com/ratatui-org/ratatui)
