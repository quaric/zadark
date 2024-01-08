# Development

This document describes the process for running this application on your local computer.

## Getting Started

1. Clone the repo
    ```bash
    git clone https://github.com/quaric/zadark.git
    cd zadark
    ```

2. Install packages
    ```bash
    yarn install
    ```

3. Start development
    ```bash
    yarn dev

    # or build
    yarn build

    # ➜ Output:
    # build/
    #   chrome/
    #     manifest.json
    #     ...
    #   edge/
    #     manifest.json
    #     ...
    #   firefox/
    #     manifest.json
    #     ...
    #   pc/
    #     index.js
    #     ...
    ```

4. Testing

- macOS & Windows
  - `yarn run pc:dev`
- Chrome Extension
  - Step 1: Open `chrome://extensions/`
  - Step 2: Turn on `Developer Mode`
  - Step 3: Click `Load unpacked`
  - Step 4: Choose folder `build/chrome/`
- Safari Extension
  - Step 1: Open `src/web/vendor/safari/ZaDark.xcodeproj` in Xcode
  - Step 2: Choose `Product > Run`
  - Step 3: Open `Safari > Preferences > Extensions` > Turn on `ZaDark – Zalo Dark Mode`
- Edge Extension
  - Step 1: Open `edge://extensions/`
  - Step 2: Turn on `Developer Mode`
  - Step 3: Click `Load unpacked`
  - Step 4: Choose folder `build/edge/`
- Firefox Extension
  - Step 1: Open `about:debugging#/runtime/this-firefox`
  - Step 2: Click `Load Temporary Add-on...`
  - Step 3: Choose file `build/firefox/manifest.json`

## Creating Built Distributions

### For Safari Extension

1. Run `yarn build`
2. Run `yarn safari` or open `src/web/vendor/safari/ZaDark.xcodeproj` in Xcode
3. Choose `Product > Archive`

> Documentation: https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases

### For Other Platforms

```bash
yarn dist

# ➜ Output:
# dist/
#   chrome/
#     ZaDark Chrome [VERSION].zip
#
#   edge/
#     ZaDark Edge [VERSION].zip
#
#   firefox/
#     ZaDark Firefox [VERSION].zip
#
#   windows/
#     ZaDark [VERSION].exe
#     ZaDark [VERSION].zip
#
#   macos/
#     ZaDark [VERSION] macOS-x64
#     ZaDark [VERSION] macOS-arm64
```

- For Chrome Edge and Firefox: Distribute `dist/[PLATFORM]/ZaDark [PLATFORM] [VERSION].zip` to Store
- For Windows: Distribute `dist/windows/ZaDark [VERSION].zip` directly to users
- For macOS: Distribute `dist/macos/ZaDark [VERSION] macOS-[TARGET].zip` directly to users
