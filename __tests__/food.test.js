'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const { sequelizeDatabase } = require('../src/models/index');
const mockRequest = supertest(app);

// Connect to database first
beforeAll(async () => {
  await sequelizeDatabase.sync({ force: true });
});

// Close database connection at end of test
afterAll(async () => {
  await sequelizeDatabase.close();
});

describe('Food REST API', () => {

  // Trigger error catch blocks and errors within Food CRUD operations
  it('fails to get a non-existent food item by id', async () => {
    let response = await mockRequest.get('/food/9999');
    expect(response.status).toBeGreaterThan(399); // expect an error status code
    expect(response.body.message).toEqual('Food item with ID 9999 not found');
  });
  
  it('fails to add a food item with invalid data', async () => {
    let response = await mockRequest.post('/food').send({
      // omit required fields or send invalid data
      name: 123, // assuming name should be a string
    });
    expect(response.status).toBeGreaterThan(399); // expect an error status code
  });
  
  it('fails to update a non-existent food item', async () => {
    let response = await mockRequest.put('/food/9999').send({
      name: 'Non-existent Food',
      category: 'Fruit',
      calories: 100,
    });
    expect(response.status).toBeGreaterThan(399); // expect an error status code
  });

  it('tests for deleting non existent item by id', async () => {
    // test for error catching
    // Attempt to delete a food item with a non-existent ID (e.g., 9999)
    let deleteErrorResponse = await mockRequest.delete('/food/9999');

    expect(deleteErrorResponse.status).toEqual(404);
    expect(deleteErrorResponse.body.message).toEqual(`Food item with ID 9999 not found`);
  });
  
  // Test 404.js error handler on bad route and bad method
  it('handles 404 on a bad route \'/badRoute\'', async () => {
    const response = await mockRequest.get('/badRoute');
    expect(response.status).toEqual(404);
    expect(response.body.route).toEqual('/badRoute');
    expect(response.body.message).toEqual('Not Found');
  });

  it('handles 404 on a bad method \'mockRequest.put\'', async () => {
    const response = await mockRequest.put('/food');
    expect(response.status).toEqual(404);
    expect(response.body.route).toEqual('/food');
    expect(response.body.message).toEqual('Not Found');
  });

  // Perform Regular CRUD operations
  it('adds a food item', async () => {
    let response = await mockRequest.post('/food').send({
      name: 'Tester Food',
      category: 'Fruit',
      calories: 120,
    });
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Tester Food');
    expect(response.body.category).toEqual('Fruit');
    expect(response.body.calories).toEqual(120);
    expect(response.body.id).toBeTruthy();
  });

  it('gets all food items', async () => {
    let response = await mockRequest.get('/food');
    // response comes back as an array, testing for first index in the array
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('Tester Food');
    expect(response.body[0].category).toEqual('Fruit');
    expect(response.body[0].calories).toEqual(120);
    expect(response.body[0].id).toBeTruthy();
  });

  it('gets one food item by id', async () => {
    // get food item by id
    let response = await mockRequest.get('/food/1');
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Tester Food');
    expect(response.body.category).toEqual('Fruit');
    expect(response.body.calories).toEqual(120);
    expect(response.body.id).toBeTruthy();
  });

  it('updates food item by id', async () => {
    // identify by id 'food/1' and send data to be updated
    let response = await mockRequest.put('/food/1').send({
      name: 'Updated Food',
      category: 'Fruit',
      calories: 150,
    });
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Updated Food');
    expect(response.body.category).toEqual('Fruit');
    expect(response.body.calories).toEqual(150);
    expect(response.body.id).toBeTruthy();
  });

  it('deletes a food item by id', async () => {
    // Delete food item by id '1'
    let deleteResponse = await mockRequest.delete('/food/1');

    expect(deleteResponse.status).toEqual(200);
    expect(deleteResponse.body.id).toEqual('1');
    expect(deleteResponse.body.deleted).toBeTruthy();
    expect(deleteResponse.body.record).toBeNull();

    // test for error catching
    // Attempt to delete a food item with a non-existent ID (e.g., 9999)
    let deleteErrorResponse = await mockRequest.delete('/food/9999');

    expect(deleteErrorResponse.status).toEqual(404);
  });
});
