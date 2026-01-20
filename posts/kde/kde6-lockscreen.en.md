---
lang: en
date: 2025-01-27
title: Remove KDE 6 lock screen shake
---

<video controls loop src="https://github.com/user-attachments/assets/b2eef35c-0dcc-4632-994f-361b48520d96"></video>

## Overview

When the password is wrong on the KDE 6 lock screen, the input field shakes left and right.

<video controls loop src="https://github.com/user-attachments/assets/70a7ceef-a26a-4e1d-9a70-724a66de253e"></video>

### Environment

- Fedora 41 (Kinoite)
- KDE Plasma 6.2.5

## Fixes

- For the login screen: edit the SDDM theme
- For the lock screen: install a custom shell package and edit it

## Remove the login failure animation in SDDM

Remove `rejectPasswordAnimation.start()` from `Main.qml`.

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

### Reference

- [Apply SDDM changes on kinoite](./kinoite-sddm.en.md)

## Remove the lock screen failure animation

### Install a custom shell package

```sh
$ kpackagetool6 --install /usr/share/plasma/shells/org.kde.plasma.desktop/
/var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/ installed successfully
$ cd /var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/
```

Edit the installed theme:

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

### Upgrade the custom shell package

```sh
kpackagetool6 --type Plasma/Shell --upgrade /var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/
Upgrading package from file: /var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/
/var/home/scarf/.local/share/plasma/shells/org.kde.plasma.desktop/ upgraded
```

### Test

```sh
$ /usr/libexec/kscreenlocker_greet --testing --shell=/var/home/scarf/.local/share/plasma/shells/org.kde.plasma.desktop/
```

<video controls loop src="https://github.com/user-attachments/assets/73505896-6ed1-445b-a311-05581ba071e9"></video>

### References

- [KDE 5](./kde5-lockscreen.en.md)
- https://invent.kde.org/plasma/kscreenlocker/-/merge_requests/232
- https://man.archlinux.org/man/kpackagetool6.1.en
