---
lang: en
date: 2025-08-10
title: The Linux Nvidia Suspend *Experience*
description: Common suspend problems on systems with Nvidia
---

### Environment

- Fedora 42 (Kinoite)
- KDE Plasma 6.4.3
- **Nvidia 575.64.05**

## Screen resolution shrinks after suspend

- Cause: unknown
- Fix: unplug and replug the HDMI/DP2 cable

## Bluetooth does not work after suspend

- Symptom: `No default controller available` when starting `bluetoothctl`
- Fix: unload and reload the `btusb` module

```sh
sudo modprobe -r btusb
sleep 1
sudo service bluetooth restart
sleep 1
sudo modprobe btusb
```

Reference: <https://askubuntu.com/questions/1387234/bluetooth-only-works-after-reloading-module-btusb>
