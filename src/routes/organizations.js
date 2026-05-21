import express from 'express';
import { body, param } from 'express-validator';
import * as organizationsController from '../controllers/organizations.js';
import validate from '../middleware/validate.js';
import asyncHandler from '../middleware/asyncHandler.js';
import upload from '../middleware/upload.js';
import { createOrganizationValidation } from '../validators/organization/organizationValidators.js';
const router = express.Router();

router.get('/', validate, asyncHandler(organizationsController.getAll));
router.get('/pending', validate, asyncHandler(organizationsController.getPending));
router.get('/:id', 
  param('id').isInt({ min: 1 }).withMessage('id має бути цілим числом'), 
  validate,
  asyncHandler(organizationsController.getById)
);

router.post('/', createOrganizationValidation, validate, asyncHandler(organizationsController.create));
router.post('/import', 
  upload.single('file'), 
  validate,
  asyncHandler(organizationsController.importCSV)
);
router.put('/:id/status',
  param('id').isInt({ min: 1 }).withMessage('id має бути цілим числом'),
  body('status').isIn(['approved', 'rejected', 'archived']).withMessage('status має бути approved, rejected або archived'),
  body('rejectionReason').optional().isString().withMessage('rejectionReason має бути рядком'),
  validate,
  asyncHandler(organizationsController.updateStatus)
);

export default router;
