const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const organizationsController = require('../controllers/organizations');
const validate = require('../middleware/validate');
const asyncHandler = require('../middleware/asyncHandler');
const upload = require('../middleware/upload');

// Отримати всі схвалені організації
// Використовується на головній сторінці каталогу
router.get('/',
  validate,
  asyncHandler(organizationsController.getAll)
);

// Отримати заявки, які чекають на модерацію
// Використовується адміном
router.get('/pending',
  validate,
  asyncHandler(organizationsController.getPending)
);

// Отримати одну організацію по її ID
// Використовується на сторінці деталей організації
router.get('/:id',
  param('id').isInt({ min: 1 }).withMessage('id має бути цілим числом'),
  validate,
  asyncHandler(organizationsController.getById)
);

// Створити нову заявку на додавання організації
// Використовується коли користувач заповнює форму
router.post('/',
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('name має бути від 2 до 255 символів'),
  body('description').optional().isLength({ max: 1000 }).withMessage('description максимум 1000 символів'),
  body('website_url').optional().isURL({ protocols: ['https'], require_protocol: true }).withMessage('website_url має бути валідним HTTPS URL'),
  body('category_ids').isArray({ min: 1, max: 5 }).withMessage('category_ids має бути масивом від 1 до 5 категорій'),
  body('category_ids.*').isInt({ min: 1 }).withMessage('кожен category_id має бути цілим числом'),
  validate,
  asyncHandler(organizationsController.create)
);

// Завантажити багато організацій одним CSV файлом
// Використовується коли хочуть додати одразу багато записів
router.post('/import',
  upload.single('file'),
  validate,
  asyncHandler(organizationsController.importCSV)
);

// Змінити статус організації (схвалити/відхилити/заархівувати)
// Використовується адміном під час модерації
router.put('/:id/status',
  param('id').isInt({ min: 1 }).withMessage('id має бути цілим числом'),
  body('status').isIn(['approved', 'rejected', 'archived']).withMessage('status має бути approved, rejected або archived'),
  body('rejection_reason').optional().isString().withMessage('rejection_reason має бути рядком'),
  validate,
  asyncHandler(organizationsController.updateStatus)
);

module.exports = router;
