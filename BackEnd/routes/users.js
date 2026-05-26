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
  const email = req.body.email?.trim().toLowerCase();

  if (!req.body.name?.trim() || !email || !req.body.password?.trim()) {
    return res.status(400).json({ message: 'Nombre, email y password son requeridos' });
  }

  const user = new User({
    name: req.body.name.trim(),
    email,
    password: req.body.password.trim(),
    role: req.body.role || 'cliente'
  });

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        res.status(409).json({ message: 'Ese correo ya esta en uso' });
        return null;
      }

      return user.save();
    })
    .then((data) => {
      if (!data) return;
      res.json(data);
    })
    .catch((e) => {
      res.status(400).json({ message: e.message });
    });
});

router.patch('/:id', (req, res) => {
  const updates = {};

  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.email !== undefined) updates.email = req.body.email.trim().toLowerCase();
  if (req.body.password?.trim()) updates.password = req.body.password.trim();
  if (req.body.role !== undefined) updates.role = req.body.role;

  User.updateOne(
    { _id: req.params.id },
    { $set: updates }
  )
    .then((data) => {
      if (!data.matchedCount) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return User.findById(req.params.id);
    })
    .then((user) => {
      if (!user) return;
      res.json(user);
    })
    .catch((e) => {
      res.status(400).json({ message: e.message });
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
