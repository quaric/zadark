#!/bin/bash

#
# The provided code is a bash script used for notarizing a macOS application package.
# Notarization is the process of verifying and confirming the safety of an application
# before it is allowed to run on macOS systems.
#
# Preparation steps before running this code:
#
# 1. Make sure you have Xcode installed on your computer.
#
# 2. Create a ".env" file and specify the necessary environment variables,
#    including "keychain_profile" to specify the keychain profile
#    that will be used in the notarization process.
#
# 3. Ensure that you have packaged the application as an installer package (.pkg)
#    using the following commands in order: "yarn dist", "yarn macos:pkgbuild".
#    This process will generate a macOS installer package file with the .pkg format.
#
# 4. Make sure the "package.json" file in the "src/pc" directory contains the version information of the application.
#
# 5. Run the bash script in the macOS terminal or command prompt by typing "yarn macos:notarize".
#
# Read more about notarization here: https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution
#

# Source the environment variables from the .env file
source .env

# Retrieve the version number from the package.json file
version=$(grep -o '"version": *"[^"]*"' src/pc/package.json | awk -F'"' '{print $4}')

# Set the package file path based on the version number
pkgFilePath=dist/macos/ZaDark\ ${version}.pkg

echo "[Prepare]"
echo "$pkgFilePath"

echo ""
echo "[Notarize]"

# Submit the package file for notarization using the xcrun notarytool
xcrun notarytool submit "$pkgFilePath" \
  --keychain-profile "$keychain_profile" \
  --wait
