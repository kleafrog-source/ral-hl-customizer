# План тестирования интеграции CustomizerPrices

## 🎯 Цели тестирования

### 1. Отладка SVG слоев
- [x] Найти функцию, устанавливающую `display:none` для `*-original-*` элементов
- [x] Добавить `initSVGVisibility()` в `engine.js` после загрузки SVG
- [x] Исправить порядок инициализации в `main.js`: SVG → state → render
- [x] Добавить проверку наличия SVG-контейнера в `updateSVG()`

### 2. Интеграция CustomizerPrices
- [x] Создать HL-блок CustomizerPrices с полями:
  - `UF_SECTION_CODE` (spheres, body, logo, case, shockmount, shockmountPins)
  - `UF_MODEL_CODE` (пусто = для всех, bomblet, malfa, deluxe, 017-fet, 017-tube)
  - `UF_VARIANT_CODE` (пусто = для всех, или конкретный вариант)
  - `UF_PRICE` (числовая наценка)
  - `UF_IS_RAL_SURCHARGE` (1 = применять ко всем RAL-вариантам)
  - `UF_SORT` (порядок сортировки)
  - `UF_DESCRIPTION` (описание)

- [x] Добавить загрузку данных в `result_modifier.php`
- [x] Реализовать `getSurcharge()` с приоритетом поиска:
  1. Точный матч: (section, model, variant)
  2. Матч по модели: (section, model, *)
  3. Глобальный матч: (section, *, *)
  4. RAL наценка: если `UF_IS_RAL_SURCHARGE=1`
- [x] Интегрировать в `calculateTotal()` для использования новых наценок
- [x] Передать данные в `template.php` через `window.CUSTOMIZER_DATA.prices`

## 🧪 Тестовые сценарии

### Сценарий 1: Видимость SVG слоев при старте
1. Открыть страницу с моделью `bomblet`
2. Проверить в консоли:
   - `[SVG] Initializing visibility for initial state: ...`
   - `[SVG] Set spheres-original-3 to visible`
   - `[SVG] Set body-original-3 to visible`
3. Проверить в DOM:
   - `#spheres-original-3` имеет `display: inline`
   - `#body-original-3` имеет `display: inline`
   - Остальные `*-original-*` слои скрыты

### Сценарий 2: Расчет цен для RAL цветов
1. Выбрать RAL цвет для силуэта
2. Проверить в консоли:
   - `[Price Calculator] RAL surcharge applied: spheres = 3000`
3. Проверить итоговую цену: базовая + 3000

### Сценарий 3: Цена подвеса для разных моделей
1. Переключиться на модель `bomblet`
2. Включить подвес
3. Проверить цену: должна быть 10000 (из HL-блока)
4. Переключиться на модель `malfa`
5. Проверить цену: должна быть 3000 (общая наценка за цвет)

### Сценарий 4: Кастомная эмблема
1. Включить "Собственная эмблема"
2. Проверить цену: +3000 за логотип

## 🔍 Консольные команды для отладки

```javascript
// Проверка загрузки цен
console.log(window.CUSTOMIZER_DATA.prices);

// Проверка работы getSurcharge
import { getSurcharge } from './modules/price-calculator.js';
console.log(getSurcharge('spheres', 'RAL 9005', 'bomblet', true)); // Должен вернуть 3000
console.log(getSurcharge('shockmount', '', 'bomblet', false)); // Должен вернуть 10000
console.log(getSurcharge('shockmount', '', 'malfa', false)); // Должен вернуть 0 (нет точного матча)

// Проверка состояния SVG
const svg = document.querySelector('#microphone-svg-container svg');
console.log('Spheres original 3:', svg?.querySelector('#spheres-original-3')?.style.display);
console.log('Body original 3:', svg?.querySelector('#body-original-3')?.style.display);
```

## 📋 Чек-лист готовности

- [ ] HL-блок CustomizerPrices создан в Битрикс
- [ ] Данные из XML импортированы в HL-блок
- [ ] `result_modifier.php` загружает цены без ошибок
- [ ] `window.CUSTOMIZER_DATA.prices` содержит данные
- [ ] `loadCustomPrices()` вызывается при инициализации
- [ ] `getSurcharge()` работает с правильным приоритетом
- [ ] `calculateTotal()` использует новые наценки
- [ ] SVG слои видны при старте для `bomblet`
- [ ] Цена пересчитывается при изменении опций

## 🚀 Следующие шаги

1. Выполнить SQL скрипт для создания HL-блока
2. Импортировать данные из XML в созданный HL-блок
3. Проверить работу консольных команд
4. Провести все тестовые сценарии
5. Исправить обнаруженные проблемы
