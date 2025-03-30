== Shopping Store (для macOS ARM: M1/M2/M3) ==

📦 Вміст архіву:
- shopping-store-mac-arm64 — виконуваний файл
- Start.command — запуск у 2 кліки
- README.txt — ця інструкція

---

▶️ Як ЗАПУСТИТИ ДОДАТОК:

❗ Дуже важливо: macOS може заблокувати виконання, якщо ZIP був завантажений через Safari або Chrome.
Тому спочатку зніміть quarantine **з архіву, а не з розпакованих файлів!**

🔧 КРОКИ:

1. Відкрий Terminal
2. Перейдіть у папку з ZIP-файлом (наприклад):
   cd ~/Downloads

3. Зніміть quarantine з архіву:
   xattr -d com.apple.quarantine shopping-store-mac-arm64.zip

4. Тепер розпакуйте ZIP:
   unzip shopping-store-mac-arm64.zip
   cd shopping-store-arm64-bundle

5. Запустіть програму:
   chmod +x shopping-store-mac-arm64
   ./$EXECUTABLE

✅ АБО: Використайте Start.command
- Клікніть правою кнопкою миші → Open → Open

---

🔐 Якщо macOS все одно блокує:
- Перейдіть в System Settings → Privacy & Security
- Знайдіть повідомлення про блокування файлу
- Натисніть “Allow Anyway”
- Після цього — знову правий клік → Open

🌐 Сайт відкриється на http://localhost:3000
