---
date: 2025-08-10
title: 냉혹한 리눅스 Nvidia 절전 모드의 세계
description: Nvidia가 설치된 환경에서 절전 모드 전환시 생기는 다양한 문제와 해결 방법
---

### 환경

- Fedora 42 (Kinoite)
- KDE Plasma 6.4.3
- **Nvidia 575.64.05**

## 절전 모드시 화면 해상도가 작게 줄어듬

- 원인: 불명
- 해결: HDMI/DP2 케이블 뽑았다 다시 꽂기

## 절전 모드시 블루투스가 동작하지 않음

- 현상: `bluetoothctl`을 켜려고 해도 `No default controller available` 발생
- 해결: `btusb` 모듈을 언로드하고 다시 로드

```sh
sudo modprobe -r btusb
sleep 1
sudo service bluetooth restart
sleep 1
sudo modprobe btusb
```

참고: <https://askubuntu.com/questions/1387234/bluetooth-only-works-after-reloading-module-btusb>
