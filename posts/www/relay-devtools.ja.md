---
lang: ja
date: 2024-02-01
title: FirefoxでRelay Devtoolsを使う
---

## 概要

1. [Relay Devtools](https://relay.dev/docs/debugging/relay-devtools/) 拡張機能はFirefoxで[サポートされていない](https://github.com/relayjs/relay-devtools/issues/39)
2. [README手順](https://github.com/relayjs/relay-devtools?tab=readme-ov-file#from-source)どおりにFirefox用拡張機能をビルドすると複数のエラーが発生する

## 解決

### Node 21でnode-gypエラー

- 原因: 古い `fsevents` パッケージのビルド失敗
- 解決: Node 18を使用 (`nvm use 18`)

### yarn v4でworkspace名の重複エラー

- 原因: v1とv4のworkspace構造差
- 解決: yarn v1を使用 (`yarn set version classic`)

### ビルド時に `error:0308010C:digital envelope routines::unsupported`

- 原因: [webpack@v4が古いOpenSSLを使用](https://github.com/webpack/webpack/issues/14532#issuecomment-947012063)
- 解決: `NODE_OPTIONS=--openssl-legacy-provider` を追加

### `shells/firefox/build/RelayDevTools.zip` のインストール失敗

- 原因: 署名されていない拡張機能はインストールできない
- 解決: 公式の[未署名拡張機能の許可](https://support.mozilla.org/ja/kb/add-on-signing-in-firefox#w_wei-shu-ming-noadoonwoshi-itaichang-he-shang-ji-yu-za-xiang-ke)を参照
  1. Firefox Developer Editionをインストール
  2. `about:config` を開く
  3. `xpinstall.signatures.required` を `false` に設定
