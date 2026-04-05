// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.
const User = require('../models/user');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status']
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ['Viewer', 'Analyst', 'Admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.role = role;
    await user.save();
    
    res.json({ message: 'User role updated successfully', user: { id: user.id, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
};
