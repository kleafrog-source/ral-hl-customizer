#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
from pathlib import Path

def fix_encoding(file_path):
    """Простое исправление кодировки"""
    try:
        # Читаем как байты
        with open(file_path, 'rb') as f:
            data = f.read()
        
        # Пробуем декодировать как cp1251 и сохранить как utf-8
        text = data.decode('cp1251')
        
        # Сохраняем в UTF-8
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(text)
        
        print(f"✓ Fixed: {file_path}")
        return True
    except:
        print(f"✗ Skip (maybe already UTF-8): {file_path}")
        return False

# Основная директория
project_dir = r"C:\Users\mungo\CascadeProjects\customizer_hl_mics"

# Расширения для обработки
extensions = ('.php', '.html', '.phtml', '.inc')

# Обходим все файлы
for root, dirs, files in os.walk(project_dir):
    # Пропускаем системные папки
    dirs[:] = [d for d in dirs if not d.startswith('.')]
    
    for file in files:
        if file.endswith(extensions):
            file_path = os.path.join(root, file)
            fix_encoding(file_path)

print("Done!")