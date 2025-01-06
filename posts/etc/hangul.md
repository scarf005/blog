---
date: 2025-01-05
title: 냉혹한 리눅스 한글 입력의 세계
description: fcitx 환경에서 스팀과 기타등등에 한글 입력하기
---

### 환경

- Fedora 41 (Kinoite)
- KDE Plasma 6.2.4
- fcitx5 && fcitx5-hangul

## 스팀과 스팀 게임에서 한글 입력 사용

<video width="460" height="93" autoplay controls loop src="https://github.com/user-attachments/assets/1291f0c8-f812-41d6-a31e-92bbdeef460c"></video>

- 원인: X11 앱에서는 [XIM](https://en.wikipedia.org/wiki/X_Input_Method)을 써야 한글 입력 가능
- 해결: `XMODIFIERS` 환경 변수 설정

```sh
YOUR_INPUT_METHOD=fcitx # ibus 등 다른 입력기를 사용할 시 변경


echo "XMODIFIERS=@im=$YOUR_INPUT_METHOD" | sudo tee -a /etc/environment
```

로그아웃 후 로그인하여 다음과 같이 뜨면 성공:

```sh
echo $XMODIFIERS $LANG
> @im=fcitx ko_KR.UTF-8
```

참고: <https://wiki.archlinux.org/title/Fcitx5#XIM>

## `ㄱㅅ` 누르면 `ㄳ`, `ㄱㄱ` 누르면 `ㄲ` 되는 현상 방지

- 원인: [libhangul](https://github.com/libhangul/libhangul) 배포가 10년 넘게 (2011) 되지 않아 [해당 설정을 끄는 API를 사용할 수 없음](https://github.com/fcitx/fcitx5-hangul/issues/12#issuecomment-2341205900)
- 해결: 원하는 설정을 적용 후 `libhangul`을 수동으로 빌드하여 적용

### 환경 설정

```sh
git clone https://github.com/libhangul/libhangul
cd libhangul

sudo dnf install gcc make gettext gettext-devel libtool libtoolize aclocal autoconf expat-devel
```

### 원하는 설정 적용

- `ㄱㄱ` 누르면 `ㄲ` 되는 현상 비활성화: 최신 git 환경에서 빌드 시 [기본적으로 비활성화되어있음](https://github.com/libhangul/libhangul/commit/1b438ae53333c7186544ecd79add5ea175a63d8d#diff-b52a01722c6deec9de955a307286b6014e2882497dc05be1f61af32129ed1c44R857)
- `ㄱㅅ` 누르면 `ㄳ` 되는 현상 비활성화: `HANGUL_IC_OPTION_NON_CHOSEONG_COMBI` 기본값을 `false`로 변경

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

내려받은 저장소에 해당 변경사항을 적용

## 빌드 및 설치

```sh
make -j $(nproc)
sudo make install
sudo ldconfig
```

다음과 같이 나오면 성공:

```sh
ldconfig -p | grep libhangul
        libhangul.so.1 (libc6,x86-64) => /usr/local/lib/libhangul.so.1
        libhangul.so.1 (libc6,x86-64) => /lib64/libhangul.so.1
        libhangul.so (libc6,x86-64) => /usr/local/lib/libhangul.so
```

만일 `/usr/local/lib`같은 곳에 `libhangul`이 설치되어 `ldconfig`가 읽지 못한다면 해당 경로를 ldconfig에 추가후 위 동작을 반복:

```sh
echo '/usr/local/lib' | sudo tee -a /etc/ld.so.conf.d/usr_local_lib.conf
sudo ldconfig
```

직접 빌드한 `libhangul.so`가 `ldconfig`에 반영된 것을 확인 후 로그아웃-로그인하여 `fcitx5-hangul`에 적용
