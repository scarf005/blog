---
date: 2025-01-27
title: KDE 6 잠금화면 흔들림 제거
---

<video controls loop src="https://github.com/user-attachments/assets/b2eef35c-0dcc-4632-994f-361b48520d96"></video>

## 개요

KDE 6 잠금화면에서 비밀번호가 틀리면 입력창이 좌우로 요동침

<video controls loop src="https://github.com/user-attachments/assets/70a7ceef-a26a-4e1d-9a70-724a66de253e"></video>

### 환경

- Fedora 41 (Kinoite)
- KDE Plasma 6.2.5

## 해결 방법

- 로그인 화면의 경우: SDDM 테마를 복제 후 수정
- 잠금 화면의 경우: 사용자 정의 Shell 패키지 설치 후 수정

## 로그인 화면(`SDDM`)에서 로그인 실패 애니메이션 제거

`Main.qml`에서 `rejectPasswordAnimation.start()` 제거

```sh
$ /bin/ls /usr/share/sddm/themes/01-breeze-fedora/
Background.qml      Login.qml  Messages.sh        default-logo.svg  metadata.desktop  theme.conf
KeyboardButton.qml  Main.qml   SessionButton.qml  faces             preview.png
```

```diff
diff --git a/Main.qml b/Main.qml
index f0e8bd4..8093944 100644
--- a/Main.qml
+++ b/Main.qml
@@ -506,7 +506,6 @@ Item {
             footer.enabled = true
             mainStack.enabled = true
             userListComponent.userList.opacity = 1
-            rejectPasswordAnimation.start()
         }
         function onLoginSucceeded() {
             //note SDDM will kill the greeter at some random point after this
```

### 참고

- [kinoite에서 SDDM 수정 내용 적용](./kinoite-sddm.md)

## 잠금 화면에서 로그인 실패 애니메이션 제거

### 사용자 정의 Shell 패키지 설치

```sh
$ kpackagetool6 --install /usr/share/plasma/shells/org.kde.plasma.desktop/
/var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/을(를) 성공적으로 설치했습니다
$ cd /var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/
```

설치한 테마로 이동해 다음 파일 수정:

```diff
diff --git a/contents/lockscreen/LockScreenUi.qml b/contents/lockscreen/LockScreenUi.qml
index 2bcecd7..1f5da10 100644
--- a/contents/lockscreen/LockScreenUi.qml
+++ b/contents/lockscreen/LockScreenUi.qml
@@ -49,7 +49,6 @@ Item {
             lockScreenUi.handleMessage(msg);
             graceLockTimer.restart();
             notificationRemoveTimer.restart();
-            rejectPasswordAnimation.start();
         }
 
         function onSucceeded() {
```

### 사용자 정의 Shell 패키지로 업그레이드

```sh
kpackagetool6 --type Plasma/Shell --upgrade /var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/
파일에서 패키지 업그레이드 중: /var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/
/var/home/scarf/.local/share/plasma/shells/org.kde.plasma.desktop/을(를) 업그레이드했습니다
```

### 테스트

```sh
$ /usr/libexec/kscreenlocker_greet --testing --shell=/var/home/scarf/.local/share/plasma/shells/org.kde.plasma.desktop/
```

<video controls loop src="https://github.com/user-attachments/assets/73505896-6ed1-445b-a311-05581ba071e9"></video>

### 참고

- [KDE 5](./kde5-lockscreen.md)
- https://invent.kde.org/plasma/kscreenlocker/-/merge_requests/232
- https://man.archlinux.org/man/kpackagetool6.1.en
