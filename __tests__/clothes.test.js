'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const { sequelizeDatabase } = require('../src/models/index');
const mockRequest = supertest(app);

beforeAll(async () => {
  await sequelizeDatabase.sync({ force: true });
});

afterAll(async () => {
  await sequelizeDatabase.close();
});

describe('Clothes REST API', () => {

  it('fails to get a non-existent clothes item by id', async () => {
    let response = await mockRequest.get('/clothes/9999');
    expect(response.status).toBeGreaterThan(399);
    expect(response.body.message).toEqual('Clothes item with ID 9999 not found');
  });
  
  it('fails to add a clothes item with invalid data', async () => {
    let response = await mockRequest.post('/clothes').send({
      type: 123, // assuming type should be a string
    });
    expect(response.status).toBeGreaterThan(399);
  });
  
  it('fails to update a non-existent clothes item', async () => {
    let response = await mockRequest.put('/clothes/9999').send({
      type: 'Non-existent Clothes',
      size: 'Large',
      color: 'Red',
    });
    expect(response.status).toBeGreaterThan(399);
  });

  it('tests for deleting non-existent item by id', async () => {
    let deleteErrorResponse = await mockRequest.delete('/clothes/9999');
    expect(deleteErrorResponse.status).toEqual(404);
    expect(deleteErrorResponse.body.message).toEqual('Clothes item with ID 9999 not found');
  });

  it('handles 404 on a bad route', async () => {
    const response = await mockRequest.get('/badRoute');
    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('Not Found');
  });

  it('handles 404 on a bad method', async () => {
    const response = await mockRequest.put('/clothes');
    expect(response.status).toEqual(404);
  });

  it('adds a clothes item', async () => {
    let response = await mockRequest.post('/clothes').send({
      type: 'Shirt',
      size: 'Medium',
      color: 'Blue',
    });
    expect(response.status).toEqual(200);
    expect(response.body.type).toEqual('Shirt');
    expect(response.body.size).toEqual('Medium');
    expect(response.body.color).toEqual('Blue');
    expect(response.body.id).toBeTruthy();
  });

  it('gets all clothes items', async () => {
    let response = await mockRequest.get('/clothes');
    expect(response.status).toEqual(200);
    expect(response.body[0].type).toEqual('Shirt');
    expect(response.body[0].size).toEqual('Medium');
    expect(response.body[0].color).toEqual('Blue');
    expect(response.body[0].id).toBeTruthy();
  });

  it('gets one clothes item by id', async () => {
    let response = await mockRequest.get('/clothes/1');
    expect(response.status).toEqual(200);
    expect(response.body.type).toEqual('Shirt');
    expect(response.body.size).toEqual('Medium');
    expect(response.body.color).toEqual('Blue');
    expect(response.body.id).toBeTruthy();
  });

  it('updates clothes item by id', async () => {
    let response = await mockRequest.put('/clothes/1').send({
      type: 'Updated Clothes',
      size: 'Large',
      color: 'Green',
    });
    expect(response.status).toEqual(200);
    expect(response.body.type).toEqual('Updated Clothes');
    expect(response.body.size).toEqual('Large');
    expect(response.body.color).toEqual('Green');
    expect(response.body.id).toBeTruthy();
  });

  it('deletes a clothes item by id', async () => {
    let deleteResponse = await mockRequest.delete('/clothes/1');
    expect(deleteResponse.status).toEqual(200);
    expect(deleteResponse.body.id).toEqual('1');
    expect(deleteResponse.body.deleted).toBeTruthy();
    expect(deleteResponse.body.record).toBeNull();
  });
});

