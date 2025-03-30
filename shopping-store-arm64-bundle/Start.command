#!/bin/bash
cd "$(dirname "$0")"
chmod +x "shopping-store-mac-arm64"
xattr -dr com.apple.quarantine "shopping-store-mac-arm64"
./shopping-store-mac-arm64
echo "✅ Сервер запущено на http://localhost:3000"
read -p "Натисни Enter, щоб закрити..."
