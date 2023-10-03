# Shellあれこれ

## SHELL自身のプロセスID

- $$ : 動作しているSHELLプロセス

``` shell title="PIDからシェル名を判定する"
SHELLNAME=`ls -l /proc/$$/exe`
if [[ "$SHELLNAME" == *bash* ]]; then
    echo "bash!"
fi
```

