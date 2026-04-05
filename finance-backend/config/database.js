// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.
const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Use cloud database (PostgreSQL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Usually needed for hosted DBs like Supabase/Heroku
      }
    }
  });
} else {
  // Fallback to local SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.NODE_ENV === 'test' 
      ? ':memory:' 
      : path.join(__dirname, '../database.sqlite'),
    logging: false,
  });
}

module.exports = sequelize;
