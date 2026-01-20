---
lang: en
date: 2024-06-19
title: Update fish shell env vars with Home Manager
---

## Overview

[Home Manager](https://github.com/nix-community/home-manager): even after updating `home.sessionVariables`, the environment variables are not refreshed.

## Fix

### [`home.sessionVariables`](https://mynixos.com/home-manager/option/home.sessionVariables) only apply after logging out and back in

> Environment variables to always set _at login_.

1. Edit `home.sessionVariables`
2. Run `home-manager switch`
3. Log out and log back in

### Update env vars at shell startup

Use `set -gx` directly in `programs.fish.shellInit`.

- Reason: you often need to update env vars, and logging out/in is too tedious

#### Pseudocode

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

#### Result

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

## References

- https://chatgpt.com/share/929ff744-e3f4-4ffd-9cb9-049ec3cb28d9
