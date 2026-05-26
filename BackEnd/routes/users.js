const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/', (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(400).json('Error: ' + err);
    });
});

router.post('/', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });

  user
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.json({ message: e.message });
    });
});

router.patch('/:id', (req, res) => {
  User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
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
  User.deleteOne({ _id: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.json({ message: e.message });
    });
});

module.exports = router;
