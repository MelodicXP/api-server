'use strict';

// Import express library
const express = require('express');

// Import productsCollection from models/index
const { productsCollection } = require('../models/index');

// Single instance of router
const router = express.Router();

// ** POST products to database, connect to database to create first, then send back data added as confirmation, else catch error
router.post('/products', async (req, res, next) => {
  try {
    // Takes in object (req.body) as an argument for .create()
    const newProducts = await productsCollection.create(req.body);
    res.status(200).send(newProducts);
  } catch(e) {
    console.error('Error posting products:', e);
    next(e);
  }
});

// ** GET ALL products from database, await connection to database and send back data
router.get('/products', async (req, res, next) => {
  const products = await productsCollection.read();
  res.status(200).send(products);
});

// ** GET one product by id
router.get('/products/:id', async (req, res, next) => {
  try {
    // set id variable from request to find by id
    const id = parseInt(req.params.id);
    // find products by id 
    const product = await productsCollection.read(id);

    // Check if response is an empty array indicating product not found
    if (!product || product.length === 0) {
      // product not found, return a 404 status
      return res.status(404).send({ message: `Product with ID ${id} not found` });
    }
    
    // product found, return it
    res.status(200).send(product);
  } catch (e) { // catch error
    console.error('Error getting product by id:', e);
    next(e);
  }
});

// ** Update product record
router.put('/products/:id', async (req, res, next) => {
  try {
    // set id variable from request to find food item by id
    const id = req.params.id;

    // await update, pass in id and req.body as parameters
    const updatedProduct = await productsCollection.update(id, req.body);

    // if no updatedProduct data, return 404
    if (!updatedProduct) {
      return res.status(404).send({ message: `No Product found with ID ${id}` });
    }

    // Send back updated item
    res.status(200).send(updatedProduct);
  } catch (e) { // catch error
    console.error('Error updating product by id:', e);
    next(e);
  }
});

// ** Delete an product record
router.delete('/products/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    // Utitlize delete method from Collection class
    const numDeleted = await productsCollection.delete(id);

    // Check if any product was deleted
    if (numDeleted > 0) {
      // product found and deleted
      res.status(200).send({ id: id, deleted: true });
    } else {
      // No product found with id
      res.status(404).send({ message: `Product with ID ${id} not found` });
    }
  } catch (e) {
    console.error('Error deleting product by id:', e);
    next(e);
  }
});

// export product router to be used in server.js
module.exports = router;