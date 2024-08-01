'use strict';

// Import express library
const express = require('express');

// Import foodModel from models/index
const { categoryCollection } = require('../models/index');

// Single instance of router
const router = express.Router();

// ** POST categories to database, connect to database to create first, then send back data added as confirmation, else catch error
router.post('/categories', async (req, res, next) => {
  try {
    // Takes in object (req.body) as an argument for .create()
    const newCategory = await categoryCollection.create(req.body);
    res.status(200).send(newCategory);
  } catch(e) {
    console.error('Error posting category:', e);
    next(e);
  }
});

// ** GET ALL categories from database, await connection to database and send back data
router.get('/categories', async (req, res, next) => {
  const categories = await categoryCollection.read();
  res.status(200).send(categories);
});

// ** GET one category by id
router.get('/categories/:id', async (req, res, next) => {
  try {
    // set id variable from request to find by id
    const id = parseInt(req.params.id);
    // find categories by id 
    const category = await categoryCollection.read(id);

    // Check if response is an empty array indicating categories not found
    if (!category || category.length === 0) {
      // category not found, return a 404 status
      return res.status(404).send({ message: `Category with ID ${id} not found` });
    }
    
    // category found, return it
    res.status(200).send(category);
  } catch (e) { // catch error
    console.error('Error getting category by id:', e);
    next(e);
  }
});

// ** Update category record
router.put('/categories/:id', async (req, res, next) => {
  try {
    // set id variable from request to find food item by id
    const id = req.params.id;

    // await update, pass in id and req.body as parameters
    const updatedCategory = await categoryCollection.update(id, req.body);

    // if no updatedCategory data, return 404
    if (!updatedCategory) {
      return res.status(404).send({ message: `No Category found with ID ${id}` });
    }

    // Send back updated item
    res.status(200).send(updatedCategory);
  } catch (e) { // catch error
    console.error('Error updating category by id:', e);
    next(e);
  }
});

// ** Delete an category record
router.delete('/categories/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    // Utitlize delete method from Collection class
    const numDeleted = await categoryCollection.delete(id);

    // Check if any category was deleted
    if (numDeleted > 0) {
      // Category found and deleted
      res.status(200).send({ id: id, deleted: true });
    } else {
      // No category found with id
      res.status(404).send({ message: `Category with ID ${id} not found` });
    }
  } catch (e) {
    console.error('Error deleting category by id:', e);
    next(e);
  }
});

// export category router to be used in server.js
module.exports = router;