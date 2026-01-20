---
lang: ja
date: 2024-06-19
title: Home Managerでfishの環境変数を更新する
---

## 概要

[Home Manager](https://github.com/nix-community/home-manager)で`home.sessionVariables`を更新しても環境変数が反映されない。

## 解決方法

### [`home.sessionVariables`](https://mynixos.com/home-manager/option/home.sessionVariables) はログアウト後に反映

> Environment variables to always set _at login_.

1. `home.sessionVariables` を編集
2. `home-manager switch` を実行
3. ログアウトして再ログイン

### シェル起動時に環境変数を更新

`programs.fish.shellInit` で `set -gx` を直接設定する。

- 理由: 頻繁に環境変数を更新したく、ログアウト/ログインが面倒

#### 疑似コード

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

#### 実行結果

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

## 参考

- https://chatgpt.com/share/929ff744-e3f4-4ffd-9cb9-049ec3cb28d9
