# ZaDark – Best Dark Theme for Zalo

[![Download ZaDark – Best Dark Theme for Zalo](https://img.shields.io/sourceforge/dt/zadark.svg)](https://sourceforge.net/projects/zadark/)

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

[![Download ZaDark – Best Dark Theme for Zalo](https://a.fsdn.com/con/app/sf-download-button)](https://sourceforge.net/projects/zadark/)

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
