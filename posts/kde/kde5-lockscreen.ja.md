---
lang: ja
date: 2024-03-05
title: KDE 5のロック画面の揺れを止める
---

<video controls loop src="https://github.com/scarf005/blog/assets/54838975/16c977be-1a6b-4f3b-b243-763f6b0f158d"></video>

## 概要

KDE 5のロック画面でパスワードが間違っていると入力欄が左右に揺れる。

<video controls loop src="https://github.com/scarf005/blog/assets/54838975/f6f2526e-32ae-46a3-ada0-25534b30cd20"></video>

## 解決方法

### アニメーション速度を調整

![image](https://github.com/scarf005/blog/assets/54838975/a539d1a6-4d4d-43d6-af6f-8dbd0b43bcc3)

- アニメーション速度を `即時` に設定
- 長所: 最も簡単
- 短所: 他のアニメーションが使えなくなる

### システムテーマを修正

- `org.breeze.desktop` に [テーマからアニメーションを削除](#テーマからアニメーションを削除) だけ適用
- 長所: 簡単
- 短所: グローバル設定を変更する

### ユーザーテーマを作成

- 長所: グローバル設定を変更しない
- 短所: 複雑で多くのディレクトリをコピーする必要がある

## 解決

### [既存テーマをコピー](https://userbase.kde.org/Plasma/Create_a_Global_Theme_Package#How_to_create_your_own_Look_and_Feel_package)

```sh
$ mkdir -p ~/.local/share/plasma/look-and-feel/
$ cd ~/.local/share/plasma/look-and-feel/

$ cp -R /usr/share/plasma/look-and-feel/org.kde.breeze.desktop/ ./org.scarf.breeze.desktop
$ cp -R /usr/share/plasma/look-and-feel/org.kde.breezetwilight.desktop/ ./org.scarf.breezetwilight.desktop
```

### テーマからアニメーションを削除

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

### `breezetwilight` に `contents/lockscreen` をコピー

```sh
$ cp -R org.scarf.breeze.desktop/contents/lockscreen/ org.scarf.breezetwilight.desktop/contents/lockscreen/
$ cp -R org.scarf.breeze.desktop/contents/components/ org.scarf.breezetwilight.desktop/contents/components/
$ cp -R org.scarf.breeze.desktop/contents/osd/ org.scarf.breezetwilight.desktop/contents/osd/
```

- `contents/defaults` から別テーマの `lockscreen` を指定できないように見える

### QMLバージョンを更新

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

## 適用

### テーマ追加の確認

![全体テーマ - システム設定](https://github.com/scarf005/blog/assets/54838975/802cd486-ec9c-4aac-8596-1dc2655f3b26)

```sh
$ lookandfeeltool --list
org.scarf.breeze.desktop
org.scarf.breezetwilight.desktop
org.kde.breeze.desktop
org.kde.breezedark.desktop
org.kde.breezetwilight.desktop
org.kubuntu.desktop
```

### テスト

```sh
$ /usr/lib/x86_64-linux-gnu/libexec/kscreenlocker_greet --testing --theme=org.scarf.breezetwilight.desktop
```

<video controls loop src="https://github.com/scarf005/blog/assets/54838975/99f27ab9-985b-4687-a9aa-89c58fa52a61"></video>

### 使用

```sh
$ lookandfeeltool --apply org.scarf.breezetwilight.desktop
```

## 参考

- https://github.com/scarf005/breeze-static-lockscreen
