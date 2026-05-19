const express = require('express');
const router = express.Router();

// Імпортуємо контролер категорій
// Саме в ньому знаходиться вся бізнес-логіка, що робити з запитом, які дані брати з БД, як формувати відповідь і т.д.
const categoriesController = require('../controllers/categories');

// Імпортуємо asyncHandler нашу обгортку для асинхронних функцій вона автоматично ловить помилки і передає їх у next(),
const asyncHandler = require('../middleware/asyncHandler');

// Перегляд категорій
// GET /api/categories
router.get('/', asyncHandler(categoriesController.getAll));

// Експортуємо роутер назовні.
module.exports = router;
