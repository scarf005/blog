---
lang: ja
date: 2025-01-05
title: 闇が深いLinux韓国語入力の世界
description: fcitx環境でSteamやその他アプリに韓国語入力する
---

### 環境

- Fedora 42 (Kinoite)
- KDE Plasma 6.4.3
- fcitx5 && fcitx5-hangul

## SteamとSteamゲームで韓国語入力

<video width="460" height="93" autoplay controls loop src="https://github.com/user-attachments/assets/1291f0c8-f812-41d6-a31e-92bbdeef460c"></video>

- 原因: X11アプリでは [XIM](https://en.wikipedia.org/wiki/X_Input_Method) が必要
- 解決: `XMODIFIERS` 環境変数を設定

```sh
YOUR_INPUT_METHOD=fcitx # ibusなどを使う場合は変更

echo "XMODIFIERS=@im=$YOUR_INPUT_METHOD" | sudo tee -a /etc/environment
```

ログアウトして再ログイン後、以下のように表示されれば成功:

```sh
echo $XMODIFIERS $LANG
> @im=fcitx ko_KR.UTF-8
```

参考: <https://wiki.archlinux.org/title/Fcitx5#XIM>

## flatpakアプリで韓国語入力

![](./hangul.kde-open-image.webp)

- 原因: QTアプリでは `QT_IM_MODULE` の設定が必要
- 解決: `/etc/environment` に `QT_IM_MODULE` を追加

```sh
YOUR_INPUT_METHOD=fcitx # ibusなどを使う場合は変更

echo "QT_IM_MODULE=$YOUR_INPUT_METHOD" | sudo tee -a /etc/environment
```

ログアウトして再ログイン後、以下のように表示されれば成功:

```sh
echo $QT_IM_MODULE
> fcitx
```

参考: <https://krita-artists.org/t/i-just-cant-use-ime-to-type-texts-on-linux/113246/2>

## distroboxで導入したアプリで韓国語入力できない

- 原因: distroboxコンテナではホストのIMEパッケージにアクセスできない
- 解決: コンテナ内にIMEパッケージをインストール

```sh
$ distrobox enter <YOUR-CONTAINER-NAME>
$ sudo dnf install fcitx5 fcitx5-hangul
```

## `ㄱㅅ` → `ㄳ`, `ㄱㄱ` → `ㄲ` を防ぐ

- 原因: [libhangul](https://github.com/libhangul/libhangul) は2011年以降リリースされておらず設定APIがない
- 解決: 設定を適用して `libhangul` を手動ビルド

### 環境準備

```sh
git clone https://github.com/libhangul/libhangul
cd libhangul

sudo dnf install gcc make gettext gettext-devel libtool libtoolize aclocal autoconf expat-devel
```

### 設定を適用

- `ㄱㄱ` → `ㄲ` 無効化: 最新gitビルドではデフォルトで無効
- `ㄱㅅ` → `ㄳ` 無効化: `HANGUL_IC_OPTION_NON_CHOSEONG_COMBI` を `false` に変更

```diff
diff --git a/hangul/hangulinputcontext.c b/hangul/hangulinputcontext.c
index ee43f5e..bdd3ad0 100644
--- a/hangul/hangulinputcontext.c
+++ b/hangul/hangulinputcontext.c
@@ -1511,7 +1511,7 @@ hangul_ic_new(const char* keyboard)
 
     hic->option_auto_reorder = false;
     hic->option_combi_on_double_stroke = false;
-    hic->option_non_choseong_combi = true;
+    hic->option_non_choseong_combi = false;
 
     hangul_ic_set_output_mode(hic, HANGUL_OUTPUT_SYLLABLE);
     hangul_ic_select_keyboard(hic, keyboard);
```

クローンしたリポジトリにこの変更を適用。

## ビルドとインストール

```sh
make -j $(nproc)
sudo make install
sudo ldconfig
```

以下のように表示されれば成功:

```sh
ldconfig -p | grep libhangul
        libhangul.so.1 (libc6,x86-64) => /usr/local/lib/libhangul.so.1
        libhangul.so.1 (libc6,x86-64) => /lib64/libhangul.so.1
        libhangul.so (libc6,x86-64) => /usr/local/lib/libhangul.so
```

`/usr/local/lib` などにインストールされ `ldconfig` が読み込めない場合はパスを追加して再実行:

```sh
echo '/usr/local/lib' | sudo tee -a /etc/ld.so.conf.d/usr_local_lib.conf
sudo ldconfig
```

`libhangul.so` が `ldconfig` に反映されたらログアウト・ログインして `fcitx5-hangul` に適用。
