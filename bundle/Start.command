#!/bin/bash
cd "$(dirname "$0")"
chmod +x "shopping-store-mac-amd64"
./shopping-store-mac-amd64
echo "✅ Сервер запущено на http://localhost:3000"
read -p "Натисни Enter, щоб закрити..."
