const express = require('express');
const router = express.Router();

const Order = require('../models/order');

router.get('/', (req, res) => {
  Order.find()
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      res.status(400).json('Error: ' + err);
    });
});

router.post('/', (req, res) => {
  const order = new Order({
    userId: req.body.userId,
    status: req.body.status,
    paymentMethod: req.body.paymentMethod,
    shippingAddress: req.body.shippingAddress,
    total: req.body.total,
    items: req.body.items
  });

  order
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.json({ message: e.message });
    });
});

router.patch('/:id', (req, res) => {
  Order.updateOne(
    { _id: req.params.id },
    {
      $set: {
        userId: req.body.userId,
        status: req.body.status,
        paymentMethod: req.body.paymentMethod,
        shippingAddress: req.body.shippingAddress,
        total: req.body.total,
        items: req.body.items
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
  Order.deleteOne({ _id: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.json({ message: e.message });
    });
});

module.exports = router;
