#!/bin/bash
cd "$(dirname "$0")"

chmod +x "my-local-store-mac-arm64"
xattr -dr com.apple.quarantine "my-local-store-mac-arm64"
./my-local-store-mac-arm64

echo "✅ Сервер запущено на http://localhost:3000"
read -p "Натисни Enter, щоб закрити..."
