---
title: Docker sample
description: C/CPP開発環境
tags: [Docker, Dev]
---

# C/CPP開発環境

```
FROM ubuntu:20.04 AS base

ARG user
ARG userid

RUN test -n "$user"
RUN test -n "$userid"

RUN apt-get update
RUN DEBIAN_FRONTEND="noninteractive" apt-get -y install tzdata
RUN apt-get -y install \
    build-essential \
    lldb \
    curl \
    git \
    libgtest-dev \
    software-properties-common \
    valgrind \
    wget \
    pkg-config \
    doxygen \
    graphviz \
    python3 \
    clang-10 \
    clang-format-10 \
    clang-tidy-10 \ 
    cmake \
    python3-pip

# get pip
RUN pip3 install ninja meson gcovr

# install google benchmark
WORKDIR /root/Downloads
RUN cd /root/Downloads && \
    git clone --depth 1 --single-branch https://github.com/google/benchmark.git && \
    mkdir benchmark/build && \
    cd benchmark/build && \
    cmake .. -DCMAKE_BUILD_TYPE=RELEASE -DBENCHMARK_ENABLE_GTEST_TESTS=OFF && \
    make -j 8 && \
    make install && \
    rm -rf /root/Downloads/benchmark

ENV PATH="${PATH}:/usr/lib/llvm-10/bin/"
ENV PATH="${PATH}:/usr/lib/llvm-10/share/clang"
RUN sed -i 's/subprocess.call(invocation)/subprocess.call(invocation, cwd=args.build_path)/g' /usr/lib/llvm-10/share/clang/run-clang-tidy.py

WORKDIR /code

# add same user
RUN groupadd -r $user && useradd -r -m -u $userid -g $user $user
USER $user
```

```shell title="build(要user/userid)"
export user="hogehoge"
export userid=1000
sudo docker build -t meson --build-arg user=$user --build-arg userid=$user .
```

```shell title="ユーザ権限で実行"
sudo docker run -v $(pwd):/code -it meson
```

```shell title="rootで作業したい場合は"
sudo docker run -u 0 -it コンテナID bash
# or
sudo docker exec -u 0 -it コンテナID bash
```

detach(切り離し)[^1]したい場合はCtrl-P, Ctrl-Qで。

[^1]:コンテナを終了しないでバックグラウンドで動作させること。