#
# Run the bash script in the macOS terminal or command prompt by typing
# yarn macos:notarytool_log <submit_id>
#

# Source the environment variables from the .env file
source .env

# Retrieve the submit ID from the command-line argument
submit_id=$1

# Use xcrun notarytool to fetch the notarization log for the specified submit ID
# --keychain-profile option specifies the keychain profile to use for accessing the notary service
# The log will be saved to the tools/macos/notarytool_log.json file
xcrun notarytool log $submit_id --keychain-profile "$keychain_profile" tools/macos/notarytool_log.json

echo "View the notarization log in the tools/macos/notarytool_log.json file"