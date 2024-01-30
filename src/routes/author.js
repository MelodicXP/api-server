'use strict';

// Import express library
const express = require('express');

// Import foodModel from models/index
const { authorCollection } = require('../models/index');

// Single instance of router
const router = express.Router();

// POST items to database, connect to database to create first, then send back data added as confirmation, else catch error
router.post('/author', async (req, res, next) => {
  try {
    // Takes in object (req.body) as an argument for .create()
    const newAuthor = await authorCollection.create(req.body);
    res.status(200).send(newAuthor);
  } catch(e) {
    next(e);
  }
});

// GET all food items from database, await connection to database and send back data
router.get('/food', async (req, res, next) => {
  const food = await foodModel.findAll();
  res.status(200).send(food);
});

// GET one item by id
router.get('/food/:id', async (req, res, next) => {
  try {
    // set id variable from request to find by id
    const id = req.params.id;
    // find item by id 
    const foodItem = await foodModel.findOne({ where: { id } });

    if (!foodItem) {
      // item not found, return a 404 status
      return res.status(404).send({ message: `Food item with ID ${id} not found` });
    }
    
    // item found, return it
    res.status(200).send(foodItem);
  } catch (e) { // catch error
    next(e);
  }
});

// Update a food item record
router.put('/food/:id', async (req, res, next) => {
  try {
    // set id variable from request to find food item by id
    const id = req.params.id;

    // check if any rows were updated, if not handle as error case, else update food item with data sent by user in req.body to specified id
    const [updateCount, updatedFoodItems] = await foodModel.update(req.body, { 
      where: { id },
      returning: true, // returns array with two elements (num of rows affected, updated records as objects)
    });

    if (updateCount === 0) {
      // now rows updated, so item does not exist
      return res.status(404).send({ message: `No Food item found with ID ${id}`});
    }
    // Send back updated item
    res.status(200).send(updatedFoodItems[0]);
  } catch (e) { // catch error
    next(e);
  }
});

// Delete a food item record
router.delete('/food/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    // First, find the record to ensure it exists
    const foodItem = await foodModel.findOne({ where: { id } });

    if (foodItem) {
      // If found, delete the record
      await foodModel.destroy({ where: { id } });

      // After deletion, you can send back a response indicating the record is now null
      res.status(200).send({ id: id, deleted: true, record: null });
    } else {
      // Return a 404 response specifically for this resource-not-found case
      res.status(404).send({ message: `Food item with ID ${id} not found` });
    }
  } catch (e) {
    next(e);
  }
});

// export food router to be used in server.js
module.exports = router;