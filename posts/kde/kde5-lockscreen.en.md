---
lang: en
date: 2024-03-05
title: Remove KDE 5 lock screen shake
---

<video controls loop src="https://github.com/scarf005/blog/assets/54838975/16c977be-1a6b-4f3b-b243-763f6b0f158d"></video>

## Overview

When the password is wrong on the KDE 5 lock screen, the input field shakes left and right.

<video controls loop src="https://github.com/scarf005/blog/assets/54838975/f6f2526e-32ae-46a3-ada0-25534b30cd20"></video>

## Solutions

### Adjust animation speed

![image](https://github.com/scarf005/blog/assets/54838975/a539d1a6-4d4d-43d6-af6f-8dbd0b43bcc3)

- Set animation speed to `Instant`
- Pros: simplest
- Cons: disables other animations

### Modify the system theme

- Apply only the [remove animation](#remove-animation-from-theme) change to `org.breeze.desktop`
- Pros: simple
- Cons: changes global settings

### Create a user theme

- Pros: does not change global settings
- Cons: complex and requires copying many directories

## Fix

### [Copy the original theme](https://userbase.kde.org/Plasma/Create_a_Global_Theme_Package#How_to_create_your_own_Look_and_Feel_package)

```sh
$ mkdir -p ~/.local/share/plasma/look-and-feel/
$ cd ~/.local/share/plasma/look-and-feel/

$ cp -R /usr/share/plasma/look-and-feel/org.kde.breeze.desktop/ ./org.scarf.breeze.desktop
$ cp -R /usr/share/plasma/look-and-feel/org.kde.breezetwilight.desktop/ ./org.scarf.breezetwilight.desktop
```

### Remove animation from theme

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

### Copy `contents/lockscreen` to `breezetwilight`

```sh
$ cp -R org.scarf.breeze.desktop/contents/lockscreen/ org.scarf.breezetwilight.desktop/contents/lockscreen/
$ cp -R org.scarf.breeze.desktop/contents/components/ org.scarf.breezetwilight.desktop/contents/components/
$ cp -R org.scarf.breeze.desktop/contents/osd/ org.scarf.breezetwilight.desktop/contents/osd/
```

- It seems `contents/defaults` cannot point to another theme's lockscreen

### Update QML version

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

## Apply

### Confirm the theme is installed

![Global Theme - System Settings](https://github.com/scarf005/blog/assets/54838975/802cd486-ec9c-4aac-8596-1dc2655f3b26)

```sh
$ lookandfeeltool --list
org.scarf.breeze.desktop
org.scarf.breezetwilight.desktop
org.kde.breeze.desktop
org.kde.breezedark.desktop
org.kde.breezetwilight.desktop
org.kubuntu.desktop
```

### Test

```sh
$ /usr/lib/x86_64-linux-gnu/libexec/kscreenlocker_greet --testing --theme=org.scarf.breezetwilight.desktop
```

<video controls loop src="https://github.com/scarf005/blog/assets/54838975/99f27ab9-985b-4687-a9aa-89c58fa52a61"></video>

### Use

```sh
$ lookandfeeltool --apply org.scarf.breezetwilight.desktop
```

## References

- https://github.com/scarf005/breeze-static-lockscreen
