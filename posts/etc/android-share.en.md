---
lang: en
date: 2026-08-21
title: Android share tab normalization
description: Remove the share-to-chat option (a.k.a. the social suicide button)
---

### Environment

- Remi Note 13 Pro 5G
- Android 16
- Xiaomi HyperOS 3.0.5.0

## Problem

Clicking the share button risks accidentally sending a link to a work chat.

## Solution

| Before                           | After                           |
| -------------------------------- | ------------------------------- |
| ![](./android-share-before.webp) | ![](./android-share-after.webp) |

```sh
adb shell settings put global direct_share_enabled 0
```

## Reference

https://www.reddit.com/r/Oppo/comments/1va87f7/how_to_remove_contact_suggestions/
