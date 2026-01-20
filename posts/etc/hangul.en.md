---
lang: en
date: 2025-01-05
title: The Linux Korean Input *Experience*
description: Typing Korean in Steam and other apps with fcitx
---

### Environment

- Fedora 42 (Kinoite)
- KDE Plasma 6.4.3
- fcitx5 && fcitx5-hangul

## Korean input in Steam and Steam games

<video width="460" height="93" autoplay controls loop src="https://github.com/user-attachments/assets/1291f0c8-f812-41d6-a31e-92bbdeef460c"></video>

- Cause: X11 apps need [XIM](https://en.wikipedia.org/wiki/X_Input_Method) for Korean input
- Fix: set the `XMODIFIERS` environment variable

```sh
YOUR_INPUT_METHOD=fcitx # change if using ibus or other IMEs

echo "XMODIFIERS=@im=$YOUR_INPUT_METHOD" | sudo tee -a /etc/environment
```

Log out and back in. If you see:

```sh
echo $XMODIFIERS $LANG
> @im=fcitx ko_KR.UTF-8
```

Reference: <https://wiki.archlinux.org/title/Fcitx5#XIM>

## Korean input in flatpak apps

![](./hangul.kde-open-image.webp)

- Cause: QT apps require `QT_IM_MODULE` to enable Korean input
- Fix: set `QT_IM_MODULE` in `/etc/environment`

```sh
YOUR_INPUT_METHOD=fcitx # change if using ibus or other IMEs

echo "QT_IM_MODULE=$YOUR_INPUT_METHOD" | sudo tee -a /etc/environment
```

Log out and back in. If you see:

```sh
echo $QT_IM_MODULE
> fcitx
```

Reference: <https://krita-artists.org/t/i-just-cant-use-ime-to-type-texts-on-linux/113246/2>

## No Korean input in distrobox-installed apps

- Cause: distrobox containers cannot access host IME packages (ibus, fcitx...)
- Fix: install IME packages inside the container

```sh
$ distrobox enter <YOUR-CONTAINER-NAME>
$ sudo dnf install fcitx5 fcitx5-hangul
```

## Prevent `ㄱㅅ` → `ㄳ`, `ㄱㄱ` → `ㄲ`

- Cause: [libhangul](https://github.com/libhangul/libhangul) has not been released since 2011, so there is no API to toggle this setting
- Fix: apply your desired settings and build `libhangul` manually

### Environment setup

```sh
git clone https://github.com/libhangul/libhangul
cd libhangul

sudo dnf install gcc make gettext gettext-devel libtool libtoolize aclocal autoconf expat-devel
```

### Apply settings

- `ㄱㄱ` → `ㄲ` disabled: in latest git builds this is disabled by default
- `ㄱㅅ` → `ㄳ` disabled: set `HANGUL_IC_OPTION_NON_CHOSEONG_COMBI` default to `false`

```diff
diff --git a/hangul/hangulinputcontext.c b/hangul/hangulinputcontext.c
index ee43f5e..bdd3ad0 100644
--- a/hangul/hangulinputcontext.c
+++ b/hangul/hangulinputcontext.c
@@ -1511,7 +1511,7 @@ hangul_ic_new(const char* keyboard)
 
     hic->option_auto_reorder = false;
     hic->option_combi_on_double_stroke = false;
-    hic->option_non_choseong_combi = true;
+    hic->option_non_choseong_combi = false;
 
     hangul_ic_set_output_mode(hic, HANGUL_OUTPUT_SYLLABLE);
     hangul_ic_select_keyboard(hic, keyboard);
```

Apply the patch in the cloned repository.

## Build and install

```sh
make -j $(nproc)
sudo make install
sudo ldconfig
```

If you see:

```sh
ldconfig -p | grep libhangul
        libhangul.so.1 (libc6,x86-64) => /usr/local/lib/libhangul.so.1
        libhangul.so.1 (libc6,x86-64) => /lib64/libhangul.so.1
        libhangul.so (libc6,x86-64) => /usr/local/lib/libhangul.so
```

If `libhangul` is installed somewhere like `/usr/local/lib` and `ldconfig` doesn't pick it up, add the path and rerun:

```sh
echo '/usr/local/lib' | sudo tee -a /etc/ld.so.conf.d/usr_local_lib.conf
sudo ldconfig
```

After confirming `libhangul.so` is in `ldconfig`, log out and back in so the changes apply to `fcitx5-hangul`.
