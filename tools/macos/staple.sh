#!/bin/bash

# Run the bash script in the macOS terminal or command prompt by typing
# yarn macos:staple

# Source the environment variables from the .env file
source .env

# Retrieve the version number from the package.json file
version=$(grep -o '"version": *"[^"]*"' src/pc/package.json | awk -F'"' '{print $4}')

# Construct the file path of the package (pkg) file using the version number
pkgFilePath=dist/macos/ZaDark-macOS-${version//./_}.pkg

echo "[Prepare]"
echo $pkgFilePath

echo ""
echo "[Staple notarization to pkg]"

# Use the xcrun stapler command to staple notarization to the pkg file
xcrun stapler staple "$pkgFilePath"

echo ""
echo "[Done]"
echo $pkgFilePath
