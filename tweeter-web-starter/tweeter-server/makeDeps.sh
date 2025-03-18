#!/bin/bash

set -e

cd "$(dirname "$0")"

npm install
(cd ../tweeter-shared && npm run build)

mkdir -p nodejs
cp -rL node_modules nodejs/

rm -f nodejs.zip

# Use PowerShell's Compress-Archive to create a ZIP file
powershell.exe -Command "Compress-Archive -Path nodejs -DestinationPath nodejs.zip -Force"

rm -rf nodejs
echo "nodejs.zip created"
