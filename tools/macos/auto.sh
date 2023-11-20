yarn macos:pkgbuild arm64
yarn macos:notarize arm64
yarn macos:staple arm64

echo ""
echo ""

yarn macos:notarize x64
yarn macos:pkgbuild x64
yarn macos:staple x64