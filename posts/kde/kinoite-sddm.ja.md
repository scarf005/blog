---
lang: ja
date: 2025-01-27
title: KDE Kinoiteでログイン画面(SDDM)の背景を変更する
---

## 概要

![Image](https://github.com/user-attachments/assets/4547f6c4-bc74-4fab-b4db-dada503f4cf8)

1. ログイン画面(`SDDM`)で背景を変更しても反映されない
2. [Kinoite](https://fedoraproject.org/atomic-desktops/kinoite/) はimmutable OSなので `/usr/share/sddm` を編集できないため

## 解決策

[ユーザーが制御できるパスに `/usr/share/sddm` をマウント](https://discussion.fedoraproject.org/t/another-way-to-customize-sddm-under-kinoite/37773)

```sh
$ CUSTOM_PATH=/var
$ sudo cp -r /usr/share/sddm $CUSTOM_PATH
#       src               target        fstype options dump fsck
$ echo "$CUSTOM_PATH/sddm /usr/share/sddm none rbind 0 0" | sudo tee -a /etc/fstab
```

再起動して変更を適用。
