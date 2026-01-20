---
lang: en
date: 2025-01-27
title: Change the login screen (SDDM) background on KDE Kinoite
---

## Overview

![Image](https://github.com/user-attachments/assets/4547f6c4-bc74-4fab-b4db-dada503f4cf8)

1. Even after changing the login screen (`SDDM`) background, it does not apply
2. This is because [Kinoite](https://fedoraproject.org/atomic-desktops/kinoite/) is immutable and `/usr/share/sddm` cannot be modified

## Fix

[Mount `/usr/share/sddm` to a user-controlled path](https://discussion.fedoraproject.org/t/another-way-to-customize-sddm-under-kinoite/37773)

```sh
$ CUSTOM_PATH=/var
$ sudo cp -r /usr/share/sddm $CUSTOM_PATH
#       src               target        fstype options dump fsck
$ echo "$CUSTOM_PATH/sddm /usr/share/sddm none rbind 0 0" | sudo tee -a /etc/fstab
```

Reboot to apply changes.
