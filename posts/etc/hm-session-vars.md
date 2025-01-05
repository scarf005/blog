---
date: 2024-06-19
title: Home Manager로 fish shell 환경 변수 업데이트
---

## 개요

[Home Manager](https://github.com/nix-community/home-manager)에서 환경 변수를 업데이트하기 위해 `home.sessionVariables`를 수정해도 환경 변수가 업데이트 되지 않음

## 해결 방법

### [`home.sessionVariables`](https://mynixos.com/home-manager/option/home.sessionVariables) 은 [로그아웃 후 다시 로그인해야만 변경사항이 적용됨](https://discourse.nixos.org/t/home-manager-doesnt-seem-to-recognize-sessionvariables/8488/26)

> Environment variables to always set _at login_.

1. `home.sessionVariables` 수정
2. `home-manager switch` 실행
3. 로그아웃 후 다시 로그인

### 셸 시작시마다 환경 변수를 업데이트

`programs.fish.shellInit`에서 직접 `set -gx`로 환경 변수 업데이트

- 선택 사유: 빈번히 환경 변수를 업데이트해야 하는데 로그아웃 후 로그인을 반복하기 번거로움

#### 의사 코드

```nix
let
  env = with xdg; {
    IDRIS2_PREFIX = "${XDG_DATA_HOME}/idris2";
    PACK_DIR = "${XDG_DATA_HOME}/pack";
    # ...
  };
  sessionVariables = builtins.concatStringsSep "\n" 
    (map (k: "set -gx ${k} ${env.${k}}") (builtins.attrNames env));
in
{
  # ...
  programs = {
    fish = {
      enable = true;
      shellInit = ''
        ${sessionVariables}
        # ...
      ''
      # ...
    };
  };
}
```

#### 실행 결과

```
$ head -12 $HOME/.config/fish/config.fish
# ~/.config/fish/config.fish: DO NOT EDIT -- this file has been generated
# automatically by home-manager.

# Only execute this file once per shell.
set -q __fish_home_manager_config_sourced; and exit
set -g __fish_home_manager_config_sourced 1

source /nix/store/lkjzs012wpynhf3x2hnmcrm1im24ilcf-hm-session-vars.fish

set -gx ANDROID_HOME /home/scarf/.local/share/android
set -gx ASDF_CONFIG_FILE /home/scarf/.config/asdf/asdfrc
set -gx ASDF_DATA_DIR /home/scarf/.local/share/asdf
```

## 참고 자료

- https://chatgpt.com/share/929ff744-e3f4-4ffd-9cb9-049ec3cb28d9
