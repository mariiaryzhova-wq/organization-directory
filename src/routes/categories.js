import express from 'express';
import { param } from 'express-validator';
import * as categoriesController from '../controllers/categories.js';
import validate from '../middleware/validate.js';
import asyncHandler from '../middleware/asyncHandler.js';
const router = express.Router();

router.get('/', asyncHandler(categoriesController.getAll));
router.get('/:id/organizations',
  param('id').isInt({ min: 1 }).withMessage('id має бути цілим числом'),
  validate,
  asyncHandler(categoriesController.getApprovedByCategory)
);

export default router;