---
title: Docker sample
description: C/CPP開発環境
tags: [Docker, Dev]
---

# C/CPP開発環境

TODO: sudoの動作確認

```
FROM ubuntu:20.04 AS base

ARG user
ARG userid

RUN test -n "$user"
RUN test -n "$userid"

RUN apt-get update
RUN DEBIAN_FRONTEND="noninteractive" apt-get -y install tzdata
RUN apt-get -y install \
    sudo \
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

RUN echo "$user ALL=(ALL:ALL) ALL" >> /etc/sudoers

WORKDIR /code

# add same user
RUN groupadd -r $user && useradd -r -m -u $userid -g $user $user
USER $user
```