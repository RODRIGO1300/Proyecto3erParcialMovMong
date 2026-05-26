const express = require('express');
const router = express.Router();

const Category = require('../models/category');

router.get('/', (req, res) => {
  Category.find()
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      res.status(400).json('Error: ' + err);
    });
});

router.post('/', (req, res) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image
  });

  category
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.json({ message: e.message });
    });
});

router.patch('/:id', (req, res) => {
  Category.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image
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
  Category.deleteOne({ _id: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.json({ message: e.message });
    });
});

module.exports = router;
