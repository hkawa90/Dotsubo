
# Emacs

ほぼEmacsの設定の備忘録

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