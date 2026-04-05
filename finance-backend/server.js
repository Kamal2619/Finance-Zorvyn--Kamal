// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Sync models
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
