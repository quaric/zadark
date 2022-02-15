# ZaDark – Best Dark Theme for Zalo

[![Sourceforge](https://img.shields.io/sourceforge/dt/zadark.svg)](https://sourceforge.net/projects/zadark/)
[![For Zalo Web](https://img.shields.io/badge/-Chrome%20Extension-34a853?style=flat-square&logo=google-chrome&logoColor=ffffff)](https://chrome.google.com/webstore/detail/za-dark/llfhpkkeljlgnjgkholeppfnepmjppob)
[![For Zalo PC (Windows)](https://img.shields.io/badge/-Windows-0078D6?style=flat-square&logo=windows&logoColor=ffffff)](https://sourceforge.net/projects/zadark/files/ZaDarkPC/Windows/)
[![For Zalo PC (macOS)](https://img.shields.io/badge/-macOS-5b5b5b?style=flat-square&logo=apple&logoColor=ffffff)](https://sourceforge.net/projects/zadark/files/ZaDarkPC/macOS/)
[![ZaDark on YouTube](https://img.shields.io/badge/-YouTube-f30005?style=flat-square&logo=youtube&logoColor=ffffff)](https://www.youtube.com/playlist?list=PLDa_fu5vscWwzGnNFXwxnpDbKJXMN5NG2)

## Overview

This extension helps you turn on Dark Theme for Zalo Web/PC(*), making your eyes feel comfortable when you work, especially at night.

> (*) Zalo Web https://chat.zalo.me/, Zalo PC https://zalo.me/pc/
> 
A product from NCDAi Studio.

### Highlights

- Multi-platform support: Zalo Web and Zalo PC (macOS, Windows).
- Nice colors, good contrast.
- Safety and Transparency (Open Source: https://github.com/ncdai3651408/za-dark).
- Allow customization according to your needs:
    + Themes: Light, Dark and Dark dimmed.
    + Single Theme: Zalo will use your selected theme.
    + Sync With System: Zalo theme will match your system settings (Chrome Extension  only).

### Important Notes

- This extension is not an official extension from Zalo.
- This extension only injects the CSS file to change the color scheme of Zalo without affecting any features and security of Zalo.

![ZaDark – Best Dark Theme for Zalo](./Screenshot.png)

## Install

[![For Zalo Web](https://img.shields.io/badge/-Chrome%20Extension-34a853?style=flat-square&logo=google-chrome&logoColor=ffffff)](https://chrome.google.com/webstore/detail/za-dark/llfhpkkeljlgnjgkholeppfnepmjppob)
[![For Zalo PC (Windows)](https://img.shields.io/badge/-Windows-0078D6?style=flat-square&logo=windows&logoColor=ffffff)](https://sourceforge.net/projects/zadark/files/ZaDarkPC/Windows/)
[![For Zalo PC (macOS)](https://img.shields.io/badge/-macOS-5b5b5b?style=flat-square&logo=apple&logoColor=ffffff)](https://sourceforge.net/projects/zadark/files/ZaDarkPC/macOS/)

### For Zalo Web
- Chrome Web Store: https://chrome.google.com/webstore/detail/za-dark/llfhpkkeljlgnjgkholeppfnepmjppob
- Tutorial: https://youtu.be/T8r1k0Rhleo

### For Zalo PC

- macOS
  - SourceForge.net: https://sourceforge.net/projects/zadark/files/ZaDarkPC/macOS/
  - Tutorial: https://youtu.be/QBmLOUF4vdA
- Windows
  - SourceForge.net: https://sourceforge.net/projects/zadark/files/ZaDarkPC/Windows/
  - Tutorial: https://youtu.be/0ndmEmzRCyU

## Run Development

### Install

```bash
git clone git@github.com:ncdai3651408/za-dark.git
cd za-dark

# Install packages
yarn run install
```

### Sass

```bash
# Chrome Extension
yarn run chrome-ext:sass-watch

# PC
yarn run pc:sass-watch
```

### Run

```bash
# Chrome Extension
# 1. Turn on Developer Mode
# 2. Load unpacked ./chrome-ext-dist

# PC
yarn run pc:dev
```

## Build Production

```bash
# Chrome Extension
yarn run chrome-ext:build
# ➜ Output:
#   ./build/chrome-ext/ZaDarkChromeExtension-x.x.zip

# PC
yarn run pc:build
# ➜ Output:
#   ./build/pc/ZaDarkPC-macOS-x.x
#   ./build/pc/ZaDarkPC-Windows-x.x
```
