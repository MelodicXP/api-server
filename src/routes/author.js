'use strict';

// Import express library
const express = require('express');

// Import foodModel from models/index
const { authorCollection } = require('../models/index');

// Single instance of router
const router = express.Router();

// ** POST author to database, connect to database to create first, then send back data added as confirmation, else catch error
router.post('/author', async (req, res, next) => {
  try {
    // Takes in object (req.body) as an argument for .create()
    const newAuthor = await authorCollection.create(req.body);
    res.status(200).send(newAuthor);
  } catch(e) {
    console.error('Error getting all authors:', e);
    next(e);
  }
});

// ** GET all authors from database, await connection to database and send back data
router.get('/author', async (req, res, next) => {
  const authors = await authorCollection.read();
  res.status(200).send(authors);
});

// ** GET one author by id
router.get('/author/:id', async (req, res, next) => {
  try {
    // set id variable from request to find by id
    const id = req.params.id;
    // find author by id 
    const author = await authorCollection.read(id);

    // Check if response is an empty array indicating author not found
    if (!author || author.length === 0) {
      // author not found, return a 404 status
      return res.status(404).send({ message: `Author with ID ${id} not found` });
    }
    
    // item found, return it
    res.status(200).send(author);
  } catch (e) { // catch error
    console.error('Error getting author by id:', e);
    next(e);
  }
});

// ** Update a food item record
router.put('/author/:id', async (req, res, next) => {
  try {
    // set id variable from request to find food item by id
    const id = req.params.id;

    // await update, pass in id and req.body as parameters
    const updatedAuthor = await authorCollection.update(id, req.body);

    // if no updatedAuthor data, return 404
    if (!updatedAuthor) {
      return res.status(404).send({ message: `No Author found with ID ${id}` });
    }

    // Send back updated item
    res.status(200).send(updatedAuthor);
  } catch (e) { // catch error
    console.error('Error updating author by id:', e);
    next(e);
  }
});

// ** Delete an author record
router.delete('/author/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    // Utitlize delete method from Collection class
    const numDeleted = await authorCollection.delete(id);

    // Check if any author was deleted
    if (numDeleted > 0) {
      // Author found and deleted
      res.status(200).send({ id: id, deleted: true });
    } else {
      // No authorfound with id
      res.status(404).send({ message: `Author with ID ${id} not found` });
    }
  } catch (e) {
    console.error('Error deleting author by id:', e);
    next(e);
  }
});

// export food router to be used in server.js
module.exports = router;