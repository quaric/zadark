# Development

This document describes the process for running this application on your local computer.

## Getting Started

1. Clone the repo
    ```bash
    git clone git@github.com:ncdai3651408/za-dark.git
    cd za-dark
    ```

2. Install packages
    ```bash
    yarn install
    ```

3. Start development
    ```bash
    # Watching files
    yarn watch

    # or build
    yarn build

    # ➜ Output:
    # build/
    #   chrome/
    #     manifest.json
    #     ...
    #   firefox/
    #     manifest.json
    #     ...
    #   opera/
    #     manifest.json
    #     ...
    #   edge/
    #     manifest.json
    #     ...
    #   pc/
    #     index.js
    #     ...
    ```

4. Testing

- Chrome Extension
  - Step 1: Open `chrome://extensions/`
  - Step 2: Turn on `Developer Mode`
  - Step 3: Click `Load unpacked`
  - Step 4: Choose folder `build/chrome/`
- Firefox Extension
  - Step 1: Open `about:debugging#/runtime/this-firefox`
  - Step 2: Click `Load Temporary Add-on...`
  - Step 3: Choose file `build/firefox/manifest.json`
- Opera Extension
  - Step 1: Open `opera://extensions/`
  - Step 2: Turn on `Developer Mode`
  - Step 3: Click `Load unpacked`
  - Step 4: Choose folder `build/opera/`
- Edge Extension
  - Step 1: Open `edge://extensions/`
  - Step 2: Turn on `Developer Mode`
  - Step 3: Click `Load unpacked`
  - Step 4: Choose folder `build/edge/`
- Safari Extension
  - Step 1: Open `src/browser-ext/vendor/safari/ZaDark.xcodeproj` in Xcode
  - Step 2: Choose `Product > Run`
  - Step 3: Open `Safari > Preferences > Extensions` > Turn on `ZaDark – Best Dark Theme for Zalo`
- macOS & Windows
  - `yarn run pc:dev`

## Creating Built Distributions

### For Safari Extension

1. Run `yarn build`
2. RUn `yarn safari` or open `src/browser-ext/vendor/safari/ZaDark.xcodeproj` in Xcode
3. Choose `Product > Archive`

> Documentation: https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases

### For Other Platforms

```bash
yarn dist

# ➜ Output:
# dist/
#   chrome/
#     ZaDark-Chrome-[VERSION].zip
#
#   firefox/
#     ZaDark-Firefox-[VERSION].zip
#
#   opera/
#     ZaDark-Opera-[VERSION].zip
#
#   edge/
#     ZaDark-Edge-[VERSION].zip
#
#   macos/
#     ZaDark-macOS-[VERSION]
#     ZaDark-macOS-[VERSION].zip
#
#   windows/
#     ZaDark-Windows-[VERSION].exe
#     ZaDark-Windows-[VERSION].zip
```

- For Google Chrome, Firefox, Opera and Microsoft Edge: Distribute `dist/[PLATFORM]/ZaDark-[PLATFORM]-[VERSION].zip` to Store
- For Windows: Distribute `dist/windows/ZaDark-Windows-[VERSION].zip` directly to users
- For macOS: Let's see the [Codesign macOS Application](#codesign-macos-application)

### Codesign macOS Application

1. Create the configuration file `tools/macos/config.ini` with content from `tools/macos/example.config.ini`
2. Run `yarn codesign:macos` to begin the signing and notarization process
3. Enter your `username` and `password` as needed to unlock your keychain
4. Once the package is submitted to Apple, `codesign:macos` will check to see if the process is complete
5. Rejoyce in your signed `dist/macos/ZaDark-macOS-[VERSION].pkg` file
6. Distribute `dist/macos/ZaDark-macOS-[VERSION].pkg` directly to users

> `codesign:macos` script is converted from Python (https://github.com/txoof/codesign) to Node. Thanks @txoof.
