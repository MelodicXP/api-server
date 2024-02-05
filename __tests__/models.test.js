'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const { sequelizeDatabase } = require('../src/models');
const mockRequest = supertest(app);

beforeAll(async () => {
  await sequelizeDatabase.sync({force: true});
});

afterAll(async () => {
  await sequelizeDatabase.close(); // Changed from drop() to close() for safe teardown
});

describe('Author REST API', () => {

  it('fails to get a non-existent author by id', async () => {
    let response = await mockRequest.get('/author/9999');
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Author with ID 9999 not found');
  });
  
  it('fails to add author with invalid data', async () => {
    let response = await mockRequest.post('/author').send({
      name: 123, // assuming name should be a string
    });
    expect(response.status).toBeGreaterThan(399);
  });
  
  it('fails to update a non-existent author by id', async () => {
    let response = await mockRequest.put('/author/9999').send({
      name: 'Non-existent Author',
      genre: 'Non-Fiction',
      numBooksPublished: 2,
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('No Author found with ID 9999');
  });

  it('fails to delete non-existent author by id', async () => {
    let deleteErrorResponse = await mockRequest.delete('/author/9999');
    expect(deleteErrorResponse.status).toEqual(404);
    expect(deleteErrorResponse.body.message).toEqual('Author with ID 9999 not found');
  });

  it('handles 404 on a bad route', async () => {
    const response = await mockRequest.get('/badRoute');
    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('Not Found');
  });

  it('handles 404 on a bad method', async () => {
    const response = await mockRequest.put('/author');
    expect(response.status).toEqual(404);
  });

  it('adds author(s) to database', async () => {
    let response = await mockRequest.post('/author').send({
      name: 'Test Author',
      genre: 'Science Fiction',
      numBooksPublished: 1,
    });

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Test Author');
    expect(response.body.genre).toEqual('Science Fiction');
    expect(response.body.numBooksPublished).toEqual(1);
    expect(response.body.id).toBeTruthy();

    response = await mockRequest.post('/author').send({
      name: 'Test Author 2',
      genre: 'Fiction',
      numBooksPublished: 2,
    });

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Test Author 2');
    expect(response.body.genre).toEqual('Fiction');
    expect(response.body.numBooksPublished).toEqual(2);
    expect(response.body.id).toBeTruthy();
  });

  it('gets all authors from database', async () => {
    let response = await mockRequest.get('/author');

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(1);
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('Test Author');
    expect(response.body[0].genre).toEqual('Science Fiction');
    expect(response.body[0].numBooksPublished).toEqual(1);
    expect(response.body[0].id).toBeTruthy();
  });

  it('gets one author from database by id', async () => {
    let response = await mockRequest.get('/author/2');
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Test Author 2');
    expect(response.body.genre).toEqual('Fiction');
    expect(response.body.numBooksPublished).toEqual(2);
    expect(response.body.id).toBeTruthy();
    expect(response.body.id).toEqual(2);
  });

  it('updates author by id', async () => {
    let response = await mockRequest.put('/author/2').send({
      name: 'Updated Author',
      genre: 'Fantasy',
      numBooksPublished: 3,
    });
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Updated Author');
    expect(response.body.genre).toEqual('Fantasy');
    expect(response.body.numBooksPublished).toEqual(3);
    expect(response.body.id).toBeTruthy();
    expect(response.body.id).toEqual(2);
  });

  it('deletes a author by id', async () => {
    let deleteResponse = await mockRequest.delete('/author/1');
    expect(deleteResponse.status).toEqual(200);
    expect(deleteResponse.body.id).toEqual('1');
    expect(deleteResponse.body.deleted).toBeTruthy();
  });
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

