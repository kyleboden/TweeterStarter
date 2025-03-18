#!/bin/bash

set -e

cd "$(dirname "$0")"

npm run build
rm -f dist.zip

# Use PowerShell's Compress-Archive to create a ZIP file
powershell.exe -Command "Compress-Archive -Path dist\* -DestinationPath dist.zip -Force"

echo "dist.zip created"
