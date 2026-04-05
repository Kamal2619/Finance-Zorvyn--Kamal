// Copyright (c) 2026 KAMAL J R REC'26. All rights reserved.
const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/user');

describe('Finance API Tests', () => {
  let adminToken;

  beforeAll(async () => {
    // Sync the db in memory for testing
    await sequelize.sync({ force: true });

    // Create an Admin user for testing
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin Test',
        email: 'admin@test.com',
        password: 'password123',
        role: 'Admin'
      });

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    
    adminToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should verify health endpoint and use ₹ currency standard', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.currency_standard).toBe('₹');
    expect(res.body.copyright).toContain('KAMAL J R REC\'26');
  });

  it('should allow admin to create a finance record', async () => {
    const res = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        amount: 5000,
        type: 'Income',
        category: 'Freelance',
        notes: 'Payment received'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.record.amount).toBe(5000);
  });

  it('should get dashboard summary', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.summary.totalIncome).toBe(5000);
    expect(res.body.currency).toBe('₹');
  });
});
