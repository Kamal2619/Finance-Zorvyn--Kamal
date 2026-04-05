// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.
const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Both Analyst and Admin can view dashboard summaries
router.get('/summary', authenticate, authorize(['Analyst', 'Admin']), dashboardController.getSummary);

module.exports = router;
