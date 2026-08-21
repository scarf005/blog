---
date: 2026-08-21
title: 안드로이드 공유탭 정상화
description: 채팅방으로 공유(a.k.a 사회적 자살 버튼) 제거하기
---

### 환경

- Remi Note 13 Pro 5G
- Android 16
- Xiaomi HyperOS 3.0.5.0

## 문제

공유 버튼 클릭시 업무용 메신저에 링크를 잘못 보낼 수 있는 위험이 있음

## 해결

| 전                               | 후                              |
| -------------------------------- | ------------------------------- |
| ![](./android-share-before.webp) | ![](./android-share-after.webp) |

```sh
adb shell settings put global direct_share_enabled 0
```

## 참고

https://www.reddit.com/r/Oppo/comments/1va87f7/how_to_remove_contact_suggestions/