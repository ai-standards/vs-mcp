#!/bin/bash

# Usage: ./bump-and-build.sh [<new-version>]
set -e

if [ -z "$1" ]; then
  # No version argument, increment minor version
  CURRENT_VERSION=$(jq -r '.version' package.json)
  IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
  MINOR=$((MINOR + 1))
  PATCH=0
  VERSION="$MAJOR.$MINOR.$PATCH"
  echo "No version argument provided. Incrementing minor version: $CURRENT_VERSION -> $VERSION"
else
  VERSION="$1"
  echo "Setting version to $VERSION"
fi

# Bump version in package.json
jq ".version = \"$VERSION\"" package.json > package.json.tmp && mv package.json.tmp package.json

echo "Version bumped to $VERSION in package.json."

# build the mcp server from mcp functions
npm run build:server

# build the react webview
npm run build:webview

# build the extension
npm run build


# package the extension
npm run package



# Get the current version and set filenames
VERSION=$(npm pkg get version)
VERSION=${VERSION//\"/}
PKG_FILE="packages/vsmcp-$VERSION.vsix"
LATEST_FILE="packages/vsmcp-latest.vsix"

# Delete vsmcp-latest.vsix if it exists
if [ -f "$LATEST_FILE" ]; then
  rm "$LATEST_FILE"
fi

# Copy the new package to vsmcp-latest.vsix, with error check
if [ -f "$PKG_FILE" ]; then
  cp "$PKG_FILE" "$LATEST_FILE"
else
  echo "ERROR: Package file $PKG_FILE does not exist."
  exit 1
fi

echo "Builds completed."
