import express from 'express';
const router = express.Router();
import * as moderationController from '../controllers/moderationController.js';
// router.get('/pending', moderationController.getPendingOrganizations);
// router.patch('/:id/status', moderationController.updateOrganizationStatus);

export default router;
