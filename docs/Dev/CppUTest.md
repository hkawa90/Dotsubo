# CppUTest unit testing and mocking framework for C/C++

- CppUTest
    - [Cpputest Manual](http://cpputest.github.io/manual.html)

## はじめに

### インストール
#### ソースから
必要なもの：
+ コンパイラ
+ CMake

```shell
git clone git://github.com/cpputest/cpputest.git
cd cpputest
mkdir build && cd build
cmake ..
make
make install
```

#### apt

```shell
sudo apt install cpputest
```

## 基本的な使用方法

### テスト対象コード例

```c title="target.c"
// a+bを返す
int sum(int a, int b) {
  return a + b;
}
```

### テストコード例

```cpp title="main.cpp"
#include "CppUTest/CommandLineTestRunner.h"

int main(int ac, char** av)
{
    return CommandLineTestRunner::RunAllTests(ac, av);
}
```

```cpp title="test.cpp"
#include "CppUTest/CommandLineTestRunner.h"
#include <iostream>

#ifdef __cplusplus
extern "C" {
    extern int sum(int v1, int v2);
}
#endif  // __cplusplus

// 各テスト実行時の定義をテストグループとして定義します
TEST_GROUP(TestFuncGroup)
{
    // 各テストケースの実行直前に実行するメソッド
    // 主に必要なリソースの確保などを行う
    TEST_SETUP()
    {
    	//
    }

    // 各テストケースの実行直後に実行するメソッド
    // 主に後始末をここで行う。
    TEST_TEARDOWN()
    {
	//
    }
};

// テストを実行するメソッド
// TEST(テストグループ名称, テスト名称)
// テスト実行時の進捗・実行結果時に使用される。
TEST(TestFuncGroup, Test1)
{
    // テスト対象を実行
    int ret = sum(1, 2);
    // 実行結果を検証 : 下記では第１引数と第２引数が同じことを期待する
    //                          一致しない場合、テストは失敗(NG)となる。
    // マクロ定義されている。
    CHECK_EQUAL(3, ret);
}
```

他のマクロ群：

- IGNORE_TEST(testGroup, testName) - テスト対象から除外。一時的に実施しないようにするため先頭にIGNORE_を付与。
- CHECK(boolean condition) - checks any boolean result.
- CHECK_TEXT(boolean condition, text) - checks any boolean result and prints text on failure.
- CHECK_FALSE(condition) - checks any boolean result
- CHECK_EQUAL(expected, actual) - checks for equality between entities using ==. So if you have a class that supports operator==() you can use this macro to compare two instances. You will also need to add a StringFrom() function like those found in SimpleString. This is for printing the objects when the check failed.
- CHECK_COMPARE(first, relop, second) - checks thats a relational operator holds between two entities. On failure, prints what both operands evaluate to.
- CHECK_THROWS(expected_exception, expression) - checks if expression throws expected_exception (e.g. std::exception). CHECK_THROWS is only available if CppUTest is built with the Standard C++ Library (default).
- STRCMP_EQUAL(expected, actual) - checks const char* strings for equality using strcmp().
- STRNCMP_EQUAL(expected, actual, length) - checks const char* strings for equality using strncmp().
- STRCMP_NOCASE_EQUAL(expected, actual) - checks const char* strings for equality, not considering case.
- STRCMP_CONTAINS(expected, actual) - checks whether const char* actual contains const char* expected.
- LONGS_EQUAL(expected, actual) - compares two numbers.
- UNSIGNED_LONGS_EQUAL(expected, actual) - compares two positive numbers.
- BYTES_EQUAL(expected, actual) - compares two numbers, eight bits wide.
- POINTERS_EQUAL(expected, actual) - compares two pointers.
- DOUBLES_EQUAL(expected, actual, tolerance) - compares two floating point numbers within some tolerance
- FUNCTIONPOINTERS_EQUAL(expected, actual) - compares two void (*)() function pointers
- MEMCMP_EQUAL(expected, actual, size) - compares two areas of memory
- BITS_EQUAL(expected, actual, mask) - compares expected to actual bit by bit, applying mask
- FAIL(text) - always fails

### build方法
   
上記target.c, main.cpp, test.cppをコンパイルして、CppUTest CppUTestExtとリンクする。

### 実行方法

通常のプログラムとして実行する。

## Mockの使い方

### Mockとは

> モックオブジェクトとは、ソフトウェアテスト時、特にテスト駆動開発、ビヘイビア駆動開発における代用の下位モジュールスタブの一種。スタブと比較して、検査対象のモジュールがその下位モジュールを正しく利用しているかどうかを検証するのに使われる。 
>
> − ウィキペディア

CppUtestではテストコードからmockへの呼び出しにおいて、mockの動作定義(引数のチェックおよび戻り値)を行うことができます。

#### C interface

C 言語版Mockの使い方を説明します。

C言語インタフェースでは`CppUTestExt/MockSupport_c.h'をインクルードします。

```c title="テストコード：test_target.c"
extern int f1(int);

int sum(int a, int b)
{
    return f1(a) + f1(b);
}
```

```c title="Mock: mock.c"
#include "CppUTestExt/MockSupport_c.h"

int f1(int a)
{
    return mock_c()
        ->actualCall("f1")
        ->withIntParameters("a", 1)
        ->returnValue().value.intValue;
}
```

```cpp title="テストコード：main.cpp"
#include "CppUTest/CommandLineTestRunner.h"
#include "CppUTestExt/MockSupport_c.h"

extern "C" {
    extern int sum(int, int);
}

// テストグループを定義
TEST_GROUP(TestFuncGroup) {
    // 各テストケースの実行直前に呼ばれる仮想メソッド
    TEST_SETUP() {
    }

    // 各テストケースの実行直後に呼ばれる仮想メソッド
    TEST_TEARDOWN() {
        mock_c()->checkExpectations();
        mock_c()->removeAllComparatorsAndCopiers();
        mock_c()->clear(); // Mock資源をクリア
    }
};

TEST(TestFuncGroup, f1)
{
    // ◎C言語インタフェースのmockの動作定義を行う
    // 関数f1は２回呼ばれ、引数`a'はint型で値が１であること、
    // 戻り値はint型の１である。
    
    mock_c()
        ->expectNCalls(2,"f1") // 1回のみ:expectOneCall, 0回:expectNoCall
        ->withIntParameters("a", 1) // ★
        ->andReturnIntValue(1); // ★★
    // ◎テストコードを実行
    int ret = sum(1, 1);
    // mockが期待された使い方をされたか確認
    mock_c()->checkExpectations();
    
    CHECK_EQUAL(2, ret);
}
```

★引数指定：
組み込み型やユーザ定義を規定するものが用意されている。

```
withBoolParameters: bool
withIntParameters: int
withUnsignedIntParameters: unsigned int
withLongIntParameters: long int
withUnsignedLongIntParameters: unsigned long int
withLongLongIntParameters: long long int
withUnsignedLongLongIntParameters: unsigned long long int
withDoubleParameters: double
withStringParameters: char *
withPointerParameters: void *
withConstPointerParameters : const void *
withFunctionPointerParameters: func
withMemoryBufferParameter:unsgined char *
withParameterOfType: void *: ユーザ定義（後述）
withOutputParameter:
withOutputParameterOfType: 
```

★★戻り値指定：

```
andReturnBoolValue:
andReturnUnsignedIntValue:
andReturnIntValue:
andReturnLongIntValue:
andReturnUnsignedLongIntValue:
andReturnLongLongIntValue:
andReturnUnsignedLongLongIntValue:
andReturnDoubleValue:
andReturnStringValue:
andReturnPointerValue:
andReturnConstPointerValue:
andReturnFunctionPointerValue:
```
ユーザ定義引数の処理

書式は以下の通りで

```
.withParameterOfType("myType", "parameterName", object);
```

引数チェックのため、次の２つの関数を実装する必要がある。

```
int _IsEqual(const void* object1, const void* object2);
const char *_ToString(const void* object);
```

```c title="テストコード：test_target.c"
struct userInfo {
    int num;
    char *name;
};
extern int f2(struct userInfo*);

int addUser(struct userInfo* user)
{
    return f2(user);
}
```

```c title="mock.c"
int f2(struct userInfo*user)
{
    struct userInfo u;
    u.num = 1;
    u.name = "nobody";
    
    return mock_c()
        ->actualCall("f2")
        ->withParameterOfType("struct userInfo", "user", &u)
        ->returnValue().value.intValue;
}
```

```cpp title="main.cpp"
TEST(TestFuncGroup, f2)
{
    struct userInfo user;
    mock_c()->installComparator("struct userInfo", UserInfoIsEqual, UserInfoToString);

    mock_c()
        ->expectNCalls(1,"f2")
        ->withParameterOfType("struct userInfo", "user", &user)
        ->andReturnIntValue(0);
    user.num = 1;
    user.name = "nobody";
    int ret = addUser(&user);
    mock_c()->checkExpectations();
    CHECK_EQUAL(0, ret);
}
```

引数で値を返すもの(stat など)

```cpp title="test_target.cpp"
int isExistFile(const char *path)
{
    struct stat st;

    if (stat(path, &st) != 0)
    {
        return 0;
    }
    return (st.st_mode & S_IFMT) == S_IFREG;
}

int isExistAppDataFile()
{
    return isExistFile("/opt/app/data/data.dat");
}
```

```c title="mock.c"
int stat(const char *pathname, struct stat *buf)
{
    struct stat s;
    s.st_dev = 1;
    s.st_ino = 100;
    s.st_mode = 2;
    s.st_nlink = 3;
    s.st_uid = 4;
    s.st_gid = 5;
    s.st_rdev = 0;
    s.st_size = 1024;
    s.st_blksize = 4096;
    s.st_blocks = 6;

    return mock_c()
        ->actualCall("stat")
        ->withStringParameters("pathname", pathname)
        ->withOutputParameterOfType("struct stat*", "buf", &s)
        ->returnValue().value.intValue;
}
```

```cpp title="main.cpp"
extern "C" {
    extern int isExistAppDataFile(void);
}

void stat_copier(void* out, const void* in)
{
    memcpy(out, in, sizeof(struct stat));
}

TEST(TestFuncGroup, stat)
{
    struct stat s;
    s.st_dev = 1;
    s.st_ino = 100;
    s.st_mode = 2;
    s.st_nlink = 3;
    s.st_uid = 4;
    s.st_gid = 5;
    s.st_rdev = 0;
    s.st_size = 1024;
    s.st_blksize = 4096;
    s.st_blocks = 6;

    mock_c()->installCopier("struct stat*", stat_copier);

    mock_c()
        ->expectNCalls(1,"stat")
        ->withStringParameters("pathname", "/opt/app/data/data.dat")
        ->withOutputParameterOfTypeReturning("struct stat*", "buf", &s)
//        ->withParameterOfType("struct stat*", "buf", &s) 
        ->andReturnIntValue(0);
    int ret = isExistAppDataFile();
    mock_c()->checkExpectations();
    CHECK_EQUAL(0, ret);
}
```

## 参考文献
- [Cpputestでモックなしではテストできないようなシステム関数を置き換えてみました。 - Qiita](https://qiita.com/tchofu/items/b09799aec4d190bfb77f)
- [CppUMock (翻訳) - Qiita](https://qiita.com/ymdymd/items/1ee156b84a58ed9d78f3)
- [CppUMockの使い方これで合ってる？ - Qiita](https://qiita.com/tk23ohtani/items/55faa7564cfa55e83946)
- [CppUTest+CppUMockで組み込みテスト:家庭用コンピュータ環境の模索](http://park11.wakwak.com/~nkon/homepc/cpputest/)


## テスト有用なもの
### official scipt

cloneしたscriptに下記スクリプトがある。

テスト用ソースコードのテンプレートを作成。

- NewClass.sh - for TDDing a new C++ class
- NewInterface.sh - for TDDing a new interface along with its Mock
- NewCModule.sh - for TDDing a C module
- NewCmiModule.sh - for TDDing a C module where there will be multiple instances of the module's data structure

### NewCModule.sh

C言語のモジュールテスト用テンプレート作成。

作成されたコード：

```cpp title="Target.cpp"
#include "Target.h"

void Target_Create(void)
{
}

void Target_Destroy(void)
{
}
```

```c title="Target.h"
#ifndef D_Target_H
#define D_Target_H

/**********************************************************
 *
 * Target is responsible for ...
 *
 **********************************************************/

void Target_Create(void);
void Target_Destroy(void);

#endif  /* D_FakeTarget_H */
```

```shell title="cpputestのインストールパスを設定して実行"
export CPPUTEST_HOME=$HOME/cpputest
$CPPUTEST_HOME/script/NewCModule.sh a [b]
```
NewCModule.shの第２引数は省略可で、第１引数の名称のソースコード作成。

#### 参考文献
- [CppUMockGen](https://github.com/jgonzalezdr/CppUMockGen)

### CppUMockGen

ヘッダからMockを作成してくれる。

```shell title="Install CppUMockGen"
sudo apt install libclang-dev
git clone https://github.com/jgonzalezdr/CppUMockGen.git
cd CppUMockGen/
mkdir build_gcc
cd build_gcc
cmake ..
make
```