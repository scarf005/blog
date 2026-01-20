---
lang: ja
date: 2025-08-10
title: 闇が深いLinux Nvidiaサスペンドの世界
description: Nvidia環境でのサスペンド問題と対策
---

### 環境

- Fedora 42 (Kinoite)
- KDE Plasma 6.4.3
- **Nvidia 575.64.05**

## サスペンド後に画面解像度が小さくなる

- 原因: 不明
- 解決: HDMI/DP2ケーブルを抜き差しする

## サスペンド後にBluetoothが動かない

- 現象: `bluetoothctl` 起動時に `No default controller available`
- 解決: `btusb` モジュールをアンロードして再ロード

```sh
sudo modprobe -r btusb
sleep 1
sudo service bluetooth restart
sleep 1
sudo modprobe btusb
```

参考: <https://askubuntu.com/questions/1387234/bluetooth-only-works-after-reloading-module-btusb>
