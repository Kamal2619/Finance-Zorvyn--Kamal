// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const FinanceRecord = sequelize.define('FinanceRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.FLOAT, // Represents Indian ₹
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Income', 'Expense'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Relationships
FinanceRecord.belongsTo(User, { as: 'createdBy', foreignKey: 'userId' });
User.hasMany(FinanceRecord, { foreignKey: 'userId' });

module.exports = FinanceRecord;
