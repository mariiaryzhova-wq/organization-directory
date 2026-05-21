import express from 'express';
import { body, param } from 'express-validator';
import * as organizationsController from '../controllers/organizations.js';
import validate from '../middleware/validate.js';
import asyncHandler from '../middleware/asyncHandler.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', validate, asyncHandler(organizationsController.getAll));
router.get('/pending', validate, asyncHandler(organizationsController.getPending));
router.get('/:id', 
  param('id').isInt({ min: 1 }).withMessage('id має бути цілим числом'), 
  validate,
  asyncHandler(organizationsController.getById)
);
router.post('/',
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('name має бути від 2 до 255 символів'),
  body('description').optional().isLength({ max: 1000 }).withMessage('description максимум 1000 символів'),
  body('website_url').optional().isURL({ protocols: ['https'], require_protocol: true }).withMessage('website_url має бути валідним HTTPS URL'),
  body('category_ids').isArray({ min: 1, max: 5 }).withMessage('category_ids має бути масивом від 1 до 5 категорій'),
  body('category_ids.*').isInt({ min: 1 }).withMessage('кожен category_id має бути цілим числом'),
  validate,
  asyncHandler(organizationsController.create)
);
router.post('/import', 
  upload.single('file'), 
  validate,
  asyncHandler(organizationsController.importCSV)
);
router.put('/:id/status',
  param('id').isInt({ min: 1 }).withMessage('id має бути цілим числом'),
  body('status').isIn(['approved', 'rejected', 'archived']).withMessage('status має бути approved, rejected або archived'),
  body('rejection_reason').optional().isString().withMessage('rejection_reason має бути рядком'),
  validate,
  asyncHandler(organizationsController.updateStatus)
);

export default router;
