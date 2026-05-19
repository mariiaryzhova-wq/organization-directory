const express = require('express');

// Створюємо об'єкт роутера для маршрутів, пов'язаних з організаціями
const router = express.Router();

// Імпортуємо контролер організацій.
// У ньому будуть функції getAll, getById, create, importCSV, updateStatus.
// Кожна функція відповідає за свій ендпоінт.
const organizationsController = require('../controllers/organizations');

// Імпортуємо asyncHandler 
const asyncHandler = require('../middleware/asyncHandler');

// Перегляд каталогів організацій з можливістю фільтрації за категорією та статусом
// Логіка фільтрації буде всередині organizationsController.getAll — 
// він прочитає req.query і передасть потрібні параметри в репозиторій
router.get('/', asyncHandler(organizationsController.getAll));

// GET /api/organizations/:id
// Логіка отримати повну інформацію про одну конкретну організацію
// :id — це динамічний параметр, який буде доступний у контролері як req.params.id
// Можливо, це вважливо знати, цей маршрут має бути після GET /, бо інакше Express сприйме слово import в URL як :id.
router.get('/:id', asyncHandler(organizationsController.getById));

// Додавання організації 
// POST /api/organizations
// Клієнт надсилає JSON з даними організації в тілі запиту
// Контролер створить організацію зі статусом pending простими словами очікує модерації, і 
// поверне її дані у відповіді.
router.post('/', asyncHandler(organizationsController.create));
// POST /api/organizations/import
// Завантаження CSV-файлу з даними організацій
// Клієнт надсилає файл через multipart/form-data з полем "file"
router.post('/import', asyncHandler(organizationsController.importCSV));

//Модерація організацій
// PUT /api/organizations/:id/status
// Змінити статус організації тобто можна схвалити, відхилити або архівувати заявку на додавання організації
// ID організації, статус якої змінюємо передається в URL як :id, а новий статус в тілі запиту.
router.put('/:id/status', asyncHandler(organizationsController.updateStatus));

// Експортуємо роутер, щоб його можна було підключити в index.js
module.exports = router;
