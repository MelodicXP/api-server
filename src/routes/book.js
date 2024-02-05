'use strict';

// Import express library
const express = require('express');

// Import clothesModel from models/index
const { bookCollection } = require('../models/index');

// Single instance of router
const router = express.Router();

// ** POST book to database, connect to database to create first, then send back data added as confirmation, else catch error
router.post('/book', async (req, res, next) => {
  try {
    // Takes in object (req.body) as an argument for .create()
    const newBook = await bookCollection.create(req.body);
    res.status(200).send(newBook);
  } catch(e) {
    console.error('Error getting all books:', e);
    next(e);
  }
});

// ** GET all books items from database, await connection to database and send back data
router.get('/book', async (req, res, next) => {
  const books = await bookCollection.read();
  res.status(200).send(books);
});

// ** GET one book by id
router.get('/book/:id', async (req, res, next) => {
  try {
    // set id variable from request to find by id
    const id = req.params.id;
    // find book by id 
    const book = await bookCollection.read(id);

    if (!book) {
      // book not found, return a 404 status
      return res.status(404).send({ message: `Book with ID ${id} not found` });
    }
    
    // book found, return it
    res.status(200).send(book);
  } catch (e) { // catch error
    next(e);
  }
});

// ** Update a food item record
router.put('/book/:id', async (req, res, next) => {
  try {
    // set id variable from request to find food item by id
    const id = req.params.id;

    // await update, pass in id and req.body as parameters
    const updatedBook = await bookCollection.update(id, req.body);

    // if no updatedbook data, return 404
    if (!updatedBook) {
      return res.status(404).send({ message: `No Author found with ID ${id}` });
    }

    // Send back updated item
    res.status(200).send(updatedBook);
  } catch (e) { // catch error
    console.error('Error updating book by id:', e);
    next(e);
  }
});

// Delete a food item record
router.delete('/book/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    // Utitlize delete method from Collection class
    const numDeleted = await bookCollection.delete(id);

    // Check if any author was deleted
    if (numDeleted > 0) {
      // Author found and deleted
      res.status(200).send({ id: id, deleted: true });
    } else {
      // No authorfound with id
      res.status(404).send({ message: `Book with ID ${id} not found` });
    }
  } catch (e) {
    console.error('Error deleting book by id:', e);
    next(e);
  }
});

// export food router to be used in server.js
module.exports = router;