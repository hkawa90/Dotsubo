
# Emacs

ほぼEmacsの設定の備忘録

## 設定の参考

### Font
- [[https://qiita.com/melito/items/238bdf72237290bc6e42][Emacs のフォント設定について]]
- [[https://valignatev.com/posts/emacs-font/][How to change Emacs font with minibuffer together]]
  - [[https://github.com/bbatsov/zenburn-emacs][zenburn-theme for Emacs]]

### 起動
- [[https://qiita.com/j8takagi/items/504ccb86921695bdec13][init.elの設定をコンピューターごとに分岐させる]]
- [[https://stackoverflow.com/questions/5795451/how-to-detect-that-emacs-is-in-terminal-mode][How to detect that emacs is in terminal-mode?]]

## EmacsWiki[^1]

EmacsWikiからの切り抜き

```elisp
;; The Markdown files I write using IA Writer use newlines to separate
;; paragraphs. That's why I need Visual Line Mode. I also need to
;; disable M-q. If I fill paragraphs, that introduces unwanted
;; newlines.
(add-hook 'markdown-mode-hook 'visual-line-mode)
(add-hook 'markdown-mode-hook 'as/markdown-config)
(defun as/markdown-config ()
  (local-set-key (kbd "M-q") 'ignore))
```

[^1]:[EmacsWiki](https://www.emacswiki.org/)