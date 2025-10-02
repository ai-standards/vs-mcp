#!/bin/bash
set -e
VERSION=$(npm pkg get version)
VERSION=${VERSION//\"/}
mkdir -p packages
vsce package --out "packages/vsmcp-$VERSION.vsix"