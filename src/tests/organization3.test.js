import { Router } from 'express';
import { body, param, query } from 'express-validator';
import asyncHandler from '../middleware/asyncHandler.js';
import validate from '../middleware/validate.js';
import upload from '../middleware/upload.js';
import { OrganizationStatus } from '../db/definitions.js';
import {
	getOrganisations,
	getById,
	create,
	updateStatus,
	importCSV,
} from '../controllers/organization.js';

const router = Router();

// GET /api/organizations
router.get(
	'/',
	[
		query('status').optional().isIn(Object.values(OrganizationStatus)),
		query('category_id').optional().isInt(),
		query('limit').optional().isInt({ min: 1 }),
		query('offset').optional().isInt({ min: 0 }),
		query('lat').optional().isFloat(),
		query('lng').optional().isFloat(),
		query('radiusKm').optional().isFloat({ min: 0 }),
	],
	validate,
	asyncHandler(getOrganisations)
);

// GET /api/organizations/:id
router.get(
	'/:id',
	[param('id').isInt()],
	validate,
	asyncHandler(getById)
);

// POST /api/organizations
router.post(
	'/',
	[
		body('name').isString().trim().isLength({ min: 2 }),
		body('description').optional().isString(),
		body('websiteUrl').optional().isURL(),
		body('categoryIds').isArray({ min: 1 }),
		body('locations').optional().isArray(),
	],
	validate,
	asyncHandler(create)
);

// PUT /api/organizations/:id/status
router.put(
	'/:id/status',
	[
		param('id').isInt(),
		body('status').isIn(Object.values(OrganizationStatus)),
		body('rejectionReason').optional().isString(),
	],
	validate,
	asyncHandler(updateStatus)
);

// POST /api/organizations/import
router.post(
	'/import',
	upload.single('file'),
	asyncHandler(importCSV)
);

export default router;
test('Мой четырнадцатый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});
