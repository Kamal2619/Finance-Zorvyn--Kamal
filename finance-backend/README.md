# Finance Data Processing and Access Control Backend
// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.

This is a complete Node.js + Express backend built with SQLite and Sequelize.

## Setup Instructions

1. **Install Dependencies:**
   Open your terminal in this folder and run:
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000`.

3. **Run Tests:**
   The backend comes with professional API tests using Jest. You can run them cleanly:
   ```bash
   npm test
   ```

## Render Deployment & Database Limits
You mentioned wanting to host this on Render and test it via Postman even when your laptop is off.
Since this uses **SQLite**, Render will host it securely online. **However**, on Render's free tier, the server restarts periodically, and the `database.sqlite` file gets wiped out. To save your data permanently for free, you would normally switch the database string to MongoDB Atlas or Neon PostgreSQL. If you are okay with data resetting every few days (just for assignment demonstration purposes), then this SQLite approach works perfectly.
