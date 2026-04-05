// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.
const express = require('express');
const recordController = require('../controllers/recordController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Require authentication for all record routes
router.use(authenticate);

// Analyst and Admin can view records
router.get('/', authorize(['Analyst', 'Admin']), recordController.getRecords);

// Only Admin can create, update, or delete records
router.post('/', authorize(['Admin']), recordController.createRecord);
router.put('/:id', authorize(['Admin']), recordController.updateRecord);
router.delete('/:id', authorize(['Admin']), recordController.deleteRecord);

module.exports = router;
