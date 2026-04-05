// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.
const FinanceRecord = require('../models/financeRecord');

exports.getSummary = async (req, res) => {
  try {
    const records = await FinanceRecord.findAll();

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};

    records.forEach(record => {
      if (record.type === 'Income') {
        totalIncome += record.amount;
      } else if (record.type === 'Expense') {
        totalExpenses += record.amount;
      }

      if (!categoryTotals[record.category]) {
        categoryTotals[record.category] = 0;
      }
      categoryTotals[record.category] += record.amount;
    });

    const netBalance = totalIncome - totalExpenses;

    res.json({
      currency: '₹',
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
        categoryTotals
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to generate dashboard summary.' });
  }
};
