---
lang: en
date: 2024-02-01
title: Using Relay Devtools in Firefox
---

## Overview

1. The [Relay Devtools](https://relay.dev/docs/debugging/relay-devtools/) extension is not supported on Firefox ([issue](https://github.com/relayjs/relay-devtools/issues/39))
2. Building the Firefox extension from the [README](https://github.com/relayjs/relay-devtools?tab=readme-ov-file#from-source) causes multiple errors

## Fixes

### node-gyp error on Node 21

- Cause: build failure in the outdated `fsevents` package
- Fix: use Node 18 (`nvm use 18`)

### Duplicate workspaces error on yarn v4

- Cause: differences between v1 and v4 workspace layouts
- Fix: use yarn v1 (`yarn set version classic`)

### `error:0308010C:digital envelope routines::unsupported` during build

- Cause: [webpack@v4 uses deprecated OpenSSL](https://github.com/webpack/webpack/issues/14532#issuecomment-947012063)
- Fix: add `NODE_OPTIONS=--openssl-legacy-provider`

### Installing `shells/firefox/build/RelayDevTools.zip` fails

- Cause: Firefox blocks unsigned extensions by policy
- Fix: follow the [official guide for enabling unsigned extensions](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox#w_what-are-my-options-if-i-want-to-use-an-unsigned-add-on-advanced-users)
  1. Install Firefox Developer Edition
  2. Go to `about:config`
  3. Set `xpinstall.signatures.required` to `false`
