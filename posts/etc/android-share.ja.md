---
lang: ja
date: 2026-08-21
title: Android共有シートを正常化
description: "チャットへの共有（別名: 社会的自殺ボタン）を削除する"
---

### 環境

- Remi Note 13 Pro 5G
- Android 16
- Xiaomi HyperOS 3.0.5.0

## 問題

共有ボタンを押すと、業務用メッセンジャーにリンクを誤送信するおそれがある。

## 解決

| 前                               | 後                              |
| -------------------------------- | ------------------------------- |
| ![](./android-share-before.webp) | ![](./android-share-after.webp) |

```sh
adb shell settings put global direct_share_enabled 0
```

## 参考

https://www.reddit.com/r/Oppo/comments/1va87f7/how_to_remove_contact_suggestions/
