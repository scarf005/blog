---
date: 2024-03-05
title: KDE 잠금화면 흔들림 제거
---

<video controls loop src="https://github.com/scarf005/blog/assets/54838975/16c977be-1a6b-4f3b-b243-763f6b0f158d"></video>

## 개요

KDE 5 잠금화면에서 비밀번호가 틀리면 입력창이 좌우로 요동침

<video controls loop src="https://github.com/scarf005/blog/assets/54838975/f6f2526e-32ae-46a3-ada0-25534b30cd20"></video>

## 해결 방법

### 애니메이션 속도 조절

![image](https://github.com/scarf005/blog/assets/54838975/a539d1a6-4d4d-43d6-af6f-8dbd0b43bcc3)

- 애니메이션 속도를 `즉시`로 변경
- 장점: 가장 간단함
- 단점: 다른 애니메이션을 사용 불가

### 시스템 테마 수정

- `org.breeze.desktop` 대상으로 [애니메이션 제거](#테마에서-애니메이션-제거)만 진행
- 장점: 간단함
- 단점: 전역 설정을 수정해야 함

### 사용자 테마 생성

- 장점: 전역 설정을 수정하지 않음
- 단점: 복잡하고 중복된 디렉터리들을 다수 복사해야 함

## 해결

### [기존 테마 복사](https://userbase.kde.org/Plasma/Create_a_Global_Theme_Package#How_to_create_your_own_Look_and_Feel_package)

```sh
$ mkdir -p ~/.local/share/plasma/look-and-feel/
$ cd ~/.local/share/plasma/look-and-feel/

$ cp -R /usr/share/plasma/look-and-feel/org.kde.breeze.desktop/ ./org.scarf.breeze.desktop
$ cp -R /usr/share/plasma/look-and-feel/org.kde.breezetwilight.desktop/ ./org.scarf.breezetwilight.desktop
```

### 테마에서 애니메이션 제거

```sh
$ rm -r scarf.breeze.desktop/contents/animation
$ rm -r scarf.breezetwilight.desktop/contents/animation
```

```diff
diff --git a/org.scarf.breeze.desktop/contents/lockscreen/LockScreenUi.qml b/org.scarf.breeze.desktop/contents/lockscreen/LockScreenUi.qml
index c39cdb6..c23a95b 100644
--- a/org.scarf.breeze.desktop/contents/lockscreen/LockScreenUi.qml
+++ b/org.scarf.breeze.desktop/contents/lockscreen/LockScreenUi.qml
@@ -16,7 +16,6 @@ import org.kde.plasma.workspace.components 2.0 as PW

 import org.kde.plasma.private.sessions 2.0
 import "../components"
-import "../components/animation"

 PlasmaCore.ColorScope {

@@ -37,7 +36,6 @@ PlasmaCore.ColorScope {
             root.notification += i18nd("plasma_lookandfeel_org.kde.lookandfeel","Unlocking failed");
             graceLockTimer.restart();
             notificationRemoveTimer.restart();
-            rejectPasswordAnimation.start();
             lockScreenUi.hadPrompt = false;
         }

@@ -108,11 +106,6 @@ PlasmaCore.ColorScope {
         visible: false
     }

-    RejectPasswordAnimation {
-        id: rejectPasswordAnimation
-        target: mainBlock
-    }
-
     MouseArea {
         id: lockScreenRoot
```

### `breezetwilight`에 `contents/lockscreen` 복사

```sh
$ cp -R org.scarf.breeze.desktop/contents/lockscreen/ org.scarf.breezetwilight.desktop/contents/lockscreen/
$ cp -R org.scarf.breeze.desktop/contents/components/ org.scarf.breezetwilight.desktop/contents/components/
$ cp -R org.scarf.breeze.desktop/contents/osd/ org.scarf.breezetwilight.desktop/contents/osd/
```

- `contents/defaults`에서 다른 테마의 `lockscreen` 지정이 불가능한 것으로 보임

### QML 버전 업데이트

```diff
diff --git a/32c6e6e b/61f84b6
index 32c6e6e..61f84b6 100644
--- a/32c6e6e
+++ b/61f84b6
@@ -141,5 +141,6 @@
         "Version": "2.0",
         "Website": "https://www.kde.org"
     },
+    "X-Plasma-APIVersion": "2",
     "X-Plasma-MainScript": "defaults"
 }
```

- https://old.reddit.com/r/kde/comments/ylp820/how_to_debug_lock_screen_theme_qml/
- https://invent.kde.org/plasma/kscreenlocker/-/merge_requests/59

## 적용

### 신규 테마 추가 여부 확인

![전역 테마 - 시스템 설정](https://github.com/scarf005/blog/assets/54838975/802cd486-ec9c-4aac-8596-1dc2655f3b26)

```sh
$ lookandfeeltool --list
org.scarf.breeze.desktop
org.scarf.breezetwilight.desktop
org.kde.breeze.desktop
org.kde.breezedark.desktop
org.kde.breezetwilight.desktop
org.kubuntu.desktop
```

### 테스트

```sh
$ /usr/lib/x86_64-linux-gnu/libexec/kscreenlocker_greet --testing --theme=org.scarf.breezetwilight.desktop
```

<video controls loop src="https://github.com/scarf005/blog/assets/54838975/99f27ab9-985b-4687-a9aa-89c58fa52a61"></video>

### 사용

```sh
$ lookandfeeltool --apply org.scarf.breezetwilight.desktop
```

## 참고

- https://github.com/scarf005/breeze-static-lockscreen
