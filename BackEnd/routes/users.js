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

router.post('/login', (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  console.log(`Login attempt for ${email || 'empty email'}`);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son requeridos' });
  }

  User.findOne({ email, password })
    .then((user) => {
      if (!user) {
        console.log(`Login failed for ${email}`);
        return res.status(401).json({ message: 'Correo o contrasena incorrectos' });
      }

      console.log(`Login success for ${email}`);
      res.json(user);
    })
    .catch((err) => {
      res.status(400).json({ message: 'Error: ' + err });
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
