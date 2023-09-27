## What's

- [junegunn/fzf: :cherry\_blossom: A command-line fuzzy finder](https://github.com/junegunn/fzf#using-git)

## Install

``` shell
sudo apt install fzf
```

## Articles

- [第504回　インタラクティブフィルター「fzf」の活用 | gihyo.jp](https://gihyo.jp/admin/serial/01/ubuntu-recipe/0504)


## Useful Scripts

- [Examples · junegunn/fzf Wiki](https://github.com/junegunn/fzf/wiki/examples)
- [fzfを使って現在起動中のDockerコンテナプロセスに簡単に接続するスクリプト | ゲンゾウ用ポストイット](https://genzouw.com/entry/2023/02/16/084506/3279/)
- [fzf/ADVANCED.md at master · junegunn/fzf](https://github.com/junegunn/fzf/blob/master/ADVANCED.md)


<details>
  <summary>fzf習作</summary>

```shell
#!/bin/bash

SHELL_NAME=docker_cmdr
XDG_LOCAL_SHARE=.local/share
CONF_FILE=$HOME/$XDG_LOCAL_SHARE/$SHELL_NAME/config.sh
HIST_FILE_PREFIX=$HOME/$XDG_LOCAL_SHARE/$SHELL_NAME/his-
RUN_PORT_HIS="${HIST_FILE_PREFIX}port.txt"
RUN_WKDIR_HIS="${HIST_FILE_PREFIX}wd.txt"
RUN_MNT_HIS="${HIST_FILE_PREFIX}mt.txt"
RUN_OPT_HIS="${HIST_FILE_PREFIX}opt.txt"
KEYIN_MSG="Input keyboard."


# Desc:文字列の配列からfzfで選択
# Example
# op=(remove history remove_force inspect save)
# selection=`fzf_selection "${op[*]}" "hoge---"`
# echo $selection
function fzf_selection() {
    list=$1
    header=$2
    local selection=$(echo ${list[*]} | tr " " "\n" | fzf --header=${header} --reverse --height 40%)
    echo $selection
}

# Desc:
# Example
# selection=`fzf_selection_history $PORT_HIS "hoge---"`
# echo $selection
function fzf_selection_history() {
    his_file=$1
    header=$2
    echo $his_file 1>&2
    echo $header 1>&2
    local selection=$(cat $his_file | fzf --header="${header}" --reverse --height 40%)
    echo $selection
}

#----- DOCKER IMAGE -----

function run_image() {
    image=$1
    local opt=""
    op=(port workdir rm it detach mount optional)
    selection=`fzf_selection "${op[*]}" "Select operation(You can select multiple items using the tab key.):"`
    if [[ "$selection" == *port* ]]; then
	op_tmp=`fzf_selection_history $RUN_PORT_HIS "Select operation:"`
	if [[ "$op_tmp" == $KEYIN_MSG ]]; then
	    echo "Input option.(eg: 80:80)"
	    read op_tmp
	    #update history
	    echo $op_tmp >> $RUN_PORT_HIS
	fi
	opt="${opt} -p ${op_tmp}"
    fi
    if [[ "$selection" == *workdir* ]]; then
	op_tmp=`fzf_selection_history $RUN_WKDIR_HIS "Select operation:"`
	if [[ "$op_tmp" == $KEYIN_MSG ]]; then
	    echo "Input work directory."
	    read op_tmp
	    #update history
	    echo $op_tmp >> $RUN_WKDIR_HIS
	fi
	opt="${opt} --workdir ${op_tmp}"
    fi
    if [[ "$selection" == *rm* ]]; then
        opt="${opt} --rm"
    fi
    if [[ "$selection" == *it* ]]; then
        opt="${opt} -it"
    fi
    if [[ "$selection" == *detach* ]]; then
        opt="${opt} -d"      
    fi
    if [[ "$selection" == *mount* ]]; then
	op_tmp=`fzf_selection_history $RUN_MNT_HIS "Select operation:"`
	if [[ "$op_tmp" == $KEYIN_MSG ]]; then
	    echo "Input mount option."
	    read op_tmp
	    #update history
	    echo $op_tmp >> $RUN_MNT_HIS
	fi
	opt="${opt} --mount ${op_tmp}"
    fi
    if [[ "$selection" == *optional* ]]; then
	op_tmp=`fzf_selection_history $RUN_OPT_HIS "Select operation:"`
	if [[ "$op_tmp" == $KEYIN_MSG ]]; then
	    echo "Input additional option."
	    read op_tmp
	    #update history
	    echo $op_tmp >> $RUN_OPT_HIS
	fi
	opt="${opt} ${op_tmp}"
    fi
    echo $opt $image
#    docker run $opt $image
}

function remove_image() {
    image=$1
    docker rmi $image
}

function remove_image_force() {
    image=$1
    docker rmi -f $image
}

function history_image() {
    image=$1
    docker history $image
}

function inspect_image() {
    image=$1
    docker inspect $image
}

function save_image() {
    image=$1
    echo "Inpu tar filename ?"
    read tar_filename
    docker image save -o tar_filename $image
}

function docker_images () {
    # [Format command and log output | Docker Docs](https://docs.docker.com/config/formatting/)
    image=$(docker images | fzf --reverse --header-lines=1| awk '{print $3}')

    op=(remove history remove_force inspect save)
    selection=`fzf_selection "${op[*]}" "Select operation:"`
    case $selection in
	"run" ) run_image $image;;
	"history" ) history_image $image;;
	"remove_force" ) remove_image_force $image;;
	"remove" ) remove_image $image;;
	"inspcect" ) inspect_image $image;;
	"save" ) save_image $image;;
    esac
}

#----- DOCKER CONTAINER -----

function rm_container() {
    container_id=$1

    echo "rm ${container_id}"
    echo "Is it OK?"
    read enter

    docker rm $container_id
}

function attach_container() {
    container_id=$1

    echo "attach ${container_id}"
    echo "Is it OK?"
    read enter

    docker attach $container_id
}

function commit_container() {
    container_id=$1

    echo "commit ${container_id}"
    echo "Is it OK?"
    read enter

    docker commit $container_id
}

function cp_container() {
    container_id=$1
    echo "Input source(eg. CONTAINER:/tmp/tmp.file"
    read input
    echo "Input destination"
    read destination
    input=$(echo $input | sed "s/CONTAINER/${container_id}/")
    destination=$(echo $destination | sed "s/CONTAINER/$container_id/")

    echo "cp ${container_id}"
    echo "Is it OK?"
    read enter

    docker cp $input $destination
}

function rm_container() {
    container_id=$1

    echo "rm ${container_id}"
    echo "Is it OK?"
    read enter

    docker rm $container_id
}

function docker_container() {
    echo "container"
    container=$(docker ps -a | fzf --reverse --header-lines=1| awk '{print $1}')
    op=(attach commit cp create exec logs rm run)
    selection=`fzf_selection "${op[*]}" "Select operation:"`

    case $selection in
	"attach" ) attach_container $container;; # to running docker process
	"commit" ) commit_container $container;;
	"cp" ) cp_container $container;;
	"create" ) create_container $container;;
	"exec" ) exec_container $container;;
	"logs" ) logs_container $container;;
	"rm" ) rm_container $container;;
    esac
    
}

#----- CMDR -----

function init_cmdr_env() {
    if [ ! -d $HOME/$XDG_LOCAL_SHARE/$SHELL_NAME ];then
       echo "Create Directory"
       mkdir -p $HOME/$XDG_LOCAL_SHARE/$SHELL_NAME
    fi
    if [ -e "$CONF_FILE" ]; then
        echo "$CONF_FILE"
        . $CONF_FILE
    else
        touch $CONF_FILE
    fi
    if [ ! -e "$RUN_PORT_HIS" ]; then
        echo "$RUN_PORT_HIS"
        echo $KEYIN_MSG > $RUN_PORT_HIS
        if [ ${#CONF_DEFAULT_PORT_MAPPING} -ne 0 ]; then
            CONF_DEFAULT_PORT_MAPPING="80:80"
        fi
        echo $CONF_DEFAULT_PORT_MAPPING >> $RUN_PORT_HIS
    fi
    if [ ! -e "$RUN_WKDIR_HIS" ]; then
        echo "$RUN_WKDIR_HIS"
        echo $KEYIN_MSG > $RUN_WKDIR_HIS
        if [ ${#CONF_DEFAULT_WKDIR} -ne 0 ]; then
            CONF_DEFAULT_WKDIR="/tmp"
        fi
        echo $CONF_DEFAULT_WKDIR >> $RUN_WKDIR_HIS
    fi
    if [ ! -e "$RUN_MNT_HIS" ]; then
        echo "$RUN_MNT_HIS"
        echo $KEYIN_MSG > $RUN_MNT_HIS
        if [ ${#CONF_DEFAULT_MNT} -ne 0 ]; then
            CONF_DEFAULT_MNT="type=bind,src=$(pwd),dst=/code"
        fi
        echo $CONF_DEFAULT_MNT >> $RUN_MNT_HIS
    fi
    if [ ! -e "$RUN_OPT_HIS" ]; then
        echo "$RUN_OPT_HIS"
        echo $KEYIN_MSG > $RUN_OPT_HIS
        if [ ${#CONF_DEFAULT_OPT} -ne 0 ]; then
            CONF_DEFAULT_OPT=""
        fi
        echo $CONF_DEFAULT_OPT >> $RUN_OPT_HIS
    fi
}

# --- main ---
if [ $# -eq 1 ]; then
    # get op
    op_in=$1
    case $op_in in
        "init" ) init_cmdr_env;;
	"images" ) docker_images;;
	"container" ) docker_container;;
    esac
elif [ $# -eq 0 ]; then
    docker_images
else
    echo "Invalid arguments"
fi
```

</details>
