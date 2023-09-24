---
title: ソースコードを理解したい
sidebar_position: 3
---

## ソースコードを理解したいための準備

- [The Rust Programming Language 日本語版 - The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/)
- [Introduction - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/)


``` rust title="src/app.rs" showLineNumbers
use std::error;

/// Application result type.
pub type AppResult<T> = std::result::Result<T, Box<dyn error::Error>>;

/// Application.
#[derive(Debug)]
pub struct App {
    /// Is the application running?
    pub running: bool,
    /// counter
    pub counter: u8,
}

impl Default for App {
    fn default() -> Self {
        Self {
            running: true,
            counter: 0,
        }
    }
}

impl App {
    /// Constructs a new instance of [`App`].
    pub fn new() -> Self {
        Self::default()
    }

    /// Handles the tick event of the terminal.
    pub fn tick(&self) {}

    /// Set running to false to quit the application.
    pub fn quit(&mut self) {
        self.running = false;
    }

    pub fn increment_counter(&mut self) {
        if let Some(res) = self.counter.checked_add(1) {
            self.counter = res;
        }
    }

    pub fn decrement_counter(&mut self) {
        if let Some(res) = self.counter.checked_sub(1) {
            self.counter = res;
        }
    }
}
```

``` 
- Line 1.
	- [use宣言 - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/mod/use.html)
		- useで`std::error`モジュールを簡潔に記述できる
	- std::error => [std::error - Rust](https://doc.rust-lang.org/std/error/index.html)
		- Rust言語は、エラーの構築／表現、報告、伝播、反応、破棄のために、2つの補完的なシステムを提供する。これらの責務は "エラー処理 "と総称される。最初のシステムのコンポーネントであるパニックランタイムとインターフェースは、プログラムで検出されたバグを表現するために最も一般的に使用されます。2番目のシステムの構成要素であるResult、エラー特性、およびユーザ定義型は、プログラムの予期される実行時の失敗モードを表現するために使用される。
- Line 4.
	- [プライベートとパブリック - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/mod/visibility.html?highlight=pub#%E3%83%97%E3%83%A9%E3%82%A4%E3%83%99%E3%83%BC%E3%83%88%E3%81%A8%E3%83%91%E3%83%96%E3%83%AA%E3%83%83%E3%82%AF)
		- pubキーワードで就職するとパブリック属性となる
	- typeで既存の型に新しい名前(alias)を付けることができます。
	- `AppResult<T> = std::result::Result<T, Box<dyn error::Error>>;` AppResult<T>の別名を与える
		- [ジェネリックなデータ型 - Rust 日本語版](https://man.plustar.jp/rust/book/ch10-01-syntax.html)
		- [std::result - Rust](https://doc.rust-lang.org/std/result/)
			- Result<T, E> は、エラーを返したり伝搬したりするのに使われる型である。Ok(T)は成功を表し、値を含み、Err(E)はエラーを表し、エラー値を含む。
		- [Box, スタックとヒープ - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/std/box.html)
		- [エラーをBoxする - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/error/multiple_error_types/boxing_errors.html)
		- [dynを利用してトレイトを返す - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/trait/dyn.html?highlight=dyn#dyn%E3%82%92%E5%88%A9%E7%94%A8%E3%81%97%E3%81%A6%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88%E3%82%92%E8%BF%94%E3%81%99)
- Line 8.
	- struct: [構造体 - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/custom_types/structs.html?highlight=struct#%E6%A7%8B%E9%80%A0%E4%BD%93)
	- [基本データ型 - Rust By Example 日本語版](https://doc.rust-jp.rs/rust-by-example-ja/primitives.html?highlight=bool#%E3%82%B9%E3%82%AB%E3%83%A9%E3%83%BC%E5%9E%8B)
	- トレイトの実装は impl A for B
        - トレイト: 共通の振る舞いを定義するトレイトは、Rustコンパイラに、特定の型に存在し、他の型と共有できる機能について知らせます。 トレイトを使用すると、共通の振る舞いを抽象的に定義できます。トレイト境界を使用すると、 あるジェネリックが、特定の振る舞いをもつあらゆる型になり得ることを指定できます。
	
```

``` rust title="理解したいコード"
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

``` rust title=""
use ratatui_sample::app::{App, AppResult};
```

上記use宣言後にAppは`ratatui_sample::app::App`と等価となり、いちいちスコープを書かなくていい。
