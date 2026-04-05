// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.
const FinanceRecord = require('../models/financeRecord');
const { Op } = require('sequelize');

exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ error: 'Amount (in ₹), type, and category are required.' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than ₹0.' });
    }

    const record = await FinanceRecord.create({
      amount,
      type,
      category,
      date: date || new Date(),
      notes,
      userId: req.user.id
    });

    res.status(201).json({ message: 'Record created successfully', record });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create record.' });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, limit, offset } = req.query;
    
    const whereClause = {};
    if (type) whereClause.type = type;
    if (category) whereClause.category = category;
    if (startDate && endDate) {
      whereClause.date = { [Op.between]: [startDate, endDate] };
    }

    const records = await FinanceRecord.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10) || 50,
      offset: parseInt(offset, 10) || 0,
      order: [['date', 'DESC']]
    });

    res.json({
      total: records.count,
      data: records.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const record = await FinanceRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    await record.update(updates);
    res.json({ message: 'Record updated successfully', record });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update record.' });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await FinanceRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    await record.destroy();
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
};
