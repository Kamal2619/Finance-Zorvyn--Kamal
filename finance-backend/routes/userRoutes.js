// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.
const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Only Admins can manage users
router.get('/', authorize(['Admin']), userController.getUsers);
router.put('/:id/role', authorize(['Admin']), userController.updateRole);

module.exports = router;
