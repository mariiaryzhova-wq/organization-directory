const express = require('express');
const router = express.Router();
const moderationController = require('../controllers/moderationController');
router.get('/pending', moderationController.getPendingOrganizations);
router.patch('/:id/status', moderationController.updateOrganizationStatus);
module.exports = router;
