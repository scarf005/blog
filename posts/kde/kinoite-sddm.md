---
date: 2025-01-27
title: KDE kinoite에서 로그인 화면(SDDM) 배경사진 변경
---

## 개요

![Image](https://github.com/user-attachments/assets/4547f6c4-bc74-4fab-b4db-dada503f4cf8)

1. 로그인 화면(`SDDM`)에서 배경사진을 변경하여도 적용되지 않음
2. 이는 [Kinoite](https://fedoraproject.org/atomic-desktops/kinoite/)가 불변 (immutable) OS이어서 `SDDM` 설정이 저장되는 `/usr/share/sddm` 경로 수정이 불가하기 때문

## 해결책

[사용자가 제어 가능한 경로에 `/usr/share/sddm`를 마운트](https://discussion.fedoraproject.org/t/another-way-to-customize-sddm-under-kinoite/37773)

```sh
$ CUSTOM_PATH=/var
$ sudo cp -r /usr/share/sddm $CUSTOM_PATH
#       src               target        fstype options dump fsck
$ echo "$CUSTOM_PATH/sddm /usr/share/sddm none rbind 0 0" | sudo tee -a /etc/fstab
```

종료 후 재시작하여 변경사항 적용
