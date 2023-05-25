# Development

This document describes the process for running this application on your local computer.

## Getting Started

1. Clone the repo
    ```bash
    git clone https://github.com/quaric/zadark-legacy.git
    cd zadark-legacy
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
  - Step 1: Open `src/web/vendor/safari/ZaDark.xcodeproj` in Xcode
  - Step 2: Choose `Product > Run`
  - Step 3: Open `Safari > Preferences > Extensions` > Turn on `ZaDark – Zalo Dark Mode`
- macOS & Windows
  - `sudo yarn run pc:dev`

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
#     ZaDark-macOS-[VERSION].pkg
#
#   windows/
#     ZaDark-Windows-[VERSION].exe
#     ZaDark-Windows-[VERSION].zip
```

- For Google Chrome, Firefox, Opera and Microsoft Edge: Distribute `dist/[PLATFORM]/ZaDark-[PLATFORM]-[VERSION].zip` to Store
- For Windows: Distribute `dist/windows/ZaDark-Windows-[VERSION].zip` directly to users
- For macOS: Let's see the [Codesign macOS Application](#codesign-macos-application)

### Codesign && Notarize macOS Application

1. Create the configuration file `.env` with the content from `.env.example`.
2. Run the command `yarn macos:pkgbuild` to perform the signing and package building process:
   - This command will automatically sign the application.
   - After signing, it will generate an installer package named `dist/macos/ZaDark-macOS-[VERSION].pkg`.
3. If the previous command succeeds, run the command `yarn macos:notarize` to notarize the installer package:
   - This command will submit the package for notarization to Apple's notary service.
   - It will wait for the notarization process to complete.
4. Once notarization is complete, run the command `yarn macos:staple` to staple the notary ticket to the installer package:
   - This step ensures that the notarization information is attached to the package.
5. Congratulations! You now have a signed and notarized installer package located at `dist/macos/ZaDark-macOS-[VERSION].pkg`.
6. Distribute the `ZaDark-macOS-[VERSION].pkg` package directly to users for installation.

> Read more about notarization here: https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution