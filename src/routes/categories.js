const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const categoriesController = require('../controllers/categories');
const validate = require('../middleware/validate');
const asyncHandler = require('../middleware/asyncHandler');

// Отримати всі категорії (Ресторани, Магазини, Аптеки тощо)
// Використовується для фільтрів та випадаючих списків
router.get('/',
  asyncHandler(categoriesController.getAll)
);

// Отримати всі організації з певної категорії
// Наприклад: всі ресторани або всі магазини
// Використовується коли користувач вибирає категорію
router.get('/:id/organizations',
  param('id').isInt({ min: 1 }).withMessage('id має бути цілим числом'),
  validate,
  asyncHandler(categoriesController.getApprovedByCategory)
);

module.exports = router;