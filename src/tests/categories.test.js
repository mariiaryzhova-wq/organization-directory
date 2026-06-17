import { Router } from 'express';
import { param } from 'express-validator';
import asyncHandler from '../middleware/asyncHandler.js';
import validate from '../middleware/validate.js';
import { getAll, getApprovedByCategory } from '../controllers/category.js';

const router = Router();

// GET /api/categories
router.get('/', asyncHandler(getAll));

// GET /api/categories/:id/organizations
router.get(
	'/:id/organizations',
	[param('id').isInt()],
	validate,
	asyncHandler(getApprovedByCategory)
);

export default router;
test('Мой пятнадцатый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});
