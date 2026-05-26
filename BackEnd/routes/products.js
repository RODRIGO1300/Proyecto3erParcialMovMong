const express = require('express');
const router = express.Router();

const Product = require('../models/product');

router.get('/', (req, res) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.status(400).json('Error: ' + err);
    });
});

router.post('/', (req, res) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    rating: {
      rate: req.body.rating?.rate,
      count: req.body.rating?.count
    },
    seller: req.body.seller,
    isLocal: req.body.isLocal
  });

  product
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.json({ message: e.message });
    });
});

router.patch('/:id', (req, res) => {
  Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        image: req.body.image,
        rating: {
          rate: req.body.rating?.rate,
          count: req.body.rating?.count
        },
        seller: req.body.seller,
        isLocal: req.body.isLocal
      }
    }
  )
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.json({ message: e.message });
    });
});

router.delete('/:id', (req, res) => {
  Product.deleteOne({ _id: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.json({ message: e.message });
    });
});

module.exports = router;
