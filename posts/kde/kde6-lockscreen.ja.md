---
lang: ja
date: 2025-01-27
title: KDE 6のロック画面の揺れを止める
---

<video controls loop src="https://github.com/user-attachments/assets/b2eef35c-0dcc-4632-994f-361b48520d96"></video>

## 概要

KDE 6のロック画面でパスワードが間違っていると入力欄が左右に揺れる。

<video controls loop src="https://github.com/user-attachments/assets/70a7ceef-a26a-4e1d-9a70-724a66de253e"></video>

### 環境

- Fedora 41 (Kinoite)
- KDE Plasma 6.2.5

## 解決方法

- ログイン画面: SDDMテーマを複製して修正
- ロック画面: ユーザー定義Shellパッケージをインストールして修正

## ログイン画面(`SDDM`)でログイン失敗アニメーションを削除

`Main.qml` の `rejectPasswordAnimation.start()` を削除する。

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

### 参考

- [kinoiteでSDDMの修正を適用](./kinoite-sddm.ja.md)

## ロック画面でログイン失敗アニメーションを削除

### ユーザー定義Shellパッケージをインストール

```sh
$ kpackagetool6 --install /usr/share/plasma/shells/org.kde.plasma.desktop/
/var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/ をインストールしました
$ cd /var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/
```

インストールしたテーマで以下を修正:

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

### ユーザー定義Shellパッケージへアップグレード

```sh
kpackagetool6 --type Plasma/Shell --upgrade /var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/
ファイルからパッケージをアップグレード中: /var/home/scarf/.local/share/kpackage/generic/org.kde.plasma.desktop/
/var/home/scarf/.local/share/plasma/shells/org.kde.plasma.desktop/ をアップグレードしました
```

### テスト

```sh
$ /usr/libexec/kscreenlocker_greet --testing --shell=/var/home/scarf/.local/share/plasma/shells/org.kde.plasma.desktop/
```

<video controls loop src="https://github.com/user-attachments/assets/73505896-6ed1-445b-a311-05581ba071e9"></video>

### 参考

- [KDE 5](./kde5-lockscreen.ja.md)
- https://invent.kde.org/plasma/kscreenlocker/-/merge_requests/232
- https://man.archlinux.org/man/kpackagetool6.1.en
