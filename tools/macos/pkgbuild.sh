#!/bin/bash

#
# The provided code is a bash script used to prepare and package a macOS application ZaDark for installation.
# The preparation and packaging process involves preparing the necessary files, signing the executables,
# packaging the application into an installer package (.pkg), and setting the icon for the package.
#
# Preparation steps before running this code:
#
# 1. Make sure you have Xcode installed on your system.
#
# 2. Create a ".env" file and include the necessary environment variables
#   - hash_dev_id_application: The hash of the developer ID application certificate.
#   - hash_dev_id_installer: The hash of the developer ID installer certificate.
#   - bundle_id: The bundle identifier of the ZaDark application.
#
# 3. Make sure you have run the command "yarn dist" to build the source code.
#    This will generate the necessary source files for the ZaDark application.
#
# 4. Run the bash script in the macOS terminal or command prompt by typing "yarn macos:pkgbuild".
#

# Source the environment variables from the .env file
source .env

# Set temporary path
tmpPath=.zadark

# Retrieve the version number from the package.json file
version=$(grep -o '"version": *"[^"]*"' src/pc/package.json | awk -F'"' '{print $4}')

# Set original file path and package file path based on the version number
originalFilePath=dist/macos/ZaDark\ ${version}\ exec
pkgFilePath=dist/macos/ZaDark\ ${version}.pkg

echo "[Prepare]"

# Clean up the temporary path
rm -rf "$tmpPath"

# Create the temporary path
mkdir "$tmpPath"

# Copy the original file to the temporary path
ditto "$originalFilePath" "$tmpPath/ZaDark"

echo ""
echo "[Sign the executable]"

# Sign the ZaDark file in the temporary path
codesign --deep --force --options=runtime --entitlements tools/macos/assets/entitlements.plist --sign "$hash_dev_id_application" --timestamp "$tmpPath/ZaDark"

echo ""
echo "[Package as a pkg for installation]"

# Build the package using pkgbuild
pkgbuild \
  --identifier "$bundle_id" \
  --sign "$hash_dev_id_installer" \
  --scripts "tools/macos/assets/scripts" \
  --timestamp \
  --root "$tmpPath" \
  --install-location "/Applications" \
  "$pkgFilePath"

echo ""
echo "[Done]"
echo "$pkgFilePath"

# Clean up the temporary path
rm -rf "$tmpPath"
